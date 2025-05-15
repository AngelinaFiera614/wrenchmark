
import { Motorcycle } from "@/types";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { compareNumericValues, getComparisonClass } from "@/lib/comparison-utils";
import ComparisonSectionHeader from "../ComparisonSectionHeader";
import { useMobile } from "@/hooks/use-mobile";

interface ComparisonDimensionsProps {
  motorcycles: Motorcycle[];
}

export default function ComparisonDimensions({ motorcycles }: ComparisonDimensionsProps) {
  const isMobile = useMobile();
  
  // Compare weight
  const weightComparisons = compareNumericValues(motorcycles.map(m => m.weight_kg));
  
  // Compare seat height
  const heightComparisons = compareNumericValues(motorcycles.map(m => m.seat_height_mm));
  
  // Compare wheelbase
  const wheelbaseComparisons = compareNumericValues(motorcycles.map(m => m.wheelbase_mm));
  
  // Compare ground clearance
  const clearanceComparisons = compareNumericValues(motorcycles.map(m => m.ground_clearance_mm));
  
  // Compare fuel capacity
  const fuelComparisons = compareNumericValues(motorcycles.map(m => m.fuel_capacity_l));
  
  // Create mobile cards for each motorcycle
  if (isMobile) {
    return (
      <>
        <ComparisonSectionHeader 
          title="Dimensions" 
          description="Physical specifications and measurements" 
        />
        
        <div className="space-y-6">
          {motorcycles.map((motorcycle, index) => (
            <div key={motorcycle.id} className="bg-card rounded-lg border p-4">
              <h3 className="text-lg font-bold mb-4">{motorcycle.make} {motorcycle.model}</h3>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Weight</p>
                  <p className={`font-mono font-medium ${getComparisonClass(weightComparisons[index])}`}>
                    {motorcycle.weight_kg} kg
                  </p>
                </div>
                
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Seat Height</p>
                  <p className={`font-mono font-medium ${getComparisonClass(heightComparisons[index])}`}>
                    {motorcycle.seat_height_mm} mm
                  </p>
                </div>
                
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Wheelbase</p>
                  <p className={`font-mono font-medium ${getComparisonClass(wheelbaseComparisons[index])}`}>
                    {motorcycle.wheelbase_mm} mm
                  </p>
                </div>
                
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Ground Clearance</p>
                  <p className={`font-mono font-medium ${getComparisonClass(clearanceComparisons[index])}`}>
                    {motorcycle.ground_clearance_mm} mm
                  </p>
                </div>
                
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Fuel Capacity</p>
                  <p className={`font-mono font-medium ${getComparisonClass(fuelComparisons[index])}`}>
                    {motorcycle.fuel_capacity_l} L
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </>
    );
  }
  
  // Desktop table view
  return (
    <>
      <ComparisonSectionHeader 
        title="Dimensions" 
        description="Physical specifications and measurements" 
      />
      
      <Table className="bg-card/50">
        <TableHeader>
          <TableRow>
            <TableHead className="w-[180px]">Specification</TableHead>
            {motorcycles.map((motorcycle) => (
              <TableHead key={motorcycle.id}>
                {motorcycle.make} {motorcycle.model}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow>
            <TableCell className="font-medium">Weight</TableCell>
            {weightComparisons.map((comparison, i) => (
              <TableCell 
                key={`weight-${motorcycles[i].id}`}
                className={getComparisonClass(comparison)}
              >
                {comparison.value} kg
              </TableCell>
            ))}
          </TableRow>
          
          <TableRow>
            <TableCell className="font-medium">Seat Height</TableCell>
            {heightComparisons.map((comparison, i) => (
              <TableCell 
                key={`height-${motorcycles[i].id}`}
                className={getComparisonClass(comparison)}
              >
                {comparison.value} mm
              </TableCell>
            ))}
          </TableRow>
          
          <TableRow>
            <TableCell className="font-medium">Wheelbase</TableCell>
            {wheelbaseComparisons.map((comparison, i) => (
              <TableCell 
                key={`wheelbase-${motorcycles[i].id}`}
                className={getComparisonClass(comparison)}
              >
                {comparison.value} mm
              </TableCell>
            ))}
          </TableRow>
          
          <TableRow>
            <TableCell className="font-medium">Ground Clearance</TableCell>
            {clearanceComparisons.map((comparison, i) => (
              <TableCell 
                key={`clearance-${motorcycles[i].id}`}
                className={getComparisonClass(comparison)}
              >
                {comparison.value} mm
              </TableCell>
            ))}
          </TableRow>
          
          <TableRow>
            <TableCell className="font-medium">Fuel Capacity</TableCell>
            {fuelComparisons.map((comparison, i) => (
              <TableCell 
                key={`fuel-${motorcycles[i].id}`}
                className={getComparisonClass(comparison)}
              >
                {comparison.value} L
              </TableCell>
            ))}
          </TableRow>
        </TableBody>
      </Table>
    </>
  );
}
