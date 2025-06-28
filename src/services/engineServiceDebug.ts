import { supabase } from "@/integrations/supabase/client";
import { Engine } from "./engineService";

// Enhanced logging utility for engine operations
const logEngineOperation = (operation: string, data: any, result?: any, error?: any) => {
  const timestamp = new Date().toISOString();
  const logEntry = {
    timestamp,
    operation,
    data,
    result,
    error: error ? {
      message: error.message,
      code: error.code,
      details: error.details,
      hint: error.hint
    } : null
  };
  
  console.log(`=== ENGINE ${operation.toUpperCase()} ===`, logEntry);
  
  // Store in localStorage for debugging
  const logs = JSON.parse(localStorage.getItem('engineOperationLogs') || '[]');
  logs.push(logEntry);
  // Keep only last 50 logs
  if (logs.length > 50) logs.shift();
  localStorage.setItem('engineOperationLogs', JSON.stringify(logs));
  
  return logEntry;
};

export const debugUpdateEngine = async (id: string, engineData: Partial<Engine>): Promise<Engine> => {
  logEngineOperation('UPDATE_START', { id, engineData });
  
  try {
    // First, fetch the current engine data
    const { data: currentEngine, error: fetchError } = await supabase
      .from('engines')
      .select('*')
      .eq('id', id)
      .single();
    
    if (fetchError) {
      logEngineOperation('UPDATE_FETCH_ERROR', { id }, null, fetchError);
      throw fetchError;
    }
    
    logEngineOperation('UPDATE_CURRENT_DATA', { currentEngine });
    
    // Validate the update data
    const validationResult = validateEngineData({ ...currentEngine, ...engineData });
    if (!validationResult.isValid) {
      const validationError = new Error(`Validation failed: ${validationResult.errors.join(', ')}`);
      logEngineOperation('UPDATE_VALIDATION_ERROR', { validationResult }, null, validationError);
      throw validationError;
    }
    
    // Perform the update
    const { data, error } = await supabase
      .from('engines')
      .update(engineData)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      logEngineOperation('UPDATE_ERROR', { id, engineData }, null, error);
      throw error;
    }
    
    logEngineOperation('UPDATE_SUCCESS', { id, engineData }, data);
    return data;
  } catch (error) {
    logEngineOperation('UPDATE_EXCEPTION', { id, engineData }, null, error);
    throw error;
  }
};

// Validation function with detailed error reporting
const validateEngineData = (engineData: any): { isValid: boolean; errors: string[] } => {
  const errors: string[] = [];
  
  // Required fields
  if (!engineData.name || engineData.name.trim() === '') {
    errors.push('Name is required');
  }
  
  if (!engineData.displacement_cc || engineData.displacement_cc <= 0) {
    errors.push('Displacement must be a positive number');
  }
  
  // Numeric field validation
  const numericFields = [
    'power_hp', 'torque_nm', 'power_rpm', 'torque_rpm',
    'cylinder_count', 'valve_count', 'bore_mm', 'stroke_mm', 'valves_per_cylinder'
  ];
  
  numericFields.forEach(field => {
    if (engineData[field] !== null && engineData[field] !== undefined) {
      if (isNaN(Number(engineData[field])) || Number(engineData[field]) < 0) {
        errors.push(`${field} must be a valid positive number`);
      }
    }
  });
  
  // Integer field validation
  const integerFields = ['displacement_cc', 'power_rpm', 'torque_rpm', 'cylinder_count', 'valve_count', 'valves_per_cylinder'];
  integerFields.forEach(field => {
    if (engineData[field] !== null && engineData[field] !== undefined) {
      if (!Number.isInteger(Number(engineData[field]))) {
        errors.push(`${field} must be a whole number`);
      }
    }
  });
  
  return {
    isValid: errors.length === 0,
    errors
  };
};

// Function to get engine operation logs
export const getEngineOperationLogs = (): any[] => {
  return JSON.parse(localStorage.getItem('engineOperationLogs') || '[]');
};

// Function to clear engine operation logs
export const clearEngineOperationLogs = (): void => {
  localStorage.removeItem('engineOperationLogs');
};

// Function to check J-Series engine specifically
export const debugJSeriesEngine = async (): Promise<any> => {
  try {
    const { data, error } = await supabase
      .from('engines')
      .select('*')
      .ilike('name', '%j-series%');
    
    if (error) {
      logEngineOperation('J_SERIES_DEBUG_ERROR', {}, null, error);
      return { error };
    }
    
    logEngineOperation('J_SERIES_DEBUG_SUCCESS', {}, data);
    return { data };
  } catch (error) {
    logEngineOperation('J_SERIES_DEBUG_EXCEPTION', {}, null, error);
    return { error };
  }
};
