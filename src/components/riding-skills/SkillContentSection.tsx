
import React from "react";

interface SkillContentSectionProps {
  instructions: string;
}

const SkillContentSection: React.FC<SkillContentSectionProps> = ({ instructions }) => {
  const renderInstructions = () => {
    // Split by newlines to support simple formatting
    return instructions.split('\n').map((line, index) => (
      <p key={index} className="mb-3">{line}</p>
    ));
  };

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Instructions</h2>
      <div className="text-muted-foreground space-y-1">
        {renderInstructions()}
      </div>
    </div>
  );
};

export default SkillContentSection;
