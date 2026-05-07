import { motion, AnimatePresence } from "framer-motion";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useState, useEffect, useRef } from "react";
import { useQuery } from "@tanstack/react-query";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { PlusCircle, Trash2, Briefcase, GraduationCap, User, Phone, FileText, Users, MapPin, Clock, ChevronRight, ArrowLeft } from "lucide-react";

// ─── Translations ─────────────────────────────────────────────────────────────

const T = {
  en: {
    pageTitle: "Careers",
    pageSubtitle: "Join the Urjatech team. Fill in the form below and we'll get back to you.",
    langBtn: "हिंदी",
    sec1: "Application Details", sec2: "Personal Details", sec3: "Contact Information",
    sec4: "Academic / Professional Qualifications", sec5: "Work Experience",
    sec6: "Skills & Competencies", sec7: "References", sec8: "Documents & Additional Information",
    positionApplied: "Position Applied For", positionPH: "e.g. Sales Engineer",
    referredBy: "Referred By", referredByPH: "Name of referrer (if any)",
    employmentType: "Employment Type", noticePeriod: "Notice Period / Availability",
    expectedCTC: "Expected CTC / Salary (per annum)", expectedCTCPH: "e.g. ₹6,00,000",
    passportPhoto: "Passport Photo", clickUpload: "Click to upload\nJPG / PNG", changePhoto: "Change photo", maxFile: "Max 5 MB",
    titleField: "Title", fullName: "Full Name", fullNamePH: "As per official documents",
    dob: "Date of Birth", age: "Age (auto-calculated)",
    gender: "Gender", maritalStatus: "Marital Status",
    sons: "Number of Sons", daughters: "Number of Daughters",
    placeOfBirth: "Place of Birth", placeOfBirthPH: "City, State",
    nationality: "Nationality",
    guardianName: "Father's / Husband's Name", guardianNamePH: "Full name",
    guardianOccupation: "Father's / Husband's Occupation", guardianOccPH: "Occupation",
    guardianIncome: "Father's / Husband's Monthly Income", guardianIncomePH: "e.g. ₹50,000",
    mobile: "Mobile Number", mobilePH: "+91 XXXXX XXXXX",
    altPhone: "Alternate Phone",
    email: "Email Address", emailPH: "you@example.com",
    linkedin: "LinkedIn Profile URL", linkedinPH: "linkedin.com/in/yourname",
    presentAddress: "Present Address", addressPH: "Street, City, State, PIN",
    sameAddressChk: "Permanent address is same as present address",
    permanentAddress: "Permanent Address",
    examination: "Examination", examinationPH: "e.g. 10th, B.Tech",
    school: "School / College", schoolPH: "Institution name",
    board: "Board / University", boardPH: "e.g. CBSE, VTU",
    subject: "Subject / Stream", subjectPH: "e.g. Science, Electronics",
    yearOfPassing: "Year of Passing", percentage: "% Marks / CGPA", percentagePH: "e.g. 82% or 8.5",
    addEducation: "Add Education Row",
    totalExperience: "Total Years of Experience", totalExpPH: "e.g. 3 years 6 months",
    currentEmployer: "Current Employer", currentEmployerPH: "Company name (if employed)",
    currentCTC: "Current CTC (per annum)", currentCTCPH: "e.g. ₹5,00,000",
    expLabel: (n: number) => `Experience #${n + 1}`,
    company: "Company Name & Place", companyPH: "Company Pvt. Ltd., Delhi",
    designation: "Designation", designationPH: "e.g. Senior Engineer",
    from: "From", to: "To (leave blank if current)",
    salaryDrawn: "Salary Drawn", salaryPH: "e.g. ₹4,50,000 p.a.",
    benefits: "Other Facilities / Benefits", benefitsPH: "e.g. PF, Medical, Bonus",
    responsibilities: "Job Responsibilities", responsibilitiesPH: "Briefly describe your key responsibilities",
    reasonLeaving: "Reason for Leaving", reasonLeavingPH: "e.g. Better opportunity, Relocation",
    addExperience: "Add Experience",
    keySkills: "Key Technical Skills", keySkillsPH: "List your core skills, e.g. Electrical design, AutoCAD, Project management…",
    computerSkills: "Computer / Software Skills", computerSkillsPH: "e.g. MS Office, SAP, AutoCAD",
    languages: "Languages Known", languagesPH: "e.g. Hindi, English, Punjabi",
    certifications: "Certifications / Additional Courses", certificationsPH: "List any certifications, online courses or vocational training",
    refSubtitle: "Provide two people who know you professionally and are not relatives.",
    refLabel: (n: number) => `Reference ${n}`,
    refName: "Full Name", refNamePH: "Name",
    refRelationship: "Relationship / How they know you", refRelPH: "e.g. Ex-Manager",
    refCompany: "Company / Organisation", refCompanyPH: "Company",
    refPhone: "Phone", refPhonePH: "+91 XXXXX XXXXX",
    refEmail: "Email", refEmailPH: "reference@example.com",
    resumeLabel: "Upload Resume / CV", resumeHint: "(PDF, DOC, DOCX — max 5 MB)",
    coverLetter: "Cover Letter", coverLetterHint: "(optional)", coverLetterPH: "Tell us why you'd be a great fit for this role…",
    additionalRemarks: "Additional Remarks", additionalRemarksHint: "(optional)", additionalRemarksPH: "Any other information you'd like to share",
    declaration: "I hereby declare that all information provided in this application is true, correct and complete to the best of my knowledge and belief. I understand that any false or misleading information may result in disqualification from the selection process or termination of employment.",
    submit: "Submit Application", submitting: "Submitting…",
    selectPH: "— Select —",
    employmentOpts: ["Full-time", "Part-time", "Internship"],
    noticePeriodOpts: ["Immediate", "15 Days", "1 Month", "2 Months", "3 Months"],
    titleOpts: ["Mr.", "Mrs.", "Ms.", "Dr."],
    genderOpts: ["Male", "Female", "Other", "Prefer not to say"],
    maritalOpts: ["Single", "Married", "Divorced", "Widowed"],
    successTitle: "Application Submitted!", successDesc: "We'll review your application and get back to you soon.",
    errorTitle: "Submission Failed", networkError: "Could not reach the server. Please try again.",
  },
  hi: {
    pageTitle: "करियर",
    pageSubtitle: "उर्जाटेक टीम में शामिल हों। नीचे फ़ॉर्म भरें और हम आपसे संपर्क करेंगे।",
    langBtn: "English",
    sec1: "आवेदन विवरण", sec2: "व्यक्तिगत विवरण", sec3: "संपर्क जानकारी",
    sec4: "शैक्षणिक / व्यावसायिक योग्यता", sec5: "कार्य अनुभव",
    sec6: "कौशल और दक्षता", sec7: "संदर्भ", sec8: "दस्तावेज़ और अतिरिक्त जानकारी",
    positionApplied: "आवेदित पद", positionPH: "जैसे: सेल्स इंजीनियर",
    referredBy: "किसने भेजा", referredByPH: "संदर्भकर्ता का नाम (यदि कोई हो)",
    employmentType: "रोजगार का प्रकार", noticePeriod: "नोटिस अवधि / उपलब्धता",
    expectedCTC: "अपेक्षित वेतन (प्रति वर्ष)", expectedCTCPH: "जैसे: ₹6,00,000",
    passportPhoto: "पासपोर्ट फ़ोटो", clickUpload: "फ़ोटो अपलोड करें\nJPG / PNG", changePhoto: "फ़ोटो बदलें", maxFile: "अधिकतम 5 MB",
    titleField: "उपाधि", fullName: "पूरा नाम", fullNamePH: "आधिकारिक दस्तावेज़ के अनुसार",
    dob: "जन्म तिथि", age: "आयु (स्वतः गणना)",
    gender: "लिंग", maritalStatus: "वैवाहिक स्थिति",
    sons: "पुत्रों की संख्या", daughters: "पुत्रियों की संख्या",
    placeOfBirth: "जन्म स्थान", placeOfBirthPH: "शहर, राज्य",
    nationality: "राष्ट्रीयता",
    guardianName: "पिता / पति का नाम", guardianNamePH: "पूरा नाम",
    guardianOccupation: "पिता / पति का व्यवसाय", guardianOccPH: "व्यवसाय",
    guardianIncome: "पिता / पति की मासिक आय", guardianIncomePH: "जैसे: ₹50,000",
    mobile: "मोबाइल नंबर", mobilePH: "+91 XXXXX XXXXX",
    altPhone: "वैकल्पिक फ़ोन",
    email: "ईमेल पता", emailPH: "you@example.com",
    linkedin: "लिंक्डइन प्रोफ़ाइल", linkedinPH: "linkedin.com/in/yourname",
    presentAddress: "वर्तमान पता", addressPH: "गली, शहर, राज्य, पिन",
    sameAddressChk: "स्थायी पता, वर्तमान पते के समान है",
    permanentAddress: "स्थायी पता",
    examination: "परीक्षा", examinationPH: "जैसे: 10वीं, B.Tech",
    school: "स्कूल / कॉलेज", schoolPH: "संस्था का नाम",
    board: "बोर्ड / विश्वविद्यालय", boardPH: "जैसे: CBSE, VTU",
    subject: "विषय / धारा", subjectPH: "जैसे: विज्ञान, इलेक्ट्रॉनिक्स",
    yearOfPassing: "उत्तीर्ण वर्ष", percentage: "% अंक / CGPA", percentagePH: "जैसे: 82% या 8.5",
    addEducation: "शिक्षा पंक्ति जोड़ें",
    totalExperience: "कुल अनुभव", totalExpPH: "जैसे: 3 साल 6 महीने",
    currentEmployer: "वर्तमान नियोक्ता", currentEmployerPH: "कंपनी का नाम (यदि नौकरी में हों)",
    currentCTC: "वर्तमान वेतन (प्रति वर्ष)", currentCTCPH: "जैसे: ₹5,00,000",
    expLabel: (n: number) => `अनुभव #${n + 1}`,
    company: "कंपनी का नाम और स्थान", companyPH: "कंपनी प्रा. लि., दिल्ली",
    designation: "पदनाम", designationPH: "जैसे: वरिष्ठ इंजीनियर",
    from: "से", to: "तक (वर्तमान हो तो खाली छोड़ें)",
    salaryDrawn: "आहरित वेतन", salaryPH: "जैसे: ₹4,50,000 प्रति वर्ष",
    benefits: "अन्य सुविधाएं / लाभ", benefitsPH: "जैसे: PF, चिकित्सा, बोनस",
    responsibilities: "कार्य जिम्मेदारियां", responsibilitiesPH: "अपनी प्रमुख जिम्मेदारियों का संक्षेप में वर्णन करें",
    reasonLeaving: "छोड़ने का कारण", reasonLeavingPH: "जैसे: बेहतर अवसर, स्थानांतरण",
    addExperience: "अनुभव जोड़ें",
    keySkills: "मुख्य तकनीकी कौशल", keySkillsPH: "अपने मुख्य कौशल सूचीबद्ध करें, जैसे: विद्युत डिज़ाइन, AutoCAD…",
    computerSkills: "कंप्यूटर / सॉफ्टवेयर कौशल", computerSkillsPH: "जैसे: MS Office, SAP, AutoCAD",
    languages: "ज्ञात भाषाएं", languagesPH: "जैसे: हिंदी, अंग्रेज़ी, पंजाबी",
    certifications: "प्रमाणपत्र / अतिरिक्त पाठ्यक्रम", certificationsPH: "कोई भी प्रमाणपत्र, ऑनलाइन कोर्स या व्यावसायिक प्रशिक्षण",
    refSubtitle: "दो ऐसे व्यक्तियों का नाम दें जो आपको व्यावसायिक रूप से जानते हों और रिश्तेदार न हों।",
    refLabel: (n: number) => `संदर्भ ${n}`,
    refName: "पूरा नाम", refNamePH: "नाम",
    refRelationship: "संबंध / कैसे जानते हैं", refRelPH: "जैसे: पूर्व प्रबंधक",
    refCompany: "कंपनी / संस्था", refCompanyPH: "कंपनी",
    refPhone: "फ़ोन", refPhonePH: "+91 XXXXX XXXXX",
    refEmail: "ईमेल", refEmailPH: "reference@example.com",
    resumeLabel: "बायोडाटा / CV अपलोड करें", resumeHint: "(PDF, DOC, DOCX — अधिकतम 5 MB)",
    coverLetter: "कवर पत्र", coverLetterHint: "(वैकल्पिक)", coverLetterPH: "बताएं कि आप इस पद के लिए उपयुक्त क्यों हैं…",
    additionalRemarks: "अतिरिक्त टिप्पणी", additionalRemarksHint: "(वैकल्पिक)", additionalRemarksPH: "कोई अन्य जानकारी जो आप साझा करना चाहते हों",
    declaration: "मैं एतद्द्वारा घोषणा करता/करती हूं कि इस आवेदन में दी गई सभी जानकारी मेरी जानकारी और विश्वास के अनुसार सत्य, सही और पूर्ण है। मैं समझता/समझती हूं कि कोई भी गलत या भ्रामक जानकारी चयन प्रक्रिया से अयोग्यता या नौकरी समाप्ति का कारण बन सकती है।",
    submit: "आवेदन जमा करें", submitting: "जमा हो रहा है…",
    selectPH: "— चुनें —",
    employmentOpts: ["Full-time", "Part-time", "Internship"],
    noticePeriodOpts: ["Immediate", "15 Days", "1 Month", "2 Months", "3 Months"],
    titleOpts: ["श्री", "श्रीमती", "सुश्री", "डॉ."],
    genderOpts: ["पुरुष", "महिला", "अन्य", "बताना नहीं चाहते"],
    maritalOpts: ["अविवाहित", "विवाहित", "तलाकशुदा", "विधवा/विधुर"],
    successTitle: "आवेदन जमा हो गया!", successDesc: "हम आपके आवेदन की समीक्षा करेंगे और जल्द ही संपर्क करेंगे।",
    errorTitle: "जमा करने में विफल", networkError: "सर्वर से संपर्क नहीं हो सका। कृपया पुनः प्रयास करें।",
  },
} as const;

