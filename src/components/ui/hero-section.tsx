
import * as React from "react";
import { cn } from "@/lib/utils";
import { cva, type VariantProps } from "class-variance-authority";

/**
 * Hero Section component with dramatic backgrounds and glass overlays
 * Part of the Smoked Metal Teal design system
 */
const heroSectionVariants = cva(
  "relative min-h-screen flex items-center justify-center overflow-hidden",
  {
    variants: {
      variant: {
        default: "bg-gradient-dark",
        image: "bg-cover bg-center bg-no-repeat",
        video: "bg-black",
        gradient: "bg-gradient-to-br from-background via-background-alt to-background",
      },
      overlay: {
        none: "",
        light: "before:absolute before:inset-0 before:bg-black/20 before:z-10",
        medium: "before:absolute before:inset-0 before:bg-black/40 before:z-10",
        heavy: "before:absolute before:inset-0 before:bg-black/60 before:z-10",
        glass: "before:absolute before:inset-0 before:bg-black/30 before:backdrop-blur-sm before:z-10",
      },
    },
    defaultVariants: {
      variant: "default",
      overlay: "medium",
    },
  }
);

export interface HeroSectionProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof heroSectionVariants> {
  backgroundImage?: string;
  videoSrc?: string;
}

const HeroSection = React.forwardRef<HTMLDivElement, HeroSectionProps>(
  ({ className, variant, overlay, backgroundImage, videoSrc, style, ...props }, ref) => {
    const backgroundStyle = variant === "image" && backgroundImage
      ? { backgroundImage: `url(${backgroundImage})`, ...style }
      : style;

    return (
      <section
        ref={ref}
        className={cn(heroSectionVariants({ variant, overlay, className }))}
        style={backgroundStyle}
        {...props}
      >
        {variant === "video" && videoSrc && (
          <video
            autoPlay
            muted
            loop
            playsInline
            className="absolute inset-0 w-full h-full object-cover"
          >
            <source src={videoSrc} type="video/mp4" />
          </video>
        )}
        {props.children}
      </section>
    );
  }
);
HeroSection.displayName = "HeroSection";

const HeroContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "relative z-20 container mx-auto px-4 text-center space-y-8",
      className
    )}
    {...props}
  />
));
HeroContent.displayName = "HeroContent";

const HeroTitle = React.forwardRef<
  HTMLHeadingElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h1
    ref={ref}
    className={cn(
      "text-5xl md:text-7xl font-bold text-white leading-tight tracking-tight",
      "bg-gradient-to-br from-white via-white/90 to-secondary bg-clip-text text-transparent",
      className
    )}
    {...props}
  />
));
HeroTitle.displayName = "HeroTitle";

const HeroSubtitle = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn(
      "text-xl md:text-2xl text-secondary-muted max-w-3xl mx-auto leading-relaxed",
      className
    )}
    {...props}
  />
));
HeroSubtitle.displayName = "HeroSubtitle";

const HeroActions = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "flex flex-col sm:flex-row gap-4 justify-center items-center",
      className
    )}
    {...props}
  />
));
HeroActions.displayName = "HeroActions";

export {
  HeroSection,
  HeroContent,
  HeroTitle,
  HeroSubtitle,
  HeroActions,
};
