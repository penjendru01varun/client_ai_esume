"use client";

import { useEffect, useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { ScoreCircle } from "@/components/score-circle";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/client";
import {
  Upload,
  FileText,
  Trash2,
  Eye,
  Clock,
  PlusCircle,
} from "lucide-react";

interface Resume {
  id: string;
  file_name: string;
  created_at: string;
  job_description: string | null;
  ats_scores: {
    id: string;
    overall_score: number;
  }[];
}

export default function DashboardPage() {
  const [resumes, setResumes] = useState<Resume[]>([]);
  const [loading, setLoading] = useState(true);
  const [userName, setUserName] = useState<string>("");
  const router = useRouter();
  const supabase = useMemo(() => createClient(), []);

  useEffect(() => {
    const fetchData = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        router.push("/auth/login");
        return;
      }

      setUserName(user.user_metadata?.full_name || user.email || "User");

      const { data: resumeData } = await supabase
        .from("resumes")
        .select(
          `
          id,
          file_name,
          created_at,
          job_description,
          ats_scores (
            id,
            overall_score
          )
        `
        )
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      setResumes(resumeData || []);
      setLoading(false);
    };

    fetchData();
  }, [router, supabase]);

  const handleDelete = async (resumeId: string) => {
    if (!confirm("Are you sure you want to delete this resume?")) return;

    const { error } = await supabase
      .from("resumes")
      .delete()
      .eq("id", resumeId);

    if (!error) {
      setResumes(resumes.filter((r) => r.id !== resumeId));
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <div className="w-8 h-8 border-4 border-coral border-t-transparent rounded-full animate-spin" />
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-1 py-8 px-4">
        <div className="max-w-6xl mx-auto">
          {/* Welcome Section */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground mb-2">
              Welcome back, {userName.split(" ")[0]}!
            </h1>
            <p className="text-muted-foreground">
              Manage your resumes and track your improvement over time.
            </p>
          </div>

          {/* Quick Actions */}
          <div className="grid md:grid-cols-3 gap-4 mb-8">
            <Link href="/#upload">
              <div className="bg-card rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow cursor-pointer border border-border hover:border-coral">
                <div className="w-12 h-12 bg-coral/10 rounded-xl flex items-center justify-center mb-4">
                  <Upload className="w-6 h-6 text-coral" />
                </div>
                <h3 className="font-semibold text-foreground mb-1">
                  Upload Resume
                </h3>
                <p className="text-sm text-muted-foreground">
                  Get your resume analyzed by our AI
                </p>
              </div>
            </Link>

            <Link href="/resume-builder">
              <div className="bg-card rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow cursor-pointer border border-border hover:border-coral">
                <div className="w-12 h-12 bg-coral/10 rounded-xl flex items-center justify-center mb-4">
                  <PlusCircle className="w-6 h-6 text-coral" />
                </div>
                <h3 className="font-semibold text-foreground mb-1">
                  Build Resume
                </h3>
                <p className="text-sm text-muted-foreground">
                  Create a new professional resume
                </p>
              </div>
            </Link>

            <Link href="/chatbot">
              <div className="bg-card rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow cursor-pointer border border-border hover:border-coral">
                <div className="w-12 h-12 bg-coral/10 rounded-xl flex items-center justify-center mb-4">
                  <FileText className="w-6 h-6 text-coral" />
                </div>
                <h3 className="font-semibold text-foreground mb-1">
                  AI Assistant
                </h3>
                <p className="text-sm text-muted-foreground">
                  Get personalized career advice
                </p>
              </div>
            </Link>
          </div>

          {/* Resume History */}
          <div className="bg-card rounded-2xl shadow-sm p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-foreground">
                Your Resumes
              </h2>
              <span className="text-sm text-muted-foreground">
                {resumes.length} resume{resumes.length !== 1 ? "s" : ""}
              </span>
            </div>

            {resumes.length === 0 ? (
              <div className="text-center py-12">
                <FileText className="w-16 h-16 text-muted-foreground/30 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-foreground mb-2">
                  No resumes yet
                </h3>
                <p className="text-muted-foreground mb-6">
                  Upload your first resume to get started
                </p>
                <Link href="/#upload">
                  <Button className="bg-coral hover:bg-coral-dark text-white rounded-full">
                    Upload Resume
                  </Button>
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {resumes.map((resume) => (
                  <div
                    key={resume.id}
                    className="flex items-center gap-4 p-4 bg-muted/30 rounded-xl hover:bg-muted/50 transition-colors"
                  >
                    <div className="w-12 h-12 bg-coral/10 rounded-xl flex items-center justify-center flex-shrink-0">
                      <FileText className="w-6 h-6 text-coral" />
                    </div>

                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-foreground truncate">
                        {resume.file_name}
                      </h4>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Clock className="w-4 h-4" />
                        {formatDate(resume.created_at)}
                      </div>
                    </div>

                    {resume.ats_scores[0] && (
                      <div className="hidden sm:block">
                        <ScoreCircle
                          score={resume.ats_scores[0].overall_score}
                          size="sm"
                          animated={false}
                        />
                      </div>
                    )}

                    <div className="flex items-center gap-2">
                      <Link href={`/analysis/${resume.id}`}>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-muted-foreground hover:text-coral"
                        >
                          <Eye className="w-5 h-5" />
                        </Button>
                      </Link>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDelete(resume.id)}
                        className="text-muted-foreground hover:text-destructive"
                      >
                        <Trash2 className="w-5 h-5" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
