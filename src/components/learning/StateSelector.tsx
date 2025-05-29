
import React from "react";
import { useAllStateRules } from "@/hooks/useStateRules";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { MapPin, Loader2 } from "lucide-react";

interface StateSelectorProps {
  selectedState: string | undefined;
  onStateChange: (stateCode: string) => void;
  label?: string;
}

const StateSelector: React.FC<StateSelectorProps> = ({
  selectedState,
  onStateChange,
  label = "Select State",
}) => {
  const { states, isLoading } = useAllStateRules();

  if (isLoading) {
    return (
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <Loader2 className="h-4 w-4 animate-spin" />
        <span>Loading states...</span>
      </div>
    );
  }

  // For a read-only selector when we're just displaying a state
  if (!onStateChange || typeof onStateChange !== 'function') {
    const state = states.find(s => s.state_code === selectedState);
    return (
      <div className="flex items-center gap-2 text-sm font-medium">
        <MapPin className="h-4 w-4 text-accent-teal" />
        <span>{state?.state_name || selectedState}</span>
      </div>
    );
  }

  // Filter out any states with empty or invalid state codes and ensure they're non-empty strings
  const validStates = states.filter(state => 
    state.state_code && 
    state.state_code.trim() !== '' &&
    state.state_name &&
    state.state_name.trim() !== ''
  );

  return (
    <div>
      <Select value={selectedState} onValueChange={onStateChange}>
        <SelectTrigger className="w-[180px]">
          <div className="flex items-center gap-2">
            <MapPin className="h-4 w-4" />
            <SelectValue placeholder={label} />
          </div>
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectLabel>Select your state</SelectLabel>
            {validStates.map((state) => (
              <SelectItem key={state.state_code} value={state.state_code}>
                {state.state_name}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  );
};

export default StateSelector;
