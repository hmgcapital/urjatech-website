import path from "node:path";
import Busboy from "busboy";
import { buildApplicationEmail, createTransporter } from "./_application-email.mjs";

const MAX_UPLOAD_SIZE = 5 * 1024 * 1024;
const allowedResumeExtensions = new Set([".pdf", ".doc", ".docx"]);
const allowedPhotoMimeTypes = new Set(["image/jpeg", "image/png"]);
const allowedResumeMimeTypes = new Set([
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "application/octet-stream",
]);

function json(statusCode, body) {
  return {
    statusCode,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  };
}

function normalizeHeaders(headers = {}) {
  return Object.fromEntries(Object.entries(headers).map(([key, value]) => [key.toLowerCase(), value]));
}

function parseMultipart(event) {
  return new Promise((resolve, reject) => {
    const headers = normalizeHeaders(event.headers);
    const contentType = headers["content-type"];
    if (!contentType?.includes("multipart/form-data")) {
      reject(new Error("Application must be submitted as multipart/form-data."));
      return;
    }

    const fields = {};
    const files = {};
    const busboy = Busboy({
      headers: { ...headers, "content-type": contentType },
      limits: { fileSize: MAX_UPLOAD_SIZE, files: 2 },
    });

    busboy.on("field", (name, value) => {
      fields[name] = value;
    });

    busboy.on("file", (fieldname, file, info) => {
      const filename = info.filename || "";
      const mimeType = info.mimeType || "application/octet-stream";
      const chunks = [];
      let size = 0;
      let hitLimit = false;

      file.on("data", (chunk) => {
        size += chunk.length;
        chunks.push(chunk);
      });
      file.on("limit", () => {
        hitLimit = true;
        file.resume();
      });
      file.on("end", () => {
        if (!filename) return;
        if (hitLimit) {
          reject(new Error("Each uploaded file must be 5 MB or smaller."));
          return;
        }
        files[fieldname] = {
          fieldname,
          originalname: filename,
          mimetype: mimeType,
          size,
          buffer: Buffer.concat(chunks),
        };
      });
    });

    busboy.on("error", reject);
    busboy.on("finish", () => resolve({ fields, files }));

    const body = Buffer.from(event.body || "", event.isBase64Encoded ? "base64" : "utf8");
    busboy.end(body);
  });
}

function validateFiles(files) {
  const photo = files.photo;
  if (photo && !allowedPhotoMimeTypes.has(photo.mimetype)) {
    throw new Error("Photo must be a JPG or PNG file.");
  }

  const resume = files.resume;
  if (resume) {
    const extension = path.extname(resume.originalname).toLowerCase();
    if (!allowedResumeExtensions.has(extension) || !allowedResumeMimeTypes.has(resume.mimetype)) {
      throw new Error("Resume must be a PDF, DOC, or DOCX file.");
    }
  }
}

function parseApplicationArrays(data) {
  for (const key of ["education", "experience"]) {
    if (typeof data[key] === "string") {
      try {
        data[key] = JSON.parse(data[key]);
      } catch {
        data[key] = [];
      }
    }
  }
}

async function sendMailWithRetry(mailOptions, attempts = 3) {
  let lastError;
  for (let attempt = 1; attempt <= attempts; attempt++) {
    try {
      const transporter = createTransporter();
      await transporter.sendMail(mailOptions);
      return;
    } catch (err) {
      lastError = err;
      if (attempt < attempts) {
        await new Promise((resolve) => setTimeout(resolve, 1000 * attempt));
      }
    }
  }
  throw lastError;
}

export async function handler(event) {
  if (event.httpMethod === "OPTIONS") {
    return json(200, { ok: true });
  }
  if (event.httpMethod !== "POST") {
    return json(405, { message: "Method not allowed" });
  }

  try {
    const { fields, files } = await parseMultipart(event);
    validateFiles(files);
    parseApplicationArrays(fields);

    if (!String(fields.positionApplied || "").trim()) {
      fields.positionApplied = "General Application";
    }

    const missingRequired = ["positionApplied", "fullName", "dateOfBirth", "mobile", "presentAddress"]
      .filter((key) => !String(fields[key] || "").trim());
    if (missingRequired.length > 0) {
      return json(400, { success: false, message: "Please complete all required fields before submitting." });
    }

    if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
      return json(500, { success: false, message: "Application email is not configured on the server." });
    }

    const attachments = [];
    if (files.photo) {
      attachments.push({
        filename: files.photo.originalname,
        content: files.photo.buffer,
        contentType: files.photo.mimetype,
        cid: "candidatephoto@urjatech",
      });
    }
    if (files.resume) {
      attachments.push({
        filename: files.resume.originalname,
        content: files.resume.buffer,
        contentType: files.resume.mimetype,
      });
    }

    await sendMailWithRetry({
      from: `"Urjatech Careers" <${process.env.SMTP_USER}>`,
      to: process.env.CAREERS_TO_EMAIL || "shray@urjatech.com",
      replyTo: fields.email || undefined,
      subject: `Job Application: ${fields.positionApplied || "General"} - ${fields.fullName || "Unknown"}`,
      html: buildApplicationEmail(fields, !!files.photo),
      attachments,
    });

    return json(202, { success: true, message: "Application submitted successfully." });
  } catch (err) {
    console.error("[careers-apply] Submission error:", err);
    const message = err instanceof Error ? err.message : "Failed to submit application.";
    const isUserError = /must be|required|multipart|uploaded file/i.test(message);
    return json(isUserError ? 400 : 500, {
      success: false,
      message: isUserError ? message : "Failed to submit application. Please try again or email us directly.",
    });
  }
}
