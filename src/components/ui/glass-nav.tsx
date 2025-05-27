
import * as React from "react";
import { cn } from "@/lib/utils";
import { cva, type VariantProps } from "class-variance-authority";

/**
 * Glass Navigation component with floating frosted glass effect
 * Part of the Smoked Metal Teal design system
 */
const glassNavVariants = cva(
  "fixed top-0 left-0 right-0 z-50 backdrop-blur-xl border-b transition-all duration-300",
  {
    variants: {
      variant: {
        default: "bg-background/80 border-white/10 shadow-glass",
        floating: "bg-white/5 border-white/20 shadow-teal-glow mx-4 mt-4 rounded-2xl",
        transparent: "bg-transparent border-transparent",
      },
      blur: {
        sm: "backdrop-blur-sm",
        md: "backdrop-blur-md", 
        lg: "backdrop-blur-lg",
        xl: "backdrop-blur-xl",
      },
    },
    defaultVariants: {
      variant: "default",
      blur: "xl",
    },
  }
);

export interface GlassNavProps
  extends React.HTMLAttributes<HTMLElement>,
    VariantProps<typeof glassNavVariants> {}

const GlassNav = React.forwardRef<HTMLElement, GlassNavProps>(
  ({ className, variant, blur, ...props }, ref) => (
    <nav
      ref={ref}
      className={cn(glassNavVariants({ variant, blur, className }))}
      {...props}
    />
  )
);
GlassNav.displayName = "GlassNav";

const GlassNavContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("container mx-auto px-4 py-3 flex items-center justify-between", className)}
    {...props}
  />
));
GlassNavContent.displayName = "GlassNavContent";

const GlassNavBrand = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex items-center space-x-2", className)}
    {...props}
  />
));
GlassNavBrand.displayName = "GlassNavBrand";

const GlassNavMenu = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("hidden md:flex items-center space-x-6", className)}
    {...props}
  />
));
GlassNavMenu.displayName = "GlassNavMenu";

const GlassNavActions = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex items-center space-x-3", className)}
    {...props}
  />
));
GlassNavActions.displayName = "GlassNavActions";

export {
  GlassNav,
  GlassNavContent,
  GlassNavBrand,
  GlassNavMenu,
  GlassNavActions,
};
