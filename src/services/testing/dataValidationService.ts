
import { supabase } from '@/integrations/supabase/client';
import { Motorcycle } from '@/types';

export interface ValidationIssue {
  id: string;
  table: string;
  issue: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  details?: any;
}

export interface ValidationReport {
  totalIssues: number;
  criticalIssues: number;
  highIssues: number;
  mediumIssues: number;
  lowIssues: number;
  issues: ValidationIssue[];
}

export async function runComprehensiveDataValidation(): Promise<ValidationReport> {
  const issues: ValidationIssue[] = [];

  try {
    // Check for orphaned records
    const orphanedIssues = await checkOrphanedRecords();
    issues.push(...orphanedIssues);

    // Check for missing required fields
    const missingFieldIssues = await checkMissingRequiredFields();
    issues.push(...missingFieldIssues);

    // Check for data consistency
    const consistencyIssues = await checkDataConsistency();
    issues.push(...consistencyIssues);

    // Check for duplicate records
    const duplicateIssues = await checkDuplicateRecords();
    issues.push(...duplicateIssues);

    // Check foreign key integrity
    const fkIssues = await checkForeignKeyIntegrity();
    issues.push(...fkIssues);

  } catch (error) {
    console.error('Error during data validation:', error);
    issues.push({
      id: 'validation-error',
      table: 'system',
      issue: `Validation process failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
      severity: 'critical'
    });
  }

  return {
    totalIssues: issues.length,
    criticalIssues: issues.filter(i => i.severity === 'critical').length,
    highIssues: issues.filter(i => i.severity === 'high').length,
    mediumIssues: issues.filter(i => i.severity === 'medium').length,
    lowIssues: issues.filter(i => i.severity === 'low').length,
    issues
  };
}

async function checkOrphanedRecords(): Promise<ValidationIssue[]> {
  const issues: ValidationIssue[] = [];

  try {
    // Check for model_years without motorcycles
    const { data: orphanedYears } = await supabase
      .from('model_years')
      .select('id, year, motorcycle_id')
      .is('motorcycle_id', null);

    orphanedYears?.forEach(year => {
      issues.push({
        id: `orphaned-year-${year.id}`,
        table: 'model_years',
        issue: `Model year ${year.year} has no associated motorcycle`,
        severity: 'high',
        details: { yearId: year.id, year: year.year }
      });
    });

    // Check for configurations without model years
    const { data: orphanedConfigs } = await supabase
      .from('model_configurations')
      .select(`
        id, 
        name, 
        model_year_id,
        model_years!inner(id)
      `)
      .is('model_years.id', null);

    orphanedConfigs?.forEach(config => {
      issues.push({
        id: `orphaned-config-${config.id}`,
        table: 'model_configurations',
        issue: `Configuration "${config.name}" has no valid model year`,
        severity: 'high',
        details: { configId: config.id, name: config.name }
      });
    });

  } catch (error) {
    console.error('Error checking orphaned records:', error);
    issues.push({
      id: 'orphaned-check-error',
      table: 'system',
      issue: 'Failed to check for orphaned records',
      severity: 'medium'
    });
  }

  return issues;
}

async function checkMissingRequiredFields(): Promise<ValidationIssue[]> {
  const issues: ValidationIssue[] = [];

  try {
    // Check motorcycles with missing required fields
    const { data: motorcycles } = await supabase
      .from('motorcycle_models')
      .select('id, name, brand_id, type, is_draft');

    motorcycles?.forEach(motorcycle => {
      if (!motorcycle.name || motorcycle.name.trim() === '') {
        issues.push({
          id: `missing-name-${motorcycle.id}`,
          table: 'motorcycle_models',
          issue: 'Motorcycle missing name',
          severity: 'critical',
          details: { motorcycleId: motorcycle.id }
        });
      }

      if (!motorcycle.brand_id) {
        issues.push({
          id: `missing-brand-${motorcycle.id}`,
          table: 'motorcycle_models',
          issue: 'Motorcycle missing brand association',
          severity: 'high',
          details: { motorcycleId: motorcycle.id, name: motorcycle.name }
        });
      }

      if (!motorcycle.type || motorcycle.type.trim() === '') {
        issues.push({
          id: `missing-type-${motorcycle.id}`,
          table: 'motorcycle_models',
          issue: 'Motorcycle missing type classification',
          severity: 'medium',
          details: { motorcycleId: motorcycle.id, name: motorcycle.name }
        });
      }

      // For published motorcycles, enforce stricter requirements
      if (!motorcycle.is_draft) {
        if (!motorcycle.type) {
          issues.push({
            id: `published-missing-type-${motorcycle.id}`,
            table: 'motorcycle_models',
            issue: 'Published motorcycle missing type',
            severity: 'high',
            details: { motorcycleId: motorcycle.id, name: motorcycle.name }
          });
        }
      }
    });

    // Check brands with missing required fields
    const { data: brands } = await supabase
      .from('brands')
      .select('id, name, slug');

    brands?.forEach(brand => {
      if (!brand.name || brand.name.trim() === '') {
        issues.push({
          id: `missing-brand-name-${brand.id}`,
          table: 'brands',
          issue: 'Brand missing name',
          severity: 'critical',
          details: { brandId: brand.id }
        });
      }

      if (!brand.slug || brand.slug.trim() === '') {
        issues.push({
          id: `missing-brand-slug-${brand.id}`,
          table: 'brands',
          issue: 'Brand missing slug',
          severity: 'high',
          details: { brandId: brand.id, name: brand.name }
        });
      }
    });

  } catch (error) {
    console.error('Error checking missing required fields:', error);
    issues.push({
      id: 'missing-fields-check-error',
      table: 'system',
      issue: 'Failed to check for missing required fields',
      severity: 'medium'
    });
  }

  return issues;
}

async function checkDataConsistency(): Promise<ValidationIssue[]> {
  const issues: ValidationIssue[] = [];

  try {
    // Check for invalid years
    const { data: invalidYears } = await supabase
      .from('model_years')
      .select('id, year, motorcycle_id')
      .or('year.lt.1900,year.gt.2030');

    invalidYears?.forEach(year => {
      issues.push({
        id: `invalid-year-${year.id}`,
        table: 'model_years',
        issue: `Invalid year: ${year.year}`,
        severity: 'medium',
        details: { yearId: year.id, year: year.year }
      });
    });

    // Check for negative engine sizes
    const { data: invalidEngines } = await supabase
      .from('motorcycle_models')
      .select('id, name, engine_size')
      .lt('engine_size', 0);

    invalidEngines?.forEach(motorcycle => {
      issues.push({
        id: `negative-engine-${motorcycle.id}`,
        table: 'motorcycle_models',
        issue: `Negative engine size: ${motorcycle.engine_size}`,
        severity: 'high',
        details: { motorcycleId: motorcycle.id, name: motorcycle.name, engineSize: motorcycle.engine_size }
      });
    });

    // Check for invalid weight values
    const { data: invalidWeights } = await supabase
      .from('motorcycle_models')
      .select('id, name, weight_kg')
      .or('weight_kg.lt.50,weight_kg.gt.1000');

    invalidWeights?.forEach(motorcycle => {
      if (motorcycle.weight_kg !== null) {
        issues.push({
          id: `invalid-weight-${motorcycle.id}`,
          table: 'motorcycle_models',
          issue: `Unrealistic weight: ${motorcycle.weight_kg}kg`,
          severity: 'medium',
          details: { motorcycleId: motorcycle.id, name: motorcycle.name, weight: motorcycle.weight_kg }
        });
      }
    });

  } catch (error) {
    console.error('Error checking data consistency:', error);
    issues.push({
      id: 'consistency-check-error',
      table: 'system',
      issue: 'Failed to check data consistency',
      severity: 'medium'
    });
  }

  return issues;
}

async function checkDuplicateRecords(): Promise<ValidationIssue[]> {
  const issues: ValidationIssue[] = [];

  try {
    // Check for duplicate motorcycle names within same brand
    const { data: duplicateMotorcycles } = await supabase
      .from('motorcycle_models')
      .select('name, brand_id, count(*)')
      .group('name, brand_id')
      .having('count(*)', 'gt', 1);

    duplicateMotorcycles?.forEach(duplicate => {
      issues.push({
        id: `duplicate-motorcycle-${duplicate.name}-${duplicate.brand_id}`,
        table: 'motorcycle_models',
        issue: `Duplicate motorcycle name: "${duplicate.name}" appears ${duplicate.count} times for same brand`,
        severity: 'medium',
        details: { name: duplicate.name, brandId: duplicate.brand_id, count: duplicate.count }
      });
    });

    // Check for duplicate brand names
    const { data: duplicateBrands } = await supabase
      .from('brands')
      .select('name, count(*)')
      .group('name')
      .having('count(*)', 'gt', 1);

    duplicateBrands?.forEach(duplicate => {
      issues.push({
        id: `duplicate-brand-${duplicate.name}`,
        table: 'brands',
        issue: `Duplicate brand name: "${duplicate.name}" appears ${duplicate.count} times`,
        severity: 'high',
        details: { name: duplicate.name, count: duplicate.count }
      });
    });

    // Check for duplicate slugs
    const { data: duplicateSlugs } = await supabase
      .from('motorcycle_models')
      .select('slug, count(*)')
      .group('slug')
      .having('count(*)', 'gt', 1);

    duplicateSlugs?.forEach(duplicate => {
      issues.push({
        id: `duplicate-slug-${duplicate.slug}`,
        table: 'motorcycle_models',
        issue: `Duplicate slug: "${duplicate.slug}" appears ${duplicate.count} times`,
        severity: 'critical',
        details: { slug: duplicate.slug, count: duplicate.count }
      });
    });

  } catch (error) {
    console.error('Error checking duplicate records:', error);
    issues.push({
      id: 'duplicate-check-error',
      table: 'system',
      issue: 'Failed to check for duplicate records',
      severity: 'medium'
    });
  }

  return issues;
}

async function checkForeignKeyIntegrity(): Promise<ValidationIssue[]> {
  const issues: ValidationIssue[] = [];

  try {
    // Check motorcycles with invalid brand_id
    const { data: invalidBrandRefs } = await supabase
      .from('motorcycle_models')
      .select(`
        id, 
        name, 
        brand_id,
        brands!motorcycle_models_brand_id_fkey(id)
      `)
      .is('brands.id', null)
      .not('brand_id', 'is', null);

    invalidBrandRefs?.forEach(motorcycle => {
      issues.push({
        id: `invalid-brand-ref-${motorcycle.id}`,
        table: 'motorcycle_models',
        issue: `Motorcycle "${motorcycle.name}" references non-existent brand`,
        severity: 'critical',
        details: { motorcycleId: motorcycle.id, name: motorcycle.name, brandId: motorcycle.brand_id }
      });
    });

    // Check model_years with invalid motorcycle_id
    const { data: invalidMotorcycleRefs } = await supabase
      .from('model_years')
      .select(`
        id, 
        year, 
        motorcycle_id,
        motorcycle_models!model_years_motorcycle_id_fkey(id)
      `)
      .is('motorcycle_models.id', null)
      .not('motorcycle_id', 'is', null);

    invalidMotorcycleRefs?.forEach(year => {
      issues.push({
        id: `invalid-motorcycle-ref-${year.id}`,
        table: 'model_years',
        issue: `Model year ${year.year} references non-existent motorcycle`,
        severity: 'critical',
        details: { yearId: year.id, year: year.year, motorcycleId: year.motorcycle_id }
      });
    });

  } catch (error) {
    console.error('Error checking foreign key integrity:', error);
    issues.push({
      id: 'fk-check-error',
      table: 'system',
      issue: 'Failed to check foreign key integrity',
      severity: 'medium'
    });
  }

  return issues;
}

export async function generateDataReport(): Promise<{
  motorcycles: number;
  brands: number;
  years: number;
  configurations: number;
  orphanedRecords: number;
  incompleteRecords: number;
}> {
  try {
    const [
      motorcyclesResult,
      brandsResult,
      yearsResult,
      configurationsResult
    ] = await Promise.all([
      supabase.from('motorcycle_models').select('id', { count: 'exact', head: true }),
      supabase.from('brands').select('id', { count: 'exact', head: true }),
      supabase.from('model_years').select('id', { count: 'exact', head: true }),
      supabase.from('model_configurations').select('id', { count: 'exact', head: true })
    ]);

    // Get orphaned records count
    const { data: orphanedYears } = await supabase
      .from('model_years')
      .select('id')
      .is('motorcycle_id', null);

    // Get incomplete records count (motorcycles without required fields)
    const { data: incompleteMotorcycles } = await supabase
      .from('motorcycle_models')
      .select('id')
      .or('name.is.null,brand_id.is.null,type.is.null');

    return {
      motorcycles: motorcyclesResult.count || 0,
      brands: brandsResult.count || 0,
      years: yearsResult.count || 0,
      configurations: configurationsResult.count || 0,
      orphanedRecords: (orphanedYears?.length || 0),
      incompleteRecords: (incompleteMotorcycles?.length || 0)
    };
  } catch (error) {
    console.error('Error generating data report:', error);
    return {
      motorcycles: 0,
      brands: 0,
      years: 0,
      configurations: 0,
      orphanedRecords: 0,
      incompleteRecords: 0
    };
  }
}
