
import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2",
  {
    variants: {
      variant: {
        default: "glass-morphism border-primary/30 text-white bg-primary/20 backdrop-blur-sm",
        secondary: "glass-morphism border-white/20 text-secondary bg-white/5 backdrop-blur-sm hover:bg-white/10",
        destructive: "border-transparent bg-destructive text-destructive-foreground hover:bg-destructive/80",
        outline: "glass-morphism border-white/30 text-white backdrop-blur-sm hover:bg-white/10",
        teal: "glass-morphism border-primary/50 bg-primary/30 text-white backdrop-blur-sm shadow-teal-glow/50",
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
