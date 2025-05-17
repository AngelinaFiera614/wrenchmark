import { cn } from "@/lib/utils";
import { Button, buttonVariants } from "@/components/ui/button";
import { VariantProps, cva } from "class-variance-authority";
import * as React from "react";

// Extend the button variants with our custom styles
export const customButtonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        teal: "bg-accent-teal text-white hover:bg-accent-teal-hover",
      },
      size: {
        // Use the existing sizes from the Button component
      },
    },
  }
);

export interface CustomButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof customButtonVariants> {}

export const CustomButton = React.forwardRef<HTMLButtonElement, CustomButtonProps>(
  ({ className, variant, size, ...props }, ref) => {
    // If it's our custom variant, use our custom styles
    if (variant === "teal") {
      return (
        <button
          className={cn(customButtonVariants({ variant, size, className }))}
          ref={ref}
          {...props}
        />
      );
    }
    
    // Otherwise, fall back to the default Button component
    return <Button className={className} variant={variant as any} size={size} {...props} ref={ref} />;
  }
);

CustomButton.displayName = "CustomButton";
