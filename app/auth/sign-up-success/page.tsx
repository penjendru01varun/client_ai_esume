import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Mail, FileText } from "lucide-react";

export default function SignUpSuccessPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <div className="max-w-md w-full text-center">
        <Link href="/" className="inline-flex items-center gap-2 mb-8">
          <div className="w-10 h-10 bg-coral rounded-lg flex items-center justify-center">
            <FileText className="w-6 h-6 text-white" />
          </div>
          <span className="text-2xl font-bold text-foreground">
            Resume Checker
          </span>
        </Link>

        <div className="w-20 h-20 mx-auto mb-6 bg-coral/10 rounded-full flex items-center justify-center">
          <Mail className="w-10 h-10 text-coral" />
        </div>

        <h1 className="text-3xl font-bold text-foreground mb-4">
          Check Your Email
        </h1>

        <p className="text-muted-foreground mb-8">
          {"We've sent a confirmation link to your email address. Please click the link to verify your account and get started."}
        </p>

        <div className="space-y-4">
          <Link href="/auth/login">
            <Button className="w-full h-12 bg-coral hover:bg-coral-dark text-white rounded-full text-lg font-medium">
              Go to Login
            </Button>
          </Link>

          <Link href="/">
            <Button
              variant="outline"
              className="w-full h-12 rounded-full text-lg font-medium border-coral text-coral hover:bg-coral/10 bg-transparent"
            >
              Back to Home
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
