
import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Zap, Settings, Calendar } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface ModelGeneration {
  id: string;
  name: string;
  years: string;
  keyChanges: string[];
  image?: string;
  successorId?: string;
  predecessorId?: string;
}

interface ModelEvolutionTrackerProps {
  modelName: string;
  generations: ModelGeneration[];
  onGenerationClick?: (generation: ModelGeneration) => void;
}

export default function ModelEvolutionTracker({
  modelName,
  generations,
  onGenerationClick
}: ModelEvolutionTrackerProps) {
  return (
    <Card className="bg-explorer-card border-explorer-chrome/30">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-explorer-text">
          <Settings className="h-5 w-5 text-explorer-teal" />
          {modelName} Evolution
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {generations.map((generation, index) => (
            <motion.div
              key={generation.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="flex items-center gap-4"
            >
              {/* Generation card */}
              <div 
                className="flex-1 bg-explorer-dark-light border border-explorer-chrome/20 rounded-lg p-4 hover:border-explorer-teal/50 transition-colors duration-300 cursor-pointer"
                onClick={() => onGenerationClick?.(generation)}
              >
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <h4 className="font-semibold text-explorer-text">{generation.name}</h4>
                    <div className="flex items-center gap-1 text-sm text-explorer-text-muted">
                      <Calendar className="h-3 w-3" />
                      {generation.years}
                    </div>
                  </div>
                  {generation.image && (
                    <img 
                      src={generation.image} 
                      alt={generation.name}
                      className="w-16 h-12 object-cover rounded border border-explorer-chrome/20"
                    />
                  )}
                </div>
                
                <div className="space-y-1">
                  <div className="flex items-center gap-1 text-xs text-explorer-teal">
                    <Zap className="h-3 w-3" />
                    Key Changes
                  </div>
                  <ul className="text-xs text-explorer-text-muted space-y-1">
                    {generation.keyChanges.slice(0, 3).map((change, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <span className="w-1 h-1 bg-explorer-teal rounded-full mt-1.5 flex-shrink-0" />
                        {change}
                      </li>
                    ))}
                    {generation.keyChanges.length > 3 && (
                      <li className="text-explorer-teal">+{generation.keyChanges.length - 3} more changes</li>
                    )}
                  </ul>
                </div>
              </div>
              
              {/* Arrow to next generation */}
              {index < generations.length - 1 && (
                <ArrowRight className="h-5 w-5 text-explorer-chrome/50 flex-shrink-0" />
              )}
            </motion.div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
