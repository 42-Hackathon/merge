import * as React from "react"
import { cn } from "@/lib/utils"

export interface GlassCardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'elevated' | 'subtle' | 'floating';
}

const GlassCard = React.memo(React.forwardRef<HTMLDivElement, GlassCardProps>(
  ({ className, variant = 'default', ...props }, ref) => {
    const variants = {
      default: "backdrop-blur-sm bg-white/[0.08] border border-white/20 shadow-lg",
      elevated: "backdrop-blur-md bg-white/[0.12] border border-white/30 shadow-xl ring-1 ring-white/10",
      subtle: "backdrop-blur-[2px] bg-white/[0.05] border border-white/15 shadow-md",
      floating: "backdrop-blur-sm bg-white/[0.08] border border-white/20 shadow-xl ring-1 ring-white/5"
    };

    return (
      <div
        ref={ref}
        className={cn(
          "relative rounded-xl overflow-hidden will-change-transform",
          "before:absolute before:inset-0 before:bg-gradient-to-br before:from-white/10 before:via-white/5 before:to-transparent before:rounded-xl",
          variants[variant],
          className
        )}
        {...props}
      >
        <div className="relative z-10 h-full">
          {props.children}
        </div>
      </div>
    )
  }
))

GlassCard.displayName = "GlassCard"

export { GlassCard }