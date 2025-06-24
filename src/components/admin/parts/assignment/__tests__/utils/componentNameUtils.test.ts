
import { getComponentName, componentTypes } from '../../utils/componentNameUtils';

describe('componentNameUtils', () => {
  describe('getComponentName', () => {
    it('returns engine name with displacement for engines', () => {
      const engineData = [
        { id: 'engine-1', name: 'V-Twin Engine', displacement_cc: 883 }
      ];
      
      const result = getComponentName('engine', 'engine-1', engineData);
      expect(result).toBe('V-Twin Engine');
    });

    it('returns displacement fallback for engines without name', () => {
      const engineData = [
        { id: 'engine-1', displacement_cc: 883 }
      ];
      
      const result = getComponentName('engine', 'engine-1', engineData);
      expect(result).toBe('883cc Engine');
    });

    it('returns brake type for brake systems', () => {
      const brakeData = [
        { id: 'brake-1', type: 'Dual Disc ABS' }
      ];
      
      const result = getComponentName('brake_system', 'brake-1', brakeData);
      expect(result).toBe('Dual Disc ABS');
    });

    it('returns frame type for frames', () => {
      const frameData = [
        { id: 'frame-1', type: 'Tubular Steel' }
      ];
      
      const result = getComponentName('frame', 'frame-1', frameData);
      expect(result).toBe('Tubular Steel');
    });

    it('returns suspension description for suspensions', () => {
      const suspensionData = [
        { id: 'susp-1', front_type: 'Telescopic Fork', rear_type: 'Monoshock' }
      ];
      
      const result = getComponentName('suspension', 'susp-1', suspensionData);
      expect(result).toBe('Telescopic Fork / Monoshock');
    });

    it('returns wheel type for wheels', () => {
      const wheelData = [
        { id: 'wheel-1', type: 'Cast Aluminum' }
      ];
      
      const result = getComponentName('wheel', 'wheel-1', wheelData);
      expect(result).toBe('Cast Aluminum');
    });

    it('returns Unknown Component for missing component', () => {
      const result = getComponentName('engine', 'missing-id', []);
      expect(result).toBe('Unknown Component');
    });

    it('returns Unknown Component for invalid type', () => {
      const result = getComponentName('invalid_type' as any, 'test-id', []);
      expect(result).toBe('Unknown Component');
    });
  });

  describe('componentTypes', () => {
    it('contains all expected component types', () => {
      expect(componentTypes).toHaveLength(5);
      
      const typeKeys = componentTypes.map(t => t.key);
      expect(typeKeys).toContain('engine');
      expect(typeKeys).toContain('brake_system');
      expect(typeKeys).toContain('frame');
      expect(typeKeys).toContain('suspension');
      expect(typeKeys).toContain('wheel');
    });

    it('has proper labels for all types', () => {
      const engineType = componentTypes.find(t => t.key === 'engine');
      expect(engineType?.label).toBe('Engine');

      const brakeType = componentTypes.find(t => t.key === 'brake_system');
      expect(brakeType?.label).toBe('Brake System');
    });
  });
});
