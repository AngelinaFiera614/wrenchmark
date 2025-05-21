
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { useStateByCode } from "@/hooks/useStateRules";
import { StateSelector } from "@/components/learning/StateSelector";
import { Loader2, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

const StateLawsPage = () => {
  const { stateCode } = useParams<{ stateCode?: string }>();
  const [selectedState, setSelectedState] = useState<string | undefined>(stateCode);
  const navigate = useNavigate();
  const { state, isLoading, error } = useStateByCode(selectedState);

  // Update URL when state changes
  useEffect(() => {
    if (selectedState) {
      navigate(`/state-laws/${selectedState}`, { replace: true });
    }
  }, [selectedState, navigate]);

  // Handle state change from selector
  const handleStateChange = (newStateCode: string) => {
    setSelectedState(newStateCode);
  };

  return (
    <div className="container py-8">
      <Helmet>
        <title>State Motorcycle Laws | WRENCHMARK</title>
        <meta name="description" content="Find motorcycle laws specific to your state including helmet requirements, licensing procedures, and more." />
      </Helmet>

      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">State Motorcycle Laws</h1>
        <p className="text-muted-foreground">
          Find motorcycle laws specific to your state including helmet requirements, licensing procedures, and more.
        </p>
      </div>

      <div className="mb-8">
        <StateSelector
          selectedState={selectedState}
          onStateChange={handleStateChange}
          label="Select your state"
        />
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-accent-teal" />
        </div>
      ) : error ? (
        <Card className="border-destructive">
          <CardContent className="pt-6">
            <p className="text-destructive">Error loading state data. Please try again.</p>
          </CardContent>
        </Card>
      ) : state ? (
        <Card className="bg-card border shadow-sm">
          <CardHeader>
            <CardTitle className="text-2xl flex items-center gap-2">
              {state.state_name} Motorcycle Laws
            </CardTitle>
          </CardHeader>
          
          <CardContent className="space-y-6">
            <div>
              <h3 className="text-lg font-medium mb-2">Key Requirements</h3>
              <ul className="space-y-2">
                <li className="flex items-start gap-2">
                  <span className="font-medium">Minimum Age for Permit:</span>
                  <span>{state.permit_age_min !== null ? `${state.permit_age_min} years` : 'Not specified'}</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="font-medium">Helmet Required:</span>
                  <span>{state.helmet_required ? 'Yes' : 'No*'}</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="font-medium">Road Test Required:</span>
                  <span>{state.road_test_required ? 'Yes' : 'No'}</span>
                </li>
              </ul>
            </div>
            
            {state.special_rules && (
              <div>
                <h3 className="text-lg font-medium mb-2">Special Rules</h3>
                <p>{state.special_rules}</p>
              </div>
            )}
            
            <Separator />
            
            <div>
              <h3 className="text-lg font-medium mb-2">Important Notes</h3>
              <p className="text-sm text-muted-foreground mb-2">
                Always check the official DMV/BMV website for your state for the most up-to-date requirements and laws regarding motorcycle operation.
              </p>
              {!state.helmet_required && (
                <p className="text-sm text-amber-500 mb-2">
                  *While not required by state law, helmets are strongly recommended for safety.
                </p>
              )}
            </div>
          </CardContent>
          
          {state.link_to_dmv && (
            <CardFooter className="bg-secondary/50 border-t">
              <Button variant="outline" className="w-full" asChild>
                <a href={state.link_to_dmv} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-2">
                  <span>Visit Official State DMV/BMV Website</span>
                  <ExternalLink className="h-4 w-4" />
                </a>
              </Button>
            </CardFooter>
          )}
        </Card>
      ) : (
        <div className="text-center p-8 border rounded-lg bg-muted/20">
          <h3 className="text-lg font-medium mb-2">Select a State</h3>
          <p className="text-muted-foreground">
            Please select a state from the dropdown above to view motorcycle laws and regulations.
          </p>
        </div>
      )}
    </div>
  );
};

export default StateLawsPage;
