import * as React from "react"
import { cn } from "@/lib/utils"

export interface GlassCardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'elevated' | 'subtle' | 'floating';
}

const GlassCard = React.forwardRef<HTMLDivElement, GlassCardProps>(
  ({ className, variant = 'default', ...props }, ref) => {
    const variants = {
      default: "backdrop-blur-xl bg-white/[0.15] border border-white/20 shadow-2xl",
      elevated: "backdrop-blur-2xl bg-white/[0.2] border border-white/30 shadow-[0_20px_40px_rgba(0,0,0,0.4)] ring-1 ring-white/10",
      subtle: "backdrop-blur-lg bg-white/[0.1] border border-white/15 shadow-lg",
      floating: "backdrop-blur-xl bg-white/[0.15] border border-white/20 shadow-[0_20px_40px_rgba(0,0,0,0.4)] ring-1 ring-white/5"
    };

    return (
      <div
        ref={ref}
        className={cn(
          "relative rounded-xl overflow-hidden",
          "before:absolute before:inset-0 before:bg-gradient-to-br before:from-white/10 before:via-white/5 before:to-transparent before:rounded-xl",
          "after:absolute after:inset-0 after:backdrop-blur-3xl after:bg-white/[0.02] after:rounded-xl",
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
)
GlassCard.displayName = "GlassCard"

export { GlassCard }