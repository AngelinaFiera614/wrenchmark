
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowRight, X } from 'lucide-react';
import ComponentDetailCard from './ComponentDetailCard';

interface ComponentComparisonViewProps {
  type: 'engine' | 'brake' | 'frame' | 'suspension' | 'wheel';
  components: any[];
  onClose: () => void;
}

export default function ComponentComparisonView({
  type,
  components,
  onClose
}: ComponentComparisonViewProps) {
  const [selectedComponents, setSelectedComponents] = useState<any[]>(
    components.slice(0, 2)
  );

  const addComponent = (component: any) => {
    if (selectedComponents.length < 3 && !selectedComponents.find(c => c.id === component.id)) {
      setSelectedComponents([...selectedComponents, component]);
    }
  };

  const removeComponent = (componentId: string) => {
    setSelectedComponents(selectedComponents.filter(c => c.id !== componentId));
  };

  const getTitle = () => {
    const typeNames = {
      engine: 'Engine',
      brake: 'Brake System',
      frame: 'Frame',
      suspension: 'Suspension',
      wheel: 'Wheel'
    };
    return `${typeNames[type]} Comparison`;
  };

  return (
    <div className="fixed inset-0 bg-explorer-dark/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-6xl max-h-[90vh] overflow-y-auto bg-explorer-card border-explorer-chrome/30">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-explorer-text">{getTitle()}</CardTitle>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="text-explorer-text-muted hover:text-explorer-text"
          >
            <X className="h-4 w-4" />
          </Button>
        </CardHeader>
        
        <CardContent>
          {/* Selected Components for Comparison */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
            {selectedComponents.map((component, index) => (
              <div key={component.id} className="relative">
                <ComponentDetailCard
                  type={type}
                  title={component.name || component.type || `${type} ${index + 1}`}
                  data={component}
                />
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => removeComponent(component.id)}
                  className="absolute top-2 right-2 text-explorer-text-muted hover:text-red-400"
                >
                  <X className="h-3 w-3" />
                </Button>
              </div>
            ))}
          </div>

          {/* Available Components */}
          {selectedComponents.length < 3 && (
            <div>
              <h3 className="text-lg font-medium text-explorer-text mb-3">
                Add More Components
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {components
                  .filter(c => !selectedComponents.find(sc => sc.id === c.id))
                  .map((component) => (
                    <Card
                      key={component.id}
                      className="bg-explorer-dark-light border-explorer-chrome/20 hover:border-explorer-teal/50 cursor-pointer transition-colors"
                      onClick={() => addComponent(component)}
                    >
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <span className="font-medium text-explorer-text">
                            {component.name || component.type || `${type}`}
                          </span>
                          <ArrowRight className="h-4 w-4 text-explorer-teal" />
                        </div>
                        {component.displacement_cc && (
                          <Badge variant="outline" className="mt-2">
                            {component.displacement_cc}cc
                          </Badge>
                        )}
                        {component.power_hp && (
                          <Badge variant="outline" className="mt-2 ml-2">
                            {component.power_hp}hp
                          </Badge>
                        )}
                      </CardContent>
                    </Card>
                  ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
