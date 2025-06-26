import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:ring-offset-2 focus:ring-offset-slate-900",
  {
    variants: {
      variant: {
        default: "border-transparent bg-blue-600 text-white shadow-sm hover:bg-blue-700",
        secondary: "border-white/30 bg-white/20 text-white backdrop-blur-xl hover:bg-white/30",
        destructive: "border-transparent bg-red-600 text-white shadow-sm hover:bg-red-700",
        outline: "border-white/30 text-white backdrop-blur-xl hover:bg-white/10",
        glass: "border-white/20 bg-white/10 text-white backdrop-blur-xl hover:bg-white/20 hover:border-white/30"
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  )
}

export { Badge, badgeVariants }