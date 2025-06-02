
import { supabase } from "@/integrations/supabase/client";
import { ModelYear } from "@/types/motorcycle";

export interface YearGenerationOptions {
  includeHistorical?: boolean;
  createDefaultTrims?: boolean;
  batchSize?: number;
}

export const generateModelYearsEnhanced = async (
  modelId: string, 
  options: YearGenerationOptions = {}
): Promise<boolean> => {
  const { 
    includeHistorical = true, 
    createDefaultTrims = true,
    batchSize = 10 
  } = options;

  try {
    console.log("Enhanced model year generation for model:", modelId);
    
    // Get the model data with more context
    const { data: model, error: modelError } = await supabase
      .from('motorcycle_models')
      .select(`
        production_start_year, 
        production_end_year, 
        production_status,
        type,
        name,
        brand_id
      `)
      .eq('id', modelId)
      .single();

    if (modelError || !model) {
      console.error("Error fetching model:", modelError);
      return false;
    }

    if (!model.production_start_year) {
      console.error("Model has no production start year");
      return false;
    }

    // Calculate year range with better logic
    const startYear = includeHistorical 
      ? Math.max(model.production_start_year, 2010) // Go back to 2010 for historical data
      : Math.max(model.production_start_year, 2020);
      
    const endYear = model.production_status === 'active' || !model.production_end_year 
      ? new Date().getFullYear() + 1 // Include next year for active models
      : Math.min(model.production_end_year, new Date().getFullYear() + 1);

    console.log("Generating years from", startYear, "to", endYear);

    // Generate years with rich metadata
    const years = [];
    for (let year = startYear; year <= endYear; year++) {
      const isCurrentYear = year === new Date().getFullYear();
      const isNextYear = year === new Date().getFullYear() + 1;
      const isFirstYear = year === model.production_start_year;
      const isLastYear = year === model.production_end_year;
      
      years.push({
        motorcycle_id: modelId,
        year: year,
        is_available: year >= 2023, // Recent years are available
        changes: getYearChanges(year, isFirstYear, isLastYear, isCurrentYear, isNextYear),
        msrp_usd: generateRealisticMSRP(model.type, year, isFirstYear),
        marketing_tagline: generateMarketingTagline(model.name, year, isCurrentYear, isNextYear)
      });
    }

    if (years.length === 0) {
      console.error("No years to generate");
      return false;
    }

    // Insert in batches for better performance
    const batches = [];
    for (let i = 0; i < years.length; i += batchSize) {
      batches.push(years.slice(i, i + batchSize));
    }

    const insertedYears = [];
    for (const batch of batches) {
      const { data: batchResult, error } = await supabase
        .from('model_years')
        .upsert(batch, { 
          onConflict: 'motorcycle_id,year',
          ignoreDuplicates: false 
        })
        .select();

      if (error) {
        console.error("Error inserting batch:", error);
        continue;
      }

      if (batchResult) {
        insertedYears.push(...batchResult);
      }
    }

    console.log("Generated years:", insertedYears.length);

    // Create realistic trim levels for each year
    if (createDefaultTrims && insertedYears.length > 0) {
      await generateRealisticTrims(insertedYears, model);
    }

    return true;
  } catch (error) {
    console.error("Error in generateModelYearsEnhanced:", error);
    return false;
  }
};

const getYearChanges = (
  year: number, 
  isFirst: boolean, 
  isLast: boolean, 
  isCurrent: boolean, 
  isNext: boolean
): string => {
  if (isNext) return 'Upcoming model year';
  if (isCurrent) return 'Current production';
  if (isLast) return 'Final production year';
  if (isFirst) return 'Initial production year';
  
  // Generate realistic changes for mid-production years
  const changes = [
    'Updated graphics and color options',
    'Revised suspension tuning',
    'New instrumentation',
    'Enhanced electronics package',
    'Improved ergonomics',
    'Updated ECU mapping',
    'Refreshed styling',
    'New wheel designs'
  ];
  
  // Some years have more significant changes
  if (year % 3 === 0) {
    return changes[Math.floor(Math.random() * changes.length)];
  }
  
  return 'Minor updates and refinements';
};

