import type { Express } from "express";
import { createServer, type Server } from "http";
import multer from "multer";
import fs from "fs";
import path from "path";
import { createTransporter, buildApplicationEmail } from "./email";

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 },
}).fields([
  { name: "resume", maxCount: 1 },
  { name: "photo",  maxCount: 1 },
]);

const JOBS_PATH = path.join(import.meta.dirname ?? __dirname, "jobs.json");

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
  app.post("/api/careers/apply", upload, async (req, res) => {
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

      const transporter = createTransporter();
      await transporter.verify();

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

      await transporter.sendMail({
        from:    `"Urjatech Careers" <${process.env.SMTP_USER}>`,
        to:      "shray@urjatech.com",
        replyTo: data.email || undefined,
        subject: `Job Application: ${data.positionApplied || "General"} — ${data.fullName || "Unknown"}`,
        html:    buildApplicationEmail(data, !!photoFile),
        attachments,
      });

      res.json({ success: true, message: "Application submitted successfully." });
    } catch (err: any) {
      console.error("[careers] Email send error:", err?.message || err);
      res.status(500).json({ success: false, message: "Failed to send application. Please try again or email us directly." });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
