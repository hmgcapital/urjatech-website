import type { Express, NextFunction, Request, Response } from "express";
import { createServer, type Server } from "http";
import multer from "multer";
import fs from "fs";
import path from "path";
import { createTransporter, buildApplicationEmail } from "./email";

const MAX_UPLOAD_SIZE = 5 * 1024 * 1024;
const APPLICATIONS_DIR = path.join(process.cwd(), "data", "career-applications");

const allowedResumeExtensions = new Set([".pdf", ".doc", ".docx"]);
const allowedPhotoMimeTypes = new Set(["image/jpeg", "image/png"]);
const allowedResumeMimeTypes = new Set([
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "application/octet-stream",
]);

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: MAX_UPLOAD_SIZE },
  fileFilter: (_req, file, cb) => {
    const extension = path.extname(file.originalname).toLowerCase();
    if (file.fieldname === "photo") {
      return allowedPhotoMimeTypes.has(file.mimetype)
        ? cb(null, true)
        : cb(new Error("Photo must be a JPG or PNG file."));
    }
    if (file.fieldname === "resume") {
      return allowedResumeExtensions.has(extension) && (!file.mimetype || allowedResumeMimeTypes.has(file.mimetype))
        ? cb(null, true)
        : cb(new Error("Resume must be a PDF, DOC, or DOCX file."));
    }
    cb(new Error("Unexpected file field."));
  },
}).fields([
  { name: "resume", maxCount: 1 },
  { name: "photo",  maxCount: 1 },
]);

const JOBS_PATH = path.join(import.meta.dirname ?? __dirname, "jobs.json");

function uploadApplication(req: Request, res: Response, next: NextFunction) {
  upload(req, res, (err) => {
    if (err instanceof multer.MulterError) {
      const message = err.code === "LIMIT_FILE_SIZE"
        ? "Each uploaded file must be 5 MB or smaller."
        : "Could not upload the selected files. Please check the files and try again.";
      return res.status(400).json({ success: false, message });
    }
    if (err) {
      return res.status(400).json({ success: false, message: err.message || "Invalid upload." });
    }
    next();
  });
}

function safeSegment(value: string) {
  return value
    .normalize("NFKD")
    .replace(/[^\w.-]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80) || "application";
}

async function persistApplication(data: Record<string, any>, files: Record<string, Express.Multer.File[]> | undefined) {
  const submittedAt = new Date().toISOString();
  const submissionId = `${submittedAt.replace(/[:.]/g, "-")}-${safeSegment(data.fullName || data.mobile || "application")}`;
  const submissionDir = path.join(APPLICATIONS_DIR, submissionId);
  const attachmentDir = path.join(submissionDir, "attachments");
  const savedFiles: Record<string, any> = {};

  await fs.promises.mkdir(attachmentDir, { recursive: true });

  for (const [field, fieldFiles] of Object.entries(files || {})) {
    savedFiles[field] = [];
    for (const file of fieldFiles) {
      const filename = safeSegment(file.originalname);
      await fs.promises.writeFile(path.join(attachmentDir, filename), file.buffer);
      savedFiles[field].push({
        originalName: file.originalname,
        savedAs: filename,
        mimeType: file.mimetype,
        size: file.size,
      });
    }
  }

  await fs.promises.writeFile(
    path.join(submissionDir, "application.json"),
    JSON.stringify({ submissionId, submittedAt, emailStatus: "pending", data, files: savedFiles }, null, 2),
    "utf8"
  );

  return { submissionId, submissionDir };
}

async function markEmailStatus(submissionDir: string, status: "sent" | "failed", error?: unknown) {
  await fs.promises.writeFile(
    path.join(submissionDir, "email-status.json"),
    JSON.stringify({
      status,
      updatedAt: new Date().toISOString(),
      error: error instanceof Error ? error.message : error ? String(error) : undefined,
    }, null, 2),
    "utf8"
  );
}

