import Link from "next/link";
import { Button } from "@/components/ui/button";
import { AlertCircle, FileText } from "lucide-react";

export default function AuthErrorPage() {
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

        <div className="w-20 h-20 mx-auto mb-6 bg-destructive/10 rounded-full flex items-center justify-center">
          <AlertCircle className="w-10 h-10 text-destructive" />
        </div>

        <h1 className="text-3xl font-bold text-foreground mb-4">
          Authentication Error
        </h1>

        <p className="text-muted-foreground mb-8">
          Something went wrong during authentication. Please try again or
          contact support if the problem persists.
        </p>

        <div className="space-y-4">
          <Link href="/auth/login">
            <Button className="w-full h-12 bg-coral hover:bg-coral-dark text-white rounded-full text-lg font-medium">
              Try Again
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
