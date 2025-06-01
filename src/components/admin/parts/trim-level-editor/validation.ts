
export const validateTrimLevelForm = (formData: any, modelYearId: string) => {
  if (!formData.name.trim()) {
    throw new Error("Trim level name is required");
  }
  
  if (!modelYearId) {
    throw new Error("Model year ID is missing");
  }

  // Validate numeric fields if they're provided
  const numericFields = [
    { field: 'seat_height_mm', label: 'Seat height' },
    { field: 'weight_kg', label: 'Weight' },
    { field: 'wheelbase_mm', label: 'Wheelbase' },
    { field: 'fuel_capacity_l', label: 'Fuel capacity' },
    { field: 'ground_clearance_mm', label: 'Ground clearance' },
    { field: 'price_premium_usd', label: 'Price premium' }
  ];

  for (const { field, label } of numericFields) {
    const value = formData[field as keyof typeof formData];
    if (value !== '' && value !== null && value !== undefined) {
      const numValue = Number(value);
      if (isNaN(numValue)) {
        throw new Error(`${label} must be a valid number`);
      }
      if (field !== 'price_premium_usd' && numValue <= 0) {
        throw new Error(`${label} must be a positive number`);
      }
      if (field === 'price_premium_usd' && numValue < 0) {
        throw new Error(`${label} cannot be negative`);
      }
    }
  }
};