function wait(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function sendMailWithRetry(mailOptions: any, attempts = 3) {
  let lastError: unknown;
  for (let attempt = 1; attempt <= attempts; attempt++) {
    try {
      const transporter = createTransporter();
      await transporter.sendMail(mailOptions);
      return;
    } catch (err) {
      lastError = err;
      if (attempt < attempts) await wait(1000 * attempt);
    }
  }
  throw lastError;
}

function readJobs() {
  try {
    return JSON.parse(fs.readFileSync(JOBS_PATH, "utf8"));
  } catch {
    return [];
  }
}

export async function registerRoutes(app: Express): Promise<Server> {

  // ── GET /api/careers/jobs ─────────────────────────────────────────────────
  // Returns all active job listings
  app.get("/api/careers/jobs", (_req, res) => {
    const jobs = readJobs().filter((j: any) => j.active !== false);
    res.json(jobs);
  });

  // ── PUT /api/careers/jobs ─────────────────────────────────────────────────
  // Replace the entire jobs list. Protected by admin password in Authorization header.
  // Usage: Authorization: Bearer <JOBS_ADMIN_PASS>
  app.put("/api/careers/jobs", (req, res) => {
    const token = req.headers.authorization?.replace("Bearer ", "").trim();
    const expected = process.env.JOBS_ADMIN_PASS || "urjatech-admin";
    if (token !== expected) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    try {
      const jobs = req.body;
      if (!Array.isArray(jobs)) return res.status(400).json({ message: "Body must be a JSON array" });
      fs.writeFileSync(JOBS_PATH, JSON.stringify(jobs, null, 2), "utf8");
      res.json({ success: true, count: jobs.length });
    } catch (err: any) {
      res.status(500).json({ message: err.message });
    }
  });

  // ── POST /api/careers/apply ───────────────────────────────────────────────
  app.post("/api/careers/apply", uploadApplication, async (req, res) => {
    try {
      const data = req.body as Record<string, any>;
      const files = req.files as Record<string, Express.Multer.File[]> | undefined;
      const resumeFile = files?.["resume"]?.[0];
      const photoFile  = files?.["photo"]?.[0];

      for (const key of ["education", "experience"]) {
        if (typeof data[key] === "string") {
          try { data[key] = JSON.parse(data[key]); } catch { data[key] = []; }
        }
      }
      if (!String(data.positionApplied || "").trim()) {
        data.positionApplied = "General Application";
      }

      const missingRequired = ["positionApplied", "fullName", "dateOfBirth", "mobile", "presentAddress"]
        .filter((key) => !String(data[key] || "").trim());
      if (missingRequired.length > 0) {
        return res.status(400).json({ success: false, message: "Please complete all required fields before submitting." });
      }

      const { submissionId, submissionDir } = await persistApplication(data, files);

      const attachments: any[] = [];
      if (photoFile) {
        attachments.push({
          filename: photoFile.originalname,
          content:  photoFile.buffer,
          contentType: photoFile.mimetype,
          cid: "candidatephoto@urjatech",
        });
      }
      if (resumeFile) {
        attachments.push({
          filename: resumeFile.originalname,
          content:  resumeFile.buffer,
          contentType: resumeFile.mimetype,
        });
      }

      const mailOptions = {
        from:    `"Urjatech Careers" <${process.env.SMTP_USER}>`,
        to:      "shray@urjatech.com",
        replyTo: data.email || undefined,
        subject: `Job Application: ${data.positionApplied || "General"} — ${data.fullName || "Unknown"}`,
        html:    buildApplicationEmail(data, !!photoFile),
        attachments,
      };

      res.status(202).json({
        success: true,
        message: "Application received successfully.",
        submissionId,
      });

      sendMailWithRetry(mailOptions)
        .then(() => markEmailStatus(submissionDir, "sent"))
        .catch((err) => {
          console.error("[careers] Email delivery failed after saving application:", err?.message || err);
          return markEmailStatus(submissionDir, "failed", err).catch((statusErr) => {
            console.error("[careers] Could not write email status:", statusErr?.message || statusErr);
          });
        });
    } catch (err: any) {
      console.error("[careers] Application submit error:", err?.message || err);
      res.status(500).json({ success: false, message: "Failed to receive application. Please try again or email us directly." });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
