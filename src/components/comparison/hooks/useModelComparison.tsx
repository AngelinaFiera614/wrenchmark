
import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { MotorcycleModel, ModelYear, Configuration } from '@/types/motorcycle';
import { getModelsForComparison } from '@/services/modelService';
import { toast } from 'sonner';

export type SelectedState = {
  [key: string]: {
    yearId: string;
    configId: string;
  };
};

export function useModelComparison() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [models, setModels] = useState<MotorcycleModel[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedState, setSelectedState] = useState<SelectedState>({});
  
  useEffect(() => {
    const fetchModels = async () => {
      setIsLoading(true);
      
      // Get models from URL params
      const modelSlugs = searchParams.get('models')?.split(',') || [];
      
      if (modelSlugs.length === 0) {
        toast.error('No models selected for comparison');
        setIsLoading(false);
        return;
      }
      
      try {
        const fetchedModels = await getModelsForComparison(modelSlugs);
        
        if (fetchedModels.length === 0) {
          toast.error('Could not find the selected models');
          setIsLoading(false);
          return;
        }
        
        setModels(fetchedModels);
        
        // Initialize selected state with default configurations
        const initialState: SelectedState = {};
        fetchedModels.forEach(model => {
          if (model.years && model.years.length > 0) {
            const latestYear = model.years.reduce((latest, year) => 
              year.year > latest.year ? year : latest, model.years[0]);
              
            const defaultConfig = latestYear.configurations?.find(config => config.is_default) 
              || latestYear.configurations?.[0];
              
            if (defaultConfig) {
              initialState[model.id] = {
                yearId: latestYear.id,
                configId: defaultConfig.id
              };
            }
          }
        });
        
        setSelectedState(initialState);
      } catch (error) {
        console.error('Error fetching models for comparison:', error);
        toast.error('Failed to load comparison data');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchModels();
  }, [searchParams]);
  
  const handleRemoveModel = (modelSlug: string) => {
    const modelSlugs = searchParams.get('models')?.split(',') || [];
    const updatedSlugs = modelSlugs.filter(slug => slug !== modelSlug);
    
    if (updatedSlugs.length === 0) {
      // Redirect to motorcycles page if no models left
      window.location.href = '/motorcycles';
      return;
    }
    
    searchParams.set('models', updatedSlugs.join(','));
    setSearchParams(searchParams);
  };
  
  const handleYearChange = (modelId: string, yearId: string) => {
    setSelectedState(prev => {
      const model = models.find(m => m.id === modelId);
      const year = model?.years?.find(y => y.id === yearId);
      const defaultConfig = year?.configurations?.find(c => c.is_default) || year?.configurations?.[0];
      
      return {
        ...prev,
        [modelId]: {
          yearId: yearId,
          configId: defaultConfig?.id || ''
        }
      };
    });
  };
  
  const handleConfigChange = (modelId: string, configId: string) => {
    setSelectedState(prev => ({
      ...prev,
      [modelId]: {
        ...prev[modelId],
        configId
      }
    }));
  };
  
  const getSelectedYear = (model: MotorcycleModel): ModelYear | undefined => {
    const selection = selectedState[model.id];
    return model.years?.find(y => y.id === selection?.yearId);
  };
  
  const getSelectedConfig = (model: MotorcycleModel): Configuration | undefined => {
    const selection = selectedState[model.id];
    const year = model.years?.find(y => y.id === selection?.yearId);
    return year?.configurations?.find(c => c.id === selection?.configId);
  };

  return {
    models,
    isLoading,
    activeTab,
    setActiveTab,
    selectedState,
    handleRemoveModel,
    handleYearChange,
    handleConfigChange,
    getSelectedYear,
    getSelectedConfig
  };
}
