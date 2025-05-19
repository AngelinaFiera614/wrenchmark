
import { MotorcycleModel, ModelYear, Configuration } from '@/types/motorcycle';
import ModelCard from './ModelCard';
import { SelectedState } from './hooks/useModelComparison';

interface ModelsGridProps {
  models: MotorcycleModel[];
  selectedState: SelectedState;
  onRemoveModel: (slug: string) => void;
  onYearChange: (modelId: string, yearId: string) => void;
  onConfigChange: (modelId: string, configId: string) => void;
  getSelectedYear: (model: MotorcycleModel) => ModelYear | undefined;
  getSelectedConfig: (model: MotorcycleModel) => Configuration | undefined;
}

export default function ModelsGrid({
  models,
  selectedState,
  onRemoveModel,
  onYearChange,
  onConfigChange,
  getSelectedYear,
  getSelectedConfig
}: ModelsGridProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {models.map(model => (
        <ModelCard
          key={model.id}
          model={model}
          selectedYearId={selectedState[model.id]?.yearId}
          selectedConfigId={selectedState[model.id]?.configId}
          onRemove={onRemoveModel}
          onYearChange={onYearChange}
          onConfigChange={onConfigChange}
          getSelectedYear={getSelectedYear}
          getSelectedConfig={getSelectedConfig}
        />
      ))}
    </div>
  );
}
