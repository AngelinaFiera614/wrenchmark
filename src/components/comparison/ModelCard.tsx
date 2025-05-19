
import { MotorcycleModel, ModelYear, Configuration } from '@/types/motorcycle';
import { XCircle } from 'lucide-react';

interface ModelCardProps {
  model: MotorcycleModel;
  selectedYearId: string;
  selectedConfigId: string;
  onRemove: (slug: string) => void;
  onYearChange: (modelId: string, yearId: string) => void;
  onConfigChange: (modelId: string, configId: string) => void;
  getSelectedYear: (model: MotorcycleModel) => ModelYear | undefined;
  getSelectedConfig: (model: MotorcycleModel) => Configuration | undefined;
}

export default function ModelCard({
  model,
  selectedYearId,
  selectedConfigId,
  onRemove,
  onYearChange,
  onConfigChange,
  getSelectedYear,
  getSelectedConfig
}: ModelCardProps) {
  return (
    <div className="relative border border-border/40 rounded-lg overflow-hidden bg-card">
      <button 
        onClick={() => onRemove(model.slug)}
        className="absolute top-2 right-2 z-10 p-1 rounded-full bg-background/70 hover:bg-background"
        aria-label="Remove from comparison"
      >
        <XCircle className="h-5 w-5 text-muted-foreground hover:text-destructive" />
      </button>
      
      <div className="h-40 bg-muted/30 relative">
        {getSelectedConfig(model)?.image_url ? (
          <img 
            src={getSelectedConfig(model)?.image_url} 
            alt={`${model.name}`}
            className="w-full h-full object-cover"
          />
        ) : (
          <img 
            src={model.default_image_url} 
            alt={`${model.name}`}
            className="w-full h-full object-cover"
          />
        )}
      </div>
      
      <div className="p-4">
        <h3 className="text-lg font-semibold mb-1">{model.name}</h3>
        <p className="text-sm text-muted-foreground mb-4">
          {model.brand?.name}
        </p>
        
        {/* Year Selector */}
        <div className="mb-4">
          <label className="text-xs text-muted-foreground block mb-1">Year</label>
          <select 
            className="w-full border border-border rounded-md p-2 bg-background"
            value={selectedYearId}
            onChange={(e) => onYearChange(model.id, e.target.value)}
          >
            {model.years?.map(year => (
              <option key={year.id} value={year.id}>{year.year}</option>
            ))}
          </select>
        </div>
        
        {/* Configuration Selector */}
        {getSelectedYear(model)?.configurations && getSelectedYear(model)?.configurations!.length > 1 && (
          <div className="mb-4">
            <label className="text-xs text-muted-foreground block mb-1">Configuration</label>
            <select 
              className="w-full border border-border rounded-md p-2 bg-background"
              value={selectedConfigId}
              onChange={(e) => onConfigChange(model.id, e.target.value)}
            >
              {getSelectedYear(model)?.configurations?.map(config => (
                <option key={config.id} value={config.id}>{config.name}</option>
              ))}
            </select>
          </div>
        )}
      </div>
    </div>
  );
}
