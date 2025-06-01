import React from "react";
import { CardContent } from "@/components/ui/card";
import { Configuration } from "@/types/motorcycle";
import TrimLevelCard from "./TrimLevelCard";
import EmptyTrimLevelState from "./EmptyTrimLevelState";

interface TrimLevelGridProps {
  configurations: Configuration[];
  selectedConfig: string | null;
  deletingId: string | null;
  onConfigSelect: (configId: string) => void;
  onEdit: (config: Configuration) => void;
  onClone: (config: Configuration) => void;
  onDelete: (config: Configuration) => void;
  onCopy: (config: Configuration) => void;
  onCreateNew: () => void;
}

const TrimLevelGrid = ({
  configurations,
  selectedConfig,
  deletingId,
  onConfigSelect,
  onEdit,
  onClone,
  onDelete,
  onCopy,
  onCreateNew
}: TrimLevelGridProps) => {
  if (configurations.length === 0) {
    return <EmptyTrimLevelState onCreateNew={onCreateNew} />;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {configurations.map((config) => (
        <div key={config.id} className="group">
          <TrimLevelCard
            config={config}
            isSelected={selectedConfig === config.id}
            isDeleting={deletingId === config.id}
            onClick={() => onConfigSelect(config.id)}
            onEdit={onEdit}
            onClone={onClone}
            onDelete={onDelete}
            onCopy={onCopy}
          />
        </div>
      ))}
    </div>
  );
};

export default TrimLevelGrid;
