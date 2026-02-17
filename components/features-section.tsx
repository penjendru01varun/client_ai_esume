"use client"

import { Bot, Target, Layout, Sparkles, Files, MessageSquare, ShieldCheck, Zap } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"

export function FeaturesSection() {
    const features = [
        {
            title: "ATS Compatibility",
            description: "Deep-content scanning to ensure your resume survives the initial bot screening.",
            icon: Target,
            color: "text-blue-500",
            bg: "bg-blue-500/10"
        },
        {
            title: "Keyword Intelligence",
            description: "Extract high-value keywords from job descriptions and match them dynamically.",
            icon: Zap,
            color: "text-amber-500",
            bg: "bg-amber-500/10"
        },
        {
            title: "Formatting Analysis",
            description: "Detect problematic layouts, complex tables, and fonts that break ATS systems.",
            icon: Layout,
            color: "text-green-500",
            bg: "bg-green-500/10"
        },
        {
            title: "AI Coaching",
            description: "Get personalized, actionable suggestions to rewrite weak bullet points.",
            icon: Bot,
            color: "text-coral",
            bg: "bg-coral/10"
        },
        {
            title: "Antigravity Factor",
            description: "Exclusive AI logic that finds hidden strengths keyword scanners always miss.",
            icon: Sparkles,
            color: "text-purple-500",
            bg: "bg-purple-500/10"
        },
        {
            title: "Professional Builder",
            description: "Import your analysis directly into a clean, modern resume template.",
            icon: Files,
            color: "text-rose-500",
            bg: "bg-rose-500/10"
        }
    ]

    return (
        <section className="py-24 bg-muted/30">
            <div className="container mx-auto px-4">
                <div className="max-w-3xl mx-auto text-center mb-16">
                    <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-4">
                        Everything you need to <span className="text-coral">get hired</span>
                    </h2>
                    <p className="text-muted-foreground text-lg">
                        Standard scanners look for keywords. We look for potential.
                    </p>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
                    {features.map((feature, index) => (
                        <Card key={index} className="group border-border/50 bg-card hover:bg-card/80 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 overflow-hidden">
                            <CardContent className="p-8">
                                <div className={`w-12 h-12 ${feature.bg} rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                                    <feature.icon className={`w-6 h-6 ${feature.color}`} />
                                </div>
                                <h3 className="text-xl font-bold text-foreground mb-3">{feature.title}</h3>
                                <p className="text-muted-foreground leading-relaxed">
                                    {feature.description}
                                </p>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>
        </section>
    )
}
