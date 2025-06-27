
export const getComponentName = (component: any, type: string): string => {
  switch (type) {
    case 'engine':
      return component.name || 'Unknown Engine';
    case 'brake':
      return component.name || component.type || 'Unknown Brake System';
    case 'frame':
      return component.name || component.type || 'Unknown Frame';
    case 'suspension':
      return component.brand || 'Unknown Suspension';
    case 'wheel':
      return component.type || 'Unknown Wheel';
    default:
      return 'Unknown Component';
  }
};
