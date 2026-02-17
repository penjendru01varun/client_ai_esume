"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ScoreCircle } from "@/components/score-circle";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import {
  CheckCircle,
  AlertCircle,
  Lightbulb,
  ArrowLeft,
  MessageSquare,
  FileEdit,
} from "lucide-react";

interface Analysis {
  overall_score: number;
  keyword_score: number;
  formatting_score: number;
  experience_score: number;
  skills_score: number;
  antigravity_boost?: number;
  final_score?: number;
  feedback: {
    summary: string;
    strengths: string[];
    hidden_strengths?: string[];
    improvements: string[];
    missing_keywords: string[];
    recommendations: string[];
  };
}

export default function AnalysisResultPage() {
  const router = useRouter();
  const [analysis, setAnalysis] = useState<Analysis | null>(null);
  const [fileName, setFileName] = useState<string>("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedAnalysis = sessionStorage.getItem("resumeAnalysis");
    const storedFileName = sessionStorage.getItem("resumeFileName");

    if (storedAnalysis) {
      setAnalysis(JSON.parse(storedAnalysis));
      setFileName(storedFileName || "Resume");
    } else {
      router.push("/");
    }
    setLoading(false);
  }, [router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-coral" />
      </div>
    );
  }

  if (!analysis) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="max-w-6xl mx-auto px-4 py-8">
        {/* Back Button */}
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Home
        </Link>

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Resume Analysis Results
          </h1>
          <p className="text-muted-foreground">
            Analysis for: <span className="font-medium">{fileName}</span>
          </p>
        </div>

        {/* Score Overview */}
        <div className="bg-card rounded-2xl shadow-lg p-8 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
            <div className="md:col-span-1 flex flex-col items-center">
              <ScoreCircle
                score={analysis.final_score || analysis.overall_score}
                size="lg"
              />
              <p className="mt-4 font-semibold text-foreground">
                {analysis.final_score ? "Final Score" : "Overall Score"}
              </p>
              {analysis.antigravity_boost && (
                <div className="mt-2 text-xs font-medium text-emerald-600 bg-emerald-100 px-2 py-1 rounded-full">
                  +{analysis.antigravity_boost} Antigravity Boost
                </div>
              )}
            </div>
            <div className="md:col-span-4 grid grid-cols-2 md:grid-cols-4 gap-6">
              <div className="flex flex-col items-center">
                <ScoreCircle score={analysis.keyword_score} size="sm" />
                <p className="mt-2 text-sm text-muted-foreground">Keywords</p>
              </div>
              <div className="flex flex-col items-center">
                <ScoreCircle score={analysis.formatting_score} size="sm" />
                <p className="mt-2 text-sm text-muted-foreground">Formatting</p>
              </div>
              <div className="flex flex-col items-center">
                <ScoreCircle score={analysis.experience_score} size="sm" />
                <p className="mt-2 text-sm text-muted-foreground">Experience</p>
              </div>
              <div className="flex flex-col items-center">
                <ScoreCircle score={analysis.skills_score} size="sm" />
                <p className="mt-2 text-sm text-muted-foreground">Skills</p>
              </div>
            </div>
          </div>

          {/* Summary */}
          <div className="mt-8 p-4 bg-muted/50 rounded-xl">
            <p className="text-foreground">{analysis.feedback.summary}</p>
          </div>
        </div>

        {/* Antigravity Hidden Strengths */}
        {analysis.feedback.hidden_strengths && analysis.feedback.hidden_strengths.length > 0 && (
          <div className="bg-gradient-to-r from-violet-500/10 to-fuchsia-500/10 rounded-2xl shadow-lg p-6 mb-8 border border-violet-200 dark:border-violet-900">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-violet-100 rounded-lg">
                <Lightbulb className="w-5 h-5 text-violet-600" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-violet-600 to-fuchsia-600">
                  Antigravity Insights (1% Edge)
                </h2>
                <p className="text-sm text-muted-foreground">
                  Hidden strengths and transferable skills standard ATS might miss
                </p>
              </div>
            </div>
            <ul className="grid md:grid-cols-2 gap-4">
              {analysis.feedback.hidden_strengths.map((strength, index) => (
                <li key={index} className="flex items-start gap-3 bg-background/50 p-3 rounded-xl border border-violet-100 dark:border-violet-900/50">
                  <span className="w-2 h-2 rounded-full bg-violet-500 mt-2 flex-shrink-0" />
                  <span className="text-foreground font-medium">{strength}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Detailed Analysis */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {/* Strengths */}
          <div className="bg-card rounded-2xl shadow-lg p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-green-100 rounded-lg">
                <CheckCircle className="w-5 h-5 text-green-600" />
              </div>
              <h2 className="text-xl font-semibold text-foreground">
                Strengths
              </h2>
            </div>
            <ul className="space-y-3">
              {analysis.feedback.strengths.map((strength, index) => (
                <li key={index} className="flex items-start gap-3">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-500 mt-2" />
                  <span className="text-muted-foreground">{strength}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Areas for Improvement */}
          <div className="bg-card rounded-2xl shadow-lg p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-amber-100 rounded-lg">
                <AlertCircle className="w-5 h-5 text-amber-600" />
              </div>
              <h2 className="text-xl font-semibold text-foreground">
                Areas for Improvement
              </h2>
            </div>
            <ul className="space-y-3">
              {analysis.feedback.improvements.map((improvement, index) => (
                <li key={index} className="flex items-start gap-3">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-2" />
                  <span className="text-muted-foreground">{improvement}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Missing Keywords */}
          <div className="bg-card rounded-2xl shadow-lg p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-red-100 rounded-lg">
                <AlertCircle className="w-5 h-5 text-red-600" />
              </div>
              <h2 className="text-xl font-semibold text-foreground">
                Missing Keywords
              </h2>
            </div>
            <div className="flex flex-wrap gap-2">
              {analysis.feedback.missing_keywords.map((keyword, index) => (
                <span
                  key={index}
                  className="px-3 py-1 bg-red-50 text-red-700 rounded-full text-sm"
                >
                  {keyword}
                </span>
              ))}
            </div>
          </div>

          {/* Recommendations */}
          <div className="bg-card rounded-2xl shadow-lg p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Lightbulb className="w-5 h-5 text-blue-600" />
              </div>
              <h2 className="text-xl font-semibold text-foreground">
                Recommendations
              </h2>
            </div>
            <ul className="space-y-3">
              {analysis.feedback.recommendations.map((rec, index) => (
                <li key={index} className="flex items-start gap-3">
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-2" />
                  <span className="text-muted-foreground">{rec}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button
            asChild
            className="bg-coral hover:bg-coral-dark text-white rounded-full px-8 py-6"
          >
            <Link href="/resume-builder">
              <FileEdit className="w-5 h-5 mr-2" />
              Build a Better Resume
            </Link>
          </Button>
          <Button
            asChild
            variant="outline"
            className="rounded-full px-8 py-6 border-coral text-coral hover:bg-coral/10 bg-transparent"
          >
            <Link href="/chatbot">
              <MessageSquare className="w-5 h-5 mr-2" />
              Get AI Advice
            </Link>
          </Button>
        </div>
      </main>

      <Footer />
    </div>
  );
}
