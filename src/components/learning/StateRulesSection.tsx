
import React from 'react';
import { StateRule } from '@/types/state';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MapPin } from 'lucide-react';

interface StateRulesSectionProps {
  stateRules: StateRule[];
}

const StateRulesSection: React.FC<StateRulesSectionProps> = ({ stateRules }) => {
  if (!stateRules || stateRules.length === 0) return null;

  return (
    <div className="mt-8">
      <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
        <MapPin className="h-5 w-5 text-accent-teal" />
        State-Specific Requirements
      </h2>
      
      <div className="space-y-4">
        {stateRules.map(rule => (
          <Card key={rule.state_code} className="bg-muted/30 border">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">{rule.state_name}</CardTitle>
            </CardHeader>
            <CardContent>
              <dl className="space-y-2">
                {rule.helmet_required !== undefined && (
                  <div className="grid grid-cols-2 gap-2">
                    <dt className="font-medium">Helmet Required:</dt>
                    <dd>{rule.helmet_required ? 'Yes' : 'No'}</dd>
                  </div>
                )}
                {rule.permit_age_min !== null && (
                  <div className="grid grid-cols-2 gap-2">
                    <dt className="font-medium">Minimum Permit Age:</dt>
                    <dd>{rule.permit_age_min} years</dd>
                  </div>
                )}
                {rule.road_test_required !== undefined && (
                  <div className="grid grid-cols-2 gap-2">
                    <dt className="font-medium">Road Test Required:</dt>
                    <dd>{rule.road_test_required ? 'Yes' : 'No'}</dd>
                  </div>
                )}
                {rule.special_rules && (
                  <div className="mt-2">
                    <dt className="font-medium">Special Rules:</dt>
                    <dd className="mt-1 text-sm">{rule.special_rules}</dd>
                  </div>
                )}
              </dl>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default StateRulesSection;
