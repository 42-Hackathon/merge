import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg text-sm font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/50 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "bg-blue-600 text-white shadow-lg hover:bg-blue-700 hover:shadow-xl hover:-translate-y-0.5 active:translate-y-0",
        destructive: "bg-red-600 text-white shadow-lg hover:bg-red-700 hover:shadow-xl hover:-translate-y-0.5",
        outline: "border border-white/30 bg-white/10 text-white backdrop-blur-xl hover:bg-white/20 hover:border-white/40 hover:-translate-y-0.5",
        secondary: "bg-white/20 text-white backdrop-blur-xl border border-white/20 hover:bg-white/30 hover:border-white/30 hover:-translate-y-0.5",
        ghost: "text-white hover:bg-white/10 hover:text-white backdrop-blur-xl",
        link: "text-blue-400 underline-offset-4 hover:underline hover:text-blue-300",
        glass: "backdrop-blur-xl bg-white/10 border border-white/20 text-white hover:bg-white/15 hover:border-white/30 hover:-translate-y-0.5 shadow-lg"
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-8 rounded-md px-3 text-xs",
        lg: "h-12 rounded-lg px-8 text-base",
        icon: "h-10 w-10",
        xs: "h-6 w-6 text-xs"
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }