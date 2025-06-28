
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';

const EngineDebugInfo = ({ engineId }: { engineId?: string }) => {
  const { data: engines, isLoading } = useQuery({
    queryKey: ['engines-debug', engineId],
    queryFn: async () => {
      let query = supabase.from('engines').select('*');
      
      if (engineId) {
        query = query.eq('id', engineId);
      } else {
        query = query.ilike('name', '%j-series%');
      }
      
      const { data, error } = await query;
      
      if (error) {
        console.error('Debug query error:', error);
        throw error;
      }
      
      return data || [];
    }
  });

  if (isLoading) {
    return <div>Loading debug info...</div>;
  }

  if (!engines || engines.length === 0) {
    return (
      <Card className="border-yellow-500">
        <CardHeader>
          <CardTitle className="text-yellow-600">Engine Debug Info</CardTitle>
        </CardHeader>
        <CardContent>
          <p>No engines found matching criteria</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {engines.map((engine) => (
        <Card key={engine.id} className="border-blue-500">
          <CardHeader>
            <CardTitle className="text-blue-600 flex items-center gap-2">
              Engine Debug: {engine.name}
              <Badge variant={engine.is_draft ? "destructive" : "default"}>
                {engine.is_draft ? "Draft" : "Published"}
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <strong>ID:</strong> {engine.id}
              </div>
              <div>
                <strong>Name:</strong> {engine.name || 'NULL'}
              </div>
              <div>
                <strong>Displacement:</strong> {engine.displacement_cc || 'NULL'} cc
              </div>
              <div>
                <strong>Power:</strong> {engine.power_hp || 'NULL'} hp
              </div>
              <div>
                <strong>Torque:</strong> {engine.torque_nm || 'NULL'} Nm
              </div>
              <div>
                <strong>Engine Type:</strong> {engine.engine_type || 'NULL'}
              </div>
              <div>
                <strong>Cylinders:</strong> {engine.cylinder_count || 'NULL'}
              </div>
              <div>
                <strong>Cooling:</strong> {engine.cooling || 'NULL'}
              </div>
              <div>
                <strong>Fuel System:</strong> {engine.fuel_system || 'NULL'}
              </div>
              <div>
                <strong>Bore:</strong> {engine.bore_mm || 'NULL'} mm
              </div>
              <div>
                <strong>Stroke:</strong> {engine.stroke_mm || 'NULL'} mm
              </div>
              <div>
                <strong>Compression:</strong> {engine.compression_ratio || 'NULL'}
              </div>
              <div className="col-span-2">
                <strong>Created:</strong> {new Date(engine.created_at).toLocaleString()}
              </div>
              <div className="col-span-2">
                <strong>Updated:</strong> {new Date(engine.updated_at).toLocaleString()}
              </div>
              {engine.notes && (
                <div className="col-span-2">
                  <strong>Notes:</strong> {engine.notes}
                </div>
              )}
            </div>
            
            <div className="mt-4 p-3 bg-gray-100 rounded">
              <strong>Raw Data:</strong>
              <pre className="text-xs mt-2 overflow-x-auto">
                {JSON.stringify(engine, null, 2)}
              </pre>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default EngineDebugInfo;
