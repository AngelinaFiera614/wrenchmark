
import React from "react";
import { Configuration } from "@/types/motorcycle";
import TrimLevelCardWithNotes from "./TrimLevelCardWithNotes";
import EmptyTrimLevelState from "./EmptyTrimLevelState";

interface TrimLevelGridProps {
  configurations: Configuration[];
  onEdit: (config: Configuration) => void;
  onCopy: (config: Configuration) => void;
  onPreview: (config: Configuration) => void;
  onAdd: () => void;
}

const TrimLevelGrid = ({
  configurations,
  onEdit,
  onCopy,
  onPreview,
  onAdd
}: TrimLevelGridProps) => {
  if (configurations.length === 0) {
    return <EmptyTrimLevelState onAdd={onAdd} />;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {configurations.map((config) => (
        <TrimLevelCardWithNotes
          key={config.id}
          configuration={config}
          onEdit={onEdit}
          onCopy={onCopy}
          onPreview={onPreview}
        />
      ))}
    </div>
  );
};

export default TrimLevelGrid;
