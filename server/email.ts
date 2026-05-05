import nodemailer from "nodemailer";

export function createTransporter() {
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST || "smtp.gmail.com",
    port: parseInt(process.env.SMTP_PORT || "587"),
    secure: false,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });
}

function row(label: string, value: string | undefined) {
  if (!value) return "";
  return `
    <tr>
      <td style="padding:6px 12px;font-weight:600;color:#374151;background:#f9fafb;width:220px;vertical-align:top;border-bottom:1px solid #e5e7eb;">${label}</td>
      <td style="padding:6px 12px;color:#111827;border-bottom:1px solid #e5e7eb;">${value}</td>
    </tr>`;
}

function section(title: string, content: string) {
  return `
    <tr>
      <td colspan="2" style="padding:14px 12px 4px;background:#01AEEF;color:#fff;font-weight:700;font-size:14px;letter-spacing:0.5px;">
        ${title}
      </td>
    </tr>
    ${content}`;
}

export function buildApplicationEmail(data: Record<string, any>): string {
  const edu = (data.education || [])
    .map(
      (e: any, i: number) => `
      <tr>
        <td colspan="2" style="padding:4px 12px;border-bottom:1px solid #e5e7eb;">
          <strong>${e.examination || `#${i + 1}`}</strong> — ${e.institution || ""}, ${e.board || ""} | ${e.subject || ""} | ${e.year || ""} | ${e.percentage || ""}%
        </td>
      </tr>`
    )
    .join("");

  const exp = (data.experience || [])
    .map(
      (e: any, i: number) => `
      <tr>
        <td colspan="2" style="padding:8px 12px;border-bottom:1px solid #e5e7eb;">
          <strong>${e.company || `Experience #${i + 1}`}</strong> (${e.designation || ""})<br/>
          <span style="color:#6b7280;font-size:13px;">${e.from || ""} → ${e.to || "Present"} | Salary: ${e.salary || "—"} | Other: ${e.benefits || "—"}</span><br/>
          <em style="font-size:13px;">Responsibilities:</em> ${e.responsibilities || "—"}<br/>
          <em style="font-size:13px;">Reason for leaving:</em> ${e.reasonForLeaving || "—"}
        </td>
      </tr>`
    )
    .join("");

  return `
  <!DOCTYPE html>
  <html>
  <head><meta charset="utf-8"/></head>
  <body style="margin:0;padding:20px;background:#f3f4f6;font-family:Arial,sans-serif;font-size:14px;color:#111827;">
    <div style="max-width:720px;margin:0 auto;background:#fff;border-radius:6px;overflow:hidden;box-shadow:0 1px 4px rgba(0,0,0,0.1);">

      <!-- Header -->
      <div style="background:#01AEEF;padding:24px 28px;">
        <img src="https://urjatech.com/URJATECH LOGO.png" alt="Urjatech" style="height:36px;" onerror="this.style.display='none'"/>
        <h1 style="margin:12px 0 4px;color:#fff;font-size:20px;">New Job Application</h1>
        <p style="margin:0;color:rgba(255,255,255,0.85);font-size:15px;">
          <strong>${data.positionApplied || "General Application"}</strong> &mdash; ${data.fullName || ""}
        </p>
      </div>

      <table style="width:100%;border-collapse:collapse;">

        ${section("APPLICATION DETAILS", `
          ${row("Position Applied For", data.positionApplied)}
          ${row("Employment Type", data.employmentType)}
          ${row("Expected CTC", data.expectedCTC)}
          ${row("Notice Period", data.noticePeriod)}
          ${row("Referred By", data.referredBy)}
          ${row("Date of Application", new Date().toLocaleDateString("en-IN", { day: "2-digit", month: "long", year: "numeric" }))}
        `)}

        ${section("PERSONAL DETAILS", `
          ${row("Full Name", `${data.title || ""} ${data.fullName || ""}`.trim())}
          ${row("Date of Birth", data.dateOfBirth)}
          ${row("Age", data.age)}
          ${row("Gender", data.gender)}
          ${row("Marital Status", data.maritalStatus)}
          ${data.maritalStatus === "Married" ? row("Sons / Daughters", `${data.numberOfSons || 0} / ${data.numberOfDaughters || 0}`) : ""}
          ${row("Place of Birth", data.placeOfBirth)}
          ${row("Nationality", data.nationality)}
          ${row("Father's / Husband's Name", data.guardianName)}
          ${row("Father's / Husband's Occupation", data.guardianOccupation)}
          ${row("Father's / Husband's Monthly Income", data.guardianMonthlyIncome)}
        `)}

        ${section("CONTACT INFORMATION", `
          ${row("Mobile", data.mobile)}
          ${row("Alternate Phone", data.alternatePhone)}
          ${row("Email", data.email)}
          ${row("LinkedIn", data.linkedIn)}
          ${row("Present Address", data.presentAddress?.replace(/\n/g, "<br/>"))}
          ${row("Permanent Address", data.permanentAddress?.replace(/\n/g, "<br/>"))}
        `)}

        ${section("EDUCATION", edu || `<tr><td colspan="2" style="padding:8px 12px;color:#6b7280;">No education details provided.</td></tr>`)}

        ${section("WORK EXPERIENCE", `
          ${row("Total Experience", data.totalExperience)}
          ${row("Current CTC", data.currentCTC)}
          ${row("Current Employer", data.currentEmployer)}
          ${exp || `<tr><td colspan="2" style="padding:8px 12px;color:#6b7280;">No experience details provided.</td></tr>`}
        `)}

        ${section("SKILLS & COMPETENCIES", `
          ${row("Key Technical Skills", data.keySkills?.replace(/\n/g, "<br/>"))}
          ${row("Computer / Software Skills", data.computerSkills)}
          ${row("Languages Known", data.languagesKnown)}
          ${row("Certifications / Courses", data.certifications?.replace(/\n/g, "<br/>"))}
        `)}

        ${section("REFERENCES", `
          ${row("Reference 1", data.ref1Name ? `${data.ref1Name} (${data.ref1Relationship || ""}) | ${data.ref1Company || ""} | ${data.ref1Phone || ""} | ${data.ref1Email || ""}` : undefined)}
          ${row("Reference 2", data.ref2Name ? `${data.ref2Name} (${data.ref2Relationship || ""}) | ${data.ref2Company || ""} | ${data.ref2Phone || ""} | ${data.ref2Email || ""}` : undefined)}
        `)}

        ${section("ADDITIONAL INFORMATION", `
          ${row("Cover Letter", data.coverLetter?.replace(/\n/g, "<br/>"))}
          ${row("Additional Remarks", data.additionalRemarks?.replace(/\n/g, "<br/>"))}
        `)}

      </table>

      <div style="padding:16px 20px;background:#f9fafb;border-top:1px solid #e5e7eb;font-size:12px;color:#6b7280;text-align:center;">
        This application was submitted via the Urjatech Careers page. Resume is attached if uploaded.
      </div>
    </div>
  </body>
  </html>`;
}
