"use client"

import { X, Image as ImageIcon, FileText, Video, Music } from "lucide-react";
import { MediaItem } from "./mediaTypes";

interface SelectedMediaProps {
  media: MediaItem;
  onRemove: () => void;
}

export default function SelectedMedia({ media, onRemove }: SelectedMediaProps) {
  const getFileIcon = (type: string) => {
    switch (type) {
      case 'image':
        return <ImageIcon className="w-4 h-4" />;
      case 'video':
        return <Video className="w-4 h-4" />;
      case 'audio':
        return <Music className="w-4 h-4" />;
      default:
        return <FileText className="w-4 h-4" />;
    }
  };

  return (
    <div className="flex items-center gap-2 bg-background rounded-lg p-2 border border-gray-200">
      <div className="w-8 h-8 bg-background rounded flex items-center justify-center">
        {media.type === 'image' ? (
          <img
            src={media.thumbnail || media.url}
            alt={media.name}
            className="w-full h-full object-cover rounded"
          />
        ) : (
          getFileIcon(media.type)
        )}
      </div>
      
      <span className="text-sm text-gray-700 dark:text-gray-50 flex-1 truncate max-w-32">
        {media.name}
      </span>
      
      <button
        onClick={onRemove}
        className="text-gray-500 dark:text-gray-50 hover:text-gray-700 dark:hover:text-gray-200 transition-colors p-1"
      >
        <X className="w-3 h-3" />
      </button>
    </div>
  );
}
