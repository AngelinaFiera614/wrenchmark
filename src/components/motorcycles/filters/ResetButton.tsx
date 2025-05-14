
import React from "react";
import { Button } from "@/components/ui/button";

interface ResetButtonProps {
  onReset: () => void;
}

export default function ResetButton({ onReset }: ResetButtonProps) {
  return (
    <Button 
      variant="outline" 
      size="sm" 
      className="w-full"
      onClick={onReset}
    >
      Reset Filters
    </Button>
  );
}
