
import React from 'react';

export default function BrandSlideshowBackground() {
  return (
    <>
      {/* Background with smoke effect */}
      <div className="absolute inset-0 bg-gradient-to-br from-explorer-dark via-explorer-dark-light to-explorer-dark opacity-90" />
      <div className="absolute inset-0 bg-explorer-smoke opacity-20" />
    </>
  );
}
