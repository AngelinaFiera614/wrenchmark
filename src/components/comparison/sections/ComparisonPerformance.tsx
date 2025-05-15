
import { Motorcycle } from "@/types";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { compareNumericValues, getComparisonClass } from "@/lib/comparison-utils";
import ComparisonSectionHeader from "../ComparisonSectionHeader";
import { useMobile } from "@/hooks/use-mobile";

interface ComparisonPerformanceProps {
  motorcycles: Motorcycle[];
}

export default function ComparisonPerformance({ motorcycles }: ComparisonPerformanceProps) {
  const isMobile = useMobile();
  
  // Compare engine sizes
  const engineComparisons = compareNumericValues(motorcycles.map(m => m.engine_cc));
  
  // Compare horsepower
  const horsepowerComparisons = compareNumericValues(motorcycles.map(m => m.horsepower_hp));
  
  // Compare torque
  const torqueComparisons = compareNumericValues(motorcycles.map(m => m.torque_nm));
  
  // Compare top speed
  const speedComparisons = compareNumericValues(motorcycles.map(m => m.top_speed_kph));
  
  // Create mobile cards for each motorcycle
  if (isMobile) {
    return (
      <>
        <ComparisonSectionHeader 
          title="Performance" 
          description="Engine and performance specifications" 
        />
        
        <div className="space-y-6">
          {motorcycles.map((motorcycle, index) => (
            <div key={motorcycle.id} className="bg-card/70 rounded-lg border border-border/50 p-4 backdrop-blur-sm">
              <h3 className="text-lg font-bold mb-4 text-foreground">{motorcycle.make} {motorcycle.model}</h3>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Engine</p>
                  <p className={`font-mono font-medium text-foreground ${getComparisonClass(engineComparisons[index])}`}>
                    {motorcycle.engine_cc} cc
                  </p>
                </div>
                
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Horsepower</p>
                  <p className={`font-mono font-medium text-foreground ${getComparisonClass(horsepowerComparisons[index])}`}>
                    {motorcycle.horsepower_hp} hp
                  </p>
                </div>
                
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Torque</p>
                  <p className={`font-mono font-medium text-foreground ${getComparisonClass(torqueComparisons[index])}`}>
                    {motorcycle.torque_nm} Nm
                  </p>
                </div>
                
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Top Speed</p>
                  <p className={`font-mono font-medium text-foreground ${getComparisonClass(speedComparisons[index])}`}>
                    {motorcycle.top_speed_kph} km/h
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
        title="Performance" 
        description="Engine and performance specifications" 
      />
      
      <Table className="bg-card/50 border border-border/30">
        <TableHeader>
          <TableRow className="border-border/30">
            <TableHead className="w-[180px] text-foreground">Specification</TableHead>
            {motorcycles.map((motorcycle) => (
              <TableHead key={motorcycle.id} className="text-foreground">
                {motorcycle.make} {motorcycle.model}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow className="border-border/30">
            <TableCell className="font-medium text-foreground">Engine Size</TableCell>
            {engineComparisons.map((comparison, i) => (
              <TableCell 
                key={`engine-${motorcycles[i].id}`}
                className={`${getComparisonClass(comparison)} text-foreground font-mono`}
              >
                {comparison.value} cc
              </TableCell>
            ))}
          </TableRow>
          
          <TableRow className="border-border/30">
            <TableCell className="font-medium text-foreground">Horsepower</TableCell>
            {horsepowerComparisons.map((comparison, i) => (
              <TableCell 
                key={`hp-${motorcycles[i].id}`}
                className={`${getComparisonClass(comparison)} text-foreground font-mono`}
              >
                {comparison.value} hp
              </TableCell>
            ))}
          </TableRow>
          
          <TableRow className="border-border/30">
            <TableCell className="font-medium text-foreground">Torque</TableCell>
            {torqueComparisons.map((comparison, i) => (
              <TableCell 
                key={`torque-${motorcycles[i].id}`}
                className={`${getComparisonClass(comparison)} text-foreground font-mono`}
              >
                {comparison.value} Nm
              </TableCell>
            ))}
          </TableRow>
          
          <TableRow className="border-border/30">
            <TableCell className="font-medium text-foreground">Top Speed</TableCell>
            {speedComparisons.map((comparison, i) => (
              <TableCell 
                key={`speed-${motorcycles[i].id}`}
                className={`${getComparisonClass(comparison)} text-foreground font-mono`}
              >
                {comparison.value} km/h
              </TableCell>
            ))}
          </TableRow>
        </TableBody>
      </Table>
    </>
  );
}
