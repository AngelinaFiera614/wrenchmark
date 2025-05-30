
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

interface NormalizedScore {
  motorcycle: {
    id: string;
    make: string;
    model: string;
  };
  performanceScore: number;
  fuelEfficiencyScore: number;
  practicalityScore: number;
}

interface NormalizedScoresTableProps {
  normalizedScores: NormalizedScore[];
}

export default function NormalizedScoresTable({ normalizedScores }: NormalizedScoresTableProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Normalized Performance Scores</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Motorcycle</TableHead>
              <TableHead className="text-center">Performance</TableHead>
              <TableHead className="text-center">Fuel Efficiency</TableHead>
              <TableHead className="text-center">Practicality</TableHead>
              <TableHead className="text-center">Overall</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {normalizedScores.map((score) => {
              const overall = (score.performanceScore + score.fuelEfficiencyScore + score.practicalityScore) / 3;
              return (
                <TableRow key={score.motorcycle.id}>
                  <TableCell className="font-medium">
                    {score.motorcycle.make} {score.motorcycle.model}
                  </TableCell>
                  <TableCell className="text-center">
                    <Badge variant="outline" className="bg-green-500/10">
                      {score.performanceScore.toFixed(0)}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-center">
                    <Badge variant="outline" className="bg-blue-500/10">
                      {score.fuelEfficiencyScore.toFixed(0)}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-center">
                    <Badge variant="outline" className="bg-purple-500/10">
                      {score.practicalityScore.toFixed(0)}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-center">
                    <Badge variant="outline" className="bg-accent-teal/20 text-accent-teal">
                      {overall.toFixed(0)}
                    </Badge>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
