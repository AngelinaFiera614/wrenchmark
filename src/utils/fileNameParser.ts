
/**
 * Parses a filename to extract make, model, year and other metadata information
 * Format patterns like: make-model-year.pdf, make_model_year.pdf, etc.
 */
export const parseFileName = (fileName: string) => {
  // Remove .pdf or other extensions
  const baseName = fileName.replace(/\.[^/.]+$/, "");
  
  console.log("Parsing filename:", fileName, "Base name:", baseName);
  
  // Handle common prefixes that should be removed
  const cleanName = baseName.replace(/^(manual|service|workshop|repair|owner|handbook|guide)[\s\-_]+/i, '');
  
  // Split by common separators
  const parts = cleanName.split(/[-_\s]+/);
  console.log("Parts after splitting:", parts);
  
  let make = '';
  let model = '';
  let year: number | null = null;
  let suggestedTags: string[] = [];
  
  // Known motorcycle makes for better identification
  const knownMakes = [
    'honda', 'yamaha', 'suzuki', 'kawasaki', 'harley', 'davidson', 'harleydavidson',
    'bmw', 'ducati', 'triumph', 'ktm', 'aprilia', 'royalenfield', 'royal', 'enfield',
    'indian', 'victory', 'buell', 'husqvarna', 'moto', 'guzzi', 'motoguzzi'
  ];
  
  // Extract possible tags from filename
  const lowerFileName = fileName.toLowerCase();
  
  // Extract manual type as potential tag
  if (lowerFileName.includes('owner') || lowerFileName.includes('user')) {
    suggestedTags.push('owner');
  }
  if (lowerFileName.includes('service') || lowerFileName.includes('repair') || 
      lowerFileName.includes('workshop') || lowerFileName.includes('maintenance')) {
    suggestedTags.push('service');
  }
  if (lowerFileName.includes('wiring') || lowerFileName.includes('diagram') || 
      lowerFileName.includes('electric') || lowerFileName.includes('schematic')) {
    suggestedTags.push('wiring');
  }
  
  // Add language tag if detectable
  if (lowerFileName.includes('english') || lowerFileName.includes('eng') || 
      lowerFileName.includes('en')) {
    suggestedTags.push('english');
  }
  if (lowerFileName.includes('spanish') || lowerFileName.includes('esp') || 
      lowerFileName.includes('es')) {
    suggestedTags.push('spanish');
  }
  if (lowerFileName.includes('french') || lowerFileName.includes('fr')) {
    suggestedTags.push('french');
  }
  
  // Try to find year (usually a 4-digit number between 1900 and current year + 1)
  for (let i = 0; i < parts.length; i++) {
    const yearCandidate = parseInt(parts[i], 10);
    if (!isNaN(yearCandidate) && yearCandidate >= 1900 && yearCandidate <= new Date().getFullYear() + 1) {
      year = yearCandidate;
      parts.splice(i, 1); // Remove year from parts
      break;
    }
  }
  
  // Try to identify known make in the first few parts
  for (let i = 0; i < Math.min(3, parts.length); i++) {
    const lowerPart = parts[i].toLowerCase();
    if (knownMakes.includes(lowerPart)) {
      make = parts[i];
      parts.splice(i, 1);
      
      // Handle special cases like "royal enfield" that might be split
      if (lowerPart === 'royal' && parts.length > 0 && parts[0].toLowerCase() === 'enfield') {
        make = 'Royal Enfield';
        parts.splice(0, 1);
      } else if (lowerPart === 'harley' && parts.length > 0 && parts[0].toLowerCase() === 'davidson') {
        make = 'Harley Davidson';
        parts.splice(0, 1);
      } else if (lowerPart === 'moto' && parts.length > 0 && parts[0].toLowerCase() === 'guzzi') {
        make = 'Moto Guzzi';
        parts.splice(0, 1);
      }
      break;
    }
  }
  
  // If no make was found, use first part as make
  if (!make && parts.length > 0) {
    make = parts[0];
    parts.splice(0, 1);
  }
  
  // Remaining parts form the model
  model = parts.join(' ');
  
  // Capitalize make and model
  make = make.charAt(0).toUpperCase() + make.slice(1);
  if (model) {
    model = model.charAt(0).toUpperCase() + model.slice(1);
  }
  
  console.log("Parsed result:", { make, model, year, suggestedTags });
  
  return {
    make,
    model,
    year,
    suggestedTags
  };
};