type Lang = keyof typeof T;

// ─── Zod Schema ──────────────────────────────────────────────────────────────

const educationSchema = z.object({
  examination: z.string().min(1, "Required"),
  institution: z.string().min(1, "Required"),
  board: z.string().optional(),
  subject: z.string().optional(),
  year: z.string().optional(),
  percentage: z.string().optional(),
});

const experienceSchema = z.object({
  company: z.string().min(1, "Required"),
  designation: z.string().min(1, "Required"),
  from: z.string().optional(),
  to: z.string().optional(),
  salary: z.string().optional(),
  benefits: z.string().optional(),
  responsibilities: z.string().optional(),
  reasonForLeaving: z.string().optional(),
});

const formSchema = z.object({
  positionApplied: z.string().min(1, "Position is required"),
  referredBy: z.string().optional(),
  employmentType: z.string().min(1, "Please select employment type"),
  expectedCTC: z.string().optional(),
  noticePeriod: z.string().optional(),
  title: z.string().optional(),
  fullName: z.string().min(2, "Full name is required"),
  dateOfBirth: z.string().min(1, "Date of birth is required"),
  age: z.string().optional(),
  gender: z.string().optional(),
  maritalStatus: z.string().optional(),
  numberOfSons: z.string().optional(),
  numberOfDaughters: z.string().optional(),
  placeOfBirth: z.string().optional(),
  nationality: z.string().optional(),
  guardianName: z.string().optional(),
  guardianOccupation: z.string().optional(),
  guardianMonthlyIncome: z.string().optional(),
  mobile: z.string().min(10, "Valid mobile number required"),
  alternatePhone: z.string().optional(),
  // Email is optional — validate format only if provided
  email: z.string().refine(
    (val) => !val || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val),
    { message: "Invalid email format" }
  ).optional(),
  linkedIn: z.string().optional(),
  presentAddress: z.string().min(5, "Present address is required"),
  sameAddress: z.boolean().optional(),
  permanentAddress: z.string().optional(),
  education: z.array(educationSchema).min(1, "At least one education record is required"),
  totalExperience: z.string().optional(),
  currentCTC: z.string().optional(),
  currentEmployer: z.string().optional(),
  experience: z.array(experienceSchema),
  keySkills: z.string().optional(),
  computerSkills: z.string().optional(),
  languagesKnown: z.string().optional(),
  certifications: z.string().optional(),
  ref1Name: z.string().optional(), ref1Relationship: z.string().optional(),
  ref1Company: z.string().optional(), ref1Phone: z.string().optional(), ref1Email: z.string().optional(),
  ref2Name: z.string().optional(), ref2Relationship: z.string().optional(),
  ref2Company: z.string().optional(), ref2Phone: z.string().optional(), ref2Email: z.string().optional(),
  coverLetter: z.string().optional(),
  additionalRemarks: z.string().optional(),
  declaration: z.boolean().refine((v) => v === true, { message: "You must accept the declaration to submit" }),
});

