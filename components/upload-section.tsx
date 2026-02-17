"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { Upload, FileText, CheckCircle2, AlertCircle, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"

export function UploadSection() {
    const router = useRouter()
    const [file, setFile] = React.useState<File | null>(null)
    const [jobDescription, setJobDescription] = React.useState("")
    const [isAnalyzing, setIsAnalyzing] = React.useState(false)
    const [dragActive, setDragActive] = React.useState(false)
    const fileInputRef = React.useRef<HTMLInputElement>(null)

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setFile(e.target.files[0])
        }
    }

    const handleDrag = (e: React.DragEvent) => {
        e.preventDefault()
        e.stopPropagation()
        if (e.type === "dragenter" || e.type === "dragover") {
            setDragActive(true)
        } else if (e.type === "dragleave") {
            setDragActive(false)
        }
    }

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault()
        e.stopPropagation()
        setDragActive(false)
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            const droppedFile = e.dataTransfer.files[0]
            const validTypes = [".pdf", ".docx", ".txt"]
            const extension = droppedFile.name.substring(droppedFile.name.lastIndexOf(".")).toLowerCase()
            if (validTypes.includes(extension)) {
                setFile(droppedFile)
            }
        }
    }

    const removeFile = () => setFile(null)

    const handleAnalyze = async () => {
        if (!file) return

        setIsAnalyzing(true)

        let content = ""
        if (file.type === "text/plain" || file.name.endsWith(".md") || file.name.endsWith(".txt")) {
            content = await file.text()
        } else {
            content = "Simulated resume content for " + file.name
        }

        try {
            const response = await fetch("/api/analyze", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    fileName: file.name,
                    fileContent: content,
                    jobDescription
                })
            })

            if (response.ok) {
                router.push("/dashboard")
            }
        } catch (error) {
            console.error("Analysis failed", error)
        } finally {
            setIsAnalyzing(false)
        }
    }

    return (
        <section className="container py-16 md:py-24">
            <div className="max-w-3xl mx-auto space-y-8">
                <div className="text-center space-y-2">
                    <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground">
                        Ready to boost your career?
                    </h2>
                    <p className="text-muted-foreground text-lg">
                        Upload your resume and get instant AI feedback.
                    </p>
                </div>

                <Card className="border-border/50 shadow-xl overflow-hidden bg-card/50 backdrop-blur-sm">
                    <CardHeader className="bg-muted/30 pb-8">
                        <CardTitle className="text-2xl">Upload Your Resume</CardTitle>
                        <CardDescription className="text-base text-muted-foreground">
                            We support PDF, DOCX, and TXT files.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="p-8 space-y-8">
                        {/* File Upload Area */}
                        <div className="space-y-4">
                            <Label className="text-sm font-semibold uppercase tracking-wider text-muted-foreground/80">
                                Step 1: Your Resume
                            </Label>
                            {!file ? (
                                <div
                                    onDragEnter={handleDrag}
                                    onDragOver={handleDrag}
                                    onDragLeave={handleDrag}
                                    onDrop={handleDrop}
                                    onClick={() => fileInputRef.current?.click()}
                                    className={cn(
                                        "relative group flex flex-col items-center justify-center border-2 border-dashed rounded-2xl p-12 transition-all cursor-pointer",
                                        dragActive
                                            ? "border-coral bg-coral/5 ring-4 ring-coral/10"
                                            : "border-border hover:border-coral/50 hover:bg-muted/50"
                                    )}
                                >
                                    <Input
                                        ref={fileInputRef}
                                        id="resume"
                                        type="file"
                                        className="hidden"
                                        accept=".pdf,.docx,.txt"
                                        onChange={handleFileChange}
                                    />
                                    <div className="w-16 h-16 bg-coral/10 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                                        <Upload className="w-8 h-8 text-coral" />
                                    </div>
                                    <p className="text-lg font-medium text-foreground mb-1">
                                        Click or drag and drop
                                    </p>
                                    <p className="text-sm text-muted-foreground">
                                        Max size 10MB
                                    </p>
                                </div>
                            ) : (
                                <div className="flex items-center justify-between p-6 bg-coral/5 border border-coral/20 rounded-2xl animate-in fade-in slide-in-from-bottom-2 duration-300">
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 bg-coral/20 rounded-xl flex items-center justify-center">
                                            <FileText className="w-6 h-6 text-coral" />
                                        </div>
                                        <div>
                                            <p className="font-semibold text-foreground truncate max-w-[200px] sm:max-w-md">
                                                {file.name}
                                            </p>
                                            <p className="text-sm text-muted-foreground">
                                                {(file.size / 1024 / 1024).toFixed(2)} MB • Ready to analyze
                                            </p>
                                        </div>
                                    </div>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        onClick={removeFile}
                                        className="text-muted-foreground hover:text-destructive transition-colors"
                                    >
                                        <X className="w-5 h-5" />
                                    </Button>
                                </div>
                            )}
                        </div>

                        {/* Job Description Area */}
                        <div className="space-y-4">
                            <Label htmlFor="job-desc" className="text-sm font-semibold uppercase tracking-wider text-muted-foreground/80">
                                Step 2: Job Description <span className="text-muted-foreground/50 lowercase">(Optional)</span>
                            </Label>
                            <div className="relative group">
                                <Textarea
                                    id="job-desc"
                                    placeholder="Paste the job description here to get a tailored ATS score..."
                                    className="min-h-[160px] rounded-2xl border-border bg-background/50 resize-none p-4 focus:ring-coral/20 focus:border-coral transition-all text-base"
                                    value={jobDescription}
                                    onChange={(e) => setJobDescription(e.target.value)}
                                />
                                <div className="absolute right-4 bottom-4 opacity-30 group-focus-within:opacity-100 transition-opacity">
                                    <CheckCircle2 className="w-5 h-5 text-coral" />
                                </div>
                            </div>
                        </div>

                        {/* CTA Button */}
                        <Button
                            onClick={handleAnalyze}
                            disabled={!file || isAnalyzing}
                            size="lg"
                            className={cn(
                                "w-full h-16 rounded-2xl text-lg font-bold transition-all duration-300 transition-shadow",
                                file && !isAnalyzing
                                    ? "bg-coral hover:bg-coral-dark text-white shadow-lg shadow-coral/20 scale-[1.01] hover:scale-[1.02] active:scale-[0.98]"
                                    : "bg-muted text-muted-foreground"
                            )}
                        >
                            {isAnalyzing ? (
                                <div className="flex items-center gap-3">
                                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                    Analyzing with AI...
                                </div>
                            ) : (
                                <div className="flex items-center gap-2">
                                    Analyze My Resume
                                </div>
                            )}
                        </Button>

                        {!file && (
                            <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                                <AlertCircle className="w-4 h-4" />
                                Please select a file to start the analysis
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </section>
    )
}
