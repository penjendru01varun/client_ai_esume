"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createClient } from "@/lib/supabase/client";
import {
  User,
  Briefcase,
  GraduationCap,
  Wrench,
  Award,
  ChevronRight,
  ChevronLeft,
  Plus,
  Trash2,
  Download,
  Save,
} from "lucide-react";

interface PersonalInfo {
  fullName: string;
  email: string;
  phone: string;
  location: string;
  linkedin: string;
  summary: string;
}

interface Experience {
  id: string;
  company: string;
  position: string;
  startDate: string;
  endDate: string;
  current: boolean;
  description: string;
}

interface Education {
  id: string;
  institution: string;
  degree: string;
  field: string;
  graduationDate: string;
  gpa: string;
}

interface ResumeData {
  personalInfo: PersonalInfo;
  experiences: Experience[];
  education: Education[];
  skills: string[];
  certifications: string[];
}

const steps = [
  { id: 1, name: "Personal Info", icon: User },
  { id: 2, name: "Experience", icon: Briefcase },
  { id: 3, name: "Education", icon: GraduationCap },
  { id: 4, name: "Skills", icon: Wrench },
  { id: 5, name: "Review", icon: Award },
];

const initialData: ResumeData = {
  personalInfo: {
    fullName: "",
    email: "",
    phone: "",
    location: "",
    linkedin: "",
    summary: "",
  },
  experiences: [],
  education: [],
  skills: [],
  certifications: [],
};

