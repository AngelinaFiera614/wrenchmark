
import { MotorcycleModel } from "@/types/motorcycle";
import { fetchModelsForComparison } from "./modelQueries";

export const getModelsForComparison = async (slugs: string[]): Promise<MotorcycleModel[]> => {
  const data = await fetchModelsForComparison(slugs);
  return data as unknown as MotorcycleModel[];
};
