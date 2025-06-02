
import { GlossaryTerm } from '@/types/glossary';
import { ColumnVisibility } from '@/components/admin/glossary/ColumnVisibilityControls';

export interface ExportOptions {
  format: 'csv' | 'json';
  filename?: string;
  columnVisibility: ColumnVisibility;
}

export function exportGlossaryTerms(terms: GlossaryTerm[], options: ExportOptions) {
  const timestamp = new Date().toISOString().split('T')[0];
  const filename = options.filename || `glossary-terms-${timestamp}`;

  if (options.format === 'csv') {
    exportAsCSV(terms, filename, options.columnVisibility);
  } else {
    exportAsJSON(terms, filename);
  }
}

function exportAsCSV(terms: GlossaryTerm[], filename: string, columnVisibility: ColumnVisibility) {
  const headers: string[] = [];
  const fields: (keyof GlossaryTerm)[] = [];

  if (columnVisibility.term) {
    headers.push('Term');
    fields.push('term');
  }
  if (columnVisibility.definition) {
    headers.push('Definition');
    fields.push('definition');
  }
  if (columnVisibility.categories) {
    headers.push('Categories');
    fields.push('category');
  }
  if (columnVisibility.relatedTerms) {
    headers.push('Related Terms');
    fields.push('related_terms');
  }
  if (columnVisibility.updated) {
    headers.push('Updated');
    fields.push('updated_at');
  }

  const csvContent = [
    headers.join(','),
    ...terms.map(term => 
      fields.map(field => {
        let value = term[field];
        
        if (Array.isArray(value)) {
          value = value.join('; ');
        } else if (field === 'updated_at') {
          value = new Date(value as string).toLocaleDateString();
        }
        
        // Escape CSV values
        const escaped = String(value || '').replace(/"/g, '""');
        return `"${escaped}"`;
      }).join(',')
    )
  ].join('\n');

  downloadFile(csvContent, `${filename}.csv`, 'text/csv');
}

function exportAsJSON(terms: GlossaryTerm[], filename: string) {
  const jsonContent = JSON.stringify({
    exportedAt: new Date().toISOString(),
    termCount: terms.length,
    terms: terms,
  }, null, 2);

  downloadFile(jsonContent, `${filename}.json`, 'application/json');
}

function downloadFile(content: string, filename: string, mimeType: string) {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
