"use client"

import Link from "next/link"
import { FileText, Github, Twitter, Linkedin } from "lucide-react"

export function Footer() {
    return (
        <footer className="w-full border-t border-border bg-background py-12 md:py-16">
            <div className="container mx-auto px-4">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
                    <div className="col-span-1 md:col-span-2 space-y-4">
                        <Link href="/" className="flex items-center gap-2 group">
                            <div className="w-10 h-10 bg-coral rounded-xl flex items-center justify-center group-hover:rotate-12 transition-transform">
                                <FileText className="w-6 h-6 text-white" />
                            </div>
                            <span className="text-xl font-bold text-foreground tracking-tight">
                                Resume Checker
                            </span>
                        </Link>
                        <p className="max-w-xs text-muted-foreground leading-relaxed italic">
                            Empowering professionals with AI-driven insights to navigate the modern job market.
                        </p>
                    </div>

                    <div className="space-y-4">
                        <h4 className="font-bold text-foreground">Product</h4>
                        <ul className="space-y-2 text-sm text-muted-foreground">
                            <li><Link href="#upload" className="hover:text-coral transition-colors">Analyzer</Link></li>
                            <li><Link href="/resume-builder" className="hover:text-coral transition-colors">Resume Builder</Link></li>
                            <li><Link href="/chatbot" className="hover:text-coral transition-colors">AI Assistant</Link></li>
                        </ul>
                    </div>

                    <div className="space-y-4">
                        <h4 className="font-bold text-foreground">Community</h4>
                        <div className="flex gap-4">
                            <Link href="#" className="p-2 bg-muted rounded-full hover:bg-coral/10 hover:text-coral transition-all">
                                <Twitter className="w-5 h-5" />
                            </Link>
                            <Link href="#" className="p-2 bg-muted rounded-full hover:bg-coral/10 hover:text-coral transition-all">
                                <Github className="w-5 h-5" />
                            </Link>
                            <Link href="#" className="p-2 bg-muted rounded-full hover:bg-coral/10 hover:text-coral transition-all">
                                <Linkedin className="w-5 h-5" />
                            </Link>
                        </div>
                    </div>
                </div>

                <div className="pt-8 border-t border-border/50 flex flex-col md:flex-row items-center justify-between gap-4">
                    <p className="text-sm text-muted-foreground">
                        © 2025 Resume Checker AI. All rights reserved.
                    </p>
                    <div className="flex gap-6 text-sm text-muted-foreground">
                        <Link href="#" className="hover:text-foreground">Privacy Policy</Link>
                        <Link href="#" className="hover:text-foreground">Terms of Service</Link>
                    </div>
                </div>
            </div>
        </footer>
    )
}
