
import React from "react";
import { Motorcycle } from "@/types";
import { ComparisonSectionHeader } from "../ComparisonSectionHeader";
import { compareArrayValues, getComparisonClass } from "@/lib/comparison-utils";

interface ComparisonFeaturesProps {
  motorcycles: Motorcycle[];
}

export default function ComparisonFeatures({ motorcycles }: ComparisonFeaturesProps) {
  // Smart Features
  const smartFeatures = motorcycles.map(m => m.smart_features || []);
  const smartFeaturesComparison = compareArrayValues(smartFeatures);
  
  // Style Tags
  const styleTags = motorcycles.map(m => m.style_tags || []);
  const styleTagsComparison = compareArrayValues(styleTags);

  return (
    <div>
      <ComparisonSectionHeader title="Features & Characteristics" />
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Smart Features Section */}
        <div className="bg-muted/30 rounded-lg p-4">
          <h3 className="text-lg font-semibold mb-3 text-accent-teal">Smart Features</h3>
          
          <div className="grid grid-cols-1 gap-4">
            {motorcycles.map((motorcycle, index) => (
              <div key={motorcycle.id} className="space-y-2">
                <h4 className="font-medium">{motorcycle.make} {motorcycle.model}</h4>
                
                <ul className={`list-disc list-inside ${getComparisonClass(smartFeaturesComparison[index])}`}>
                  {motorcycle.smart_features && motorcycle.smart_features.length > 0 ? (
                    motorcycle.smart_features.map((feature, i) => (
                      <li key={i} className="text-sm">
                        {feature}
                      </li>
                    ))
                  ) : (
                    <li className="text-sm text-muted-foreground">No smart features listed</li>
                  )}
                </ul>
              </div>
            ))}
          </div>
        </div>
        
        {/* Style Tags Section */}
        <div className="bg-muted/30 rounded-lg p-4">
          <h3 className="text-lg font-semibold mb-3 text-accent-teal">Style Characteristics</h3>
          
          <div className="grid grid-cols-1 gap-4">
            {motorcycles.map((motorcycle, index) => (
              <div key={motorcycle.id} className="space-y-2">
                <h4 className="font-medium">{motorcycle.make} {motorcycle.model}</h4>
                
                <div className={`flex flex-wrap gap-2 ${getComparisonClass(styleTagsComparison[index])}`}>
                  {motorcycle.style_tags && motorcycle.style_tags.length > 0 ? (
                    motorcycle.style_tags.map((tag, i) => (
                      <span key={i} className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-muted text-foreground">
                        {tag}
                      </span>
                    ))
                  ) : (
                    <span className="text-sm text-muted-foreground">No style tags listed</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
