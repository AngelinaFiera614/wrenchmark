
import React from "react";
import EnhancedMotorcycleSpecsForm from "./EnhancedMotorcycleSpecsForm";
import { Motorcycle } from "@/types";

interface MotorcycleSpecsFormProps {
  motorcycle: Motorcycle;
  isEditing: boolean;
  onUpdate: (field: string, value: any) => void;
}

// This component now delegates to the enhanced version
const MotorcycleSpecsForm = (props: MotorcycleSpecsFormProps) => {
  return <EnhancedMotorcycleSpecsForm {...props} />;
};

export default MotorcycleSpecsForm;
