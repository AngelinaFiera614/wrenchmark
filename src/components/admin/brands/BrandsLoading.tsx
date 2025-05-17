
import React from "react";
import { Loader2 } from "lucide-react";

const BrandsLoading = () => {
  return (
    <div className="flex justify-center py-20">
      <Loader2 className="h-8 w-8 animate-spin text-accent-teal" />
    </div>
  );
};

export default BrandsLoading;
