import type { Express } from "express";
import { createServer, type Server } from "http";
import multer from "multer";
import { createTransporter, buildApplicationEmail } from "./email";

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB per file
}).fields([
  { name: "resume", maxCount: 1 },
  { name: "photo",  maxCount: 1 },
]);

export async function registerRoutes(app: Express): Promise<Server> {

  // POST /api/careers/apply
  app.post("/api/careers/apply", upload, async (req, res) => {
    try {
      const data = req.body as Record<string, any>;
      const files = req.files as Record<string, Express.Multer.File[]> | undefined;

      const resumeFile = files?.["resume"]?.[0];
      const photoFile  = files?.["photo"]?.[0];

      // Parse JSON-encoded arrays
      for (const key of ["education", "experience"]) {
        if (typeof data[key] === "string") {
          try { data[key] = JSON.parse(data[key]); } catch { data[key] = []; }
        }
      }

      const transporter = createTransporter();
      await transporter.verify();

      const attachments: any[] = [];

      // Photo — inline CID so it renders inside the email body
      if (photoFile) {
        attachments.push({
          filename: photoFile.originalname,
          content:  photoFile.buffer,
          contentType: photoFile.mimetype,
          cid: "candidatephoto@urjatech",   // referenced in HTML
        });
      }

      // Resume — regular attachment
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
