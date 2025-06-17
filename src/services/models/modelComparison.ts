
import { MotorcycleModel } from "@/types";
import { fetchMotorcycleModels } from "./modelQueries";

export const getModelsForComparison = async (): Promise<MotorcycleModel[]> => {
  return fetchMotorcycleModels();
};

export const fetchModelsForComparison = getModelsForComparison;

export const compareModels = (models: MotorcycleModel[]) => {
  // Basic comparison logic
  return models.map(model => ({
    ...model,
    comparisonData: {
      performance: {
        engine_size: model.engine_size || 0,
        horsepower: model.horsepower || 0,
        torque_nm: model.torque_nm || 0,
        top_speed_kph: model.top_speed_kph || 0
      },
      dimensions: {
        weight_kg: model.weight_kg || 0,
        seat_height_mm: model.seat_height_mm || 0,
        wheelbase_mm: model.wheelbase_mm || 0,
        ground_clearance_mm: model.ground_clearance_mm || 0,
        fuel_capacity_l: model.fuel_capacity_l || 0
      },
      features: {
        has_abs: model.has_abs || false,
        difficulty_level: model.difficulty_level || 1
      }
    }
  }));
};
