
import React from "react";
import SmartMotorcycleSpecsForm from "./SmartMotorcycleSpecsForm";
import { Motorcycle } from "@/types";

interface MotorcycleSpecsFormProps {
  motorcycle: Motorcycle;
  isEditing: boolean;
  onUpdate: (field: string, value: any) => void;
}

// This component now delegates to the smart version
const MotorcycleSpecsForm = (props: MotorcycleSpecsFormProps) => {
  return <SmartMotorcycleSpecsForm {...props} />;
};

export default MotorcycleSpecsForm;
