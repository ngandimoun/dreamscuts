"use client"

import { useState, useEffect, useRef } from "react";
import { X, Save, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { MediaItem } from "./mediaTypes";

interface DescriptionModalProps {
  isOpen: boolean;
  media: MediaItem | null;
  onClose: () => void;
  onSave: (description: string) => void;
}

export default function DescriptionModal({ isOpen, media, onClose, onSave }: DescriptionModalProps) {
  const [description, setDescription] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [imageLoading, setImageLoading] = useState(true);
  const [imageError, setImageError] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Réinitialiser la description quand le modal s'ouvre
  useEffect(() => {
    if (isOpen && media) {
      setDescription(media.description || "");
      setImageLoading(true);
      setImageError(false);
      // Focus sur le textarea après un court délai pour l'animation
      setTimeout(() => {
        textareaRef.current?.focus();
      }, 100);
    }
  }, [isOpen, media]);

  // Gestion de la touche Échap pour fermer la modal
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
      // Empêcher le scroll du body quand la modal est ouverte
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  const handleSave = async () => {
    if (isLoading) return;
    
    setIsLoading(true);
    try {
      onSave(description.trim());
      onClose();
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setDescription(media?.description || "");
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
      e.preventDefault();
      handleSave();
    }
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  if (!isOpen || !media) return null;

  return (
    <div 
      className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={handleBackdropClick}
    >
      <div className="bg-background rounded-2xl shadow-2xl w-full max-w-md border border-gray-200 dark:border-gray-700 overflow-hidden animate-in fade-in-0 zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20">
          <div className="flex-1">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-50">
              Description of the media
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1 truncate">
              {media.name}
            </p>
          </div>
          <button
            onClick={onClose}
            className="ml-4 p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors"
            title="Close"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Preview du média */}
          <div className="mb-4">
            <div className="w-full bg-gray-100 dark:bg-gray-800 rounded-lg overflow-hidden flex items-center justify-center relative">
              {media.type === 'image' ? (
                <div className="w-full flex items-center justify-center p-2 relative">
                  {imageLoading && (
                    <div className="absolute inset-0 flex items-center justify-center bg-gray-100 dark:bg-gray-800 rounded">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                    </div>
                  )}
                  {imageError ? (
                    <div className="w-full h-32 flex items-center justify-center bg-gray-200 dark:bg-gray-700 rounded">
                      <div className="text-center">
                        <div className="w-12 h-12 bg-red-100 dark:bg-red-900 rounded-full flex items-center justify-center mx-auto mb-2">
                          <svg className="w-6 h-6 text-red-600 dark:text-red-400" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                          </svg>
                        </div>
                        <p className="text-xs text-gray-600 dark:text-gray-400">Loading error</p>
                      </div>
                    </div>
                  ) : (
                    <img
                      src={media.thumbnail || media.url}
                      alt={media.name}
                      className={`max-w-full max-h-48 w-auto h-auto object-contain rounded transition-opacity duration-200 ${
                        imageLoading ? 'opacity-0' : 'opacity-100'
                      }`}
                      style={{
                        maxHeight: '192px', // 12rem
                        maxWidth: '100%',
                        width: 'auto',
                        height: 'auto'
                      }}
                      onLoad={(e) => {
                        const img = e.target as HTMLImageElement;
                        setImageLoading(false);
                        setImageError(false);
                        
                        // Ajuster la hauteur du conteneur selon l'image
                        const container = img.parentElement?.parentElement;
                        if (container && img.naturalHeight > 0) {
                          const aspectRatio = img.naturalWidth / img.naturalHeight;
                          const maxWidth = 400; // Largeur maximale du conteneur
                          const maxHeight = 192; // Hauteur maximale
                          
                          let displayWidth = maxWidth;
                          let displayHeight = maxWidth / aspectRatio;
                          
                          if (displayHeight > maxHeight) {
                            displayHeight = maxHeight;
                            displayWidth = maxHeight * aspectRatio;
                          }
                          
                          container.style.height = `${displayHeight + 16}px`; // +16px pour le padding
                        }
                      }}
                      onError={() => {
                        setImageLoading(false);
                        setImageError(true);
                      }}
                    />
                  )}
                </div>
              ) : media.type === 'video' ? (
                <div className="w-full h-32 flex items-center justify-center bg-gray-200 dark:bg-gray-700">
                  <div className="text-center">
                    <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mx-auto mb-2">
                      <svg className="w-6 h-6 text-blue-600 dark:text-blue-400" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M2 6a2 2 0 012-2h6a2 2 0 012 2v8a2 2 0 01-2 2H4a2 2 0 01-2-2V6zM14.553 7.106A1 1 0 0014 8v4a1 1 0 00.553.894l2 1A1 1 0 0018 13V7a1 1 0 00-1.447-.894l-2 1z" />
                      </svg>
                    </div>
                    <p className="text-xs text-gray-600 dark:text-gray-400">Video</p>
                  </div>
                </div>
              ) : media.type === 'audio' ? (
                <div className="w-full h-32 flex items-center justify-center bg-gray-200 dark:bg-gray-700">
                  <div className="text-center">
                    <div className="w-12 h-12 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mx-auto mb-2">
                      <svg className="w-6 h-6 text-green-600 dark:text-green-400" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.617.814L4.617 14H2a1 1 0 01-1-1V7a1 1 0 011-1h2.617l3.766-2.814a1 1 0 011-.11zM14.657 2.929a1 1 0 011.414 0A9.972 9.972 0 0119 10a9.972 9.972 0 01-2.929 7.071 1 1 0 01-1.414-1.414A7.971 7.971 0 0017 10c0-2.21-.894-4.208-2.343-5.657a1 1 0 010-1.414zm-2.829 2.828a1 1 0 011.415 0A5.983 5.983 0 0115 10a5.984 5.984 0 01-1.757 4.243 1 1 0 01-1.415-1.415A3.984 3.984 0 0013 10a3.983 3.983 0 00-1.172-2.828 1 1 0 010-1.415z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <p className="text-xs text-gray-600 dark:text-gray-400">Audio</p>
                  </div>
                </div>
              ) : (
                <div className="w-full h-32 flex items-center justify-center bg-gray-200 dark:bg-gray-700">
                  <div className="text-center">
                    <div className="w-12 h-12 bg-gray-100 dark:bg-gray-900 rounded-full flex items-center justify-center mx-auto mb-2">
                      <svg className="w-6 h-6 text-gray-600 dark:text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <p className="text-xs text-gray-600 dark:text-gray-400">Document</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Zone de saisie */}
          <div className="space-y-4">
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Description
              </label>
              <textarea
                ref={textareaRef}
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Add a description for this media..."
                className="w-full h-32 px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none transition-all duration-200 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400"
                disabled={isLoading}
              />
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                Use Ctrl+Enter to save quickly
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-6 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
          <Button
            onClick={handleReset}
            variant="outline"
            size="sm"
            disabled={isLoading || description === (media.description || "")}
            className="flex items-center gap-2"
          >
            <RotateCcw className="w-4 h-4" />
            Reset
          </Button>
          
          <div className="flex items-center gap-3">
            <Button
              onClick={onClose}
              variant="outline"
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button
              onClick={handleSave}
              disabled={isLoading || description.trim() === (media.description || "")}
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white"
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Backup...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  Save
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
