
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AlertTriangle, CheckCircle, Info } from 'lucide-react';

interface ComponentStatusCardProps {
  title: string;
  data: any;
  isAvailable: boolean;
  children?: React.ReactNode;
}

export function ComponentStatusCard({ 
  title, 
  data, 
  isAvailable, 
  children 
}: ComponentStatusCardProps) {
  if (!isAvailable || !data) {
    return (
      <Card className="border-orange-200">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-base">{title}</CardTitle>
            <Badge variant="outline" className="border-orange-200 bg-orange-50 text-orange-700">
              <AlertTriangle className="h-3 w-3 mr-1" />
              Not Available
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-center py-4 text-muted-foreground">
            <Info className="h-8 w-8 mx-auto mb-2 text-orange-400" />
            <p className="text-sm">
              {title} specifications are not available for this configuration.
            </p>
            <p className="text-xs mt-1">
              This component may not have been assigned to this motorcycle model yet.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base">{title}</CardTitle>
          <Badge variant="secondary" className="bg-green-100 text-green-800">
            <CheckCircle className="h-3 w-3 mr-1" />
            Available
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        {children}
      </CardContent>
    </Card>
  );
}
