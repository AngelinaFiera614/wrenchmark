
import React from 'react';
import { Link } from 'react-router-dom';

interface StateRule {
  state_code: string;
  state_name: string;
  special_rules?: string;
  helmet_required?: boolean;
  permit_age_min?: number;
}

interface StateRulesSectionProps {
  stateRules: StateRule[];
}

const StateRulesSection: React.FC<StateRulesSectionProps> = ({ stateRules }) => {
  if (!stateRules || stateRules.length === 0) return null;

  return (
    <div className="mt-8 border-t border-border pt-6">
      <h2 className="text-2xl font-bold mb-4">State-Specific Rules</h2>
      
      <div className="space-y-4">
        {stateRules.map((rule) => (
          <div 
            key={rule.state_code} 
            className="bg-card/50 border border-border rounded-lg p-4"
          >
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-lg font-medium">{rule.state_name}</h3>
              <Link 
                to={`/state-laws/${rule.state_code}`}
                className="text-accent-teal text-sm hover:underline"
              >
                View all {rule.state_name} laws
              </Link>
            </div>

            {rule.special_rules && (
              <p className="text-sm text-muted-foreground mb-2">{rule.special_rules}</p>
            )}
            
            <div className="flex flex-wrap gap-2 mt-2">
              {rule.helmet_required !== undefined && (
                <span className={`text-xs px-2 py-1 rounded-full ${
                  rule.helmet_required 
                    ? "bg-accent-teal/20 text-accent-teal" 
                    : "bg-yellow-500/20 text-yellow-500"
                }`}>
                  Helmet: {rule.helmet_required ? "Required" : "Optional"}
                </span>
              )}
              
              {rule.permit_age_min && (
                <span className="text-xs px-2 py-1 rounded-full bg-blue-500/20 text-blue-400">
                  Min. Age: {rule.permit_age_min}
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default StateRulesSection;
