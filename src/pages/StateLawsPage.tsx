
import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useAllStateRules, useStateByCode } from '@/hooks/useStateRules';
import StateSelector from '@/components/learning/StateSelector';
import { Card, CardContent } from '@/components/ui/card';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  MapPin, 
  Shield, 
  Clock, 
  FileText, 
  ExternalLink, 
  Loader2,
  HelpCircle,
  AlertTriangle 
} from 'lucide-react';

const StateLawsPage: React.FC = () => {
  const [selectedStateCode, setSelectedStateCode] = useState<string | undefined>(undefined);
  const { state, isLoading } = useStateByCode(selectedStateCode);
  const { states } = useAllStateRules();

  return (
    <>
      <Helmet>
        <title>Motorcycle State Laws | Wrenchmark</title>
        <meta 
          name="description" 
          content="State-specific motorcycle permit and licensing laws from across the United States."
        />
      </Helmet>

      <div className="container py-8">
        <div className="flex flex-col gap-6 max-w-4xl mx-auto">
          <div className="flex flex-col gap-2">
            <h1 className="text-3xl font-bold">Motorcycle State Laws</h1>
            <p className="text-muted-foreground">
              Find permit requirements, helmet laws, and licensing information specific to your state.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6 mb-4">
            <StateSelector 
              selectedState={selectedStateCode}
              onStateChange={setSelectedStateCode}
              label="Select your state"
            />

            {states.length > 0 && !selectedStateCode && (
              <p className="text-sm text-muted-foreground flex items-center">
                <HelpCircle className="h-4 w-4 mr-1" />
                Select a state to view specific requirements
              </p>
            )}
          </div>

          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-accent-teal" />
            </div>
          ) : state ? (
            <div className="grid gap-6">
              <Card>
                <CardContent className="pt-6">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                    <div className="flex items-center">
                      <MapPin className="h-6 w-6 text-accent-teal mr-2" />
                      <h2 className="text-2xl font-bold">{state.state_name}</h2>
                    </div>
                    
                    {state.link_to_dmv && (
                      <Button variant="outline" asChild>
                        <a 
                          href={state.link_to_dmv} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="flex items-center"
                        >
                          Visit Official DMV <ExternalLink className="ml-2 h-4 w-4" />
                        </a>
                      </Button>
                    )}
                  </div>

                  <div className="grid gap-6">
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="flex items-start gap-3">
                        <Clock className="h-5 w-5 text-accent-teal shrink-0 mt-1" />
                        <div>
                          <h3 className="font-medium">Minimum Age Requirements</h3>
                          <p className="text-sm mt-1">
                            {state.permit_age_min 
                              ? `Minimum age for motorcycle permit: ${state.permit_age_min} years old`
                              : "No specific minimum age information available"}
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex items-start gap-3">
                        <Shield className="h-5 w-5 text-accent-teal shrink-0 mt-1" />
                        <div>
                          <h3 className="font-medium">Helmet Requirements</h3>
                          <div className="flex items-center mt-1">
                            {state.helmet_required ? (
                              <>
                                <Badge className="bg-red-500 text-white">Required</Badge>
                                <p className="text-sm ml-2">Helmets are legally required</p>
                              </>
                            ) : (
                              <>
                                <Badge variant="outline">Optional</Badge>
                                <p className="text-sm ml-2">Helmets not mandated by state law</p>
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <FileText className="h-5 w-5 text-accent-teal shrink-0 mt-1" />
                      <div>
                        <h3 className="font-medium">Road Test Requirements</h3>
                        <p className="text-sm mt-1">
                          {state.road_test_required 
                            ? "A road test is required to obtain a motorcycle license"
                            : "A road test may be waived under certain conditions"}
                        </p>
                      </div>
                    </div>

                    {state.special_rules && (
                      <div className="flex items-start gap-3">
                        <AlertTriangle className="h-5 w-5 text-accent-teal shrink-0 mt-1" />
                        <div>
                          <h3 className="font-medium">Special Rules</h3>
                          <p className="text-sm mt-1">{state.special_rules}</p>
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              <Alert>
                <AlertTriangle className="h-4 w-4" />
                <AlertTitle>Important Notice</AlertTitle>
                <AlertDescription>
                  Laws and requirements may change. This information is provided as a guide only.
                  Always verify current requirements with your state's DMV before applying for a motorcycle permit or license.
                </AlertDescription>
              </Alert>
            </div>
          ) : (
            <Card className="p-6">
              <div className="flex flex-col items-center py-8 text-center">
                <MapPin className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-xl font-medium mb-2">Select a State</h3>
                <p className="text-muted-foreground max-w-md">
                  Choose a state from the dropdown above to see motorcycle permit requirements, 
                  helmet laws, and other important regulations.
                </p>
              </div>
            </Card>
          )}
        </div>
      </div>
    </>
  );
};

export default StateLawsPage;
