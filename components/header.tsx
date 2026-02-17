"use client"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export function Header() {
    return (
        <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="container flex h-14 items-center justify-between">
                <div className="flex items-center gap-4">
                    <Link href="/" className="font-bold text-lg">
                        ATS Resume Analyzer
                    </Link>
                    <nav className="flex items-center gap-6 text-sm">
                        <Link href="/dashboard" className="transition-colors hover:text-foreground/80">Dashboard</Link>
                        <Link href="/resume-builder" className="transition-colors hover:text-foreground/80">Builder</Link>
                        <Link href="/chatbot" className="transition-colors hover:text-foreground/80">Chat</Link>
                    </nav>
                </div>
                <div className="flex items-center gap-2">
                    <Link href="/auth/login">
                        <Button variant="ghost" size="sm">Login</Button>
                    </Link>
                    <Link href="/auth/sign-up">
                        <Button size="sm">Sign Up</Button>
                    </Link>
                </div>
            </div>
        </header>
    )
}
