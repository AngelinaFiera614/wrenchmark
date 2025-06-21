
import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Upload, 
  FileText, 
  AlertTriangle, 
  CheckCircle, 
  X,
  Download 
} from "lucide-react";
import { Brand } from "@/types";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface ImportMotorcycleDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  brands: Brand[];
  onSuccess: () => void;
}

interface ImportRow {
  name: string;
  brand_name: string;
  type: string;
  production_start_year?: number;
  base_description?: string;
  engine_size?: number;
  horsepower?: number;
  weight_kg?: number;
  status: 'pending' | 'success' | 'error';
  error?: string;
  brand_id?: string;
}

const ImportMotorcycleDialog = ({ open, onOpenChange, brands, onSuccess }: ImportMotorcycleDialogProps) => {
  const { toast } = useToast();
  const [importData, setImportData] = useState("");
  const [importRows, setImportRows] = useState<ImportRow[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [step, setStep] = useState<'input' | 'preview' | 'processing'>('input');

  const sampleData = `name,brand_name,type,production_start_year,base_description,engine_size,horsepower,weight_kg
Ninja 650,Kawasaki,Sport,2017,Sporty middleweight motorcycle,649,67,193
CBR600RR,Honda,Sport,2003,High-performance supersport,599,118,194
MT-07,Yamaha,Naked,2014,Lightweight naked bike,689,74,182`;

  const parseCSV = (csvText: string): ImportRow[] => {
    const lines = csvText.trim().split('\n');
    if (lines.length < 2) return [];

    const headers = lines[0].split(',').map(h => h.trim());
    const rows: ImportRow[] = [];

    for (let i = 1; i < lines.length; i++) {
      const values = lines[i].split(',').map(v => v.trim());
      const row: ImportRow = {
        name: '',
        brand_name: '',
        type: '',
        status: 'pending'
      };

      headers.forEach((header, index) => {
        const value = values[index] || '';
        switch (header) {
          case 'name':
            row.name = value;
            break;
          case 'brand_name':
            row.brand_name = value;
            // Find matching brand ID
            const brand = brands.find(b => b.name.toLowerCase() === value.toLowerCase());
            if (brand) {
              row.brand_id = brand.id;
            } else {
              row.error = `Brand "${value}" not found`;
              row.status = 'error';
            }
            break;
          case 'type':
            row.type = value;
            break;
          case 'production_start_year':
            row.production_start_year = value ? parseInt(value) : undefined;
            break;
          case 'base_description':
            row.base_description = value;
            break;
          case 'engine_size':
            row.engine_size = value ? parseFloat(value) : undefined;
            break;
          case 'horsepower':
            row.horsepower = value ? parseFloat(value) : undefined;
            break;
          case 'weight_kg':
            row.weight_kg = value ? parseFloat(value) : undefined;
            break;
        }
      });

      // Validate required fields
      if (!row.name) {
        row.error = 'Name is required';
        row.status = 'error';
      } else if (!row.brand_id) {
        row.error = row.error || 'Valid brand is required';
        row.status = 'error';
      } else if (!row.type) {
        row.error = 'Type is required';
        row.status = 'error';
      }

      rows.push(row);
    }

    return rows;
  };

  const handleParseData = () => {
    try {
      const rows = parseCSV(importData);
      setImportRows(rows);
      setStep('preview');
    } catch (error) {
      toast({
        title: "Parse Error",
        description: "Failed to parse CSV data. Please check the format.",
        variant: "destructive"
      });
    }
  };

  const handleImport = async () => {
    setIsProcessing(true);
    setStep('processing');

    const validRows = importRows.filter(row => row.status !== 'error');
    let successCount = 0;

    for (const row of validRows) {
      try {
        const { error } = await supabase
          .from('motorcycle_models')
          .insert({
            name: row.name,
            brand_id: row.brand_id!,
            type: row.type,
            production_start_year: row.production_start_year,
            base_description: row.base_description,
            engine_size: row.engine_size,
            horsepower: row.horsepower,
            weight_kg: row.weight_kg,
            slug: `${row.brand_name.toLowerCase()}-${row.name.toLowerCase()}`.replace(/[^a-z0-9-]/g, '-'),
            is_draft: false
          });

        if (error) {
          row.status = 'error';
          row.error = error.message;
        } else {
          row.status = 'success';
          successCount++;
        }
      } catch (error) {
        row.status = 'error';
        row.error = 'Failed to create motorcycle';
      }

      // Update the state to show progress
      setImportRows([...importRows]);
    }

    setIsProcessing(false);

    toast({
      title: "Import Complete",
      description: `Successfully imported ${successCount} of ${validRows.length} motorcycles.`
    });

    if (successCount > 0) {
      onSuccess();
    }
  };

  const handleReset = () => {
    setImportData("");
    setImportRows([]);
    setStep('input');
  };

  const downloadSample = () => {
    const blob = new Blob([sampleData], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'motorcycle_import_sample.csv';
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Upload className="h-5 w-5" />
            Import Motorcycles
          </DialogTitle>
        </DialogHeader>

        {step === 'input' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="import-data">CSV Data</Label>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={downloadSample}
              >
                <Download className="h-4 w-4 mr-2" />
                Download Sample
              </Button>
            </div>
            
            <Textarea
              id="import-data"
              value={importData}
              onChange={(e) => setImportData(e.target.value)}
              placeholder="Paste your CSV data here..."
              rows={10}
              className="font-mono text-sm"
            />

            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Required Fields</CardTitle>
              </CardHeader>
              <CardContent className="text-sm space-y-2">
                <div><strong>name:</strong> Motorcycle model name</div>
                <div><strong>brand_name:</strong> Manufacturer name (must match existing brand)</div>
                <div><strong>type:</strong> Motorcycle type (Sport, Cruiser, etc.)</div>
                <div className="text-muted-foreground">
                  Optional: production_start_year, base_description, engine_size, horsepower, weight_kg
                </div>
              </CardContent>
            </Card>

            <div className="flex gap-2 pt-4">
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)} className="flex-1">
                Cancel
              </Button>
              <Button 
                type="button" 
                onClick={handleParseData}
                disabled={!importData.trim()}
                className="flex-1"
              >
                <FileText className="h-4 w-4 mr-2" />
                Parse Data
              </Button>
            </div>
          </div>
        )}

        {step === 'preview' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium">Import Preview</h3>
                <p className="text-sm text-muted-foreground">
                  {importRows.filter(r => r.status !== 'error').length} valid, {importRows.filter(r => r.status === 'error').length} errors
                </p>
              </div>
              <Button variant="outline" size="sm" onClick={handleReset}>
                <X className="h-4 w-4 mr-2" />
                Start Over
              </Button>
            </div>

            <div className="max-h-60 overflow-y-auto space-y-2">
              {importRows.map((row, index) => (
                <Card key={index} className={`${row.status === 'error' ? 'border-red-200 bg-red-50' : 'border-green-200 bg-green-50'}`}>
                  <CardContent className="p-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-medium">{row.brand_name} {row.name}</div>
                        <div className="text-sm text-muted-foreground">{row.type}</div>
                      </div>
                      <div className="flex items-center gap-2">
                        {row.status === 'error' ? (
                          <Badge variant="destructive">
                            <AlertTriangle className="h-3 w-3 mr-1" />
                            Error
                          </Badge>
                        ) : (
                          <Badge variant="secondary" className="bg-green-100 text-green-800">
                            <CheckCircle className="h-3 w-3 mr-1" />
                            Ready
                          </Badge>
                        )}
                      </div>
                    </div>
                    {row.error && (
                      <div className="text-sm text-red-600 mt-1">{row.error}</div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="flex gap-2 pt-4">
              <Button type="button" variant="outline" onClick={handleReset} className="flex-1">
                Back
              </Button>
              <Button 
                type="button" 
                onClick={handleImport}
                disabled={importRows.filter(r => r.status !== 'error').length === 0}
                className="flex-1"
              >
                Import {importRows.filter(r => r.status !== 'error').length} Motorcycles
              </Button>
            </div>
          </div>
        )}

        {step === 'processing' && (
          <div className="space-y-4">
            <div className="text-center">
              <h3 className="font-medium">Importing Motorcycles...</h3>
              <p className="text-sm text-muted-foreground">Please wait while we process your data.</p>
            </div>

            <div className="max-h-60 overflow-y-auto space-y-2">
              {importRows.map((row, index) => (
                <Card key={index} className={`
                  ${row.status === 'success' ? 'border-green-200 bg-green-50' : 
                    row.status === 'error' ? 'border-red-200 bg-red-50' : 
                    'border-gray-200'}
                `}>
                  <CardContent className="p-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-medium">{row.brand_name} {row.name}</div>
                        <div className="text-sm text-muted-foreground">{row.type}</div>
                      </div>
                      <div className="flex items-center gap-2">
                        {row.status === 'success' && (
                          <Badge variant="secondary" className="bg-green-100 text-green-800">
                            <CheckCircle className="h-3 w-3 mr-1" />
                            Success
                          </Badge>
                        )}
                        {row.status === 'error' && (
                          <Badge variant="destructive">
                            <AlertTriangle className="h-3 w-3 mr-1" />
                            Failed
                          </Badge>
                        )}
                        {row.status === 'pending' && (
                          <Badge variant="outline">Processing...</Badge>
                        )}
                      </div>
                    </div>
                    {row.error && (
                      <div className="text-sm text-red-600 mt-1">{row.error}</div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>

            {!isProcessing && (
              <div className="flex gap-2 pt-4">
                <Button type="button" onClick={() => onOpenChange(false)} className="flex-1">
                  Close
                </Button>
              </div>
            )}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default ImportMotorcycleDialog;