type FormValues = z.infer<typeof formSchema>;

// ─── Helpers ─────────────────────────────────────────────────────────────────

function SectionHeader({ icon: Icon, title }: { icon: React.ElementType; title: string }) {
  return (
    <div className="flex items-center gap-3 mb-6 pb-3 border-b-2 border-[#01AEEF]">
      <div className="bg-[#01AEEF] text-white p-2 rounded-sm">
        <Icon className="h-4 w-4" />
      </div>
      <h2 className="text-lg font-black uppercase tracking-wide text-gray-900">{title}</h2>
    </div>
  );
}

function FieldGrid({ children }: { children: React.ReactNode }) {
  return <div className="grid grid-cols-1 md:grid-cols-2 gap-4">{children}</div>;
}

function SelectField({ label, name, options, placeholder, required, control }: {
  label: string; name: any; options: string[]; placeholder: string; required?: boolean; control: any;
}) {
  return (
    <FormField control={control} name={name} render={({ field }) => (
      <FormItem>
        <FormLabel className="text-gray-900">
          {label}{required && <span className="text-red-500 ml-1">*</span>}
        </FormLabel>
        <FormControl>
          <select {...field} className="w-full border border-gray-300 bg-white text-gray-900 px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-[#01AEEF] rounded-sm">
            <option value="">{placeholder}</option>
            {options.map((o) => <option key={o} value={o}>{o}</option>)}
          </select>
        </FormControl>
        <FormMessage />
      </FormItem>
    )} />
  );
}

