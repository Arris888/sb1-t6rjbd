import React, { useCallback, useState, useRef } from 'react';
import { Upload, Loader2, Move } from 'lucide-react';

interface ImageUploadProps {
  onImageSelect: (file: File, croppedDataUrl: string) => void;
  preview: string | null;
  isProcessing: boolean;
}

export function ImageUpload({ onImageSelect, preview, isProcessing }: ImageUploadProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [scale, setScale] = useState(1);
  const imageRef = useRef<HTMLImageElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const dragStart = useRef<{ x: number; y: number } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith('image/')) {
      processImage(file);
    }
  }, []);

  const handleFileSelect = () => {
    fileInputRef.current?.click();
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      processImage(file);
    }
  };

  const processImage = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        setScale(1);
        setPosition({ x: 0, y: 0 });
        onImageSelect(file, e.target?.result as string);
      };
      img.src = e.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    if (isProcessing || !preview) return;
    dragStart.current = { x: e.clientX - position.x, y: e.clientY - position.y };
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!dragStart.current || isProcessing || !preview) return;
    const newX = e.clientX - dragStart.current.x;
    const newY = e.clientY - dragStart.current.y;
    setPosition({ x: newX, y: newY });
  };

  const handleMouseUp = () => {
    dragStart.current = null;
  };

  const handleWheel = (e: React.WheelEvent) => {
    if (isProcessing || !preview) return;
    e.preventDefault();
    const delta = e.deltaY * -0.01;
    const newScale = Math.max(0.1, Math.min(10, scale + delta));
    setScale(newScale);
  };

  return (
    <div className="relative">
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleChange}
        className="hidden"
        disabled={isProcessing}
      />
      <div
        onClick={handleFileSelect}
        onDrop={handleDrop}
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        ref={containerRef}
        className={`
          w-full h-64 rounded-xl border-2 border-dashed
          transition-all duration-300 ease-in-out
          ${preview ? 'border-transparent' : 'border-gray-300 hover:border-blue-500'}
          flex items-center justify-center overflow-hidden
          bg-gray-50 group-hover:bg-gray-100
          ${isProcessing ? 'opacity-75 cursor-not-allowed' : 'cursor-pointer'}
          ${isDragging ? 'border-blue-500 bg-blue-50' : ''}
        `}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onWheel={handleWheel}
      >
        {isProcessing ? (
          <div className="text-center p-6">
            <Loader2 className="mx-auto h-12 w-12 text-blue-500 animate-spin" />
            <p className="mt-2 text-sm text-gray-500">Processing image...</p>
          </div>
        ) : preview ? (
          <>
            <img
              ref={imageRef}
              src={preview}
              alt="Preview"
              className="absolute pointer-events-none select-none"
              style={{
                transform: `translate(${position.x}px, ${position.y}px) scale(${scale})`,
                transformOrigin: 'center',
                maxWidth: 'none',
                maxHeight: 'none',
              }}
            />
            <div className="absolute bottom-2 right-2 bg-black/50 text-white px-2 py-1 rounded-md text-sm flex items-center gap-1">
              <Move className="w-4 h-4" />
              Drag to adjust • Scroll to zoom
            </div>
          </>
        ) : (
          <div className="text-center p-6">
            <Upload className="mx-auto h-12 w-12 text-gray-400 group-hover:text-blue-500 transition-colors" />
            <p className="mt-2 text-sm text-gray-500">
              Drag and drop an image, or click to select
            </p>
            <p className="text-xs text-gray-400 mt-1">
              Supports PNG, JPG, WEBP up to 5MB
            </p>
          </div>
        )}
      </div>
    </div>
  );
}