import { google } from "@ai-sdk/google";
import { streamText, convertToCoreMessages } from "ai";
import { createClient } from "@/lib/supabase/server";

export const maxDuration = 30;

export async function POST(req: Request) {
  const { messages } = await req.json();

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const result = streamText({
    model: google("gemini-1.5-flash"),
    system: `You are an expert resume coach and career advisor. Your role is to help users:
- Improve their resumes for ATS (Applicant Tracking Systems) compatibility
- Provide personalized career advice
- Answer questions about job searching, interviews, and professional development
- Suggest improvements to resume content, formatting, and keywords
- Help users tailor their resumes for specific job descriptions

Be helpful, encouraging, and provide actionable advice. When reviewing resumes or providing suggestions, be specific and constructive. Format your responses clearly with bullet points or numbered lists when appropriate.`,
    messages: convertToCoreMessages(messages),
    onFinish: async ({ text }) => {
      if (!user) return;

      const lastUserMessage = messages[messages.length - 1];

      if (lastUserMessage) {
        await supabase.from("chat_history").insert({
          user_id: user.id,
          user_message: lastUserMessage.content,
          assistant_response: text,
        });
      }
    },
  });

  return result.toDataStreamResponse();
}
