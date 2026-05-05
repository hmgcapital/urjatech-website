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

const cell = (content: string, opts: {
  bold?: boolean;
  center?: boolean;
  bg?: string;
  color?: string;
  border?: string;
  width?: string;
  colSpan?: number;
  rowSpan?: number;
  vAlign?: string;
  fontSize?: string;
  padding?: string;
  italic?: boolean;
} = {}) => {
  const style = [
    `border: 1px solid #000`,
    `padding: ${opts.padding ?? "4px 6px"}`,
    opts.bold ? "font-weight:bold" : "",
    opts.center ? "text-align:center" : "",
    opts.bg ? `background:${opts.bg}` : "",
    opts.color ? `color:${opts.color}` : "",
    opts.width ? `width:${opts.width}` : "",
    opts.vAlign ? `vertical-align:${opts.vAlign}` : "vertical-align:top",
    opts.fontSize ? `font-size:${opts.fontSize}` : "font-size:12px",
    opts.italic ? "font-style:italic" : "",
  ].filter(Boolean).join(";");

  const attrs = [
    opts.colSpan ? `colspan="${opts.colSpan}"` : "",
    opts.rowSpan ? `rowspan="${opts.rowSpan}"` : "",
  ].filter(Boolean).join(" ");

  return `<td ${attrs} style="${style}">${content}</td>`;
};

const blank = (label: string, value: string | undefined, width = "auto") =>
  `<span style="display:inline-block;min-width:${width};border-bottom:1px solid #000;padding:0 4px;">${value || ""}</span>&nbsp;<span style="font-size:11px;color:#555;">${label}</span>`;

const fieldLine = (label: string, value: string | undefined) =>
  `<tr><td colspan="6" style="border:1px solid #000;padding:4px 6px;font-size:12px;">
    <strong>${label}:</strong>&nbsp;${value || ""}
   </td></tr>`;

