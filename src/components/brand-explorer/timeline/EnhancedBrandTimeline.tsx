
import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Calendar, Award, Bike } from 'lucide-react';
import { BrandMilestone } from '@/types';
import TimelineFilters from './TimelineFilters';
import MotorcycleLaunchMarker from './MotorcycleLaunchMarker';

interface MotorcycleLaunch {
  year: number;
  model: string;
  category: string;
  significance: 'high' | 'medium' | 'low';
  description?: string;
}

interface EnhancedBrandTimelineProps {
  milestones: BrandMilestone[];
  motorcycleLaunches?: MotorcycleLaunch[];
  onMilestoneClick?: (milestone: BrandMilestone) => void;
}

export default function EnhancedBrandTimeline({ 
  milestones, 
  motorcycleLaunches = [],
  onMilestoneClick 
}: EnhancedBrandTimelineProps) {
  const [activeFilters, setActiveFilters] = useState<string[]>(['milestones', 'launches']);

  // Combine and sort timeline events
  const timelineEvents = useMemo(() => {
    const events: Array<{
      year: number;
      type: 'milestone' | 'launch';
      data: BrandMilestone | MotorcycleLaunch;
    }> = [];

    if (activeFilters.includes('milestones')) {
      milestones.forEach(milestone => {
        if (!activeFilters.includes('high-importance') || milestone.importance === 'high') {
          events.push({ year: milestone.year, type: 'milestone', data: milestone });
        }
      });
    }

    if (activeFilters.includes('launches')) {
      motorcycleLaunches.forEach(launch => {
        events.push({ year: launch.year, type: 'launch', data: launch });
      });
    }

    return events.sort((a, b) => a.year - b.year);
  }, [milestones, motorcycleLaunches, activeFilters]);

  const availableTypes = ['milestones', 'launches'];

  return (
    <div className="mb-8">
      <h2 className="text-2xl font-bold text-explorer-text mb-6 flex items-center">
        <Calendar className="mr-3 h-6 w-6 text-explorer-teal" />
        Interactive Timeline
      </h2>
      
      <TimelineFilters
        activeFilters={activeFilters}
        onFilterChange={setActiveFilters}
        availableTypes={availableTypes}
      />
      
      <div className="relative">
        {/* Timeline line */}
        <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gradient-to-b from-explorer-teal via-explorer-chrome to-explorer-teal opacity-50" />
        
        <div className="space-y-6">
          {timelineEvents.map((event, index) => (
            <div key={`${event.type}-${event.year}-${index}`}>
              {event.type === 'milestone' ? (
                <motion.div
                  initial={{ opacity: 0, x: -50 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="relative flex items-center gap-6"
                >
                  {/* Timeline dot */}
                  <div className={`relative z-10 w-8 h-8 rounded-full border-2 flex items-center justify-center cursor-pointer ${
                    (event.data as BrandMilestone).importance === 'high' 
                      ? 'bg-explorer-teal border-explorer-teal shadow-lg shadow-explorer-teal/50' 
                      : 'bg-explorer-chrome border-explorer-chrome'
                  }`}
                  onClick={() => onMilestoneClick?.(event.data as BrandMilestone)}
                  >
                    <Award className="w-4 h-4 text-explorer-dark" />
                  </div>
                  
                  {/* Timeline content */}
                  <div className="flex-1 bg-explorer-card border border-explorer-chrome/30 rounded-lg p-4 hover:border-explorer-teal/50 transition-colors duration-300 cursor-pointer"
                    onClick={() => onMilestoneClick?.(event.data as BrandMilestone)}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xl font-bold text-explorer-teal">{event.year}</span>
                      {(event.data as BrandMilestone).importance === 'high' && (
                        <Award className="h-5 w-5 text-explorer-teal" />
                      )}
                    </div>
                    <p className="text-explorer-text-muted">{(event.data as BrandMilestone).description}</p>
                  </div>
                </motion.div>
              ) : (
                <MotorcycleLaunchMarker 
                  launch={event.data as MotorcycleLaunch} 
                  index={index}
                />
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
