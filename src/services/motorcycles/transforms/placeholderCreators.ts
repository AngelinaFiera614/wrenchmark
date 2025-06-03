
export const createPlaceholderMotorcycleData = (input: {
  make: string;
  model: string;
  year: number;
  isDraft?: boolean;
}) => {
  const slug = `${input.make}-${input.model}-${input.year}`.toLowerCase().replace(/\s+/g, '-');
  
  return {
    name: input.model,
    type: 'Standard',
    base_description: `${input.year} ${input.make} ${input.model}`,
    production_start_year: input.year,
    production_status: 'active',
    default_image_url: '/placeholder.svg',
    slug: slug,
    is_draft: input.isDraft || false,
    // Basic technical data with realistic defaults
    engine_size: 600,
    horsepower: 50,
    torque_nm: 45,
    weight_kg: 180,
    seat_height_mm: 800,
    wheelbase_mm: 1400,
    ground_clearance_mm: 150,
    fuel_capacity_l: 15,
    top_speed_kph: 180,
    has_abs: true,
    difficulty_level: 3,
    category: 'Standard',
    summary: `The ${input.year} ${input.make} ${input.model} is a versatile motorcycle suitable for various riding conditions.`,
    status: 'active',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };
};

export const createDraftMotorcycleData = (input: {
  make: string;
  model: string;
  year: number;
}) => {
  return createPlaceholderMotorcycleData({
    ...input,
    isDraft: true,
  });
};
