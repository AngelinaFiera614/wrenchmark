
import React from 'react';
import { motion } from 'framer-motion';
import { Calendar, Award } from 'lucide-react';
import { BrandMilestone } from '@/types';

interface BrandTimelineProps {
  milestones: BrandMilestone[];
}

export default function BrandTimeline({ milestones }: BrandTimelineProps) {
  return (
    <div className="mb-8">
      <h2 className="text-2xl font-bold text-explorer-text mb-6 flex items-center">
        <Calendar className="mr-3 h-6 w-6 text-explorer-teal" />
        Timeline
      </h2>
      
      <div className="relative">
        {/* Timeline line */}
        <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gradient-to-b from-explorer-teal via-explorer-chrome to-explorer-teal opacity-50" />
        
        <div className="space-y-6">
          {milestones.map((milestone, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="relative flex items-center gap-6"
            >
              {/* Timeline dot */}
              <div className={`relative z-10 w-8 h-8 rounded-full border-2 flex items-center justify-center ${
                milestone.importance === 'high' 
                  ? 'bg-explorer-teal border-explorer-teal shadow-lg shadow-explorer-teal/50' 
                  : 'bg-explorer-chrome border-explorer-chrome'
              }`}>
                <div className="w-2 h-2 rounded-full bg-explorer-dark" />
              </div>
              
              {/* Timeline content */}
              <div className="flex-1 bg-explorer-card border border-explorer-chrome/30 rounded-lg p-4 hover:border-explorer-teal/50 transition-colors duration-300">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xl font-bold text-explorer-teal">{milestone.year}</span>
                  {milestone.importance === 'high' && (
                    <Award className="h-5 w-5 text-explorer-teal" />
                  )}
                </div>
                <p className="text-explorer-text-muted">{milestone.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
