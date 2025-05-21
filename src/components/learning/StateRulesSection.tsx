
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MapPin } from 'lucide-react';

interface StateRulesProps {
  stateRules: any[];
}

const StateRulesSection: React.FC<StateRulesProps> = ({ stateRules }) => {
  if (!stateRules || stateRules.length === 0) {
    return null;
  }

  return (
    <div className="mt-8">
      <Card className="border-accent-teal/30">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg flex items-center gap-1">
            <MapPin className="h-5 w-5 text-accent-teal" />
            State-Specific Information
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {stateRules.map((rule, index) => (
              <div key={index} className="space-y-2">
                <h3 className="font-semibold text-white">{rule.state_name}</h3>
                {rule.special_rules && (
                  <div className="text-sm">
                    <p className="text-muted-foreground whitespace-pre-line">{rule.special_rules}</p>
                  </div>
                )}
                <div className="flex flex-wrap gap-x-6 gap-y-2 mt-2 text-sm">
                  <div>
                    <span className="text-muted-foreground mr-2">Helmet required:</span>
                    <span>{rule.helmet_required ? "Yes" : "No"}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground mr-2">Road test required:</span>
                    <span>{rule.road_test_required ? "Yes" : "No"}</span>
                  </div>
                  {rule.permit_age_min && (
                    <div>
                      <span className="text-muted-foreground mr-2">Minimum permit age:</span>
                      <span>{rule.permit_age_min}</span>
                    </div>
                  )}
                </div>
                {rule.link_to_dmv && (
                  <div className="mt-2">
                    <a 
                      href={rule.link_to_dmv} 
                      target="_blank" 
                      rel="noreferrer" 
                      className="text-sm text-accent-teal hover:underline"
                    >
                      View official DMV information →
                    </a>
                  </div>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default StateRulesSection;
