
import { supabase } from "@/integrations/supabase/client";
import { 
  EngineOption, 
  SuspensionOption, 
  BrakeOption, 
  FrameOption, 
  WheelOption 
} from "@/types/components";

// Fetch engines 
export const fetchEngines = async (): Promise<EngineOption[]> => {
  try {
    const { data, error } = await supabase
      .from('engines')
      .select('*')
      .order('name');
      
    if (error) {
      console.error("Error fetching engines:", error);
      return [];
    }
    
    return data.map(engine => ({
      id: engine.id,
      name: engine.name,
      displacement_cc: engine.displacement_cc,
      power_hp: engine.power_hp,
      torque_nm: engine.torque_nm,
      engine_type: engine.engine_type
    }));
  } catch (error) {
    console.error("Error in fetchEngines:", error);
    return [];
  }
};

// Fetch suspensions
export const fetchSuspensions = async (): Promise<SuspensionOption[]> => {
  try {
    const { data, error } = await supabase
      .from('suspensions')
      .select('*')
      .order('front_type');
      
    if (error) {
      console.error("Error fetching suspensions:", error);
      return [];
    }
    
    return data.map(suspension => ({
      id: suspension.id,
      name: suspension.front_type || 'Unnamed Suspension',
      front_type: suspension.front_type,
      rear_type: suspension.rear_type,
      brand: suspension.brand
    }));
  } catch (error) {
    console.error("Error in fetchSuspensions:", error);
    return [];
  }
};

// Fetch brake systems
export const fetchBrakeSystems = async (): Promise<BrakeOption[]> => {
  try {
    const { data, error } = await supabase
      .from('brake_systems')
      .select('*')
      .order('type');
      
    if (error) {
      console.error("Error fetching brake systems:", error);
      return [];
    }
    
    return data.map(brake => ({
      id: brake.id,
      name: brake.type || 'Unnamed Brake System',
      type: brake.type,
      has_traction_control: brake.has_traction_control,
      brake_type_front: brake.brake_type_front,
      brake_type_rear: brake.brake_type_rear
    }));
  } catch (error) {
    console.error("Error in fetchBrakeSystems:", error);
    return [];
  }
};

// Fetch frames
export const fetchFrames = async (): Promise<FrameOption[]> => {
  try {
    const { data, error } = await supabase
      .from('frames')
      .select('*')
      .order('type');
      
    if (error) {
      console.error("Error fetching frames:", error);
      return [];
    }
    
    return data.map(frame => ({
      id: frame.id,
      name: frame.type || 'Unnamed Frame',
      type: frame.type,
      material: frame.material
    }));
  } catch (error) {
    console.error("Error in fetchFrames:", error);
    return [];
  }
};

// Fetch wheels
export const fetchWheels = async (): Promise<WheelOption[]> => {
  try {
    const { data, error } = await supabase
      .from('wheels')
      .select('*')
      .order('type');
      
    if (error) {
      console.error("Error fetching wheels:", error);
      return [];
    }
    
    return data.map(wheel => ({
      id: wheel.id,
      name: wheel.type || `${wheel.front_size}/${wheel.rear_size}` || 'Unnamed Wheels',
      type: wheel.type,
      front_size: wheel.front_size,
      rear_size: wheel.rear_size
    }));
  } catch (error) {
    console.error("Error in fetchWheels:", error);
    return [];
  }
};

// Create a new engine
export const createEngine = async (engineData: Omit<EngineOption, 'id'>): Promise<EngineOption | null> => {
  try {
    const { data, error } = await supabase
      .from('engines')
      .insert({
        name: engineData.name,
        displacement_cc: engineData.displacement_cc,
        power_hp: engineData.power_hp,
        torque_nm: engineData.torque_nm,
        engine_type: engineData.engine_type
      })
      .select()
      .single();
      
    if (error) {
      console.error("Error creating engine:", error);
      return null;
    }
    
    return {
      id: data.id,
      name: data.name,
      displacement_cc: data.displacement_cc,
      power_hp: data.power_hp,
      torque_nm: data.torque_nm,
      engine_type: data.engine_type
    };
  } catch (error) {
    console.error("Error in createEngine:", error);
    return null;
  }
};

// Similar functions for creating other components
export const createBrakeSystem = async (brakeData: Omit<BrakeOption, 'id'>): Promise<BrakeOption | null> => {
  try {
    const { data, error } = await supabase
      .from('brake_systems')
      .insert({
        type: brakeData.type,
        has_traction_control: brakeData.has_traction_control,
        brake_type_front: brakeData.brake_type_front,
        brake_type_rear: brakeData.brake_type_rear
      })
      .select()
      .single();
      
    if (error) {
      console.error("Error creating brake system:", error);
      return null;
    }
    
    return {
      id: data.id,
      name: data.type,
      type: data.type,
      has_traction_control: data.has_traction_control,
      brake_type_front: data.brake_type_front,
      brake_type_rear: data.brake_type_rear
    };
  } catch (error) {
    console.error("Error in createBrakeSystem:", error);
    return null;
  }
};

export const createFrame = async (frameData: Omit<FrameOption, 'id'>): Promise<FrameOption | null> => {
  try {
    const { data, error } = await supabase
      .from('frames')
      .insert({
        type: frameData.type,
        material: frameData.material
      })
      .select()
      .single();
      
    if (error) {
      console.error("Error creating frame:", error);
      return null;
    }
    
    return {
      id: data.id,
      name: data.type,
      type: data.type,
      material: data.material
    };
  } catch (error) {
    console.error("Error in createFrame:", error);
    return null;
  }
};

export const createSuspension = async (suspensionData: Omit<SuspensionOption, 'id'>): Promise<SuspensionOption | null> => {
  try {
    const { data, error } = await supabase
      .from('suspensions')
      .insert({
        front_type: suspensionData.front_type,
        rear_type: suspensionData.rear_type,
        brand: suspensionData.brand
      })
      .select()
      .single();
      
    if (error) {
      console.error("Error creating suspension:", error);
      return null;
    }
    
    return {
      id: data.id,
      name: suspensionData.front_type || 'Unnamed Suspension',
      front_type: data.front_type,
      rear_type: data.rear_type,
      brand: data.brand
    };
  } catch (error) {
    console.error("Error in createSuspension:", error);
    return null;
  }
};

export const createWheels = async (wheelData: Omit<WheelOption, 'id'>): Promise<WheelOption | null> => {
  try {
    const { data, error } = await supabase
      .from('wheels')
      .insert({
        type: wheelData.type,
        front_size: wheelData.front_size,
        rear_size: wheelData.rear_size
      })
      .select()
      .single();
      
    if (error) {
      console.error("Error creating wheels:", error);
      return null;
    }
    
    return {
      id: data.id,
      name: wheelData.type || `${wheelData.front_size}/${wheelData.rear_size}` || 'Unnamed Wheels',
      type: data.type,
      front_size: data.front_size,
      rear_size: data.rear_size
    };
  } catch (error) {
    console.error("Error in createWheels:", error);
    return null;
  }
};
