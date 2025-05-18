
/**
 * Parses a filename to extract make, model and year information
 * Format patterns like: make-model-year.pdf, make_model_year.pdf, etc.
 */
export const parseFileName = (fileName: string) => {
  // Remove .pdf or other extensions
  const baseName = fileName.replace(/\.[^/.]+$/, "");
  
  // Split by common separators
  const parts = baseName.split(/[-_\s]+/);
  
  // Simple extraction logic
  let make = '';
  let model = '';
  let year: number | null = null;
  
  if (parts.length >= 3) {
    // Try to find year (usually the last part or second-to-last part)
    for (let i = parts.length - 1; i >= 0; i--) {
      const yearCandidate = parseInt(parts[i], 10);
      if (!isNaN(yearCandidate) && yearCandidate > 1900 && yearCandidate <= new Date().getFullYear() + 1) {
        year = yearCandidate;
        parts.splice(i, 1); // Remove year from parts
        break;
      }
    }
    
    // First part is usually make
    make = parts[0] || '';
    
    // Rest is model
    model = parts.slice(1).join(' ');
  } else if (parts.length === 2) {
    make = parts[0] || '';
    
    // Check if second part is a year
    const yearCandidate = parseInt(parts[1], 10);
    if (!isNaN(yearCandidate) && yearCandidate > 1900 && yearCandidate <= new Date().getFullYear() + 1) {
      year = yearCandidate;
    } else {
      model = parts[1] || '';
    }
  } else if (parts.length === 1) {
    make = parts[0] || '';
  }

  // Capitalize make and model
  make = make.charAt(0).toUpperCase() + make.slice(1);
  model = model.charAt(0).toUpperCase() + model.slice(1);

  return {
    make,
    model,
    year
  };
};
