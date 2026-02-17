import { cn } from "@/lib/utils"

interface ScoreCircleProps {
    score: number;
    label?: string;
    size?: "sm" | "md" | "lg";
    className?: string;
    animated?: boolean;
}

export function ScoreCircle({ score, label, size = "md", className }: ScoreCircleProps) {
    const sizeClasses = {
        sm: "w-20 h-20 text-xl",
        md: "w-32 h-32 text-3xl",
        lg: "w-48 h-48 text-5xl",
    };

    // Determine color based on score
    let colorClass = "text-red-500 border-red-500";
    if (score >= 70) colorClass = "text-green-500 border-green-500";
    else if (score >= 50) colorClass = "text-yellow-500 border-yellow-500";

    return (
        <div className={cn("flex flex-col items-center gap-2", className)}>
            <div
                className={cn(
                    "rounded-full border-4 flex items-center justify-center font-bold bg-background",
                    sizeClasses[size],
                    colorClass
                )}
            >
                {score}
            </div>
            {label && <span className="text-sm font-medium text-muted-foreground">{label}</span>}
        </div>
    );
}
