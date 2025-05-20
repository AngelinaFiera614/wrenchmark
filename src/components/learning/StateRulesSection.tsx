
import React from "react";
import { StateRule } from "@/types/state";
import { ExternalLink, MapPin, ShieldAlert, HelpCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface StateRulesSectionProps {
  stateRules: StateRule[];
}

export const StateRulesSection: React.FC<StateRulesSectionProps> = ({ stateRules }) => {
  if (!stateRules.length) return null;

  const state = stateRules[0]; // We usually display rules for one state at a time

  return (
    <div className="mt-6 p-4 rounded-md bg-accent-teal/10 border border-accent-teal/20">
      <div className="flex items-center mb-3">
        <MapPin className="h-5 w-5 text-accent-teal mr-2" />
        <h3 className="font-semibold text-lg">State Requirements: {state.state_name}</h3>
      </div>
      
      <div className="grid gap-3">
        <div className="flex items-start">
          <Badge variant="outline" className="mt-1 shrink-0 bg-accent-teal/10">
            Age
          </Badge>
          <p className="ml-3">
            Minimum age for permit: {state.permit_age_min || 'Not specified'}
          </p>
        </div>
        
        <div className="flex items-start">
          <Badge variant="outline" className="mt-1 shrink-0 bg-accent-teal/10">
            Helmet
          </Badge>
          <p className="ml-3">
            {state.helmet_required 
              ? <span className="flex items-center"><ShieldAlert className="inline h-4 w-4 mr-1 text-red-500" /> Required by law</span> 
              : 'Not mandated by state law'}
          </p>
        </div>
        
        {state.special_rules && (
          <div className="flex items-start">
            <Badge variant="outline" className="mt-1 shrink-0 bg-accent-teal/10">
              Special Rules
            </Badge>
            <p className="ml-3">{state.special_rules}</p>
          </div>
        )}
        
        <div className="flex items-start">
          <Badge variant="outline" className="mt-1 shrink-0 bg-accent-teal/10">
            Road Test
          </Badge>
          <p className="ml-3">
            {state.road_test_required 
              ? 'Required for license' 
              : 'May be waived in certain circumstances'}
          </p>
        </div>
      </div>
      
      {state.link_to_dmv && (
        <a 
          href={state.link_to_dmv} 
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center mt-4 text-sm text-accent-teal hover:underline"
        >
          Visit official DMV website <ExternalLink className="ml-1 h-3 w-3" />
        </a>
      )}
      
      <div className="mt-4 flex items-center text-xs text-muted-foreground">
        <HelpCircle className="h-3 w-3 mr-1" />
        <span>Rules may change. Always verify with your local DMV.</span>
      </div>
    </div>
  );
};

export default StateRulesSection;
