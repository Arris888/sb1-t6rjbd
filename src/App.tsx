import React, { useState, useCallback, useRef, useEffect } from 'react';
import { ImageUpload } from './components/ImageUpload';
import { DisplacementMap } from './components/DisplacementMap';
import { Wand2 } from 'lucide-react';
import { WebGLService } from './services/webgl';

function App() {
  const [originalImage, setOriginalImage] = useState<string | null>(null);
  const [displacementMap, setDisplacementMap] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const webglService = useRef<WebGLService>();

  useEffect(() => {
    webglService.current = new WebGLService();
  }, []);

  const handleImageSelect = useCallback(async (file: File, croppedDataUrl: string) => {
    setIsProcessing(true);
    try {
      setOriginalImage(croppedDataUrl);

      // Generate displacement map
      if (webglService.current) {
        const displacement = await webglService.current.generateDisplacementMap(croppedDataUrl);
        setDisplacementMap(displacement);
      }
    } catch (error) {
      console.error('Error processing image:', error);
      alert('Failed to process image. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 flex items-center justify-center gap-3 mb-4">
            <Wand2 className="w-8 h-8 text-blue-500" />
            Displacement Map Generator
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Transform your images into stunning displacement maps with WebGL.
            Perfect for creating dynamic visual effects and textures.
          </p>
        </div>

        <div className="max-w-xl mx-auto mb-12">
          <ImageUpload
            onImageSelect={handleImageSelect}
            preview={originalImage}
            isProcessing={isProcessing}
          />
        </div>

        {originalImage && displacementMap && (
          <div className="mt-16 animate-fade-in">
            <DisplacementMap
              originalImage={originalImage}
              displacementMap={displacementMap}
            />
          </div>
        )}
      </div>
    </div>
  );
}

export default App;