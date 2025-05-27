
import * as React from "react";
import { cn } from "@/lib/utils";
import { cva, type VariantProps } from "class-variance-authority";

/**
 * Premium Card component with enhanced glass morphism and animations
 * Part of the Smoked Metal Teal design system
 */
const premiumCardVariants = cva(
  "relative overflow-hidden backdrop-blur-md border text-white transition-all duration-500 group",
  {
    variants: {
      variant: {
        default: "bg-white/5 border-white/10 shadow-glass rounded-2xl",
        premium: "bg-gradient-to-br from-white/10 to-white/5 border-primary/30 shadow-teal-glow rounded-3xl",
        floating: "bg-white/8 border-white/20 shadow-2xl rounded-2xl hover:shadow-teal-glow",
        featured: "bg-gradient-to-br from-primary/20 to-white/5 border-primary/50 shadow-teal-glow-lg rounded-3xl",
      },
      interactive: {
        true: "cursor-pointer hover:scale-105 hover:bg-white/10 hover:border-primary/40 hover:shadow-teal-glow-lg",
        false: "",
      },
      glow: {
        none: "",
        subtle: "shadow-teal-glow/30",
        medium: "shadow-teal-glow",
        strong: "shadow-teal-glow-lg",
      },
    },
    defaultVariants: {
      variant: "default",
      interactive: false,
      glow: "none",
    },
  }
);

export interface PremiumCardProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof premiumCardVariants> {}

const PremiumCard = React.forwardRef<HTMLDivElement, PremiumCardProps>(
  ({ className, variant, interactive, glow, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(premiumCardVariants({ variant, interactive, glow, className }))}
      {...props}
    />
  )
);
PremiumCard.displayName = "PremiumCard";

const PremiumCardHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex flex-col space-y-2 p-6 pb-4", className)}
    {...props}
  />
));
PremiumCardHeader.displayName = "PremiumCardHeader";

const PremiumCardTitle = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h3
    ref={ref}
    className={cn(
      "text-2xl font-bold leading-none tracking-tight text-white group-hover:text-gradient-teal transition-all duration-300",
      className
    )}
    {...props}
  />
));
PremiumCardTitle.displayName = "PremiumCardTitle";

const PremiumCardDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn("text-sm text-secondary-muted leading-relaxed", className)}
    {...props}
  />
));
PremiumCardDescription.displayName = "PremiumCardDescription";

const PremiumCardContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("p-6 pt-0", className)} {...props} />
));
PremiumCardContent.displayName = "PremiumCardContent";

const PremiumCardFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex items-center p-6 pt-0", className)}
    {...props}
  />
));
PremiumCardFooter.displayName = "PremiumCardFooter";

export {
  PremiumCard,
  PremiumCardHeader,
  PremiumCardFooter,
  PremiumCardTitle,
  PremiumCardDescription,
  PremiumCardContent,
};
