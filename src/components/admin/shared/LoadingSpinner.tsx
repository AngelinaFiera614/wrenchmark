
import React from "react";
import { Loader } from "lucide-react";
import { cn } from "@/lib/utils";

interface LoadingSpinnerProps {
  size?: "sm" | "md" | "lg";
  text?: string;
  className?: string;
}

const LoadingSpinner = ({ size = "md", text, className }: LoadingSpinnerProps) => {
  const sizeClasses = {
    sm: "h-4 w-4",
    md: "h-6 w-6", 
    lg: "h-8 w-8"
  };

  return (
    <div className={cn("flex flex-col items-center space-y-4", className)}>
      <Loader className={cn("animate-spin text-accent-teal", sizeClasses[size])} />
      {text && (
        <p className="text-explorer-text-muted text-center">{text}</p>
      )}
    </div>
  );
};

export default LoadingSpinner;
