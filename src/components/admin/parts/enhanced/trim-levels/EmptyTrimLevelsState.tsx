
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const EmptyTrimLevelsState = () => {
  return (
    <Card className="bg-explorer-card border-explorer-chrome/30">
      <CardHeader>
        <CardTitle className="text-explorer-text">Trim Levels</CardTitle>
      </CardHeader>
      <CardContent className="p-8 text-center">
        <div className="text-explorer-text-muted">
          Select one or more model years to manage trim levels
        </div>
      </CardContent>
    </Card>
  );
};

export default EmptyTrimLevelsState;
