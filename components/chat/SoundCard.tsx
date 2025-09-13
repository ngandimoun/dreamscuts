"use client"

import { useState } from "react";
import { Download, MessageCircle, MapPin, Info, Star, Eye } from "lucide-react";
import { MediaItem } from "./mediaTypes";
import Waveform from "./Waveform";

interface SoundCardProps {
  media: MediaItem;
  onSelect: (media: MediaItem) => void;
  onPreview: (media: MediaItem) => void;
}

export default function SoundCard({ media, onSelect, onPreview }: SoundCardProps) {
  const [isPlaying, setIsPlaying] = useState(false);

  const handlePlay = () => {
    setIsPlaying(true);
  };

  const handlePause = () => {
    setIsPlaying(false);
  };

  const handlePreview = (e: React.MouseEvent) => {
    e.stopPropagation();
    onPreview(media);
  };

  // Extraire les métadonnées du son
  const getMetadata = () => {
    return {
      artist: media.artist || media.source || "Unknown Artist",
      downloads: media.downloads || 0,
      rating: media.rating ? media.rating.toFixed(1) : "0.0",
      comments: media.comments || 0,
      hasLocation: media.hasLocation || false,
      date: media.uploadedAt?.toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      }) || "Unknown date"
    };
  };

  const metadata = getMetadata();

  return (
    <div
      onClick={() => onSelect(media)}
      className="group cursor-pointer bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 hover:border-purple-300 dark:hover:border-purple-600 transition-all duration-200 hover:shadow-lg"
    >
      {/* Waveform */}
      <div className="p-4">
        <div className="h-16 mb-3">
          <Waveform
            audioUrl={media.url}
            duration={media.duration || 0}
            isPlaying={isPlaying}
            onPlay={handlePlay}
            onPause={handlePause}
            className="h-full"
          />
        </div>

        {/* Titre */}
        <h3 className="font-bold text-white dark:text-gray-100 text-sm mb-1 line-clamp-2">
          {media.name}
        </h3>

        {/* Artiste */}
        <p className="text-red-500 text-sm mb-2">
          {metadata.artist}
        </p>

        {/* Métadonnées et statistiques */}
        

        {/* Description (si disponible) */}
        {media.description && (
          <p className="text-gray-400 text-xs mt-2 line-clamp-2">
            {media.description}
          </p>
        )}

        {/* Bouton de prévisualisation */}
        <div className="mt-3 flex justify-end">
          <button
            onClick={handlePreview}
            className="opacity-0 group-hover:opacity-100 transition-opacity bg-purple-600 hover:bg-purple-700 text-white rounded-full p-1.5"
            title="Preview"
          >
            <Eye className="w-3 h-3" />
          </button>
        </div>
      </div>
    </div>
  );
}