export function buildApplicationEmail(data: Record<string, any>): string {
  const edu: any[] = data.education || [];
  const exp: any[] = data.experience || [];
  const today = new Date().toLocaleDateString("en-IN", { day: "2-digit", month: "2-digit", year: "numeric" });

  // ── Education table rows (a–f, minimum 6 rows) ──────────────────────────
  const eduLabels = ["a. 10th", "b. 12th", "c.", "d.", "e.", "f."];
  const eduRows = eduLabels.map((label, i) => {
    const e = edu[i] || {};
    return `<tr>
      ${cell(label, { center: true, width: "6%" })}
      ${cell(e.institution || "", { width: "22%" })}
      ${cell(e.subject || "", { width: "18%" })}
      ${cell(e.examination || "", { width: "18%" })}
      ${cell(e.year || "", { center: true, width: "10%" })}
      ${cell(e.percentage ? e.percentage + "%" : "", { center: true, width: "10%" })}
    </tr>`;
  }).join("");

  // ── Experience table rows (a–h, minimum 8 rows) ─────────────────────────
  const expLabels = ["a.", "b.", "c.", "d.", "e.", "f.", "g.", "h."];
  const expRows = expLabels.map((label, i) => {
    const e = exp[i] || {};
    const from = e.from ? e.from.replace("-", "/") : "";
    const to   = e.to   ? e.to.replace("-", "/")   : (exp[i] ? "Present" : "");
    const dur  = (e.from && e.to)
      ? (() => {
          try {
            const f = new Date(e.from + "-01");
            const t = e.to ? new Date(e.to + "-01") : new Date();
            const months = (t.getFullYear() - f.getFullYear()) * 12 + (t.getMonth() - f.getMonth());
            const yrs = Math.floor(months / 12);
            const mo  = months % 12;
            return yrs > 0 ? `${yrs}y ${mo}m` : `${mo}m`;
          } catch { return ""; }
        })()
      : "";
    return `<tr style="height:28px;">
      ${cell(label, { center: true, bold: true })}
      ${cell(from, { center: true })}
      ${cell(to, { center: true })}
      ${cell(dur, { center: true })}
      ${cell(e.company || "", {})}
      ${cell(e.designation || "", {})}
      ${cell(e.responsibilities || "", {})}
      ${cell(e.salary || "", { center: true })}
      ${cell(e.benefits || "", { center: true })}
      ${cell(e.reasonForLeaving || "", {})}
    </tr>`;
  }).join("");

  // ── Marital status string ────────────────────────────────────────────────
  const married = data.maritalStatus === "Married";
  const maritalStr = married
    ? `Married &nbsp;&nbsp; Sons: ${data.numberOfSons || "—"} &nbsp;&nbsp; Daughters: ${data.numberOfDaughters || "—"}`
    : (data.maritalStatus === "Single" ? "Unmarried" : (data.maritalStatus || ""));

  // ── Reference strings ────────────────────────────────────────────────────
  const ref1 = [data.ref1Name, data.ref1Relationship, data.ref1Company, data.ref1Phone, data.ref1Email].filter(Boolean).join(" | ");
  const ref2 = [data.ref2Name, data.ref2Relationship, data.ref2Company, data.ref2Phone, data.ref2Email].filter(Boolean).join(" | ");

  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8"/>
  <style>
    body { margin:0; padding:16px; background:#f0f0f0; font-family: Arial, sans-serif; }
    .wrapper { max-width:780px; margin:0 auto; background:#fff; border:2px solid #000; }
    table.form { width:100%; border-collapse:collapse; }
    .section-label {
      background:#000; color:#fff; font-weight:bold; font-size:11px;
      letter-spacing:1px; padding:3px 6px; text-transform:uppercase;
    }
    .office-cell { border:1px solid #000; padding:4px 6px; font-size:11px; text-align:center; min-height:36px; }
  </style>
</head>
<body>
<div class="wrapper">

  <!-- ═══ HEADER ══════════════════════════════════════════════════════════ -->
  <table class="form">
    <tr>
      <td colspan="4" style="padding:10px 14px 2px;border-bottom:2px solid #000;">
        <div style="display:flex;justify-content:space-between;align-items:flex-start;">
          <div>
            <div style="font-size:20px;font-weight:900;letter-spacing:1px;color:#000;">APPLICATION FORM</div>
            <div style="font-size:13px;font-weight:bold;color:#444;margin-top:2px;">URJATECH PVT. LTD.</div>
            <div style="font-size:11px;color:#666;margin-top:2px;">Plot No. 115, Sector Ecotech-12, Greater Noida (U.P.)</div>
          </div>
          <div style="text-align:right;font-size:12px;line-height:1.8;">
            <div><strong>Post Applied for:</strong> ${data.positionApplied || ""}</div>
            <div><strong>Referred by:</strong> ${data.referredBy || ""}</div>
            <div><strong>Date:</strong> ${today}</div>
            <div><strong>Employment Type:</strong> ${data.employmentType || ""}</div>
          </div>
        </div>
      </td>
    </tr>
  </table>

  <!-- ═══ SECTION 1: PERSONAL DETAILS ════════════════════════════════════ -->
  <div class="section-label">1. Personal Details</div>
  <table class="form">
    <tr>
      <!-- Left: personal info -->
      <td style="border:1px solid #000;padding:6px;font-size:12px;width:75%;">
        <table style="width:100%;border-collapse:collapse;font-size:12px;">
          <tr>
            <td style="padding:3px 0;width:30%;"><strong>Name:</strong></td>
            <td style="padding:3px 0;">${data.title || ""} ${data.fullName || ""}</td>
            <td style="padding:3px 0;width:30%;text-align:right;">${maritalStr}</td>
          </tr>
          <tr>
            <td style="padding:3px 0;"><strong>Date of Birth:</strong></td>
            <td style="padding:3px 0;">${data.dateOfBirth || ""}</td>
            <td style="padding:3px 0;text-align:right;"><strong>Age:</strong> ${data.age || ""}&nbsp;&nbsp;<strong>Gender:</strong> ${data.gender || ""}</td>
          </tr>
          <tr>
            <td style="padding:3px 0;"><strong>Place of Birth:</strong></td>
            <td colspan="2" style="padding:3px 0;">${data.placeOfBirth || ""}&nbsp;&nbsp;&nbsp;&nbsp;<strong>Nationality:</strong> ${data.nationality || "Indian"}</td>
          </tr>
          <tr>
            <td style="padding:3px 0;"><strong>Father's / Husband's Name:</strong></td>
            <td colspan="2" style="padding:3px 0;">${data.guardianName || ""}</td>
          </tr>
          <tr>
            <td style="padding:3px 0;"><strong>Occupation:</strong></td>
            <td style="padding:3px 0;">${data.guardianOccupation || ""}</td>
            <td style="padding:3px 0;text-align:right;"><strong>Monthly Income:</strong> ${data.guardianMonthlyIncome || ""}</td>
          </tr>
          <tr>
            <td style="padding:3px 0;"><strong>Skills:</strong></td>
            <td colspan="2" style="padding:3px 0;">${data.keySkills || ""}</td>
          </tr>
          <tr>
            <td style="padding:3px 0;"><strong>Languages:</strong></td>
            <td style="padding:3px 0;">${data.languagesKnown || ""}</td>
            <td style="padding:3px 0;text-align:right;"><strong>Computer Skills:</strong> ${data.computerSkills || ""}</td>
          </tr>
          <tr>
            <td style="padding:3px 0;"><strong>LinkedIn:</strong></td>
            <td colspan="2" style="padding:3px 0;">${data.linkedIn || ""}</td>
          </tr>
        </table>
      </td>
      <!-- Right: photo box -->
      <td style="border:1px solid #000;width:25%;text-align:center;vertical-align:middle;padding:8px;font-size:11px;color:#888;">
        <div style="border:1px dashed #aaa;width:80px;height:100px;margin:0 auto;display:flex;align-items:center;justify-content:center;color:#bbb;font-size:10px;">
          PHOTO
        </div>
      </td>
    </tr>
  </table>

  <!-- ═══ SECTION 2 & 3: ADDRESS ══════════════════════════════════════════ -->
  <div class="section-label">2. Address</div>
  <table class="form">
    <tr>
      <td style="border:1px solid #000;padding:5px 6px;font-size:12px;width:50%;">
        <strong>(a) Present Address:</strong><br/>
        <span style="white-space:pre-line;">${(data.presentAddress || "").replace(/\n/g, "<br/>")}</span>
      </td>
      <td style="border:1px solid #000;padding:5px 6px;font-size:12px;width:50%;">
        <strong>(b) Permanent Address:</strong><br/>
        <span style="white-space:pre-line;">${(data.permanentAddress || data.presentAddress || "").replace(/\n/g, "<br/>")}</span>
      </td>
    </tr>
    <tr>
      <td style="border:1px solid #000;padding:5px 6px;font-size:12px;">
        <strong>Res. Ph / Mobile:</strong> ${data.mobile || ""}
        ${data.alternatePhone ? `&nbsp;&nbsp;&nbsp;<strong>Alt:</strong> ${data.alternatePhone}` : ""}
      </td>
      <td style="border:1px solid #000;padding:5px 6px;font-size:12px;">
        <strong>E-mail:</strong> ${data.email || ""}
      </td>
    </tr>
  </table>

  <!-- ═══ SECTION 4: EDUCATION ════════════════════════════════════════════ -->
  <div class="section-label">4. Academic / Professional Qualifications (10th &amp; Onward)</div>
  <table class="form">
    <tr>
      ${cell("", { bold: true, center: true, bg: "#f5f5f5", width: "6%" })}
      ${cell("College / School / Institution", { bold: true, center: true, bg: "#f5f5f5", width: "22%" })}
      ${cell("Subject / Stream", { bold: true, center: true, bg: "#f5f5f5", width: "18%" })}
      ${cell("Examination Passed", { bold: true, center: true, bg: "#f5f5f5", width: "18%" })}
      ${cell("Year", { bold: true, center: true, bg: "#f5f5f5", width: "10%" })}
      ${cell("% Marks", { bold: true, center: true, bg: "#f5f5f5", width: "10%" })}
    </tr>
    ${eduRows}
  </table>

  <!-- ═══ SECTION 5: CERTIFICATIONS ══════════════════════════════════════ -->
  <div class="section-label">5. Certifications / Additional Courses</div>
  <table class="form">
    <tr>
      <td colspan="6" style="border:1px solid #000;padding:5px 6px;font-size:12px;min-height:30px;">
        ${data.certifications || "&nbsp;"}
      </td>
    </tr>
  </table>

  <!-- ═══ SECTION 6: REFERENCES ══════════════════════════════════════════ -->
  <div class="section-label">6. References — Name &amp; address of well-known persons</div>
  <table class="form">
    <tr>
      <td style="border:1px solid #000;padding:5px 6px;font-size:12px;width:50%;">
        <strong>Ref 1:</strong> ${ref1 || "&nbsp;"}
      </td>
      <td style="border:1px solid #000;padding:5px 6px;font-size:12px;width:50%;">
        <strong>Ref 2:</strong> ${ref2 || "&nbsp;"}
      </td>
    </tr>
  </table>

  <!-- ═══ SECTION 7: EXPERIENCE ══════════════════════════════════════════ -->
  <div class="section-label">7. Past Job Experience</div>
  <table class="form">
    <!-- Sub-header: summary row -->
    <tr style="font-size:11px;background:#f9f9f9;">
      ${cell("", { bold: true, center: true, bg: "#f5f5f5" })}
      ${cell("From", { bold: true, center: true, bg: "#f5f5f5" })}
      ${cell("To", { bold: true, center: true, bg: "#f5f5f5" })}
      ${cell("Duration", { bold: true, center: true, bg: "#f5f5f5" })}
      ${cell("Firm / Co. Name &amp; Place", { bold: true, center: true, bg: "#f5f5f5" })}
      ${cell("Designation", { bold: true, center: true, bg: "#f5f5f5" })}
      ${cell("Job Responsibilities", { bold: true, center: true, bg: "#f5f5f5" })}
      ${cell("Salary Drawn", { bold: true, center: true, bg: "#f5f5f5" })}
      ${cell("Other Facilities", { bold: true, center: true, bg: "#f5f5f5" })}
      ${cell("Reason of Leaving", { bold: true, center: true, bg: "#f5f5f5" })}
    </tr>
    ${expRows}
    <!-- Summary -->
    <tr>
      <td colspan="4" style="border:1px solid #000;padding:4px 6px;font-size:12px;">
        <strong>Total Experience:</strong> ${data.totalExperience || ""}&nbsp;&nbsp;&nbsp;
        <strong>Current CTC:</strong> ${data.currentCTC || ""}&nbsp;&nbsp;&nbsp;
        <strong>Expected CTC:</strong> ${data.expectedCTC || ""}
      </td>
      <td colspan="3" style="border:1px solid #000;padding:4px 6px;font-size:12px;">
        <strong>Current Employer:</strong> ${data.currentEmployer || ""}
      </td>
      <td colspan="3" style="border:1px solid #000;padding:4px 6px;font-size:12px;">
        <strong>Notice Period:</strong> ${data.noticePeriod || ""}
      </td>
    </tr>
  </table>

  <!-- ═══ REMARK ══════════════════════════════════════════════════════════ -->
  <table class="form">
    <tr>
      <td style="border:1px solid #000;padding:5px 6px;font-size:12px;">
        <strong>Cover Letter / Remarks:</strong><br/>
        ${(data.coverLetter || data.additionalRemarks || "&nbsp;").replace(/\n/g, "<br/>")}
      </td>
    </tr>
  </table>

  <!-- ═══ FOR OFFICE USE ONLY ══════════════════════════════════════════════ -->
  <div class="section-label" style="margin-top:6px;">For Office Use Only</div>
  <table class="form" style="font-size:11px;">
    <tr>
      <td class="office-cell" style="width:12%;"><strong>Joining Date</strong><br/><br/></td>
      <td class="office-cell" style="width:12%;"><strong>AI / B. Salary</strong><br/><br/></td>
      <td class="office-cell" style="width:10%;"><strong>Date</strong><br/><br/></td>
      <td class="office-cell" style="width:14%;"><strong>Co. / Deptt.</strong><br/><br/></td>
      <td class="office-cell" style="width:14%;"><strong>Extra Leave / Bonus</strong><br/><br/></td>
      <td class="office-cell" style="width:8%;"><strong>PF</strong><br/><br/></td>
      <td class="office-cell" style="width:12%;"><strong>Sign Mgr.</strong><br/><br/></td>
      <td class="office-cell" style="width:10%;"><strong>Timing</strong><br/><br/></td>
      <td class="office-cell" style="width:8%;"><strong>Approval</strong><br/><br/></td>
    </tr>
  </table>

  <!-- ═══ FOOTER ════════════════════════════════════════════════════════════ -->
  <div style="padding:6px 10px;font-size:10px;color:#888;text-align:center;border-top:1px solid #ddd;margin-top:2px;">
    Submitted via urjatech.com Careers page &nbsp;|&nbsp; ${new Date().toLocaleString("en-IN")}
    ${data.resumeFile ? "&nbsp;|&nbsp; Resume attached" : ""}
  </div>

</div>
</body>
</html>`;
}