const generateRealisticMSRP = (type: string, year: number, isFirstYear: boolean): number => {
  // Base prices by motorcycle type
  const basePrices = {
    'Sport': 12000,
    'Cruiser': 15000,
    'Touring': 20000,
    'Adventure': 16000,
    'Naked': 10000,
    'Standard': 8000,
    'Scooter': 4000,
    'Dual-sport': 9000
  };
  
  const basePrice = basePrices[type as keyof typeof basePrices] || 10000;
  
  // Price increases over time (inflation, features)
  const yearMultiplier = 1 + ((year - 2010) * 0.03);
  
  // First year might have premium pricing
  const firstYearMultiplier = isFirstYear ? 1.1 : 1;
  
  return Math.round(basePrice * yearMultiplier * firstYearMultiplier);
};

const generateMarketingTagline = (
  modelName: string, 
  year: number, 
  isCurrent: boolean, 
  isNext: boolean
): string => {
  if (isNext) return `The Future of ${modelName}`;
  if (isCurrent) return `${year} ${modelName} - Ready to Ride`;
  
  const taglines = [
    `${year} ${modelName} - Built for Excellence`,
    `Experience the ${year} ${modelName}`,
    `${year} ${modelName} - Ride Beyond`,
    `The ${year} ${modelName} Experience`
  ];
  
  return taglines[year % taglines.length];
};

const generateRealisticTrims = async (years: ModelYear[], model: any) => {
  try {
    const configurations = [];
    
    for (const year of years) {
      const trims = getTrimLevelsForModel(model.type, year.year);
      
      for (let i = 0; i < trims.length; i++) {
        const trim = trims[i];
        configurations.push({
          model_year_id: year.id,
          name: trim.name,
          trim_level: trim.level,
          is_default: i === 0, // First trim is default
          price_premium_usd: trim.premium,
          market_region: 'North America',
          special_features: trim.features,
          notes: trim.description
        });
      }
    }

    if (configurations.length > 0) {
      // Insert configurations in batches
      const batchSize = 20;
      for (let i = 0; i < configurations.length; i += batchSize) {
        const batch = configurations.slice(i, i + batchSize);
        await supabase
          .from('model_configurations')
          .upsert(batch, {
            onConflict: 'model_year_id,name',
            ignoreDuplicates: true
          });
      }
    }

    console.log("Generated configurations:", configurations.length);
  } catch (error) {
    console.error("Error generating trims:", error);
  }
};

const getTrimLevelsForModel = (type: string, year: number) => {
  const baseTrimsByType = {
    'Sport': [
      { name: 'Standard', level: 'Base', premium: 0, features: ['Standard suspension', 'Basic electronics'], description: 'Essential sport bike features' },
      { name: 'R', level: 'Performance', premium: 2000, features: ['Sport suspension', 'Quick shifter', 'Track mode'], description: 'Track-focused performance' },
      { name: 'S', level: 'Street', premium: 1000, features: ['Comfort seat', 'Street tires', 'Touring mode'], description: 'Street-optimized setup' }
    ],
    'Cruiser': [
      { name: 'Standard', level: 'Base', premium: 0, features: ['Standard exhaust', 'Basic electronics'], description: 'Classic cruiser styling' },
      { name: 'Touring', level: 'Comfort', premium: 3000, features: ['Windshield', 'Saddlebags', 'Cruise control'], description: 'Long-distance comfort' },
      { name: 'Custom', level: 'Style', premium: 1500, features: ['Custom paint', 'Chrome package', 'Forward controls'], description: 'Enhanced styling package' }
    ],
    'Adventure': [
      { name: 'Standard', level: 'Base', premium: 0, features: ['Standard suspension', 'Basic protection'], description: 'Adventure-ready foundation' },
      { name: 'GS', level: 'Off-road', premium: 2500, features: ['Long travel suspension', 'Bash plate', 'Off-road tires'], description: 'Off-road capability' },
      { name: 'RT', level: 'Touring', premium: 4000, features: ['Premium suspension', 'Navigation', 'Heated grips'], description: 'Premium touring features' }
    ]
  };

  const defaultTrims = [
    { name: 'Standard', level: 'Base', premium: 0, features: ['Standard equipment'], description: 'Base model configuration' },
    { name: 'Premium', level: 'Enhanced', premium: 1500, features: ['Enhanced features'], description: 'Premium feature package' }
  ];

  return baseTrimsByType[type as keyof typeof baseTrimsByType] || defaultTrims;
};
