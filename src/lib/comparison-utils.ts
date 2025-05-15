
export type ValueComparison = {
  value: number | string | boolean;
  isHighest?: boolean;
  isLowest?: boolean;
  isEqual?: boolean;
  isUnique?: boolean;
  isDifferent?: boolean;
};

export function compareNumericValues(motorcycleValues: number[]): ValueComparison[] {
  if (motorcycleValues.length === 0) return [];
  
  const max = Math.max(...motorcycleValues);
  const min = Math.min(...motorcycleValues);
  const allEqual = motorcycleValues.every((v) => v === motorcycleValues[0]);
  
  return motorcycleValues.map(value => ({
    value,
    isHighest: value === max && !allEqual,
    isLowest: value === min && !allEqual, 
    isEqual: allEqual
  }));
}

export function compareBooleanValues(motorcycleValues: boolean[]): ValueComparison[] {
  if (motorcycleValues.length === 0) return [];
  
  const allEqual = motorcycleValues.every((v) => v === motorcycleValues[0]);
  const allTrue = motorcycleValues.every(v => v === true);
  const allFalse = motorcycleValues.every(v => v === false);
  
  return motorcycleValues.map(value => ({
    value,
    isEqual: allEqual,
    isHighest: value === true && !allTrue && !allFalse,
    isLowest: value === false && !allTrue && !allFalse,
  }));
}

export function compareStringValues(motorcycleValues: string[]): ValueComparison[] {
  if (motorcycleValues.length === 0) return [];
  
  const allEqual = motorcycleValues.every((v) => v === motorcycleValues[0]);
  const valueCounts = motorcycleValues.reduce((counts, value) => {
    counts[value] = (counts[value] || 0) + 1;
    return counts;
  }, {} as Record<string, number>);
  
  return motorcycleValues.map(value => ({
    value,
    isEqual: allEqual,
    isUnique: valueCounts[value] === 1,
  }));
}

export function compareArrayValues(motorcycleValues: string[][]): ValueComparison[] {
  if (motorcycleValues.length === 0) return [];
  
  const allEqual = motorcycleValues.every((arr) => {
    if (arr.length !== motorcycleValues[0].length) return false;
    return arr.every((v, i) => v === motorcycleValues[0][i]);
  });
  
  // Find unique items in each array compared to others
  return motorcycleValues.map(array => {
    const joinedArray = array.join(',');
    
    return {
      value: array,
      isEqual: allEqual,
      isUnique: motorcycleValues.filter(a => a.join(',') === joinedArray).length === 1,
    };
  });
}

// Utility function to determine which class to apply based on comparison result
export function getComparisonClass(comparison: ValueComparison): string {
  if (comparison.isEqual) return '';
  if (comparison.isHighest) return 'text-green-400';
  if (comparison.isLowest) return 'text-yellow-400';
  if (comparison.isUnique) return 'text-blue-400';
  return '';
}
