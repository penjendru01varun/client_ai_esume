"use client";

import React from "react"
import { useState, useRef, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { useChat } from "@ai-sdk/react";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/client";
import { Send, Bot, User, Sparkles, FileText, MessageSquare, Trash2 } from "lucide-react";

const suggestedPrompts = [
  "How can I improve my resume for tech jobs?",
  "What keywords should I include for a marketing role?",
  "Review my work experience section",
  "How do I write a compelling professional summary?",
];

export default function ChatbotPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [checkingAuth, setCheckingAuth] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const supabase = useMemo(() => createClient(), []);

  const { messages, input, handleInputChange, handleSubmit, setMessages, isLoading, append } = useChat({
    api: "/api/chat",
  });

  useEffect(() => {
    const checkAuth = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        router.push("/auth/login?redirect=/chatbot");
        return;
      }

      setIsAuthenticated(true);
      setCheckingAuth(false);
    };

    checkAuth();
  }, [router, supabase]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSuggestedPrompt = (prompt: string) => {
    append({
      role: "user",
      content: prompt,
    });
  };

  const clearChat = () => {
    setMessages([]);
  };

  if (checkingAuth) {
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

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-1 flex flex-col max-w-4xl mx-auto w-full px-4 py-6">
        {/* Chat Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-coral/10 rounded-xl flex items-center justify-center">
              <Bot className="w-6 h-6 text-coral" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-foreground">
                Resume AI Assistant
              </h1>
              <p className="text-sm text-muted-foreground">
                Get personalized career advice
              </p>
            </div>
          </div>
          {messages.length > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={clearChat}
              className="text-muted-foreground hover:text-destructive"
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Clear Chat
            </Button>
          )}
        </div>

        {/* Messages Area */}
        <div className="flex-1 bg-card rounded-2xl shadow-sm border border-border overflow-hidden flex flex-col">
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {messages.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center">
                <div className="w-20 h-20 bg-coral/10 rounded-full flex items-center justify-center mb-6">
                  <Sparkles className="w-10 h-10 text-coral" />
                </div>
                <h2 className="text-xl font-semibold text-foreground mb-2">
                  How can I help you today?
                </h2>
                <p className="text-muted-foreground mb-8 max-w-md">
                  {"I'm your AI resume coach. Ask me anything about improving your resume, job searching, or career advice."}
                </p>

                {/* Suggested Prompts */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-lg">
                  {suggestedPrompts.map((prompt) => (
                    <button
                      key={prompt}
                      onClick={() => handleSuggestedPrompt(prompt)}
                      className="p-4 bg-muted/50 hover:bg-muted rounded-xl text-left text-sm text-foreground transition-colors"
                    >
                      <MessageSquare className="w-4 h-4 text-coral mb-2" />
                      {prompt}
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              <>
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex gap-4 ${message.role === "user" ? "flex-row-reverse" : ""
                      }`}
                  >
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${message.role === "user"
                        ? "bg-coral text-white"
                        : "bg-muted"
                        }`}
                    >
                      {message.role === "user" ? (
                        <User className="w-5 h-5" />
                      ) : (
                        <Bot className="w-5 h-5 text-coral" />
                      )}
                    </div>
                    <div
                      className={`flex-1 max-w-[80%] ${message.role === "user" ? "text-right" : ""
                        }`}
                    >
                      <div
                        className={`inline-block p-4 rounded-2xl ${message.role === "user"
                          ? "bg-coral text-white"
                          : "bg-muted text-foreground"
                          }`}
                      >
                        <div className="whitespace-pre-wrap text-sm text-left">
                          {message.content}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}

                {isLoading && messages[messages.length - 1]?.role === "user" && (
                  <div className="flex gap-4">
                    <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center flex-shrink-0">
                      <Bot className="w-5 h-5 text-coral" />
                    </div>
                    <div className="bg-muted rounded-2xl p-4">
                      <div className="flex gap-1">
                        <div className="w-2 h-2 bg-coral rounded-full animate-bounce" />
                        <div
                          className="w-2 h-2 bg-coral rounded-full animate-bounce"
                          style={{ animationDelay: "0.1s" }}
                        />
                        <div
                          className="w-2 h-2 bg-coral rounded-full animate-bounce"
                          style={{ animationDelay: "0.2s" }}
                        />
                      </div>
                    </div>
                  </div>
                )}

                <div ref={messagesEndRef} />
              </>
            )}
          </div>

          {/* Input Area */}
          <div className="border-t border-border p-4">
            <form onSubmit={handleSubmit} className="flex gap-3">
              <div className="flex-1 relative">
                <input
                  type="text"
                  value={input}
                  onChange={handleInputChange}
                  placeholder="Ask me anything about your resume..."
                  className="w-full h-12 px-4 pr-12 rounded-xl border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-coral/50"
                  disabled={isLoading}
                />
                <FileText className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              </div>
              <Button
                type="submit"
                disabled={!input.trim() || isLoading}
                className="bg-coral hover:bg-coral-dark text-white rounded-xl h-12 px-6"
              >
                <Send className="w-5 h-5" />
              </Button>
            </form>
            <p className="text-xs text-muted-foreground mt-2 text-center">
              AI responses are suggestions. Always review and customize for your specific situation.
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
