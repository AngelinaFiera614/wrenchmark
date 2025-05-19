
import { useModelComparison } from './hooks/useModelComparison';
import ComparisonHeader from './ComparisonHeader';
import LoadingState from './LoadingState';
import EmptyComparisonState from './EmptyComparisonState';
import ModelsGrid from './ModelsGrid';
import ComparisonTabs from './ComparisonTabs';

export function ModelComparison() {
  const {
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
  } = useModelComparison();
  
  if (isLoading) {
    return <LoadingState />;
  }
  
  if (models.length === 0) {
    return <EmptyComparisonState />;
  }

  return (
    <div className="space-y-8">
      <ComparisonHeader />
      
      {/* Models Grid */}
      <ModelsGrid
        models={models}
        selectedState={selectedState}
        onRemoveModel={handleRemoveModel}
        onYearChange={handleYearChange}
        onConfigChange={handleConfigChange}
        getSelectedYear={getSelectedYear}
        getSelectedConfig={getSelectedConfig}
      />
      
      {/* Comparison Tabs */}
      <ComparisonTabs
        models={models}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        getSelectedYear={getSelectedYear}
        getSelectedConfig={getSelectedConfig}
      />
    </div>
  );
}