function TextField({ label, name, placeholder, required, control, type = "text", readOnly }: {
  label: string; name: any; placeholder?: string; required?: boolean; control: any; type?: string; readOnly?: boolean;
}) {
  return (
    <FormField control={control} name={name} render={({ field }) => (
      <FormItem>
        <FormLabel className="text-gray-900">
          {label}{required && <span className="text-red-500 ml-1">*</span>}
        </FormLabel>
        <FormControl>
          <Input
            {...field}
            type={type}
            placeholder={placeholder}
            readOnly={readOnly}
            className={`bg-white border-gray-300 text-gray-900 placeholder:text-gray-400 rounded-sm ${readOnly ? "bg-gray-50 cursor-default" : ""}`}
          />
        </FormControl>
        <FormMessage />
      </FormItem>
    )} />
  );
}

// ─── Job type ─────────────────────────────────────────────────────────────────

interface Job {
  id: string;
  title: string;
  department: string;
  location: string;
  type: string;
  experience: string;
  description: string;
  responsibilities: string[];
  requirements: string[];
  active: boolean;
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function Careers() {
  const { toast } = useToast();
  const [lang, setLang] = useState<Lang>("en");
  const t = T[lang];

  // Which JD is expanded (accordion)
  const [expandedId, setExpandedId] = useState<string | null>(null);
  // null = listings view, "" = general application, "jobTitle" = specific JD
  const [selectedPosition, setSelectedPosition] = useState<string | null>(null);
  const formRef = useRef<HTMLDivElement>(null);

  const { data: jobs = [], isLoading: jobsLoading } = useQuery<Job[]>({
    queryKey: ["careers-jobs"],
    queryFn: () => fetch("/api/careers/jobs").then((r) => r.json()),
  });

  function applyForJob(title: string) {
    setSelectedPosition(title);
    setTimeout(() => formRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }), 50);
  }

  function applyGeneral() {
    setSelectedPosition("");
    setTimeout(() => formRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }), 50);
  }

  function backToListings() {
    setSelectedPosition(null);
    setExpandedId(null);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  function handlePhotoChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0] || null;
    setPhotoFile(file);
    if (file) {
      const reader = new FileReader();
      reader.onload = (ev) => setPhotoPreview(ev.target?.result as string);
      reader.readAsDataURL(file);
    } else {
      setPhotoPreview(null);
    }
  }

  // Sync selectedPosition into the form field whenever it changes
  useEffect(() => {
    if (selectedPosition !== null) {
      form.setValue("positionApplied", selectedPosition);
    }
  }, [selectedPosition]);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      positionApplied: "", referredBy: "", employmentType: "", expectedCTC: "", noticePeriod: "",
      title: "", fullName: "", dateOfBirth: "", age: "", gender: "", maritalStatus: "",
      numberOfSons: "", numberOfDaughters: "", placeOfBirth: "", nationality: "Indian",
      guardianName: "", guardianOccupation: "", guardianMonthlyIncome: "",
      mobile: "", alternatePhone: "", email: "", linkedIn: "",
      presentAddress: "", sameAddress: false, permanentAddress: "",
      education: [{ examination: "10th", institution: "", board: "", subject: "", year: "", percentage: "" }],
      totalExperience: "", currentCTC: "", currentEmployer: "", experience: [],
      keySkills: "", computerSkills: "", languagesKnown: "", certifications: "",
      ref1Name: "", ref1Relationship: "", ref1Company: "", ref1Phone: "", ref1Email: "",
      ref2Name: "", ref2Relationship: "", ref2Company: "", ref2Phone: "", ref2Email: "",
      coverLetter: "", additionalRemarks: "", declaration: false,
    },
  });

  const { fields: eduFields, append: appendEdu, remove: removeEdu } = useFieldArray({ control: form.control, name: "education" });
  const { fields: expFields, append: appendExp, remove: removeExp } = useFieldArray({ control: form.control, name: "experience" });

  const sameAddress  = form.watch("sameAddress");
  const maritalStatus = form.watch("maritalStatus");

  // ── Auto-calculate age from DOB ──────────────────────────────────────────
  const dob = form.watch("dateOfBirth");
  useEffect(() => {
    if (!dob) return;
    const birth = new Date(dob);
    const today = new Date();
    let age = today.getFullYear() - birth.getFullYear();
    const m = today.getMonth() - birth.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) age--;
    if (age > 0 && age < 120) form.setValue("age", String(age));
    else form.setValue("age", "");
  }, [dob]);

  async function onSubmit(data: FormValues) {
    setSubmitting(true);
    try {
      if (data.sameAddress) data.permanentAddress = data.presentAddress;
      const fd = new FormData();
      for (const [key, value] of Object.entries(data)) {
        if (key === "education" || key === "experience") continue;
        if (value !== undefined && value !== null) fd.append(key, String(value));
      }
      fd.append("education", JSON.stringify(data.education));
      fd.append("experience", JSON.stringify(data.experience));
      if (resumeFile) fd.append("resume", resumeFile);
      if (photoFile)  fd.append("photo",  photoFile);

      const res  = await fetch("/api/careers/apply", { method: "POST", body: fd });
      const json = await res.json();

      if (json.success) {
        toast({ title: t.successTitle, description: t.successDesc });
        form.reset();
        setResumeFile(null); setPhotoFile(null); setPhotoPreview(null);
      } else {
        toast({ title: t.errorTitle, description: json.message || "Please try again.", variant: "destructive" });
      }
    } catch {
      toast({ title: t.errorTitle, description: t.networkError, variant: "destructive" });
    } finally {
      setSubmitting(false);
    }
  }

  const ic = "bg-white border-gray-300 text-gray-900 placeholder:text-gray-400 rounded-sm text-sm";

  return (
    <div style={{ background: "#ffffff" }}>
      <div className="container mx-auto px-6 py-12">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="max-w-4xl mx-auto">

          {/* ── PAGE HEADER ── */}
          <div className="flex items-start justify-between mb-3">
            <div className="flex-1">
              <h1 className="text-4xl font-bold text-gray-900 text-center">{t.pageTitle}</h1>
              <p className="text-center text-gray-600 mt-2 max-w-2xl mx-auto">{t.pageSubtitle}</p>
            </div>
            <button
              type="button"
              onClick={() => setLang(lang === "en" ? "hi" : "en")}
              className="ml-4 mt-1 flex-shrink-0 border-2 border-[#01AEEF] text-[#01AEEF] font-black text-sm uppercase px-3 py-1.5 rounded-sm hover:bg-[#01AEEF] hover:text-white transition-colors"
            >
              {t.langBtn}
            </button>
          </div>

          {/* ── JOB LISTINGS (shown when no position selected) ── */}
          <AnimatePresence>
            {selectedPosition === null && (
              <motion.div
                key="listings"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
                className="mt-10 space-y-4"
              >
                {/* General application CTA */}
                <div className="flex items-center justify-between bg-gray-50 border border-gray-200 rounded-sm px-5 py-4">
                  <div>
                    <p className="font-semibold text-gray-800">
                      {lang === "en" ? "Don't see a role that fits?" : "कोई उपयुक्त पद नहीं दिखा?"}
                    </p>
                    <p className="text-sm text-gray-500 mt-0.5">
                      {lang === "en"
                        ? "Send us a general application and we'll be in touch."
                        : "हमें एक सामान्य आवेदन भेजें, हम संपर्क करेंगे।"}
                    </p>
                  </div>
                  <Button
                    type="button"
                    onClick={applyGeneral}
                    className="flex-shrink-0 ml-4 font-black border-2 border-black text-black uppercase bg-transparent hover:bg-transparent hover:text-[#01AEEF] hover:border-[#01AEEF] rounded-none px-5 py-2 text-xs"
                  >
                    {lang === "en" ? "General Application" : "सामान्य आवेदन"}
                  </Button>
                </div>

                {/* Divider */}
                <div className="flex items-center gap-3 py-2">
                  <div className="flex-1 h-px bg-gray-200" />
                  <span className="text-xs font-semibold text-gray-400 uppercase tracking-widest">
                    {lang === "en" ? "Current Openings" : "वर्तमान रिक्तियां"}
                  </span>
                  <div className="flex-1 h-px bg-gray-200" />
                </div>

                {/* Job cards */}
                {jobsLoading ? (
                  <div className="text-center py-10 text-gray-400">
                    {lang === "en" ? "Loading openings…" : "रिक्तियां लोड हो रही हैं…"}
                  </div>
                ) : jobs.length === 0 ? (
                  <div className="text-center py-10 text-gray-400">
                    {lang === "en" ? "No current openings. Check back soon!" : "अभी कोई रिक्ति नहीं है। जल्द देखें!"}
                  </div>
                ) : (
                  jobs.map((job) => (
                    <div key={job.id} className="border border-gray-200 rounded-sm overflow-hidden">
                      {/* Card header — always visible */}
                      <button
                        type="button"
                        onClick={() => setExpandedId(expandedId === job.id ? null : job.id)}
                        className="w-full flex items-center justify-between px-5 py-4 text-left hover:bg-gray-50 transition-colors"
                      >
                        <div>
                          <p className="font-black text-gray-900 text-base">{job.title}</p>
                          <div className="flex flex-wrap gap-3 mt-1.5">
                            <span className="flex items-center gap-1 text-xs text-gray-500">
                              <Briefcase className="h-3 w-3" /> {job.department}
                            </span>
                            <span className="flex items-center gap-1 text-xs text-gray-500">
                              <MapPin className="h-3 w-3" /> {job.location}
                            </span>
                            <span className="flex items-center gap-1 text-xs text-gray-500">
                              <Clock className="h-3 w-3" /> {job.experience}
                            </span>
                            <span className="text-xs text-white bg-[#01AEEF] px-2 py-0.5 rounded-full">{job.type}</span>
                          </div>
                        </div>
                        <ChevronRight className={`h-5 w-5 text-gray-400 flex-shrink-0 ml-3 transition-transform ${expandedId === job.id ? "rotate-90" : ""}`} />
                      </button>

                      {/* Expanded JD details */}
                      <AnimatePresence>
                        {expandedId === job.id && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.25 }}
                            className="overflow-hidden"
                          >
                            <div className="px-5 pb-5 border-t border-gray-100 space-y-4">
                              <p className="text-sm text-gray-600 mt-4">{job.description}</p>

                              {job.responsibilities?.length > 0 && (
                                <div>
                                  <p className="text-xs font-black uppercase text-gray-500 mb-1.5">
                                    {lang === "en" ? "Responsibilities" : "जिम्मेदारियां"}
                                  </p>
                                  <ul className="space-y-1">
                                    {job.responsibilities.map((r, i) => (
                                      <li key={i} className="flex items-start gap-2 text-sm text-gray-700">
                                        <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-[#01AEEF] flex-shrink-0" />
                                        {r}
                                      </li>
                                    ))}
                                  </ul>
                                </div>
                              )}

                              {job.requirements?.length > 0 && (
                                <div>
                                  <p className="text-xs font-black uppercase text-gray-500 mb-1.5">
                                    {lang === "en" ? "Requirements" : "आवश्यकताएं"}
                                  </p>
                                  <ul className="space-y-1">
                                    {job.requirements.map((r, i) => (
                                      <li key={i} className="flex items-start gap-2 text-sm text-gray-700">
                                        <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-gray-400 flex-shrink-0" />
                                        {r}
                                      </li>
                                    ))}
                                  </ul>
                                </div>
                              )}

                              <Button
                                type="button"
                                onClick={() => applyForJob(job.title)}
                                className="mt-2 font-black border-2 border-[#01AEEF] text-[#01AEEF] uppercase bg-transparent hover:bg-[#01AEEF] hover:text-white rounded-none px-6 py-2 text-xs flex items-center gap-2"
                              >
                                {lang === "en" ? `Apply for ${job.title}` : `${job.title} के लिए आवेदन करें`}
                                <ChevronRight className="h-4 w-4" />
                              </Button>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  ))
                )}
              </motion.div>
            )}
          </AnimatePresence>

          {/* ── APPLICATION FORM (shown when a position is selected) ── */}
          <AnimatePresence>
            {selectedPosition !== null && (
              <motion.div
                key="form"
                ref={formRef}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
                className="mt-8"
              >
                {/* Back button + banner */}
                <div className="flex items-center gap-4 mb-6">
                  <button
                    type="button"
                    onClick={backToListings}
                    className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-[#01AEEF] transition-colors font-medium"
                  >
                    <ArrowLeft className="h-4 w-4" />
                    {lang === "en" ? "Back to Openings" : "रिक्तियों पर वापस"}
                  </button>
                  {selectedPosition && (
                    <span className="text-sm text-gray-400">
                      {lang === "en" ? `Applying for: ` : `आवेदन: `}
                      <span className="font-semibold text-gray-700">{selectedPosition}</span>
                    </span>
                  )}
                </div>

          <div className="mb-2" />

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-10">

              {/* ── 1. APPLICATION DETAILS ── */}
              <div className="bg-white border border-gray-200 rounded-sm p-6 shadow-sm">
                <SectionHeader icon={Briefcase} title={t.sec1} />
                <FieldGrid>
                  <TextField control={form.control} name="positionApplied" label={t.positionApplied} placeholder={t.positionPH} required readOnly={!!selectedPosition} />
                  <TextField control={form.control} name="referredBy" label={t.referredBy} placeholder={t.referredByPH} />
                  <SelectField control={form.control} name="employmentType" label={t.employmentType} options={t.employmentOpts as unknown as string[]} placeholder={t.selectPH} required />
                  <SelectField control={form.control} name="noticePeriod" label={t.noticePeriod} options={t.noticePeriodOpts as unknown as string[]} placeholder={t.selectPH} />
                  <TextField control={form.control} name="expectedCTC" label={t.expectedCTC} placeholder={t.expectedCTCPH} />
                </FieldGrid>
              </div>

              {/* ── 2. PERSONAL DETAILS ── */}
              <div className="bg-white border border-gray-200 rounded-sm p-6 shadow-sm">
                <SectionHeader icon={User} title={t.sec2} />
                <div className="space-y-4">

                  {/* Name + photo */}
                  <div className="flex flex-col md:flex-row gap-6">
                    <div className="flex-1 space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <SelectField control={form.control} name="title" label={t.titleField} options={t.titleOpts as unknown as string[]} placeholder={t.selectPH} />
                        <div className="md:col-span-2">
                          <TextField control={form.control} name="fullName" label={t.fullName} placeholder={t.fullNamePH} required />
                        </div>
                      </div>
                    </div>

                    {/* Photo upload */}
                    <div className="flex flex-col items-center gap-2 md:w-36">
                      <span className="text-xs font-medium text-gray-700 self-start md:self-center">{t.passportPhoto}</span>
                      <label
                        htmlFor="photo-upload"
                        className="cursor-pointer group relative flex items-center justify-center w-28 h-36 border-2 border-dashed border-gray-300 rounded-sm overflow-hidden hover:border-[#01AEEF] transition-colors"
                      >
                        {photoPreview
                          ? <img src={photoPreview} alt="preview" className="w-full h-full object-cover" />
                          : <div className="text-center text-gray-400 px-2">
                              <User className="h-8 w-8 mx-auto mb-1 text-gray-300" />
                              <span className="text-[10px] leading-tight whitespace-pre-line">{t.clickUpload}</span>
                            </div>
                        }
                        {photoPreview && (
                          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                            <span className="text-white text-[10px] font-medium">{t.changePhoto}</span>
                          </div>
                        )}
                      </label>
                      <input id="photo-upload" type="file" accept="image/jpeg,image/png,image/jpg" className="hidden" onChange={handlePhotoChange} />
                      {photoFile && <p className="text-[10px] text-green-600 text-center truncate w-28">✓ {photoFile.name}</p>}
                      <p className="text-[10px] text-gray-400 text-center">{t.maxFile}</p>
                    </div>
                  </div>

                  <FieldGrid>
                    {/* DOB + auto-age side by side */}
                    <TextField control={form.control} name="dateOfBirth" label={t.dob} type="date" required />
                    <TextField control={form.control} name="age" label={t.age} placeholder="—" readOnly />
                    <SelectField control={form.control} name="gender" label={t.gender} options={t.genderOpts as unknown as string[]} placeholder={t.selectPH} />
                    <SelectField control={form.control} name="maritalStatus" label={t.maritalStatus} options={t.maritalOpts as unknown as string[]} placeholder={t.selectPH} />
                    {maritalStatus === "Married" || maritalStatus === "विवाहित" ? (
                      <>
                        <TextField control={form.control} name="numberOfSons" label={t.sons} type="number" placeholder="0" />
                        <TextField control={form.control} name="numberOfDaughters" label={t.daughters} type="number" placeholder="0" />
                      </>
                    ) : null}
                    <TextField control={form.control} name="placeOfBirth" label={t.placeOfBirth} placeholder={t.placeOfBirthPH} />
                    <TextField control={form.control} name="nationality" label={t.nationality} placeholder="Indian" />
                    <TextField control={form.control} name="guardianName" label={t.guardianName} placeholder={t.guardianNamePH} />
                    <TextField control={form.control} name="guardianOccupation" label={t.guardianOccupation} placeholder={t.guardianOccPH} />
                    <TextField control={form.control} name="guardianMonthlyIncome" label={t.guardianIncome} placeholder={t.guardianIncomePH} />
                  </FieldGrid>
                </div>
              </div>

              {/* ── 3. CONTACT INFORMATION ── */}
              <div className="bg-white border border-gray-200 rounded-sm p-6 shadow-sm">
                <SectionHeader icon={Phone} title={t.sec3} />
                <div className="space-y-4">
                  <FieldGrid>
                    <TextField control={form.control} name="mobile" label={t.mobile} placeholder={t.mobilePH} required type="tel" />
                    <TextField control={form.control} name="alternatePhone" label={t.altPhone} placeholder={t.mobilePH} type="tel" />
                    <TextField control={form.control} name="email" label={t.email} placeholder={t.emailPH} type="email" />
                    <TextField control={form.control} name="linkedIn" label={t.linkedin} placeholder={t.linkedinPH} />
                  </FieldGrid>

                  <FormField control={form.control} name="presentAddress" render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-900">{t.presentAddress} <span className="text-red-500">*</span></FormLabel>
                      <FormControl><Textarea {...field} placeholder={t.addressPH} className={ic + " min-h-[80px]"} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />

                  <FormField control={form.control} name="sameAddress" render={({ field }) => (
                    <FormItem className="flex items-center gap-2">
                      <FormControl><Checkbox checked={field.value} onCheckedChange={field.onChange} /></FormControl>
                      <FormLabel className="!mt-0 text-gray-700 font-normal cursor-pointer">{t.sameAddressChk}</FormLabel>
                    </FormItem>
                  )} />

                  {!sameAddress && (
                    <FormField control={form.control} name="permanentAddress" render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-gray-900">{t.permanentAddress}</FormLabel>
                        <FormControl><Textarea {...field} placeholder={t.addressPH} className={ic + " min-h-[80px]"} /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />
                  )}
                </div>
              </div>

              {/* ── 4. EDUCATION ── */}
              <div className="bg-white border border-gray-200 rounded-sm p-6 shadow-sm">
                <SectionHeader icon={GraduationCap} title={t.sec4} />
                <div className="space-y-4">
                  {eduFields.map((field, i) => (
                    <div key={field.id} className="border border-gray-100 rounded-sm p-4 bg-gray-50 relative">
                      {eduFields.length > 1 && (
                        <button type="button" onClick={() => removeEdu(i)} className="absolute top-3 right-3 text-red-400 hover:text-red-600">
                          <Trash2 className="h-4 w-4" />
                        </button>
                      )}
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                        {[
                          { fname: `education.${i}.examination` as const, label: t.examination, ph: t.examinationPH, req: true },
                          { fname: `education.${i}.institution` as const, label: t.school, ph: t.schoolPH, req: true },
                          { fname: `education.${i}.board` as const, label: t.board, ph: t.boardPH },
                          { fname: `education.${i}.subject` as const, label: t.subject, ph: t.subjectPH },
                          { fname: `education.${i}.year` as const, label: t.yearOfPassing, ph: "2020" },
                          { fname: `education.${i}.percentage` as const, label: t.percentage, ph: t.percentagePH },
                        ].map(({ fname, label, ph, req }) => (
                          <FormField key={fname} control={form.control} name={fname} render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-gray-700 text-xs">{label}{req && <span className="text-red-500 ml-1">*</span>}</FormLabel>
                              <FormControl><Input {...field} placeholder={ph} className={ic} /></FormControl>
                              <FormMessage />
                            </FormItem>
                          )} />
                        ))}
                      </div>
                    </div>
                  ))}
                  <Button type="button" variant="outline"
                    onClick={() => appendEdu({ examination: "", institution: "", board: "", subject: "", year: "", percentage: "" })}
                    className="flex items-center gap-2 border-dashed border-gray-400 text-gray-600 hover:border-[#01AEEF] hover:text-[#01AEEF] rounded-sm">
                    <PlusCircle className="h-4 w-4" /> {t.addEducation}
                  </Button>
                </div>
              </div>

              {/* ── 5. WORK EXPERIENCE ── */}
              <div className="bg-white border border-gray-200 rounded-sm p-6 shadow-sm">
                <SectionHeader icon={Briefcase} title={t.sec5} />
                <div className="space-y-4">
                  <FieldGrid>
                    <TextField control={form.control} name="totalExperience" label={t.totalExperience} placeholder={t.totalExpPH} />
                    <TextField control={form.control} name="currentEmployer" label={t.currentEmployer} placeholder={t.currentEmployerPH} />
                    <TextField control={form.control} name="currentCTC" label={t.currentCTC} placeholder={t.currentCTCPH} />
                  </FieldGrid>

                  {expFields.map((field, i) => (
                    <div key={field.id} className="border border-gray-100 rounded-sm p-4 bg-gray-50 relative">
                      <button type="button" onClick={() => removeExp(i)} className="absolute top-3 right-3 text-red-400 hover:text-red-600">
                        <Trash2 className="h-4 w-4" />
                      </button>
                      <p className="text-xs font-semibold text-gray-500 uppercase mb-3">{t.expLabel(i)}</p>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <FormField control={form.control} name={`experience.${i}.company`} render={({ field }) => (
                          <FormItem><FormLabel className="text-gray-700 text-xs">{t.company} <span className="text-red-500">*</span></FormLabel>
                            <FormControl><Input {...field} placeholder={t.companyPH} className={ic} /></FormControl><FormMessage /></FormItem>
                        )} />
                        <FormField control={form.control} name={`experience.${i}.designation`} render={({ field }) => (
                          <FormItem><FormLabel className="text-gray-700 text-xs">{t.designation} <span className="text-red-500">*</span></FormLabel>
                            <FormControl><Input {...field} placeholder={t.designationPH} className={ic} /></FormControl><FormMessage /></FormItem>
                        )} />
                        <FormField control={form.control} name={`experience.${i}.from`} render={({ field }) => (
                          <FormItem><FormLabel className="text-gray-700 text-xs">{t.from}</FormLabel>
                            <FormControl><Input {...field} type="month" className={ic} /></FormControl></FormItem>
                        )} />
                        <FormField control={form.control} name={`experience.${i}.to`} render={({ field }) => (
                          <FormItem><FormLabel className="text-gray-700 text-xs">{t.to}</FormLabel>
                            <FormControl><Input {...field} type="month" className={ic} /></FormControl></FormItem>
                        )} />
                        <FormField control={form.control} name={`experience.${i}.salary`} render={({ field }) => (
                          <FormItem><FormLabel className="text-gray-700 text-xs">{t.salaryDrawn}</FormLabel>
                            <FormControl><Input {...field} placeholder={t.salaryPH} className={ic} /></FormControl></FormItem>
                        )} />
                        <FormField control={form.control} name={`experience.${i}.benefits`} render={({ field }) => (
                          <FormItem><FormLabel className="text-gray-700 text-xs">{t.benefits}</FormLabel>
                            <FormControl><Input {...field} placeholder={t.benefitsPH} className={ic} /></FormControl></FormItem>
                        )} />
                        <FormField control={form.control} name={`experience.${i}.responsibilities`} render={({ field }) => (
                          <FormItem className="md:col-span-2"><FormLabel className="text-gray-700 text-xs">{t.responsibilities}</FormLabel>
                            <FormControl><Textarea {...field} placeholder={t.responsibilitiesPH} className={ic + " min-h-[70px]"} /></FormControl></FormItem>
                        )} />
                        <FormField control={form.control} name={`experience.${i}.reasonForLeaving`} render={({ field }) => (
                          <FormItem className="md:col-span-2"><FormLabel className="text-gray-700 text-xs">{t.reasonLeaving}</FormLabel>
                            <FormControl><Input {...field} placeholder={t.reasonLeavingPH} className={ic} /></FormControl></FormItem>
                        )} />
                      </div>
                    </div>
                  ))}

                  <Button type="button" variant="outline"
                    onClick={() => appendExp({ company: "", designation: "", from: "", to: "", salary: "", benefits: "", responsibilities: "", reasonForLeaving: "" })}
                    className="flex items-center gap-2 border-dashed border-gray-400 text-gray-600 hover:border-[#01AEEF] hover:text-[#01AEEF] rounded-sm">
                    <PlusCircle className="h-4 w-4" /> {t.addExperience}
                  </Button>
                </div>
              </div>

              {/* ── 6. SKILLS ── */}
              <div className="bg-white border border-gray-200 rounded-sm p-6 shadow-sm">
                <SectionHeader icon={GraduationCap} title={t.sec6} />
                <div className="space-y-4">
                  <FormField control={form.control} name="keySkills" render={({ field }) => (
                    <FormItem><FormLabel className="text-gray-900">{t.keySkills}</FormLabel>
                      <FormControl><Textarea {...field} placeholder={t.keySkillsPH} className={ic + " min-h-[80px]"} /></FormControl></FormItem>
                  )} />
                  <FieldGrid>
                    <TextField control={form.control} name="computerSkills" label={t.computerSkills} placeholder={t.computerSkillsPH} />
                    <TextField control={form.control} name="languagesKnown" label={t.languages} placeholder={t.languagesPH} />
                  </FieldGrid>
                  <FormField control={form.control} name="certifications" render={({ field }) => (
                    <FormItem><FormLabel className="text-gray-900">{t.certifications}</FormLabel>
                      <FormControl><Textarea {...field} placeholder={t.certificationsPH} className={ic + " min-h-[70px]"} /></FormControl></FormItem>
                  )} />
                </div>
              </div>

              {/* ── 7. REFERENCES ── */}
              <div className="bg-white border border-gray-200 rounded-sm p-6 shadow-sm">
                <SectionHeader icon={Users} title={t.sec7} />
                <p className="text-sm text-gray-500 mb-4">{t.refSubtitle}</p>
                <div className="space-y-6">
                  {[1, 2].map((n) => (
                    <div key={n} className="border border-gray-100 rounded-sm p-4 bg-gray-50">
                      <p className="text-xs font-semibold text-gray-500 uppercase mb-3">{t.refLabel(n)}</p>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <TextField control={form.control} name={`ref${n}Name` as any} label={t.refName} placeholder={t.refNamePH} />
                        <TextField control={form.control} name={`ref${n}Relationship` as any} label={t.refRelationship} placeholder={t.refRelPH} />
                        <TextField control={form.control} name={`ref${n}Company` as any} label={t.refCompany} placeholder={t.refCompanyPH} />
                        <TextField control={form.control} name={`ref${n}Phone` as any} label={t.refPhone} placeholder={t.refPhonePH} type="tel" />
                        <TextField control={form.control} name={`ref${n}Email` as any} label={t.refEmail} placeholder={t.refEmailPH} type="email" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* ── 8. DOCUMENTS & FINAL ── */}
              <div className="bg-white border border-gray-200 rounded-sm p-6 shadow-sm">
                <SectionHeader icon={FileText} title={t.sec8} />
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-900 mb-1">
                      {t.resumeLabel} <span className="text-gray-500 font-normal">{t.resumeHint}</span>
                    </label>
                    <input type="file" accept=".pdf,.doc,.docx"
                      onChange={(e) => setResumeFile(e.target.files?.[0] || null)}
                      className="block w-full text-sm text-gray-600 file:mr-4 file:py-2 file:px-4 file:border file:border-gray-300 file:text-sm file:font-medium file:bg-white file:text-gray-700 hover:file:border-[#01AEEF] hover:file:text-[#01AEEF] cursor-pointer"
                    />
                    {resumeFile && <p className="mt-1 text-xs text-green-600">✓ {resumeFile.name}</p>}
                  </div>

                  <FormField control={form.control} name="coverLetter" render={({ field }) => (
                    <FormItem><FormLabel className="text-gray-900">{t.coverLetter} <span className="text-gray-500 font-normal">{t.coverLetterHint}</span></FormLabel>
                      <FormControl><Textarea {...field} placeholder={t.coverLetterPH} className={ic + " min-h-[100px]"} /></FormControl></FormItem>
                  )} />

                  <FormField control={form.control} name="additionalRemarks" render={({ field }) => (
                    <FormItem><FormLabel className="text-gray-900">{t.additionalRemarks} <span className="text-gray-500 font-normal">{t.additionalRemarksHint}</span></FormLabel>
                      <FormControl><Textarea {...field} placeholder={t.additionalRemarksPH} className={ic + " min-h-[70px]"} /></FormControl></FormItem>
                  )} />

                  <FormField control={form.control} name="declaration" render={({ field }) => (
                    <FormItem>
                      <div className="flex items-start gap-3 border border-gray-200 rounded-sm p-4 bg-gray-50">
                        <FormControl><Checkbox checked={field.value} onCheckedChange={field.onChange} className="mt-0.5" /></FormControl>
                        <FormLabel className="!mt-0 text-gray-700 font-normal text-sm leading-relaxed cursor-pointer">{t.declaration}</FormLabel>
                      </div>
                      <FormMessage />
                    </FormItem>
                  )} />
                </div>
              </div>

              {/* Submit */}
              <div className="flex justify-end pb-8">
                <Button type="submit" disabled={submitting} size="lg"
                  className="font-black border-2 border-black text-black uppercase bg-transparent hover:bg-transparent hover:text-[#01AEEF] hover:border-[#01AEEF] rounded-none px-10 py-3 text-sm disabled:opacity-50">
                  {submitting ? t.submitting : t.submit}
                </Button>
              </div>

            </form>
          </Form>
              </motion.div>
            )}
          </AnimatePresence>

        </motion.div>
      </div>
    </div>
  );
}
