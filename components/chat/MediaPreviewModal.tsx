"use client"

import { MediaItem } from "./mediaTypes";
import { Video, Music, FileText } from "lucide-react";

interface MediaPreviewModalProps {
  isOpen: boolean;
  media: MediaItem | null;
  position: { x: number; y: number } | null;
}

export default function MediaPreviewModal({ isOpen, media, position }: MediaPreviewModalProps) {
  if (!isOpen || !media || !position) return null;

  return (
    <div
      className="fixed z-50 pointer-events-none"
      style={{
        left: position.x,
        top: position.y - 10, // Position au-dessus de l'élément
        transform: 'translateX(-50%) translateY(-100%)', // Centrer horizontalement et positionner au-dessus
      }}
    >
      {/* Flèche vers le bas */}
      <div className="w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-800 mx-auto mb-1" />
      
      {/* Contenu du preview */}
      <div className="bg-background text-gray-500/80 dark:text-gray-50 rounded-lg shadow-2xl min-w-64 max-w-80">
        {media.type === 'image' ? (
          <div className="p-2">
            <img
              src={media.thumbnail || media.url}
              alt={media.name}
              className="w-full h-48 object-cover rounded-md"
            />
            <div className="mt-2 p-2">
              <h4 className="text-xs truncate text-gray-500/80 dark:text-gray-50">{media.name}</h4>
              <p className="text-xs text-gray-500/80 dark:text-gray-50 capitalize">{media.type}</p>
            </div>
          </div>
        ) : (
          <div className="p-4">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-background rounded-lg flex items-center justify-center">
                {media.type === 'video' ? (
                  <Video className="w-6 h-6 text-gray-500/80 dark:text-gray-50" />
                ) : media.type === 'audio' ? (
                  <Music className="w-6 h-6 text-gray-500/80 dark:text-gray-50" />
                ) : (
                  <FileText className="w-6 h-6 text-gray-500/80 dark:text-gray-50" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="font-medium text-xs truncate text-gray-500/80 dark:text-gray-50">{media.name}</h4>
                <p className="text-xs capitalize text-gray-500/80 dark:text-gray-50">{media.type}</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
