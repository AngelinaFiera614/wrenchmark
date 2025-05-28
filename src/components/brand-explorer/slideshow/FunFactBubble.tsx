
import React from 'react';
import { motion } from 'framer-motion';

interface FunFactBubbleProps {
  currentFactIndex: number;
  funFacts: string[];
}

export default function FunFactBubble({ currentFactIndex, funFacts }: FunFactBubbleProps) {
  return (
    <motion.div
      key={currentFactIndex}
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 0, opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="relative mx-auto max-w-md mb-8"
    >
      <div className="bg-gradient-to-r from-explorer-teal/20 to-explorer-chrome/20 border border-explorer-teal/50 rounded-full px-6 py-4 text-center">
        <p className="text-explorer-text text-sm">
          💡 {funFacts[currentFactIndex]}
        </p>
      </div>
    </motion.div>
  );
}
