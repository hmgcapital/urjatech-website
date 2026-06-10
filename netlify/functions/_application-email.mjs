import nodemailer from "nodemailer";

export function createTransporter() {
  const port = Number.parseInt(process.env.SMTP_PORT || "587", 10);
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST || "smtp.gmail.com",
    port,
    secure: port === 465,
    connectionTimeout: 10000,
    greetingTimeout: 10000,
    socketTimeout: 20000,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });
}

function escapeHtml(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function nl2br(value) {
  return escapeHtml(value).replace(/\r?\n/g, "<br/>");
}

function cell(content, opts = {}) {
  const style = [
    "border:1px solid #000",
    `padding:${opts.padding ?? "4px 6px"}`,
    opts.bold ? "font-weight:bold" : "",
    opts.center ? "text-align:center" : "",
    opts.bg ? `background:${opts.bg}` : "",
    opts.width ? `width:${opts.width}` : "",
    opts.vAlign ? `vertical-align:${opts.vAlign}` : "vertical-align:top",
    opts.fontSize ? `font-size:${opts.fontSize}` : "font-size:12px",
  ].filter(Boolean).join(";");

  const attrs = [
    opts.colSpan ? `colspan="${opts.colSpan}"` : "",
    opts.rowSpan ? `rowspan="${opts.rowSpan}"` : "",
  ].filter(Boolean).join(" ");

  return `<td ${attrs} style="${style}">${content || "&nbsp;"}</td>`;
}

function parseArray(value) {
  if (Array.isArray(value)) return value;
  if (typeof value !== "string" || value.trim() === "") return [];
  try {
    const parsed = JSON.parse(value);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function duration(from, to) {
  if (!from) return "";
  try {
    const start = new Date(`${from}-01`);
    const end = to ? new Date(`${to}-01`) : new Date();
    const months = Math.max(0, (end.getFullYear() - start.getFullYear()) * 12 + (end.getMonth() - start.getMonth()));
    const years = Math.floor(months / 12);
    const rem = months % 12;
    return years > 0 ? `${years}y ${rem}m` : `${rem}m`;
  } catch {
    return "";
  }
}

export function buildApplicationEmail(data, hasPhoto = false) {
  const education = parseArray(data.education);
  const experience = parseArray(data.experience);
  const today = new Date().toLocaleDateString("en-IN", { day: "2-digit", month: "2-digit", year: "numeric" });
  const married = data.maritalStatus === "Married" || data.maritalStatus === "विवाहित";
  const maritalStatus = married
    ? `Married &nbsp;&nbsp; Sons: ${escapeHtml(data.numberOfSons || "-")} &nbsp;&nbsp; Daughters: ${escapeHtml(data.numberOfDaughters || "-")}`
    : escapeHtml(data.maritalStatus === "Single" ? "Unmarried" : data.maritalStatus || "");

  const eduLabels = ["a. 10th", "b. 12th", "c.", "d.", "e.", "f."];
  const eduRows = eduLabels.map((label, index) => {
    const item = education[index] || {};
    const marks = item.percentage ? `${escapeHtml(item.percentage)}%` : "";
    return `<tr>
      ${cell(escapeHtml(label), { center: true, width: "6%" })}
      ${cell(escapeHtml(item.institution), { width: "22%" })}
      ${cell(escapeHtml(item.subject), { width: "18%" })}
      ${cell(escapeHtml(item.examination), { width: "18%" })}
      ${cell(escapeHtml(item.year), { center: true, width: "10%" })}
      ${cell(marks, { center: true, width: "10%" })}
    </tr>`;
  }).join("");

  const expLabels = ["a.", "b.", "c.", "d.", "e.", "f.", "g.", "h."];
  const expRows = expLabels.map((label, index) => {
    const item = experience[index] || {};
    const from = item.from ? String(item.from).replace("-", "/") : "";
    const to = item.to ? String(item.to).replace("-", "/") : (experience[index] ? "Present" : "");
    return `<tr style="height:28px;">
      ${cell(escapeHtml(label), { center: true, bold: true })}
      ${cell(escapeHtml(from), { center: true })}
      ${cell(escapeHtml(to), { center: true })}
      ${cell(escapeHtml(duration(item.from, item.to)), { center: true })}
      ${cell(escapeHtml(item.company))}
      ${cell(escapeHtml(item.designation))}
      ${cell(escapeHtml(item.responsibilities))}
      ${cell(escapeHtml(item.salary), { center: true })}
      ${cell(escapeHtml(item.benefits), { center: true })}
      ${cell(escapeHtml(item.reasonForLeaving))}
    </tr>`;
  }).join("");

  const ref1 = [data.ref1Name, data.ref1Relationship, data.ref1Company, data.ref1Phone, data.ref1Email].filter(Boolean).map(escapeHtml).join(" | ");
  const ref2 = [data.ref2Name, data.ref2Relationship, data.ref2Company, data.ref2Phone, data.ref2Email].filter(Boolean).map(escapeHtml).join(" | ");
  const remarks = data.coverLetter || data.additionalRemarks || "";

  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8"/>
  <style>
    body { margin:0; padding:16px; background:#f0f0f0; font-family:Arial, sans-serif; }
    .wrapper { max-width:780px; margin:0 auto; background:#fff; border:2px solid #000; }
    table.form { width:100%; border-collapse:collapse; }
    .section-label { background:#000; color:#fff; font-weight:bold; font-size:11px; letter-spacing:1px; padding:3px 6px; text-transform:uppercase; }
    .office-cell { border:1px solid #000; padding:4px 6px; font-size:11px; text-align:center; min-height:36px; }
  </style>
</head>
<body>
<div class="wrapper">
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
            <div><strong>Post Applied for:</strong> ${escapeHtml(data.positionApplied)}</div>
            <div><strong>Referred by:</strong> ${escapeHtml(data.referredBy)}</div>
            <div><strong>Date:</strong> ${today}</div>
            <div><strong>Employment Type:</strong> ${escapeHtml(data.employmentType)}</div>
          </div>
        </div>
      </td>
    </tr>
  </table>

  <div class="section-label">1. Personal Details</div>
  <table class="form">
    <tr>
      <td style="border:1px solid #000;padding:6px;font-size:12px;width:75%;">
        <table style="width:100%;border-collapse:collapse;font-size:12px;">
          <tr><td style="padding:3px 0;width:30%;"><strong>Name:</strong></td><td style="padding:3px 0;">${escapeHtml(data.title)} ${escapeHtml(data.fullName)}</td><td style="padding:3px 0;width:30%;text-align:right;">${maritalStatus}</td></tr>
          <tr><td style="padding:3px 0;"><strong>Date of Birth:</strong></td><td style="padding:3px 0;">${escapeHtml(data.dateOfBirth)}</td><td style="padding:3px 0;text-align:right;"><strong>Age:</strong> ${escapeHtml(data.age)}&nbsp;&nbsp;<strong>Gender:</strong> ${escapeHtml(data.gender)}</td></tr>
          <tr><td style="padding:3px 0;"><strong>Place of Birth:</strong></td><td colspan="2" style="padding:3px 0;">${escapeHtml(data.placeOfBirth)}&nbsp;&nbsp;&nbsp;&nbsp;<strong>Nationality:</strong> ${escapeHtml(data.nationality || "Indian")}</td></tr>
          <tr><td style="padding:3px 0;"><strong>Father's / Husband's Name:</strong></td><td colspan="2" style="padding:3px 0;">${escapeHtml(data.guardianName)}</td></tr>
          <tr><td style="padding:3px 0;"><strong>Occupation:</strong></td><td style="padding:3px 0;">${escapeHtml(data.guardianOccupation)}</td><td style="padding:3px 0;text-align:right;"><strong>Monthly Income:</strong> ${escapeHtml(data.guardianMonthlyIncome)}</td></tr>
          <tr><td style="padding:3px 0;"><strong>Skills:</strong></td><td colspan="2" style="padding:3px 0;">${escapeHtml(data.keySkills)}</td></tr>
          <tr><td style="padding:3px 0;"><strong>Languages:</strong></td><td style="padding:3px 0;">${escapeHtml(data.languagesKnown)}</td><td style="padding:3px 0;text-align:right;"><strong>Computer Skills:</strong> ${escapeHtml(data.computerSkills)}</td></tr>
          <tr><td style="padding:3px 0;"><strong>LinkedIn:</strong></td><td colspan="2" style="padding:3px 0;">${escapeHtml(data.linkedIn)}</td></tr>
        </table>
      </td>
      <td style="border:1px solid #000;width:25%;text-align:center;vertical-align:middle;padding:8px;">
        ${hasPhoto
          ? `<img src="cid:candidatephoto@urjatech" alt="Candidate Photo" style="width:90px;height:110px;object-fit:cover;border:1px solid #ccc;display:block;margin:0 auto;"/>`
          : `<div style="border:1px dashed #aaa;width:90px;height:110px;margin:0 auto;line-height:110px;color:#bbb;font-size:10px;">PHOTO</div>`}
      </td>
    </tr>
  </table>

  <div class="section-label">2. Address</div>
  <table class="form">
    <tr>
      <td style="border:1px solid #000;padding:5px 6px;font-size:12px;width:50%;"><strong>(a) Present Address:</strong><br/>${nl2br(data.presentAddress)}</td>
      <td style="border:1px solid #000;padding:5px 6px;font-size:12px;width:50%;"><strong>(b) Permanent Address:</strong><br/>${nl2br(data.permanentAddress || data.presentAddress)}</td>
    </tr>
    <tr>
      <td style="border:1px solid #000;padding:5px 6px;font-size:12px;"><strong>Res. Ph / Mobile:</strong> ${escapeHtml(data.mobile)} ${data.alternatePhone ? `&nbsp;&nbsp;&nbsp;<strong>Alt:</strong> ${escapeHtml(data.alternatePhone)}` : ""}</td>
      <td style="border:1px solid #000;padding:5px 6px;font-size:12px;"><strong>E-mail:</strong> ${escapeHtml(data.email)}</td>
    </tr>
  </table>

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

  <div class="section-label">5. Certifications / Additional Courses</div>
  <table class="form"><tr><td colspan="6" style="border:1px solid #000;padding:5px 6px;font-size:12px;min-height:30px;">${nl2br(data.certifications) || "&nbsp;"}</td></tr></table>

  <div class="section-label">6. References - Name &amp; address of well-known persons</div>
  <table class="form"><tr><td style="border:1px solid #000;padding:5px 6px;font-size:12px;width:50%;"><strong>Ref 1:</strong> ${ref1 || "&nbsp;"}</td><td style="border:1px solid #000;padding:5px 6px;font-size:12px;width:50%;"><strong>Ref 2:</strong> ${ref2 || "&nbsp;"}</td></tr></table>

  <div class="section-label">7. Past Job Experience</div>
  <table class="form">
    <tr style="font-size:11px;background:#f9f9f9;">
      ${cell("", { bold: true, center: true, bg: "#f5f5f5" })}
      ${cell("From", { bold: true, center: true, bg: "#f5f5f5" })}
      ${cell("To", { bold: true, center: true, bg: "#f5f5f5" })}
      ${cell("Duration", { bold: true, center: true, bg: "#f5f5f5" })}
      ${cell("Firm / Co. Name & Place", { bold: true, center: true, bg: "#f5f5f5" })}
      ${cell("Designation", { bold: true, center: true, bg: "#f5f5f5" })}
      ${cell("Job Responsibilities", { bold: true, center: true, bg: "#f5f5f5" })}
      ${cell("Salary Drawn", { bold: true, center: true, bg: "#f5f5f5" })}
      ${cell("Other Facilities", { bold: true, center: true, bg: "#f5f5f5" })}
      ${cell("Reason of Leaving", { bold: true, center: true, bg: "#f5f5f5" })}
    </tr>
    ${expRows}
    <tr>
      <td colspan="4" style="border:1px solid #000;padding:4px 6px;font-size:12px;"><strong>Total Experience:</strong> ${escapeHtml(data.totalExperience)}&nbsp;&nbsp;&nbsp;<strong>Current CTC:</strong> ${escapeHtml(data.currentCTC)}&nbsp;&nbsp;&nbsp;<strong>Expected CTC:</strong> ${escapeHtml(data.expectedCTC)}</td>
      <td colspan="3" style="border:1px solid #000;padding:4px 6px;font-size:12px;"><strong>Current Employer:</strong> ${escapeHtml(data.currentEmployer)}</td>
      <td colspan="3" style="border:1px solid #000;padding:4px 6px;font-size:12px;"><strong>Notice Period:</strong> ${escapeHtml(data.noticePeriod)}</td>
    </tr>
  </table>

  <table class="form"><tr><td style="border:1px solid #000;padding:5px 6px;font-size:12px;"><strong>Cover Letter / Remarks:</strong><br/>${nl2br(remarks) || "&nbsp;"}</td></tr></table>

  <div class="section-label" style="margin-top:6px;">For Office Use Only</div>
  <table class="form" style="font-size:11px;"><tr>
    <td class="office-cell" style="width:12%;"><strong>Joining Date</strong><br/><br/></td>
    <td class="office-cell" style="width:12%;"><strong>AI / B. Salary</strong><br/><br/></td>
    <td class="office-cell" style="width:10%;"><strong>Date</strong><br/><br/></td>
    <td class="office-cell" style="width:14%;"><strong>Co. / Deptt.</strong><br/><br/></td>
    <td class="office-cell" style="width:14%;"><strong>Extra Leave / Bonus</strong><br/><br/></td>
    <td class="office-cell" style="width:8%;"><strong>PF</strong><br/><br/></td>
    <td class="office-cell" style="width:12%;"><strong>Sign Mgr.</strong><br/><br/></td>
    <td class="office-cell" style="width:10%;"><strong>Timing</strong><br/><br/></td>
    <td class="office-cell" style="width:8%;"><strong>Approval</strong><br/><br/></td>
  </tr></table>

  <div style="padding:6px 10px;font-size:10px;color:#888;text-align:center;border-top:1px solid #ddd;margin-top:2px;">
    Submitted via capitalurjatech.com Careers page &nbsp;|&nbsp; ${new Date().toLocaleString("en-IN")}
  </div>
</div>
</body>
</html>`;
}
