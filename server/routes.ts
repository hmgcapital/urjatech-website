import type { Express } from "express";
import { createServer, type Server } from "http";
import multer from "multer";
import { createTransporter, buildApplicationEmail } from "./email";

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB
  fileFilter: (_req, file, cb) => {
    const allowed = ["application/pdf", "application/msword", "application/vnd.openxmlformats-officedocument.wordprocessingml.document"];
    cb(null, allowed.includes(file.mimetype));
  },
});

export async function registerRoutes(app: Express): Promise<Server> {

  // POST /api/careers/apply
  // Accepts multipart/form-data; sends all fields as a formatted email to shray@urjatech.com
  app.post("/api/careers/apply", upload.single("resume"), async (req, res) => {
    try {
      const data = req.body as Record<string, any>;
      const resumeFile = req.file;

      // Parse JSON-encoded arrays (education, experience) sent as stringified JSON
      for (const key of ["education", "experience"]) {
        if (typeof data[key] === "string") {
          try { data[key] = JSON.parse(data[key]); } catch { data[key] = []; }
        }
      }

      const transporter = createTransporter();

      // Verify SMTP connection
      await transporter.verify();

      const mailOptions: Parameters<typeof transporter.sendMail>[0] = {
        from: `"Urjatech Careers" <${process.env.SMTP_USER}>`,
        to: "shray@urjatech.com",
        replyTo: data.email || undefined,
        subject: `Job Application: ${data.positionApplied || "General"} — ${data.fullName || "Unknown"}`,
        html: buildApplicationEmail(data),
        attachments: [],
      };

      if (resumeFile) {
        (mailOptions.attachments as any[]).push({
          filename: resumeFile.originalname,
          content: resumeFile.buffer,
          contentType: resumeFile.mimetype,
        });
      }

      await transporter.sendMail(mailOptions);

      res.json({ success: true, message: "Application submitted successfully." });
    } catch (err: any) {
      console.error("[careers] Email send error:", err?.message || err);
      res.status(500).json({ success: false, message: "Failed to send application. Please try again or email us directly." });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
