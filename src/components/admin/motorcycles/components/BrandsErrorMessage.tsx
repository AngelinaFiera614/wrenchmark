
import React from "react";

export const BrandsErrorMessage: React.FC = () => {
  return (
    <div className="bg-red-500/10 border border-red-500 p-4 rounded-md mb-4">
      <p className="text-red-500 font-medium">Failed to load brands data.</p>
      <p className="text-muted-foreground text-sm mt-1">
        Some functionality may be limited. Please try refreshing the page.
      </p>
    </div>
  );
};
