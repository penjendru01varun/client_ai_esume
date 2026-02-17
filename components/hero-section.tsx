"use client"

import Link from "next/link"
import { Sparkles, ArrowRight, CheckCircle } from "lucide-react"
import { Button } from "@/components/ui/button"

export function HeroSection() {
    return (
        <section className="relative overflow-hidden bg-background pt-16 pb-20 md:pt-24 md:pb-32 lg:pt-32">
            {/* Background Decoration */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full -z-10 pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-coral/5 rounded-full blur-[120px]" />
                <div className="absolute bottom-[20%] right-[-5%] w-[30%] h-[30%] bg-coral/10 rounded-full blur-[100px]" />
            </div>

            <div className="container relative z-10 mx-auto text-center px-4">
                {/* Badge */}
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-coral/10 border border-coral/20 text-coral text-sm font-semibold mb-8 animate-in fade-in slide-in-from-top-4 duration-500">
                    <Sparkles className="w-4 h-4" />
                    <span>AI-Powered Resume Optimization</span>
                </div>

                {/* Headline */}
                <h1 className="text-4xl md:text-6xl lg:text-7xl font-extrabold tracking-tight text-foreground mb-6 leading-[1.1]">
                    Stop getting <span className="text-transparent bg-clip-text bg-gradient-to-r from-coral to-coral-dark">ghosted</span> by <br className="hidden md:block" />
                    standard ATS systems.
                </h1>

                {/* Subheadline */}
                <p className="max-w-2xl mx-auto text-lg md:text-xl text-muted-foreground mb-10 leading-relaxed">
                    Our intelligent analyzer gives you the hidden "Antigravity Factor" score — identifying the strengths and skills that traditional keyword matching misses.
                </p>

                {/* CTAs */}
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
                    <Link href="#upload">
                        <Button size="lg" className="h-14 px-8 rounded-full bg-coral hover:bg-coral-dark text-white text-lg font-bold shadow-xl shadow-coral/20 group">
                            Analyze My Resume
                            <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                        </Button>
                    </Link>
                    <Link href="/resume-builder">
                        <Button variant="outline" size="lg" className="h-14 px-8 rounded-full text-lg font-semibold border-border hover:bg-muted transition-all">
                            Build with Guide
                        </Button>
                    </Link>
                </div>

                {/* Social Proof / Stats */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto pt-8 border-t border-border/50">
                    <div className="space-y-1">
                        <p className="text-3xl font-bold text-foreground">98%</p>
                        <p className="text-sm text-muted-foreground">ATS Pass Rate</p>
                    </div>
                    <div className="space-y-1">
                        <p className="text-3xl font-bold text-foreground">10k+</p>
                        <p className="text-sm text-muted-foreground">Resumes Analyzed</p>
                    </div>
                    <div className="space-y-1">
                        <p className="text-3xl font-bold text-foreground">250+</p>
                        <p className="text-sm text-muted-foreground">Keyword Logic</p>
                    </div>
                    <div className="space-y-1">
                        <p className="text-3xl font-bold text-foreground">1.0%</p>
                        <p className="text-sm text-muted-foreground">The AI Factor</p>
                    </div>
                </div>
            </div>
        </section>
    )
}
