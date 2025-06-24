
export const getComponentName = (componentType: string, componentId: string, componentData: any[]) => {
  const typeData = componentData;
  if (!typeData) return 'Unknown Component';
  
  const component = typeData.find((c: any) => c.id === componentId);
  if (!component) return 'Unknown Component';
  
  // Handle different component types with safe property access
  switch (componentType) {
    case 'engine':
      return (component as any).name || `${(component as any).displacement_cc || 'Unknown'}cc Engine`;
    case 'brake_system':
      return (component as any).type || 'Brake System';
    case 'frame':
      return (component as any).type || 'Frame';
    case 'suspension':
      return `${(component as any).front_type || 'Unknown'} / ${(component as any).rear_type || 'Unknown'}`;
    case 'wheel':
      return (component as any).type || 'Wheels';
    default:
      return 'Unknown Component';
  }
};

export const componentTypes = [
  { key: 'engine', label: 'Engine' },
  { key: 'brake_system', label: 'Brake System' },
  { key: 'frame', label: 'Frame' },
  { key: 'suspension', label: 'Suspension' },
  { key: 'wheel', label: 'Wheels' }
];
