
import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { MotorcycleModel, ModelYear, Configuration } from '@/types/motorcycle';
import { getModelsForComparison } from '@/services/modelService';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { ArrowLeft, XCircle } from 'lucide-react';

type SelectedState = {
  [key: string]: {
    yearId: string;
    configId: string;
  };
};

export function ModelComparison() {
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
  
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-96">
        <div className="h-12 w-12 border-4 border-t-accent-teal border-r-transparent border-b-transparent border-l-transparent rounded-full animate-spin"></div>
      </div>
    );
  }
  
  if (models.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16">
        <h2 className="text-2xl font-semibold mb-4">No models selected for comparison</h2>
        <p className="text-muted-foreground mb-6">
          Please select motorcycles to compare from the motorcycles page.
        </p>
        <Button asChild>
          <a href="/motorcycles">Browse Motorcycles</a>
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <Button variant="ghost" className="pl-0" asChild>
          <a href="/motorcycles">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Motorcycles
          </a>
        </Button>
      </div>
      
      {/* Models Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {models.map(model => (
          <div key={model.id} className="relative border border-border/40 rounded-lg overflow-hidden bg-card">
            <button 
              onClick={() => handleRemoveModel(model.slug)}
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
                  value={selectedState[model.id]?.yearId}
                  onChange={(e) => handleYearChange(model.id, e.target.value)}
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
                    value={selectedState[model.id]?.configId}
                    onChange={(e) => handleConfigChange(model.id, e.target.value)}
                  >
                    {getSelectedYear(model)?.configurations?.map(config => (
                      <option key={config.id} value={config.id}>{config.name}</option>
                    ))}
                  </select>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
      
      {/* Comparison Tabs */}
      <Tabs defaultValue="overview" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-4 w-full max-w-md mx-auto">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="engine">Engine</TabsTrigger>
          <TabsTrigger value="chassis">Chassis</TabsTrigger>
          <TabsTrigger value="features">Features</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="mt-6">
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b border-border/40">
                  <th className="text-left py-3 pl-4 font-semibold text-accent-teal">Specification</th>
                  {models.map(model => (
                    <th key={model.id} className="text-left py-3 px-4 font-semibold">
                      {model.name} {getSelectedYear(model)?.year}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-border/20">
                  <td className="py-3 pl-4 font-medium">Engine</td>
                  {models.map(model => (
                    <td key={model.id} className="py-3 px-4">
                      {getSelectedConfig(model)?.engine?.name || 'N/A'}
                    </td>
                  ))}
                </tr>
                <tr className="border-b border-border/20">
                  <td className="py-3 pl-4 font-medium">Displacement</td>
                  {models.map(model => (
                    <td key={model.id} className="py-3 px-4">
                      {getSelectedConfig(model)?.engine?.displacement_cc 
                        ? `${getSelectedConfig(model)?.engine?.displacement_cc} cc`
                        : 'N/A'}
                    </td>
                  ))}
                </tr>
                <tr className="border-b border-border/20">
                  <td className="py-3 pl-4 font-medium">Power</td>
                  {models.map(model => (
                    <td key={model.id} className="py-3 px-4">
                      {getSelectedConfig(model)?.engine?.power_hp 
                        ? `${getSelectedConfig(model)?.engine?.power_hp} hp`
                        : 'N/A'}
                    </td>
                  ))}
                </tr>
                <tr className="border-b border-border/20">
                  <td className="py-3 pl-4 font-medium">Torque</td>
                  {models.map(model => (
                    <td key={model.id} className="py-3 px-4">
                      {getSelectedConfig(model)?.engine?.torque_nm 
                        ? `${getSelectedConfig(model)?.engine?.torque_nm} Nm`
                        : 'N/A'}
                    </td>
                  ))}
                </tr>
                <tr className="border-b border-border/20">
                  <td className="py-3 pl-4 font-medium">Weight</td>
                  {models.map(model => (
                    <td key={model.id} className="py-3 px-4">
                      {getSelectedConfig(model)?.weight_kg
                        ? `${getSelectedConfig(model)?.weight_kg} kg`
                        : 'N/A'}
                    </td>
                  ))}
                </tr>
                <tr className="border-b border-border/20">
                  <td className="py-3 pl-4 font-medium">Seat Height</td>
                  {models.map(model => (
                    <td key={model.id} className="py-3 px-4">
                      {getSelectedConfig(model)?.seat_height_mm
                        ? `${getSelectedConfig(model)?.seat_height_mm} mm`
                        : 'N/A'}
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>
        </TabsContent>
        
        <TabsContent value="engine" className="mt-6">
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b border-border/40">
                  <th className="text-left py-3 pl-4 font-semibold text-accent-teal">Specification</th>
                  {models.map(model => (
                    <th key={model.id} className="text-left py-3 px-4 font-semibold">
                      {model.name} {getSelectedYear(model)?.year}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-border/20">
                  <td className="py-3 pl-4 font-medium">Engine Type</td>
                  {models.map(model => (
                    <td key={model.id} className="py-3 px-4">
                      {getSelectedConfig(model)?.engine?.engine_type || 'N/A'}
                    </td>
                  ))}
                </tr>
                <tr className="border-b border-border/20">
                  <td className="py-3 pl-4 font-medium">Displacement</td>
                  {models.map(model => (
                    <td key={model.id} className="py-3 px-4">
                      {getSelectedConfig(model)?.engine?.displacement_cc 
                        ? `${getSelectedConfig(model)?.engine?.displacement_cc} cc`
                        : 'N/A'}
                    </td>
                  ))}
                </tr>
                <tr className="border-b border-border/20">
                  <td className="py-3 pl-4 font-medium">Power</td>
                  {models.map(model => (
                    <td key={model.id} className="py-3 px-4">
                      {getSelectedConfig(model)?.engine?.power_hp 
                        ? `${getSelectedConfig(model)?.engine?.power_hp} hp`
                        : 'N/A'}
                    </td>
                  ))}
                </tr>
                <tr className="border-b border-border/20">
                  <td className="py-3 pl-4 font-medium">Torque</td>
                  {models.map(model => (
                    <td key={model.id} className="py-3 px-4">
                      {getSelectedConfig(model)?.engine?.torque_nm 
                        ? `${getSelectedConfig(model)?.engine?.torque_nm} Nm`
                        : 'N/A'}
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>
        </TabsContent>
        
        <TabsContent value="chassis" className="mt-6">
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b border-border/40">
                  <th className="text-left py-3 pl-4 font-semibold text-accent-teal">Specification</th>
                  {models.map(model => (
                    <th key={model.id} className="text-left py-3 px-4 font-semibold">
                      {model.name} {getSelectedYear(model)?.year}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-border/20">
                  <td className="py-3 pl-4 font-medium">Frame Type</td>
                  {models.map(model => (
                    <td key={model.id} className="py-3 px-4">
                      {getSelectedConfig(model)?.frame?.type || 'N/A'}
                    </td>
                  ))}
                </tr>
                <tr className="border-b border-border/20">
                  <td className="py-3 pl-4 font-medium">Frame Material</td>
                  {models.map(model => (
                    <td key={model.id} className="py-3 px-4">
                      {getSelectedConfig(model)?.frame?.material || 'N/A'}
                    </td>
                  ))}
                </tr>
                <tr className="border-b border-border/20">
                  <td className="py-3 pl-4 font-medium">Front Suspension</td>
                  {models.map(model => (
                    <td key={model.id} className="py-3 px-4">
                      {getSelectedConfig(model)?.suspension?.front_type || 'N/A'}
                    </td>
                  ))}
                </tr>
                <tr className="border-b border-border/20">
                  <td className="py-3 pl-4 font-medium">Rear Suspension</td>
                  {models.map(model => (
                    <td key={model.id} className="py-3 px-4">
                      {getSelectedConfig(model)?.suspension?.rear_type || 'N/A'}
                    </td>
                  ))}
                </tr>
                <tr className="border-b border-border/20">
                  <td className="py-3 pl-4 font-medium">Front Brake</td>
                  {models.map(model => (
                    <td key={model.id} className="py-3 px-4">
                      {getSelectedConfig(model)?.brakes?.brake_type_front || 'N/A'}
                    </td>
                  ))}
                </tr>
                <tr className="border-b border-border/20">
                  <td className="py-3 pl-4 font-medium">Rear Brake</td>
                  {models.map(model => (
                    <td key={model.id} className="py-3 px-4">
                      {getSelectedConfig(model)?.brakes?.brake_type_rear || 'N/A'}
                    </td>
                  ))}
                </tr>
                <tr className="border-b border-border/20">
                  <td className="py-3 pl-4 font-medium">ABS</td>
                  {models.map(model => (
                    <td key={model.id} className="py-3 px-4">
                      {getSelectedConfig(model)?.brakes?.has_traction_control ? 'Yes' : 'No'}
                    </td>
                  ))}
                </tr>
                <tr className="border-b border-border/20">
                  <td className="py-3 pl-4 font-medium">Front Wheel</td>
                  {models.map(model => (
                    <td key={model.id} className="py-3 px-4">
                      {getSelectedConfig(model)?.wheels?.front_size || 'N/A'}
                    </td>
                  ))}
                </tr>
                <tr className="border-b border-border/20">
                  <td className="py-3 pl-4 font-medium">Rear Wheel</td>
                  {models.map(model => (
                    <td key={model.id} className="py-3 px-4">
                      {getSelectedConfig(model)?.wheels?.rear_size || 'N/A'}
                    </td>
                  ))}
                </tr>
                <tr className="border-b border-border/20">
                  <td className="py-3 pl-4 font-medium">Wheelbase</td>
                  {models.map(model => (
                    <td key={model.id} className="py-3 px-4">
                      {getSelectedConfig(model)?.wheelbase_mm
                        ? `${getSelectedConfig(model)?.wheelbase_mm} mm`
                        : 'N/A'}
                    </td>
                  ))}
                </tr>
                <tr className="border-b border-border/20">
                  <td className="py-3 pl-4 font-medium">Ground Clearance</td>
                  {models.map(model => (
                    <td key={model.id} className="py-3 px-4">
                      {getSelectedConfig(model)?.ground_clearance_mm
                        ? `${getSelectedConfig(model)?.ground_clearance_mm} mm`
                        : 'N/A'}
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>
        </TabsContent>
        
        <TabsContent value="features" className="mt-6">
          <div className="text-center py-8 text-muted-foreground">
            Feature comparison will be implemented in the next update.
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
