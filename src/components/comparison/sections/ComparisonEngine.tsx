
import { MotorcycleModel } from '@/types/motorcycle';
import ComparisonSectionHeader from '../ComparisonSectionHeader';

interface ComparisonEngineProps {
  models: MotorcycleModel[];
  getSelectedYear: (model: MotorcycleModel) => any;
  getSelectedConfig: (model: MotorcycleModel) => any;
}

export default function ComparisonEngine({
  models,
  getSelectedYear,
  getSelectedConfig
}: ComparisonEngineProps) {
  return (
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
  );
}
