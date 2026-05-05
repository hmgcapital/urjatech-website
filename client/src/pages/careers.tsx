import { motion } from "framer-motion";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useState } from "react";
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
import { PlusCircle, Trash2, Briefcase, GraduationCap, User, Phone, FileText, Users } from "lucide-react";

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
  // Application
  positionApplied: z.string().min(1, "Position is required"),
  referredBy: z.string().optional(),
  employmentType: z.string().min(1, "Please select employment type"),
  expectedCTC: z.string().optional(),
  noticePeriod: z.string().optional(),

  // Personal
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

  // Contact
  mobile: z.string().min(10, "Valid mobile number required"),
  alternatePhone: z.string().optional(),
  email: z.string().email("Valid email required"),
  linkedIn: z.string().optional(),
  presentAddress: z.string().min(5, "Present address is required"),
  sameAddress: z.boolean().optional(),
  permanentAddress: z.string().optional(),

  // Education (dynamic)
  education: z.array(educationSchema).min(1, "At least one education record is required"),

  // Experience (dynamic)
  totalExperience: z.string().optional(),
  currentCTC: z.string().optional(),
  currentEmployer: z.string().optional(),
  experience: z.array(experienceSchema),

  // Skills
  keySkills: z.string().optional(),
  computerSkills: z.string().optional(),
  languagesKnown: z.string().optional(),
  certifications: z.string().optional(),

  // References
  ref1Name: z.string().optional(),
  ref1Relationship: z.string().optional(),
  ref1Company: z.string().optional(),
  ref1Phone: z.string().optional(),
  ref1Email: z.string().optional(),
  ref2Name: z.string().optional(),
  ref2Relationship: z.string().optional(),
  ref2Company: z.string().optional(),
  ref2Phone: z.string().optional(),
  ref2Email: z.string().optional(),

  // Documents / Final
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

function SelectField({
  label,
  name,
  options,
  required,
  control,
}: {
  label: string;
  name: any;
  options: string[];
  required?: boolean;
  control: any;
}) {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel className="text-gray-900">
            {label}{required && <span className="text-red-500 ml-1">*</span>}
          </FormLabel>
          <FormControl>
            <select
              {...field}
              className="w-full border border-gray-300 bg-white text-gray-900 px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-[#01AEEF] rounded-sm"
            >
              <option value="">— Select —</option>
              {options.map((o) => (
                <option key={o} value={o}>{o}</option>
              ))}
            </select>
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}

