"use client";

import { useEffect, useState, use, useMemo } from "react";
import { useRouter } from "next/navigation";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { ScoreCircle } from "@/components/score-circle";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/client";
import {
  CheckCircle,
  AlertCircle,
  Lightbulb,
  Tag,
  ArrowLeft,
  Download,
  MessageSquare,
} from "lucide-react";
import Link from "next/link";

interface AnalysisData {
  id: string;
  overall_score: number;
  keyword_score: number;
  formatting_score: number;
  experience_score: number;
  skills_score: number;
  feedback: {
    summary: string;
    strengths: string[];
    improvements: string[];
    missing_keywords: string[];
    recommendations: string[];
  };
}

export default function AnalysisPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const [analysis, setAnalysis] = useState<AnalysisData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const supabase = useMemo(() => createClient(), []);

  useEffect(() => {
    const fetchOrCreateAnalysis = async () => {
      try {
        const {
          data: { user },
        } = await supabase.auth.getUser();

        if (!user) {
          router.push("/auth/login");
          return;
        }

        // Check if analysis already exists
        const { data: existingAnalysis } = await supabase
          .from("ats_scores")
          .select("*")
          .eq("resume_id", id)
          .eq("user_id", user.id)
          .single();

        if (existingAnalysis) {
          setAnalysis(existingAnalysis);
          setLoading(false);
          return;
        }

        // Create new analysis
        const response = await fetch("/api/analyze", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ resumeId: id }),
        });

        if (!response.ok) {
          throw new Error("Failed to analyze resume");
        }

        const { analysis: newAnalysis } = await response.json();
        setAnalysis(newAnalysis);
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        setLoading(false);
      }
    };

    fetchOrCreateAnalysis();
  }, [id, router, supabase]);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-coral border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-foreground mb-2">
              Analyzing Your Resume
            </h2>
            <p className="text-muted-foreground">
              Our AI is reviewing your resume for ATS compatibility...
            </p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (error || !analysis) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Header />
        <main className="flex-1 flex items-center justify-center px-4">
          <div className="text-center max-w-md">
            <AlertCircle className="w-16 h-16 text-destructive mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-foreground mb-2">
              Analysis Failed
            </h2>
            <p className="text-muted-foreground mb-6">
              {error || "Unable to analyze your resume. Please try again."}
            </p>
            <Link href="/">
              <Button className="bg-coral hover:bg-coral-dark text-white rounded-full">
                Try Again
              </Button>
            </Link>
          </div>
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
          {/* Back button */}
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-6"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Dashboard
          </Link>

          {/* Header */}
          <div className="text-center mb-10">
            <h1 className="text-3xl font-bold text-foreground mb-2">
              Resume Analysis Results
            </h1>
            <p className="text-muted-foreground">{analysis.feedback.summary}</p>
          </div>

          {/* Main Score */}
          <div className="bg-card rounded-2xl shadow-lg p-8 mb-8">
            <div className="flex flex-col lg:flex-row items-center gap-8">
              <div className="flex-shrink-0">
                <ScoreCircle score={analysis.overall_score} size="lg" />
                <p className="text-center mt-4 font-semibold text-foreground">
                  Overall ATS Score
                </p>
              </div>

              <div className="flex-1 grid grid-cols-2 md:grid-cols-4 gap-6">
                <ScoreCircle
                  score={analysis.keyword_score}
                  size="sm"
                  label="Keywords"
                />
                <ScoreCircle
                  score={analysis.formatting_score}
                  size="sm"
                  label="Formatting"
                />
                <ScoreCircle
                  score={analysis.experience_score}
                  size="sm"
                  label="Experience"
                />
                <ScoreCircle
                  score={analysis.skills_score}
                  size="sm"
                  label="Skills"
                />
              </div>
            </div>
          </div>

          {/* Details Grid */}
          <div className="grid md:grid-cols-2 gap-6 mb-8">
            {/* Strengths */}
            <div className="bg-card rounded-2xl shadow-sm p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                </div>
                <h3 className="text-lg font-semibold text-foreground">
                  Strengths
                </h3>
              </div>
              <ul className="space-y-3">
                {analysis.feedback.strengths.map((strength, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-green-500 rounded-full mt-2" />
                    <span className="text-muted-foreground">{strength}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Areas to Improve */}
            <div className="bg-card rounded-2xl shadow-sm p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-coral/10 rounded-xl flex items-center justify-center">
                  <AlertCircle className="w-5 h-5 text-coral" />
                </div>
                <h3 className="text-lg font-semibold text-foreground">
                  Areas to Improve
                </h3>
              </div>
              <ul className="space-y-3">
                {analysis.feedback.improvements.map((improvement, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-coral rounded-full mt-2" />
                    <span className="text-muted-foreground">{improvement}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Missing Keywords */}
            <div className="bg-card rounded-2xl shadow-sm p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
                  <Tag className="w-5 h-5 text-blue-600" />
                </div>
                <h3 className="text-lg font-semibold text-foreground">
                  Suggested Keywords
                </h3>
              </div>
              <div className="flex flex-wrap gap-2">
                {analysis.feedback.missing_keywords.map((keyword, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm"
                  >
                    {keyword}
                  </span>
                ))}
              </div>
            </div>

            {/* Recommendations */}
            <div className="bg-card rounded-2xl shadow-sm p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center">
                  <Lightbulb className="w-5 h-5 text-purple-600" />
                </div>
                <h3 className="text-lg font-semibold text-foreground">
                  Recommendations
                </h3>
              </div>
              <ul className="space-y-3">
                {analysis.feedback.recommendations.map(
                  (recommendation, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-purple-500 rounded-full mt-2" />
                      <span className="text-muted-foreground">
                        {recommendation}
                      </span>
                    </li>
                  )
                )}
              </ul>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap justify-center gap-4">
            <Link href="/resume-builder">
              <Button className="bg-coral hover:bg-coral-dark text-white rounded-full px-8">
                <Download className="w-4 h-4 mr-2" />
                Build New Resume
              </Button>
            </Link>
            <Link href="/chatbot">
              <Button
                variant="outline"
                className="rounded-full px-8 border-coral text-coral hover:bg-coral/10 bg-transparent"
              >
                <MessageSquare className="w-4 h-4 mr-2" />
                Get AI Help
              </Button>
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
