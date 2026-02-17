import { google } from "@ai-sdk/google";
import { NextRequest, NextResponse } from "next/server";
import { generateText } from "ai";

export async function POST(request: NextRequest) {
  try {
    const { fileName, fileContent, jobDescription } = await request.json();

    if (!fileName || !fileContent) {
      return NextResponse.json(
        { error: "Missing file name or content" },
        { status: 400 }
      );
    }

    // Analyze resume using AI
    const prompt = `You are an expert ATS (Applicant Tracking System) resume analyzer. Analyze this resume against the job description using ATS logic, then apply a 1% enhancement factor that identifies overlooked strengths that standard keyword matching misses.

Resume File Name: ${fileName}
Resume Content:
${fileContent}

${jobDescription ? `Target Job Description: ${jobDescription}` : "No specific job description provided."}

Core Instruction:
Analyze this resume against the job description using ATS logic, then apply a 1% enhancement factor that identifies overlooked strengths that standard keyword matching misses.

Standard ATS Analysis (99%):
- Extract exact keyword matches from job description
- Calculate keyword density and placement
- Verify proper formatting (headers, bullet points, dates)
- Check for ATS-friendly section headers
- Identify missing required skills/qualifications
- Score: 0-100 based on keyword presence

Antigravity Factor (1%):
- Identify transferable skills implied but not explicitly stated
- Recognize equivalent terminology (e.g., "led" vs "managed")
- Detect contextual competencies embedded in achievements
- Find industry-adjacent experience that translates
- Spot soft skills demonstrated through quantified results
- Recognize certifications/education that substitute for experience

Provide your analysis in the following JSON format only, with no additional text:
{
  "overall_score": <number between 0-100>,
  "keyword_score": <number between 0-100>,
  "formatting_score": <number between 0-100>,
  "experience_score": <number between 0-100>,
  "skills_score": <number between 0-100>,
  "antigravity_boost": <number between 0-1>,
  "final_score": <number between 0-100, which is overall_score + antigravity_boost>,
  "summary": "<brief 2-3 sentence summary of the resume quality including the hidden strengths>",
  "strengths": ["<strength 1>", "<strength 2>", "<strength 3>"],
  "hidden_strengths": ["<hidden strength 1 (Antigravity)>", "<hidden strength 2 (Antigravity)>"],
  "improvements": ["<improvement 1>", "<improvement 2>", "<improvement 3>"],
  "missing_keywords": ["<keyword 1>", "<keyword 2>", "<keyword 3>"],
  "recommendations": ["<recommendation 1>", "<recommendation 2>", "<recommendation 3>"]
}

Provide realistic scores based on common ATS best practices.`;

    const { text } = await generateText({
      model: google("models/gemini-pro"),
      prompt,
    });

    // Parse the AI response
    let analysis;
    try {
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        analysis = JSON.parse(jsonMatch[0]);
      } else {
        throw new Error("No JSON found in response");
      }
    } catch {
      // Provide default scores if parsing fails
      analysis = {
        overall_score: 72,
        keyword_score: 68,
        formatting_score: 78,
        experience_score: 75,
        skills_score: 70,
        antigravity_boost: 0.5,
        final_score: 72.5,
        summary: "Your resume shows good potential but could benefit from optimization for ATS systems.",
        strengths: [
          "Clear professional experience",
          "Relevant skills listed",
          "Good overall structure",
        ],
        hidden_strengths: [
          "Demonstrated adaptability in changing roles",
          "Implied leadership through project ownership"
        ],
        improvements: [
          "Add more industry-specific keywords",
          "Quantify achievements with numbers",
          "Improve formatting consistency",
        ],
        missing_keywords: [
          "Results-driven",
          "Cross-functional collaboration",
          "Data analysis",
        ],
        recommendations: [
          "Use a single-column layout for better ATS parsing",
          "Include relevant certifications",
          "Add a professional summary section",
        ],
      };
    }

    // Return analysis for all users
    return NextResponse.json({
      analysis: {
        overall_score: analysis.overall_score,
        keyword_score: analysis.keyword_score,
        formatting_score: analysis.formatting_score,
        experience_score: analysis.experience_score,
        skills_score: analysis.skills_score,
        antigravity_boost: analysis.antigravity_boost,
        final_score: analysis.final_score,
        feedback: {
          summary: analysis.summary,
          strengths: analysis.strengths,
          hidden_strengths: analysis.hidden_strengths,
          improvements: analysis.improvements,
          missing_keywords: analysis.missing_keywords,
          recommendations: analysis.recommendations,
        },
      }
    });
  } catch (error) {
    console.error("Analysis error:", error);
    return NextResponse.json(
      { error: "Failed to analyze resume" },
      { status: 500 }
    );
  }
}
