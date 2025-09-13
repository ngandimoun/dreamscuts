"use client"

import { useState, useRef, useEffect } from "react";
import { MediaItem } from "./mediaTypes";

interface ImageHoverPreviewProps {
  media: MediaItem;
  children: React.ReactNode;
}

export default function ImageHoverPreview({ media, children }: ImageHoverPreviewProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [previewPosition, setPreviewPosition] = useState({ x: 0, y: 0 });
  const [imageLoaded, setImageLoaded] = useState(false);
  const hoverRef = useRef<HTMLDivElement>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    return () => {
      if (timeoutRef.current !== null) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  const handleMouseEnter = (e: React.MouseEvent) => {
    if (media.type !== 'image') return;
    
    const rect = hoverRef.current?.getBoundingClientRect();
    if (rect) {
      const viewportWidth = window.innerWidth;
      const previewWidth = 280; // Largeur de la prévisualisation (256px + padding)
      
      // Positionner à droite par défaut, mais à gauche si pas assez de place
      let x = rect.right + 10;
      if (x + previewWidth > viewportWidth) {
        x = rect.left - previewWidth - 10;
      }
      
      setPreviewPosition({
        x: Math.max(10, x), // Éviter de sortir à gauche
        y: rect.top,
      });
    }
    
    timeoutRef.current = setTimeout(() => {
      setIsHovered(true);
    }, 300); // Délai de 300ms avant d'afficher la prévisualisation
  };

  const handleMouseLeave = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    setIsHovered(false);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isHovered) return;
    
    const rect = hoverRef.current?.getBoundingClientRect();
    if (rect) {
      const viewportWidth = window.innerWidth;
      const previewWidth = 280; // Largeur de la prévisualisation (256px + padding)
      
      // Positionner à droite par défaut, mais à gauche si pas assez de place
      let x = rect.right + 10;
      if (x + previewWidth > viewportWidth) {
        x = rect.left - previewWidth - 10;
      }
      
      setPreviewPosition({
        x: Math.max(10, x), // Éviter de sortir à gauche
        y: rect.top,
      });
    }
  };

  return (
    <>
      <div
        ref={hoverRef}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onMouseMove={handleMouseMove}
        className="relative"
      >
        {children}
      </div>

      {/* Prévisualisation au survol */}
      {isHovered && media.type === 'image' && (
        <div
          className="fixed z-50 pointer-events-none"
          style={{
            left: `${previewPosition.x}px`,
            top: `${previewPosition.y}px`,
            transform: 'translateY(-50%)',
          }}
        >
          <div className="bg-background border border-gray-200 rounded-md shadow-2xl p-2">
            <div className="relative w-64 h-40">
              {!imageLoaded && (
                <div className="w-64 h-40 bg-gray-100 dark:bg-gray-800 rounded flex items-center justify-center">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-purple-600"></div>
                </div>
              )}
              <img
                src={media.url}
                alt={media.name}
                className={`w-64 h-40 object-contain rounded transition-opacity duration-200 ${
                  imageLoaded ? 'opacity-100' : 'opacity-0'
                }`}
                style={{
                  width: '256px',
                  height: '160px',
                  objectFit: 'contain'
                }}
                onLoad={() => setImageLoaded(true)}
                onError={() => setImageLoaded(true)}
              />
              <div className="absolute bottom-2 left-2 right-2 bg-black/70 text-white text-xs p-2 rounded">
                <p className="truncate font-medium">{media.name}</p>
                <p className="text-gray-300 capitalize">{media.source}</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
