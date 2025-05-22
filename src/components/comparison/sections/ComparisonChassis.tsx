
import { MotorcycleModel } from '@/types/motorcycle';
import ComparisonSectionHeader from '../ComparisonSectionHeader';
import { useMeasurement } from '@/context/MeasurementContext';
import { formatLength, formatWeight } from '@/utils/unitConverters';

interface ComparisonChassisProps {
  models: MotorcycleModel[];
  getSelectedYear: (model: MotorcycleModel) => any;
  getSelectedConfig: (model: MotorcycleModel) => any;
}

export default function ComparisonChassis({
  models,
  getSelectedYear,
  getSelectedConfig
}: ComparisonChassisProps) {
  const { unit } = useMeasurement();
  
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
                {formatLength(getSelectedConfig(model)?.wheelbase_mm, unit)}
              </td>
            ))}
          </tr>
          <tr className="border-b border-border/20">
            <td className="py-3 pl-4 font-medium">Ground Clearance</td>
            {models.map(model => (
              <td key={model.id} className="py-3 px-4">
                {formatLength(getSelectedConfig(model)?.ground_clearance_mm, unit)}
              </td>
            ))}
          </tr>
          <tr className="border-b border-border/20">
            <td className="py-3 pl-4 font-medium">Weight</td>
            {models.map(model => (
              <td key={model.id} className="py-3 px-4">
                {formatWeight(getSelectedConfig(model)?.weight_kg, unit)}
              </td>
            ))}
          </tr>
        </tbody>
      </table>
    </div>
  );
}
