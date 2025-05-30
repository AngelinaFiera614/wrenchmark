
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Eye, EyeOff, Loader, CheckCircle } from 'lucide-react';
import { useMotorcyclePublishing } from '@/hooks/useMotorcyclePublishing';
import { Motorcycle } from '@/types';

interface BulkPublishingControlsProps {
  motorcycles: Motorcycle[];
  selectedMotorcycles: string[];
  onRefresh: () => void;
}

const BulkPublishingControls = ({
  motorcycles,
  selectedMotorcycles,
  onRefresh
}: BulkPublishingControlsProps) => {
  const { publishMotorcycles, unpublishMotorcycles, publishAllDrafts, isPublishing } = useMotorcyclePublishing();

  const publishedCount = motorcycles.filter(m => !m.is_draft).length;
  const draftCount = motorcycles.filter(m => m.is_draft).length;
  const selectedPublished = selectedMotorcycles.filter(id => 
    motorcycles.find(m => m.id === id && !m.is_draft)
  ).length;
  const selectedDrafts = selectedMotorcycles.filter(id => 
    motorcycles.find(m => m.id === id && m.is_draft)
  ).length;

  const handlePublishSelected = async () => {
    const draftIds = selectedMotorcycles.filter(id => 
      motorcycles.find(m => m.id === id && m.is_draft)
    );
    
    if (draftIds.length === 0) return;
    
    const success = await publishMotorcycles(draftIds);
    if (success) onRefresh();
  };

  const handleUnpublishSelected = async () => {
    const publishedIds = selectedMotorcycles.filter(id => 
      motorcycles.find(m => m.id === id && !m.is_draft)
    );
    
    if (publishedIds.length === 0) return;
    
    const success = await unpublishMotorcycles(publishedIds);
    if (success) onRefresh();
  };

  const handlePublishAllDrafts = async () => {
    const success = await publishAllDrafts();
    if (success) onRefresh();
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CheckCircle className="h-5 w-5" />
          Publishing Controls
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Status Overview */}
        <div className="flex gap-4">
          <Badge variant="secondary" className="bg-green-100 text-green-800">
            <Eye className="mr-1 h-3 w-3" />
            Published: {publishedCount}
          </Badge>
          <Badge variant="secondary" className="bg-orange-100 text-orange-800">
            <EyeOff className="mr-1 h-3 w-3" />
            Drafts: {draftCount}
          </Badge>
        </div>

        {/* Selected Items Actions */}
        {selectedMotorcycles.length > 0 && (
          <div className="space-y-2">
            <div className="text-sm text-muted-foreground">
              Selected: {selectedMotorcycles.length} motorcycle{selectedMotorcycles.length > 1 ? 's' : ''}
              {selectedDrafts > 0 && ` (${selectedDrafts} draft${selectedDrafts > 1 ? 's' : ''})`}
              {selectedPublished > 0 && ` (${selectedPublished} published)`}
            </div>
            <div className="flex gap-2">
              {selectedDrafts > 0 && (
                <Button
                  onClick={handlePublishSelected}
                  disabled={isPublishing}
                  size="sm"
                  className="bg-green-600 hover:bg-green-700"
                >
                  {isPublishing ? (
                    <Loader className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <Eye className="mr-2 h-4 w-4" />
                  )}
                  Publish Selected ({selectedDrafts})
                </Button>
              )}
              {selectedPublished > 0 && (
                <Button
                  onClick={handleUnpublishSelected}
                  disabled={isPublishing}
                  size="sm"
                  variant="outline"
                >
                  {isPublishing ? (
                    <Loader className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <EyeOff className="mr-2 h-4 w-4" />
                  )}
                  Unpublish Selected ({selectedPublished})
                </Button>
              )}
            </div>
          </div>
        )}

        {/* Bulk Actions */}
        {draftCount > 0 && (
          <div className="pt-2 border-t">
            <Button
              onClick={handlePublishAllDrafts}
              disabled={isPublishing}
              variant="outline"
              size="sm"
            >
              {isPublishing ? (
                <Loader className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Eye className="mr-2 h-4 w-4" />
              )}
              Publish All Drafts ({draftCount})
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default BulkPublishingControls;