function TextField({
  label,
  name,
  placeholder,
  required,
  control,
  type = "text",
}: {
  label: string;
  name: any;
  placeholder?: string;
  required?: boolean;
  control: any;
  type?: string;
}) {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel className="text-gray-900">
            {label}{required && <span className="text-red-500 ml-1">*</span>}
          </FormLabel>
          <FormControl>
            <Input
              {...field}
              type={type}
              placeholder={placeholder}
              className="bg-white border-gray-300 text-gray-900 placeholder:text-gray-400 rounded-sm"
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function Careers() {
  const { toast } = useToast();
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

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      positionApplied: "",
      referredBy: "",
      employmentType: "",
      expectedCTC: "",
      noticePeriod: "",
      title: "",
      fullName: "",
      dateOfBirth: "",
      age: "",
      gender: "",
      maritalStatus: "",
      numberOfSons: "",
      numberOfDaughters: "",
      placeOfBirth: "",
      nationality: "Indian",
      guardianName: "",
      guardianOccupation: "",
      guardianMonthlyIncome: "",
      mobile: "",
      alternatePhone: "",
      email: "",
      linkedIn: "",
      presentAddress: "",
      sameAddress: false,
      permanentAddress: "",
      education: [{ examination: "10th", institution: "", board: "", subject: "", year: "", percentage: "" }],
      totalExperience: "",
      currentCTC: "",
      currentEmployer: "",
      experience: [],
      keySkills: "",
      computerSkills: "",
      languagesKnown: "",
      certifications: "",
      ref1Name: "",
      ref1Relationship: "",
      ref1Company: "",
      ref1Phone: "",
      ref1Email: "",
      ref2Name: "",
      ref2Relationship: "",
      ref2Company: "",
      ref2Phone: "",
      ref2Email: "",
      coverLetter: "",
      additionalRemarks: "",
      declaration: false,
    },
  });

  const { fields: eduFields, append: appendEdu, remove: removeEdu } = useFieldArray({
    control: form.control,
    name: "education",
  });

  const { fields: expFields, append: appendExp, remove: removeExp } = useFieldArray({
    control: form.control,
    name: "experience",
  });

  const sameAddress = form.watch("sameAddress");
  const maritalStatus = form.watch("maritalStatus");

  async function onSubmit(data: FormValues) {
    setSubmitting(true);
    try {
      if (data.sameAddress) {
        data.permanentAddress = data.presentAddress;
      }

      const fd = new FormData();

      // Append all scalar fields
      for (const [key, value] of Object.entries(data)) {
        if (key === "education" || key === "experience") continue;
        if (value !== undefined && value !== null) {
          fd.append(key, String(value));
        }
      }

      // Append arrays as JSON
      fd.append("education", JSON.stringify(data.education));
      fd.append("experience", JSON.stringify(data.experience));

      // Append files
      if (resumeFile) fd.append("resume", resumeFile);
      if (photoFile)  fd.append("photo",  photoFile);

      const res = await fetch("/api/careers/apply", { method: "POST", body: fd });
      const json = await res.json();

      if (json.success) {
        toast({ title: "Application Submitted!", description: "We'll review your application and get back to you soon." });
        form.reset();
        setResumeFile(null);
        setPhotoFile(null);
        setPhotoPreview(null);
      } else {
        toast({ title: "Submission Failed", description: json.message || "Please try again.", variant: "destructive" });
      }
    } catch {
      toast({ title: "Network Error", description: "Could not reach the server. Please try again.", variant: "destructive" });
    } finally {
      setSubmitting(false);
    }
  }

  const inputClass = "bg-white border-gray-300 text-gray-900 placeholder:text-gray-400 rounded-sm text-sm";

  return (
    <div style={{ background: "#ffffff" }}>
      <div className="container mx-auto px-6 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-4xl mx-auto"
        >
          <h1 className="text-4xl font-bold mb-3 text-gray-900 text-center">Careers</h1>
          <p className="text-center text-gray-600 mb-10 max-w-2xl mx-auto">
            Join the Urjatech team. Fill in the form below and we'll get back to you.
          </p>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-10">

              {/* ── 1. APPLICATION DETAILS ── */}
              <div className="bg-white border border-gray-200 rounded-sm p-6 shadow-sm">
                <SectionHeader icon={Briefcase} title="Application Details" />
                <div className="space-y-4">
                  <FieldGrid>
                    <TextField control={form.control} name="positionApplied" label="Position Applied For" placeholder="e.g. Sales Engineer" required />
                    <TextField control={form.control} name="referredBy" label="Referred By" placeholder="Name of referrer (if any)" />
                    <SelectField control={form.control} name="employmentType" label="Employment Type" options={["Full-time", "Part-time", "Internship"]} required />
                    <SelectField control={form.control} name="noticePeriod" label="Notice Period / Availability" options={["Immediate", "15 Days", "1 Month", "2 Months", "3 Months"]} />
                    <TextField control={form.control} name="expectedCTC" label="Expected CTC / Salary (per annum)" placeholder="e.g. ₹6,00,000" />
                  </FieldGrid>
                </div>
              </div>

              {/* ── 2. PERSONAL DETAILS ── */}
              <div className="bg-white border border-gray-200 rounded-sm p-6 shadow-sm">
                <SectionHeader icon={User} title="Personal Details" />
                <div className="space-y-4">

                  {/* Name row + Photo upload side-by-side */}
                  <div className="flex flex-col md:flex-row gap-6">

                    {/* Left: Name fields */}
                    <div className="flex-1 space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <SelectField control={form.control} name="title" label="Title" options={["Mr.", "Mrs.", "Ms.", "Dr."]} />
                        <div className="md:col-span-2">
                          <TextField control={form.control} name="fullName" label="Full Name" placeholder="As per official documents" required />
                        </div>
                      </div>
                    </div>

                    {/* Right: Passport photo upload */}
                    <div className="flex flex-col items-center gap-2 md:w-36">
                      <span className="text-xs font-medium text-gray-700 self-start md:self-center">
                        Passport Photo
                      </span>

                      {/* Preview box */}
                      <label
                        htmlFor="photo-upload"
                        className="cursor-pointer group relative flex items-center justify-center w-28 h-36 border-2 border-dashed border-gray-300 rounded-sm overflow-hidden hover:border-[#01AEEF] transition-colors"
                        title="Click to upload photo"
                      >
                        {photoPreview ? (
                          <img
                            src={photoPreview}
                            alt="Candidate photo preview"
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="text-center text-gray-400 px-2">
                            <User className="h-8 w-8 mx-auto mb-1 text-gray-300" />
                            <span className="text-[10px] leading-tight">Click to upload<br/>JPG / PNG</span>
                          </div>
                        )}
                        {/* Overlay on hover when photo already uploaded */}
                        {photoPreview && (
                          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                            <span className="text-white text-[10px] font-medium">Change photo</span>
                          </div>
                        )}
                      </label>

                      <input
                        id="photo-upload"
                        type="file"
                        accept="image/jpeg,image/png,image/jpg"
                        className="hidden"
                        onChange={handlePhotoChange}
                      />

                      {photoFile && (
                        <p className="text-[10px] text-green-600 text-center truncate w-28">✓ {photoFile.name}</p>
                      )}
                      <p className="text-[10px] text-gray-400 text-center">Max 5 MB</p>
                    </div>

                  </div>
                  <FieldGrid>
                    <TextField control={form.control} name="dateOfBirth" label="Date of Birth" type="date" required />
                    <TextField control={form.control} name="age" label="Age" placeholder="Years" />
                    <SelectField control={form.control} name="gender" label="Gender" options={["Male", "Female", "Other", "Prefer not to say"]} />
                    <SelectField control={form.control} name="maritalStatus" label="Marital Status" options={["Single", "Married", "Divorced", "Widowed"]} />
                    {maritalStatus === "Married" && (
                      <>
                        <TextField control={form.control} name="numberOfSons" label="Number of Sons" type="number" placeholder="0" />
                        <TextField control={form.control} name="numberOfDaughters" label="Number of Daughters" type="number" placeholder="0" />
                      </>
                    )}
                    <TextField control={form.control} name="placeOfBirth" label="Place of Birth" placeholder="City, State" />
                    <TextField control={form.control} name="nationality" label="Nationality" placeholder="Indian" />
                    <TextField control={form.control} name="guardianName" label="Father's / Husband's Name" placeholder="Full name" />
                    <TextField control={form.control} name="guardianOccupation" label="Father's / Husband's Occupation" placeholder="Occupation" />
                    <TextField control={form.control} name="guardianMonthlyIncome" label="Father's / Husband's Monthly Income" placeholder="e.g. ₹50,000" />
                  </FieldGrid>
                </div>
              </div>

              {/* ── 3. CONTACT INFORMATION ── */}
              <div className="bg-white border border-gray-200 rounded-sm p-6 shadow-sm">
                <SectionHeader icon={Phone} title="Contact Information" />
                <div className="space-y-4">
                  <FieldGrid>
                    <TextField control={form.control} name="mobile" label="Mobile Number" placeholder="+91 XXXXX XXXXX" required type="tel" />
                    <TextField control={form.control} name="alternatePhone" label="Alternate Phone" placeholder="+91 XXXXX XXXXX" type="tel" />
                    <TextField control={form.control} name="email" label="Email Address" placeholder="you@example.com" required type="email" />
                    <TextField control={form.control} name="linkedIn" label="LinkedIn Profile URL" placeholder="linkedin.com/in/yourname" />
                  </FieldGrid>

                  <FormField
                    control={form.control}
                    name="presentAddress"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-gray-900">Present Address <span className="text-red-500">*</span></FormLabel>
                        <FormControl>
                          <Textarea {...field} placeholder="Street, City, State, PIN" className={inputClass + " min-h-[80px]"} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="sameAddress"
                    render={({ field }) => (
                      <FormItem className="flex items-center gap-2">
                        <FormControl>
                          <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                        </FormControl>
                        <FormLabel className="!mt-0 text-gray-700 font-normal cursor-pointer">
                          Permanent address is same as present address
                        </FormLabel>
                      </FormItem>
                    )}
                  />

                  {!sameAddress && (
                    <FormField
                      control={form.control}
                      name="permanentAddress"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-gray-900">Permanent Address</FormLabel>
                          <FormControl>
                            <Textarea {...field} placeholder="Street, City, State, PIN" className={inputClass + " min-h-[80px]"} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  )}
                </div>
              </div>

              {/* ── 4. EDUCATION ── */}
              <div className="bg-white border border-gray-200 rounded-sm p-6 shadow-sm">
                <SectionHeader icon={GraduationCap} title="Academic / Professional Qualifications" />

                <div className="space-y-4">
                  {eduFields.map((field, i) => (
                    <div key={field.id} className="border border-gray-100 rounded-sm p-4 bg-gray-50 relative">
                      <div className="absolute top-3 right-3">
                        {eduFields.length > 1 && (
                          <button type="button" onClick={() => removeEdu(i)} className="text-red-400 hover:text-red-600">
                            <Trash2 className="h-4 w-4" />
                          </button>
                        )}
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                        <FormField control={form.control} name={`education.${i}.examination`} render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-gray-700 text-xs">Examination <span className="text-red-500">*</span></FormLabel>
                            <FormControl>
                              <Input {...field} placeholder="e.g. 10th, B.Tech" className={inputClass} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )} />
                        <FormField control={form.control} name={`education.${i}.institution`} render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-gray-700 text-xs">School / College <span className="text-red-500">*</span></FormLabel>
                            <FormControl>
                              <Input {...field} placeholder="Institution name" className={inputClass} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )} />
                        <FormField control={form.control} name={`education.${i}.board`} render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-gray-700 text-xs">Board / University</FormLabel>
                            <FormControl>
                              <Input {...field} placeholder="e.g. CBSE, VTU" className={inputClass} />
                            </FormControl>
                          </FormItem>
                        )} />
                        <FormField control={form.control} name={`education.${i}.subject`} render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-gray-700 text-xs">Subject / Stream</FormLabel>
                            <FormControl>
                              <Input {...field} placeholder="e.g. Science, Electronics" className={inputClass} />
                            </FormControl>
                          </FormItem>
                        )} />
                        <FormField control={form.control} name={`education.${i}.year`} render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-gray-700 text-xs">Year of Passing</FormLabel>
                            <FormControl>
                              <Input {...field} placeholder="e.g. 2020" className={inputClass} />
                            </FormControl>
                          </FormItem>
                        )} />
                        <FormField control={form.control} name={`education.${i}.percentage`} render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-gray-700 text-xs">% Marks / CGPA</FormLabel>
                            <FormControl>
                              <Input {...field} placeholder="e.g. 82% or 8.5" className={inputClass} />
                            </FormControl>
                          </FormItem>
                        )} />
                      </div>
                    </div>
                  ))}

                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => appendEdu({ examination: "", institution: "", board: "", subject: "", year: "", percentage: "" })}
                    className="flex items-center gap-2 border-dashed border-gray-400 text-gray-600 hover:border-[#01AEEF] hover:text-[#01AEEF] rounded-sm"
                  >
                    <PlusCircle className="h-4 w-4" /> Add Education Row
                  </Button>
                </div>
              </div>

              {/* ── 5. WORK EXPERIENCE ── */}
              <div className="bg-white border border-gray-200 rounded-sm p-6 shadow-sm">
                <SectionHeader icon={Briefcase} title="Work Experience" />
                <div className="space-y-4">
                  <FieldGrid>
                    <TextField control={form.control} name="totalExperience" label="Total Years of Experience" placeholder="e.g. 3 years 6 months" />
                    <TextField control={form.control} name="currentEmployer" label="Current Employer" placeholder="Company name (if employed)" />
                    <TextField control={form.control} name="currentCTC" label="Current CTC (per annum)" placeholder="e.g. ₹5,00,000" />
                  </FieldGrid>

                  {expFields.map((field, i) => (
                    <div key={field.id} className="border border-gray-100 rounded-sm p-4 bg-gray-50 relative">
                      <div className="absolute top-3 right-3">
                        <button type="button" onClick={() => removeExp(i)} className="text-red-400 hover:text-red-600">
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                      <p className="text-xs font-semibold text-gray-500 uppercase mb-3">Experience #{i + 1}</p>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <FormField control={form.control} name={`experience.${i}.company`} render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-gray-700 text-xs">Company Name & Place <span className="text-red-500">*</span></FormLabel>
                            <FormControl><Input {...field} placeholder="Company Pvt. Ltd., Delhi" className={inputClass} /></FormControl>
                            <FormMessage />
                          </FormItem>
                        )} />
                        <FormField control={form.control} name={`experience.${i}.designation`} render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-gray-700 text-xs">Designation <span className="text-red-500">*</span></FormLabel>
                            <FormControl><Input {...field} placeholder="e.g. Senior Engineer" className={inputClass} /></FormControl>
                            <FormMessage />
                          </FormItem>
                        )} />
                        <FormField control={form.control} name={`experience.${i}.from`} render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-gray-700 text-xs">From</FormLabel>
                            <FormControl><Input {...field} type="month" className={inputClass} /></FormControl>
                          </FormItem>
                        )} />
                        <FormField control={form.control} name={`experience.${i}.to`} render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-gray-700 text-xs">To (leave blank if current)</FormLabel>
                            <FormControl><Input {...field} type="month" className={inputClass} /></FormControl>
                          </FormItem>
                        )} />
                        <FormField control={form.control} name={`experience.${i}.salary`} render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-gray-700 text-xs">Salary Drawn</FormLabel>
                            <FormControl><Input {...field} placeholder="e.g. ₹4,50,000 p.a." className={inputClass} /></FormControl>
                          </FormItem>
                        )} />
                        <FormField control={form.control} name={`experience.${i}.benefits`} render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-gray-700 text-xs">Other Facilities / Benefits</FormLabel>
                            <FormControl><Input {...field} placeholder="e.g. PF, Medical, Bonus" className={inputClass} /></FormControl>
                          </FormItem>
                        )} />
                        <FormField control={form.control} name={`experience.${i}.responsibilities`} render={({ field }) => (
                          <FormItem className="md:col-span-2">
                            <FormLabel className="text-gray-700 text-xs">Job Responsibilities</FormLabel>
                            <FormControl>
                              <Textarea {...field} placeholder="Briefly describe your key responsibilities" className={inputClass + " min-h-[70px]"} />
                            </FormControl>
                          </FormItem>
                        )} />
                        <FormField control={form.control} name={`experience.${i}.reasonForLeaving`} render={({ field }) => (
                          <FormItem className="md:col-span-2">
                            <FormLabel className="text-gray-700 text-xs">Reason for Leaving</FormLabel>
                            <FormControl>
                              <Input {...field} placeholder="e.g. Better opportunity, Relocation" className={inputClass} />
                            </FormControl>
                          </FormItem>
                        )} />
                      </div>
                    </div>
                  ))}

                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => appendExp({ company: "", designation: "", from: "", to: "", salary: "", benefits: "", responsibilities: "", reasonForLeaving: "" })}
                    className="flex items-center gap-2 border-dashed border-gray-400 text-gray-600 hover:border-[#01AEEF] hover:text-[#01AEEF] rounded-sm"
                  >
                    <PlusCircle className="h-4 w-4" /> Add Experience
                  </Button>
                </div>
              </div>

              {/* ── 6. SKILLS ── */}
              <div className="bg-white border border-gray-200 rounded-sm p-6 shadow-sm">
                <SectionHeader icon={GraduationCap} title="Skills & Competencies" />
                <div className="space-y-4">
                  <FormField control={form.control} name="keySkills" render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-900">Key Technical Skills</FormLabel>
                      <FormControl>
                        <Textarea {...field} placeholder="List your core skills, e.g. Electrical design, AutoCAD, Project management…" className={inputClass + " min-h-[80px]"} />
                      </FormControl>
                    </FormItem>
                  )} />
                  <FieldGrid>
                    <TextField control={form.control} name="computerSkills" label="Computer / Software Skills" placeholder="e.g. MS Office, SAP, AutoCAD" />
                    <TextField control={form.control} name="languagesKnown" label="Languages Known" placeholder="e.g. Hindi, English, Punjabi" />
                  </FieldGrid>
                  <FormField control={form.control} name="certifications" render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-900">Certifications / Additional Courses</FormLabel>
                      <FormControl>
                        <Textarea {...field} placeholder="List any certifications, online courses or vocational training" className={inputClass + " min-h-[70px]"} />
                      </FormControl>
                    </FormItem>
                  )} />
                </div>
              </div>

              {/* ── 7. REFERENCES ── */}
              <div className="bg-white border border-gray-200 rounded-sm p-6 shadow-sm">
                <SectionHeader icon={Users} title="References" />
                <p className="text-sm text-gray-500 mb-4">Provide two people who know you professionally and are not relatives.</p>
                <div className="space-y-6">
                  {[1, 2].map((n) => (
                    <div key={n} className="border border-gray-100 rounded-sm p-4 bg-gray-50">
                      <p className="text-xs font-semibold text-gray-500 uppercase mb-3">Reference {n}</p>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <TextField control={form.control} name={`ref${n}Name` as any} label="Full Name" placeholder="Name" />
                        <TextField control={form.control} name={`ref${n}Relationship` as any} label="Relationship / How they know you" placeholder="e.g. Ex-Manager" />
                        <TextField control={form.control} name={`ref${n}Company` as any} label="Company / Organisation" placeholder="Company" />
                        <TextField control={form.control} name={`ref${n}Phone` as any} label="Phone" placeholder="+91 XXXXX XXXXX" type="tel" />
                        <TextField control={form.control} name={`ref${n}Email` as any} label="Email" placeholder="reference@example.com" type="email" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* ── 8. DOCUMENTS & FINAL ── */}
              <div className="bg-white border border-gray-200 rounded-sm p-6 shadow-sm">
                <SectionHeader icon={FileText} title="Documents & Additional Information" />
                <div className="space-y-4">

                  {/* Resume upload */}
                  <div>
                    <label className="block text-sm font-medium text-gray-900 mb-1">
                      Upload Resume / CV <span className="text-gray-500 font-normal">(PDF, DOC, DOCX — max 5 MB)</span>
                    </label>
                    <input
                      type="file"
                      accept=".pdf,.doc,.docx"
                      onChange={(e) => setResumeFile(e.target.files?.[0] || null)}
                      className="block w-full text-sm text-gray-600 file:mr-4 file:py-2 file:px-4 file:border file:border-gray-300 file:text-sm file:font-medium file:bg-white file:text-gray-700 hover:file:border-[#01AEEF] hover:file:text-[#01AEEF] cursor-pointer"
                    />
                    {resumeFile && (
                      <p className="mt-1 text-xs text-green-600">✓ {resumeFile.name}</p>
                    )}
                  </div>

                  <FormField control={form.control} name="coverLetter" render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-900">Cover Letter <span className="text-gray-500 font-normal">(optional)</span></FormLabel>
                      <FormControl>
                        <Textarea {...field} placeholder="Tell us why you'd be a great fit for this role…" className={inputClass + " min-h-[100px]"} />
                      </FormControl>
                    </FormItem>
                  )} />

                  <FormField control={form.control} name="additionalRemarks" render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-900">Additional Remarks <span className="text-gray-500 font-normal">(optional)</span></FormLabel>
                      <FormControl>
                        <Textarea {...field} placeholder="Any other information you'd like to share" className={inputClass + " min-h-[70px]"} />
                      </FormControl>
                    </FormItem>
                  )} />

                  {/* Declaration */}
                  <FormField
                    control={form.control}
                    name="declaration"
                    render={({ field }) => (
                      <FormItem>
                        <div className="flex items-start gap-3 border border-gray-200 rounded-sm p-4 bg-gray-50">
                          <FormControl>
                            <Checkbox checked={field.value} onCheckedChange={field.onChange} className="mt-0.5" />
                          </FormControl>
                          <FormLabel className="!mt-0 text-gray-700 font-normal text-sm leading-relaxed cursor-pointer">
                            I hereby declare that all information provided in this application is true, correct and complete to the best of my knowledge and belief. I understand that any false or misleading information may result in disqualification from the selection process or termination of employment.
                          </FormLabel>
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              {/* Submit */}
              <div className="flex justify-end pb-8">
                <Button
                  type="submit"
                  disabled={submitting}
                  className="font-black border-2 border-black text-black uppercase bg-transparent hover:bg-transparent hover:text-[#01AEEF] hover:border-[#01AEEF] rounded-none px-10 py-3 text-sm disabled:opacity-50"
                  size="lg"
                >
                  {submitting ? "Submitting…" : "Submit Application"}
                </Button>
              </div>

            </form>
          </Form>
        </motion.div>
      </div>
    </div>
  );
}
