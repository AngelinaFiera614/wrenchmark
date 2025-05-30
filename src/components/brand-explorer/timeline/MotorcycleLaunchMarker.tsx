
import React from 'react';
import { motion } from 'framer-motion';
import { Bike, Calendar } from 'lucide-react';

interface MotorcycleLaunch {
  year: number;
  model: string;
  category: string;
  significance: 'high' | 'medium' | 'low';
  description?: string;
}

interface MotorcycleLaunchMarkerProps {
  launch: MotorcycleLaunch;
  index: number;
}

export default function MotorcycleLaunchMarker({ 
  launch, 
  index 
}: MotorcycleLaunchMarkerProps) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -30 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.1 }}
      className="relative flex items-center gap-6"
    >
      {/* Launch marker */}
      <div className={`relative z-10 w-6 h-6 rounded-full border-2 flex items-center justify-center ${
        launch.significance === 'high' 
          ? 'bg-explorer-teal border-explorer-teal shadow-md shadow-explorer-teal/50' 
          : launch.significance === 'medium'
          ? 'bg-blue-500 border-blue-500 shadow-md shadow-blue-500/50'
          : 'bg-explorer-chrome border-explorer-chrome'
      }`}>
        <Bike className="w-3 h-3 text-explorer-dark" />
      </div>
      
      {/* Launch content */}
      <div className="flex-1 bg-explorer-card/50 border border-explorer-chrome/20 rounded-lg p-3 hover:border-explorer-teal/30 transition-colors duration-300">
        <div className="flex items-center justify-between mb-1">
          <span className="text-lg font-semibold text-explorer-teal">{launch.year}</span>
          <span className="text-xs px-2 py-1 bg-explorer-chrome/20 rounded text-explorer-text-muted">
            {launch.category}
          </span>
        </div>
        <div className="flex items-center gap-2 mb-1">
          <Calendar className="h-3 w-3 text-explorer-teal" />
          <span className="font-medium text-explorer-text">{launch.model}</span>
        </div>
        {launch.description && (
          <p className="text-sm text-explorer-text-muted">{launch.description}</p>
        )}
      </div>
    </motion.div>
  );
}
