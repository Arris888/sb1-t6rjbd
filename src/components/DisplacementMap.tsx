import React from 'react';
import { ImageIcon, Download } from 'lucide-react';

interface DisplacementMapProps {
  originalImage: string | null;
  displacementMap: string | null;
}

export function DisplacementMap({ originalImage, displacementMap }: DisplacementMapProps) {
  if (!originalImage || !displacementMap) return null;

  const handleDownload = (dataUrl: string, filename: string) => {
    const link = document.createElement('a');
    link.href = dataUrl;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-6xl mx-auto">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-medium text-gray-900 flex items-center gap-2">
            <ImageIcon className="w-5 h-5" />
            Original Image
          </h3>
          <button
            onClick={() => handleDownload(originalImage, 'original-image.png')}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-500 text-white hover:bg-blue-600 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            <Download className="w-4 h-4" />
            Download
          </button>
        </div>
        <div className="aspect-square rounded-lg overflow-hidden bg-white shadow-lg">
          <img
            src={originalImage}
            alt="Original"
            className="w-full h-full object-contain"
          />
        </div>
      </div>
      
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-medium text-gray-900 flex items-center gap-2">
            <ImageIcon className="w-5 h-5" />
            Displacement Map
          </h3>
          <button
            onClick={() => handleDownload(displacementMap, 'displacement-map.png')}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-500 text-white hover:bg-blue-600 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            <Download className="w-4 h-4" />
            Download
          </button>
        </div>
        <div className="aspect-square rounded-lg overflow-hidden bg-white shadow-lg">
          <img
            src={displacementMap}
            alt="Displacement Map"
            className="w-full h-full object-contain"
          />
        </div>
      </div>
    </div>
  );
}