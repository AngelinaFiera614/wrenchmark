
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
  onCreateNew
}: TrimLevelGridProps) => {
  if (configurations.length === 0) {
    return (
      <CardContent>
        <EmptyTrimLevelState onCreateNew={onCreateNew} />
      </CardContent>
    );
  }

  return (
    <CardContent>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {configurations.map((config) => (
          <TrimLevelCard
            key={config.id}
            config={config}
            isSelected={selectedConfig === config.id}
            isDeleting={deletingId === config.id}
            onSelect={() => onConfigSelect(config.id)}
            onEdit={() => onEdit(config)}
            onClone={() => onClone(config)}
            onDelete={() => onDelete(config)}
          />
        ))}
      </div>
    </CardContent>
  );
};

export default TrimLevelGrid;
