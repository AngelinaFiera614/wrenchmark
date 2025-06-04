
import { MotorcycleModel, ModelYear, Configuration } from "@/types/motorcycle";

export interface AdminPartsSelectionState {
  selectedModel: string | null;
  selectedYear: string | null;
  selectedConfig: string | null;
}

export interface AdminPartsUIState {
  activeTab: string;
  showPreview: boolean;
}

export interface AdminPartsData {
  models: MotorcycleModel[];
  modelYears: ModelYear[];
  configurations: Configuration[];
  selectedModelData?: MotorcycleModel;
  selectedYearData?: ModelYear;
  selectedConfigData?: Configuration;
}

export interface AdminPartsLoadingStates {
  modelsLoading: boolean;
  yearsLoading: boolean;
  configsLoading: boolean;
}

export interface AdminPartsErrorStates {
  modelsError: Error | null;
  yearsError: Error | null;
  configsError: Error | null;
}

export interface AdminPartsActions {
  handleModelSelect: (modelId: string) => void;
  handleYearSelect: (yearId: string) => void;
  handleConfigSelect: (configId: string) => void;
  handlePreviewConfig: (configId: string) => void;
  handleComponentLinked: () => void;
  refreshConfigurations: (yearIds?: string[]) => Promise<void>;
  fetchConfigurationsForYears: (yearIds: string[]) => Promise<Configuration[]>;
  setActiveTab: (tab: string) => void;
  setShowPreview: (show: boolean) => void;
}