export default function ResumeBuilderPage() {
  const [currentStep, setCurrentStep] = useState(1);
  const [data, setData] = useState<ResumeData>(initialData);
  const [saving, setSaving] = useState(false);
  const [newSkill, setNewSkill] = useState("");
  const [newCertification, setNewCertification] = useState("");
  const router = useRouter();
  const supabase = React.useMemo(() => createClient(), []);

  useEffect(() => {
    const loadSavedData = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        router.push("/auth/login?redirect=/resume-builder");
        return;
      }

      const { data: savedData } = await supabase
        .from("resume_builder_data")
        .select("data")
        .eq("user_id", user.id)
        .single();

      if (savedData?.data) {
        setData(savedData.data as ResumeData);
      }
    };

    loadSavedData();
  }, [router, supabase]);

  const saveData = async () => {
    setSaving(true);
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (user) {
      await supabase.from("resume_builder_data").upsert(
        {
          user_id: user.id,
          data,
        },
        { onConflict: "user_id" }
      );
    }
    setSaving(false);
  };

  const updatePersonalInfo = (field: keyof PersonalInfo, value: string) => {
    setData((prev: ResumeData) => ({
      ...prev,
      personalInfo: { ...prev.personalInfo, [field]: value },
    }));
  };

  const addExperience = () => {
    setData((prev: ResumeData) => ({
      ...prev,
      experiences: [
        ...prev.experiences,
        {
          id: crypto.randomUUID(),
          company: "",
          position: "",
          startDate: "",
          endDate: "",
          current: false,
          description: "",
        },
      ],
    }));
  };

  const updateExperience = (
    id: string,
    field: keyof Experience,
    value: string | boolean
  ) => {
    setData((prev: ResumeData) => ({
      ...prev,
      experiences: prev.experiences.map((exp: Experience) =>
        exp.id === id ? { ...exp, [field]: value } : exp
      ),
    }));
  };

  const removeExperience = (id: string) => {
    setData((prev: ResumeData) => ({
      ...prev,
      experiences: prev.experiences.filter((exp: Experience) => exp.id !== id),
    }));
  };

  const addEducation = () => {
    setData((prev: ResumeData) => ({
      ...prev,
      education: [
        ...prev.education,
        {
          id: crypto.randomUUID(),
          institution: "",
          degree: "",
          field: "",
          graduationDate: "",
          gpa: "",
        },
      ],
    }));
  };

  const updateEducation = (id: string, field: keyof Education, value: string) => {
    setData((prev: ResumeData) => ({
      ...prev,
      education: prev.education.map((edu: Education) =>
        edu.id === id ? { ...edu, [field]: value } : edu
      ),
    }));
  };

  const removeEducation = (id: string) => {
    setData((prev: ResumeData) => ({
      ...prev,
      education: prev.education.filter((edu: Education) => edu.id !== id),
    }));
  };

  const addSkill = () => {
    if (newSkill.trim() && !data.skills.includes(newSkill.trim())) {
      setData((prev: ResumeData) => ({
        ...prev,
        skills: [...prev.skills, newSkill.trim()],
      }));
      setNewSkill("");
    }
  };

  const removeSkill = (skill: string) => {
    setData((prev: ResumeData) => ({
      ...prev,
      skills: prev.skills.filter((s: string) => s !== skill),
    }));
  };

  const addCertification = () => {
    if (
      newCertification.trim() &&
      !data.certifications.includes(newCertification.trim())
    ) {
      setData((prev: ResumeData) => ({
        ...prev,
        certifications: [...prev.certifications, newCertification.trim()],
      }));
      setNewCertification("");
    }
  };

  const removeCertification = (cert: string) => {
    setData((prev: ResumeData) => ({
      ...prev,
      certifications: prev.certifications.filter((c: string) => c !== cert),
    }));
  };

  const nextStep = () => {
    saveData();
    setCurrentStep((prev) => Math.min(prev + 1, 5));
  };

  const prevStep = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-foreground">
              Personal Information
            </h2>
            <p className="text-muted-foreground">
              {"Let's start with your basic information"}
            </p>

            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Full Name</Label>
                <Input
                  value={data.personalInfo.fullName}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => updatePersonalInfo("fullName", e.target.value)}
                  placeholder="John Doe"
                  className="h-12 rounded-xl"
                />
              </div>
              <div className="space-y-2">
                <Label>Email</Label>
                <Input
                  type="email"
                  value={data.personalInfo.email}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => updatePersonalInfo("email", e.target.value)}
                  placeholder="john@example.com"
                  className="h-12 rounded-xl"
                />
              </div>
              <div className="space-y-2">
                <Label>Phone</Label>
                <Input
                  value={data.personalInfo.phone}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => updatePersonalInfo("phone", e.target.value)}
                  placeholder="+1 (555) 123-4567"
                  className="h-12 rounded-xl"
                />
              </div>
              <div className="space-y-2">
                <Label>Location</Label>
                <Input
                  value={data.personalInfo.location}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => updatePersonalInfo("location", e.target.value)}
                  placeholder="New York, NY"
                  className="h-12 rounded-xl"
                />
              </div>
              <div className="space-y-2 md:col-span-2">
                <Label>LinkedIn Profile</Label>
                <Input
                  value={data.personalInfo.linkedin}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => updatePersonalInfo("linkedin", e.target.value)}
                  placeholder="linkedin.com/in/johndoe"
                  className="h-12 rounded-xl"
                />
              </div>
              <div className="space-y-2 md:col-span-2">
                <Label>Professional Summary</Label>
                <textarea
                  value={data.personalInfo.summary}
                  onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => updatePersonalInfo("summary", e.target.value)}
                  placeholder="A brief summary of your professional background and career goals..."
                  className="w-full h-32 px-4 py-3 border border-border rounded-xl bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-coral/50 resize-none"
                />
              </div>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-foreground">
                  Work Experience
                </h2>
                <p className="text-muted-foreground">
                  Add your relevant work history
                </p>
              </div>
              <Button
                onClick={addExperience}
                className="bg-coral hover:bg-coral-dark text-white rounded-full"
              >
                <Plus className="w-4 h-4 mr-2" /> Add Experience
              </Button>
            </div>

            {data.experiences.length === 0 ? (
              <div className="text-center py-12 bg-muted/30 rounded-xl">
                <Briefcase className="w-12 h-12 text-muted-foreground/30 mx-auto mb-4" />
                <p className="text-muted-foreground">
                  No experience added yet. Click the button above to add your
                  work history.
                </p>
              </div>
            ) : (
              <div className="space-y-6">
                {data.experiences.map((exp, index) => (
                  <div
                    key={exp.id}
                    className="bg-muted/30 rounded-xl p-6 space-y-4"
                  >
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium text-foreground">
                        Experience {index + 1}
                      </h4>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => removeExperience(exp.id)}
                        className="text-muted-foreground hover:text-destructive"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Company</Label>
                        <Input
                          value={exp.company}
                          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                            updateExperience(exp.id, "company", e.target.value)
                          }
                          placeholder="Company Name"
                          className="h-12 rounded-xl"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Position</Label>
                        <Input
                          value={exp.position}
                          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                            updateExperience(exp.id, "position", e.target.value)
                          }
                          placeholder="Job Title"
                          className="h-12 rounded-xl"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Start Date</Label>
                        <Input
                          type="month"
                          value={exp.startDate}
                          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                            updateExperience(exp.id, "startDate", e.target.value)
                          }
                          className="h-12 rounded-xl"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>End Date</Label>
                        <Input
                          type="month"
                          value={exp.endDate}
                          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                            updateExperience(exp.id, "endDate", e.target.value)
                          }
                          disabled={exp.current}
                          className="h-12 rounded-xl"
                        />
                        <label className="flex items-center gap-2 text-sm text-muted-foreground">
                          <input
                            type="checkbox"
                            checked={exp.current}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                              updateExperience(exp.id, "current", e.target.checked)
                            }
                            className="rounded"
                          />
                          Currently working here
                        </label>
                      </div>
                      <div className="space-y-2 md:col-span-2">
                        <Label>Description</Label>
                        <textarea
                          value={exp.description}
                          onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                            updateExperience(exp.id, "description", e.target.value)
                          }
                          placeholder="Describe your responsibilities and achievements..."
                          className="w-full h-24 px-4 py-3 border border-border rounded-xl bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-coral/50 resize-none"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-foreground">Education</h2>
                <p className="text-muted-foreground">
                  Add your educational background
                </p>
              </div>
              <Button
                onClick={addEducation}
                className="bg-coral hover:bg-coral-dark text-white rounded-full"
              >
                <Plus className="w-4 h-4 mr-2" /> Add Education
              </Button>
            </div>

            {data.education.length === 0 ? (
              <div className="text-center py-12 bg-muted/30 rounded-xl">
                <GraduationCap className="w-12 h-12 text-muted-foreground/30 mx-auto mb-4" />
                <p className="text-muted-foreground">
                  No education added yet. Click the button above to add your
                  educational background.
                </p>
              </div>
            ) : (
              <div className="space-y-6">
                {data.education.map((edu: Education, index: number) => (
                  <div
                    key={edu.id}
                    className="bg-muted/30 rounded-xl p-6 space-y-4"
                  >
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium text-foreground">
                        Education {index + 1}
                      </h4>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => removeEducation(edu.id)}
                        className="text-muted-foreground hover:text-destructive"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Institution</Label>
                        <Input
                          value={edu.institution}
                          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                            updateEducation(edu.id, "institution", e.target.value)
                          }
                          placeholder="University Name"
                          className="h-12 rounded-xl"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Degree</Label>
                        <Input
                          value={edu.degree}
                          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                            updateEducation(edu.id, "degree", e.target.value)
                          }
                          placeholder="Bachelor's, Master's, etc."
                          className="h-12 rounded-xl"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Field of Study</Label>
                        <Input
                          value={edu.field}
                          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                            updateEducation(edu.id, "field", e.target.value)
                          }
                          placeholder="Computer Science, Business, etc."
                          className="h-12 rounded-xl"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Graduation Date</Label>
                        <Input
                          type="month"
                          value={edu.graduationDate}
                          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                            updateEducation(edu.id, "graduationDate", e.target.value)
                          }
                          className="h-12 rounded-xl"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>GPA (Optional)</Label>
                        <Input
                          value={edu.gpa}
                          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                            updateEducation(edu.id, "gpa", e.target.value)
                          }
                          placeholder="3.8/4.0"
                          className="h-12 rounded-xl"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        );

      case 4:
        return (
          <div className="space-y-8">
            {/* Skills */}
            <div className="space-y-4">
              <h2 className="text-2xl font-bold text-foreground">Skills</h2>
              <p className="text-muted-foreground">
                Add your relevant technical and soft skills
              </p>

              <div className="flex gap-2">
                <Input
                  value={newSkill}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNewSkill(e.target.value)}
                  onKeyPress={(e: React.KeyboardEvent<HTMLInputElement>) => e.key === "Enter" && addSkill()}
                  placeholder="Add a skill (e.g., JavaScript, Project Management)"
                  className="h-12 rounded-xl flex-1"
                />
                <Button
                  onClick={addSkill}
                  className="bg-coral hover:bg-coral-dark text-white rounded-full px-6"
                >
                  Add
                </Button>
              </div>

              <div className="flex flex-wrap gap-2">
                {data.skills.map((skill: string) => (
                  <span
                    key={skill}
                    className="px-4 py-2 bg-coral/10 text-coral rounded-full text-sm flex items-center gap-2"
                  >
                    {skill}
                    <button
                      onClick={() => removeSkill(skill)}
                      className="hover:text-coral-dark"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </span>
                ))}
                {data.skills.length === 0 && (
                  <p className="text-muted-foreground text-sm">
                    No skills added yet
                  </p>
                )}
              </div>
            </div>

            {/* Certifications */}
            <div className="space-y-4">
              <h2 className="text-2xl font-bold text-foreground">
                Certifications
              </h2>
              <p className="text-muted-foreground">
                Add any relevant certifications or licenses
              </p>

              <div className="flex gap-2">
                <Input
                  value={newCertification}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNewCertification(e.target.value)}
                  onKeyPress={(e: React.KeyboardEvent<HTMLInputElement>) => e.key === "Enter" && addCertification()}
                  placeholder="Add a certification (e.g., AWS Certified, PMP)"
                  className="h-12 rounded-xl flex-1"
                />
                <Button
                  onClick={addCertification}
                  className="bg-coral hover:bg-coral-dark text-white rounded-full px-6"
                >
                  Add
                </Button>
              </div>

              <div className="flex flex-wrap gap-2">
                {data.certifications.map((cert) => (
                  <span
                    key={cert}
                    className="px-4 py-2 bg-blue-100 text-blue-700 rounded-full text-sm flex items-center gap-2"
                  >
                    {cert}
                    <button
                      onClick={() => removeCertification(cert)}
                      className="hover:text-blue-900"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </span>
                ))}
                {data.certifications.length === 0 && (
                  <p className="text-muted-foreground text-sm">
                    No certifications added yet
                  </p>
                )}
              </div>
            </div>
          </div>
        );

      case 5:
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-foreground">
              Review Your Resume
            </h2>
            <p className="text-muted-foreground">
              Review your information before generating your resume
            </p>

            <div className="bg-card border border-border rounded-xl p-6 space-y-6">
              {/* Personal Info */}
              <div>
                <h3 className="font-semibold text-foreground mb-3 text-lg">
                  {data.personalInfo.fullName || "Your Name"}
                </h3>
                <div className="text-sm text-muted-foreground space-y-1">
                  {data.personalInfo.email && <p>{data.personalInfo.email}</p>}
                  {data.personalInfo.phone && <p>{data.personalInfo.phone}</p>}
                  {data.personalInfo.location && (
                    <p>{data.personalInfo.location}</p>
                  )}
                  {data.personalInfo.linkedin && (
                    <p>{data.personalInfo.linkedin}</p>
                  )}
                </div>
                {data.personalInfo.summary && (
                  <p className="mt-3 text-foreground">
                    {data.personalInfo.summary}
                  </p>
                )}
              </div>

              {/* Experience */}
              {data.experiences.length > 0 && (
                <div>
                  <h4 className="font-semibold text-foreground mb-3">
                    Experience
                  </h4>
                  {data.experiences.map((exp) => (
                    <div key={exp.id} className="mb-4">
                      <p className="font-medium text-foreground">
                        {exp.position} at {exp.company}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {exp.startDate} -{" "}
                        {exp.current ? "Present" : exp.endDate}
                      </p>
                      <p className="text-sm text-foreground mt-1">
                        {exp.description}
                      </p>
                    </div>
                  ))}
                </div>
              )}

              {/* Education */}
              {data.education.length > 0 && (
                <div>
                  <h4 className="font-semibold text-foreground mb-3">
                    Education
                  </h4>
                  {data.education.map((edu) => (
                    <div key={edu.id} className="mb-3">
                      <p className="font-medium text-foreground">
                        {edu.degree} in {edu.field}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {edu.institution} | {edu.graduationDate}
                        {edu.gpa && ` | GPA: ${edu.gpa}`}
                      </p>
                    </div>
                  ))}
                </div>
              )}

              {/* Skills */}
              {data.skills.length > 0 && (
                <div>
                  <h4 className="font-semibold text-foreground mb-3">Skills</h4>
                  <div className="flex flex-wrap gap-2">
                    {data.skills.map((skill) => (
                      <span
                        key={skill}
                        className="px-3 py-1 bg-muted text-foreground rounded-full text-sm"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Certifications */}
              {data.certifications.length > 0 && (
                <div>
                  <h4 className="font-semibold text-foreground mb-3">
                    Certifications
                  </h4>
                  <ul className="list-disc list-inside text-foreground">
                    {data.certifications.map((cert) => (
                      <li key={cert}>{cert}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            <div className="flex gap-4">
              <Button
                onClick={saveData}
                disabled={saving}
                variant="outline"
                className="rounded-full px-6 border-coral text-coral hover:bg-coral/10 bg-transparent"
              >
                <Save className="w-4 h-4 mr-2" />
                {saving ? "Saving..." : "Save Draft"}
              </Button>
              <Button className="bg-coral hover:bg-coral-dark text-white rounded-full px-6">
                <Download className="w-4 h-4 mr-2" />
                Download Resume
              </Button>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-1 py-8 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-foreground mb-2">
              Resume Builder
            </h1>
            <p className="text-muted-foreground">
              Create a professional resume in minutes
            </p>
          </div>

          {/* Progress Steps */}
          <div className="flex items-center justify-center mb-10 overflow-x-auto pb-4">
            {steps.map((step, index) => (
              <div key={step.id} className="flex items-center">
                <button
                  onClick={() => setCurrentStep(step.id)}
                  className={`flex flex-col items-center gap-2 px-4 ${currentStep === step.id
                    ? "text-coral"
                    : currentStep > step.id
                      ? "text-green-500"
                      : "text-muted-foreground"
                    }`}
                >
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center ${currentStep === step.id
                      ? "bg-coral text-white"
                      : currentStep > step.id
                        ? "bg-green-500 text-white"
                        : "bg-muted"
                      }`}
                  >
                    <step.icon className="w-5 h-5" />
                  </div>
                  <span className="text-xs font-medium whitespace-nowrap">
                    {step.name}
                  </span>
                </button>
                {index < steps.length - 1 && (
                  <div
                    className={`w-12 h-0.5 mx-2 ${currentStep > step.id ? "bg-green-500" : "bg-muted"
                      }`}
                  />
                )}
              </div>
            ))}
          </div>

          {/* Step Content */}
          <div className="bg-card rounded-2xl shadow-lg p-6 md:p-8">
            {renderStep()}

            {/* Navigation */}
            <div className="flex justify-between mt-8 pt-6 border-t border-border">
              <Button
                onClick={prevStep}
                disabled={currentStep === 1}
                variant="outline"
                className="rounded-full px-6 bg-transparent"
              >
                <ChevronLeft className="w-4 h-4 mr-2" />
                Previous
              </Button>
              {currentStep < 5 && (
                <Button
                  onClick={nextStep}
                  className="bg-coral hover:bg-coral-dark text-white rounded-full px-6"
                >
                  Next
                  <ChevronRight className="w-4 h-4 ml-2" />
                </Button>
              )}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
