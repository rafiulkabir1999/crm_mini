import { cn } from "@/lib/utils"
import { Loader2 } from "lucide-react"

interface LoaderProps {
  size?: "sm" | "md" | "lg"
  variant?: "default" | "spinner" | "dots" | "pulse"
  className?: string
  text?: string
}

export function Loader({ 
  size = "md", 
  variant = "default", 
  className,
  text 
}: LoaderProps) {
  const sizeClasses = {
    sm: "h-4 w-4",
    md: "h-6 w-6", 
    lg: "h-8 w-8"
  }

  if (variant === "spinner") {
    return (
      <div className={cn("flex flex-col items-center justify-center space-y-2", className)}>
        <Loader2 className={cn("animate-spin text-primary", sizeClasses[size])} />
        {text && <p className="text-sm text-muted-foreground">{text}</p>}
      </div>
    )
  }

  if (variant === "dots") {
    return (
      <div className={cn("flex flex-col items-center justify-center space-y-2", className)}>
        <div className="flex space-x-1">
          <div className={cn(
            "bg-primary rounded-full animate-bounce",
            size === "sm" ? "h-2 w-2" : size === "md" ? "h-3 w-3" : "h-4 w-4"
          )} style={{ animationDelay: "0ms" }}></div>
          <div className={cn(
            "bg-primary rounded-full animate-bounce",
            size === "sm" ? "h-2 w-2" : size === "md" ? "h-3 w-3" : "h-4 w-4"
          )} style={{ animationDelay: "150ms" }}></div>
          <div className={cn(
            "bg-primary rounded-full animate-bounce",
            size === "sm" ? "h-2 w-2" : size === "md" ? "h-3 w-3" : "h-4 w-4"
          )} style={{ animationDelay: "300ms" }}></div>
        </div>
        {text && <p className="text-sm text-muted-foreground">{text}</p>}
      </div>
    )
  }

  if (variant === "pulse") {
    return (
      <div className={cn("flex flex-col items-center justify-center space-y-2", className)}>
        <div className={cn(
          "bg-primary rounded-full animate-pulse",
          size === "sm" ? "h-8 w-8" : size === "md" ? "h-12 w-12" : "h-16 w-16"
        )}></div>
        {text && <p className="text-sm text-muted-foreground">{text}</p>}
      </div>
    )
  }

  // Default variant - elegant loading bar
  return (
    <div className={cn("flex flex-col items-center justify-center space-y-2", className)}>
      <div className={cn(
        "relative overflow-hidden bg-muted rounded-full",
        size === "sm" ? "h-1 w-16" : size === "md" ? "h-2 w-24" : "h-3 w-32"
      )}>
        <div className={cn(
          "absolute top-0 left-0 h-full bg-primary rounded-full animate-pulse",
          "before:absolute before:top-0 before:left-0 before:h-full before:w-full before:bg-primary before:rounded-full before:animate-ping"
        )} style={{ width: "30%" }}></div>
      </div>
      {text && <p className="text-sm text-muted-foreground">{text}</p>}
    </div>
  )
}

// Page loader component
export function PageLoader({ text = "Loading..." }: { text?: string }) {
  return (
    <div className="flex items-center justify-center min-h-[400px]">
      <div className="text-center space-y-4">
        <div className="relative">
          <div className="w-16 h-16 border-4 border-muted border-t-primary rounded-full animate-spin"></div>
          <div className="absolute inset-0 w-16 h-16 border-4 border-transparent border-t-primary/30 rounded-full animate-ping"></div>
        </div>
        <p className="text-sm text-muted-foreground">{text}</p>
      </div>
    </div>
  )
}

// Skeleton loader for content
export function SkeletonLoader({ className }: { className?: string }) {
  return (
    <div className={cn("animate-pulse", className)}>
      <div className="h-4 bg-muted rounded mb-2"></div>
      <div className="h-4 bg-muted rounded mb-2 w-3/4"></div>
      <div className="h-4 bg-muted rounded w-1/2"></div>
    </div>
  )
} 