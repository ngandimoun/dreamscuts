"use client"

import { useState, useEffect, useRef } from "react";
import { X, Play, Pause, Volume2, VolumeX, Download, ExternalLink, MoreVertical, MessageCircle, MapPin, Info, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { MediaItem } from "./mediaTypes";
import HorizontalWaveform from "./HorizontalWaveform";

interface MediaPreviewModalProps {
  isOpen: boolean;
  media: MediaItem | null;
  onClose: () => void;
}

export default function MediaPreviewModal({ isOpen, media, onClose }: MediaPreviewModalProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [mediaDimensions, setMediaDimensions] = useState({ width: 0, height: 0 });
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    if (!isOpen) {
      setIsPlaying(false);
      setCurrentTime(0);
    }
  }, [isOpen]);

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

  const handlePlayPause = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
    }
  };

  const handleMuteToggle = () => {
    if (audioRef.current) {
      audioRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const handleTimeUpdate = (e: React.SyntheticEvent<HTMLVideoElement | HTMLAudioElement>) => {
    setCurrentTime(e.currentTarget.currentTime);
  };

  const handleLoadedMetadata = (e: React.SyntheticEvent<HTMLVideoElement | HTMLAudioElement>) => {
    setDuration(e.currentTarget.duration);
    if ('videoWidth' in e.currentTarget) {
      setMediaDimensions({
        width: e.currentTarget.videoWidth,
        height: e.currentTarget.videoHeight
      });
    }
  };

  const handleImageLoad = (e: React.SyntheticEvent<HTMLImageElement>) => {
    setMediaDimensions({
      width: e.currentTarget.naturalWidth,
      height: e.currentTarget.naturalHeight
    });
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const handleDownload = () => {
    if (media?.url) {
      const link = document.createElement('a');
      link.href = media.url;
      link.download = media.name;
      link.target = '_blank';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const handleExternalLink = () => {
    if (media?.originalData) {
      let externalUrl = '';
      
      switch (media.source) {
        case 'pexels':
          externalUrl = media.originalData.url;
          break;
        case 'pixabay':
          externalUrl = media.originalData.pageURL;
          break;
        case 'unsplash':
          externalUrl = media.originalData.links.html;
          break;
        case 'freesound':
          externalUrl = media.originalData.url;
          break;
      }
      
      if (externalUrl) {
        window.open(externalUrl, '_blank');
      }
    }
  };

  if (!isOpen || !media) return null;

  // Calculer la taille optimale de la modal basée sur le type de média
  const getModalSize = () => {
    if (media?.type === 'audio') {
      return 'max-w-2xl';
    }
    if (media?.type === 'image' && mediaDimensions.width > 0 && mediaDimensions.height > 0) {
      const aspectRatio = mediaDimensions.width / mediaDimensions.height;
      if (aspectRatio > 2) {
        return 'max-w-7xl'; // Images très larges
      } else if (aspectRatio > 1.5) {
        return 'max-w-6xl'; // Images larges
      } else {
        return 'max-w-5xl'; // Images normales
      }
    }
    if (media?.type === 'video' && mediaDimensions.width > 0 && mediaDimensions.height > 0) {
      const aspectRatio = mediaDimensions.width / mediaDimensions.height;
      // Tailles fixes et responsives pour les vidéos
      if (aspectRatio > 2.5) {
        return 'max-w-7xl'; // Vidéos ultra-larges (21:9, cinéma)
      } else if (aspectRatio > 1.7) {
        return 'max-w-6xl'; // Vidéos larges (16:9, standard)
      } else if (aspectRatio > 1.2) {
        return 'max-w-5xl'; // Vidéos normales (4:3, classique)
      } else {
        return 'max-w-4xl'; // Vidéos verticales ou carrées
      }
    }
    return 'max-w-6xl'; // Par défaut pour les vidéos
  };

  // Calculer les dimensions fixes et responsives pour la vidéo
  const getVideoDimensions = () => {
    if (media?.type === 'video' && mediaDimensions.width > 0 && mediaDimensions.height > 0) {
      const aspectRatio = mediaDimensions.width / mediaDimensions.height;
      
      // Tailles fixes basées sur le ratio d'aspect
      if (aspectRatio > 2.5) {
        // Vidéos ultra-larges (21:9, cinéma) - 1920x800
        return {
          width: '100%',
          height: 'auto',
          maxWidth: '100%',
          maxHeight: '60vh',
          aspectRatio: '21/9'
        };
      } else if (aspectRatio > 1.7) {
        // Vidéos larges (16:9, standard) - 1920x1080
        return {
          width: '100%',
          height: 'auto',
          maxWidth: '100%',
          maxHeight: '70vh',
          aspectRatio: '16/9'
        };
      } else if (aspectRatio > 1.2) {
        // Vidéos normales (4:3, classique) - 1024x768
        return {
          width: '100%',
          height: 'auto',
          maxWidth: '100%',
          maxHeight: '75vh',
          aspectRatio: '4/3'
        };
      } else {
        // Vidéos verticales ou carrées - 720x720
        return {
          width: 'auto',
          height: 'auto',
          maxWidth: '50%',
          maxHeight: '80vh',
          aspectRatio: '1/1'
        };
      }
    }
    
    // Dimensions par défaut pour les vidéos
    return {
      width: '100%',
      height: 'auto',
      maxWidth: '100%',
      maxHeight: '70vh',
      aspectRatio: '16/9'
    };
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div 
      className="fixed inset-0 bg-black/90 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={handleBackdropClick}
    >
      <div className={`bg-background rounded-2xl shadow-2xl w-full ${getModalSize()} max-h-[90vh] flex flex-col relative overflow-hidden`}>
        {/* Bouton de fermeture en haut à droite */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 bg-black/50 hover:bg-black/70 text-white rounded-full p-2 transition-all duration-200 hover:scale-110"
          title="Fermer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-700">
          <div className="flex-1 pr-16">
            <h2 className="text-xl font-semibold text-white truncate">
              {media.name}
            </h2>
            <p className="text-sm text-gray-400 capitalize mt-1">
              {media.type} • {media.source}
            </p>
          </div>
          {/* <div className="flex items-center gap-3">
            <Button
              onClick={handleDownload}
              variant="outline"
              size="sm"
              className="flex items-center gap-2 bg-gray-800 border-gray-600 text-white hover:bg-gray-700"
            >
              <Download className="w-4 h-4" />
              Download
            </Button>
            <Button
              onClick={handleExternalLink}
              variant="outline"
              size="sm"
              className="flex items-center gap-2 bg-gray-800 border-gray-600 text-white hover:bg-gray-700"
            >
              <ExternalLink className="w-4 h-4" />
              View Original
            </Button>
          </div> */}
        </div>

        {/* Content */}
        <div className="flex-1 flex items-center justify-center p-4 bg-background">
          {media.type === 'image' ? (
            <div className="relative w-full h-full flex items-center justify-center overflow-hidden rounded-lg">
              <img
                src={media.url}
                alt={media.name}
                className="max-w-full max-h-full object-contain rounded-lg shadow-2xl"
                onLoad={handleImageLoad}
                style={{
                  maxWidth: '100%',
                  maxHeight: '100%',
                  width: 'auto',
                  height: 'auto'
                }}
              />
            </div>
          ) : media.type === 'video' ? (
            <div className="relative w-full h-full flex items-center justify-center rounded-lg bg-black">
              <video
                src={media.url}
                className="object-contain rounded-lg shadow-2xl"
                controls
                preload="metadata"
                onTimeUpdate={handleTimeUpdate}
                onLoadedMetadata={handleLoadedMetadata}
                onPlay={() => setIsPlaying(true)}
                onPause={() => setIsPlaying(false)}
                onEnded={() => setIsPlaying(false)}
                style={{
                  ...getVideoDimensions(),
                  objectFit: 'contain',
                  display: 'block'
                }}
              />
            </div>
          ) : media.type === 'audio' ? (
            <div className="w-full max-w-4xl">
              <div className="bg-white rounded-2xl p-8 shadow-lg">
                {/* Forme d'onde horizontale comme dans l'image */}
                <div className="mb-6">
                  <div className="h-16 bg-gray-100 rounded-lg p-4">
                    <HorizontalWaveform
                      audioUrl={media.url}
                      isPlaying={isPlaying}
                      currentTime={currentTime}
                      duration={duration}
                      onPlayPause={handlePlayPause}
                      className="w-full h-full"
                    />
                  </div>
                </div>
                
                {/* Nom du fichier */}
                <h3 className="text-lg font-bold text-gray-900 mb-2">
                  {media.name}
                </h3>
                
                {/* Artiste */}
                <p className="text-red-500 text-sm mb-2">
                  {media.artist || media.source || "Unknown Artist"}
                </p>
                
                
                
                
                {/* Audio élément caché pour la gestion des événements */}
                <audio
                  src={media.url}
                  ref={(audio) => {
                    if (audio) {
                      audioRef.current = audio;
                    }
                  }}
                  onTimeUpdate={handleTimeUpdate}
                  onLoadedMetadata={handleLoadedMetadata}
                  onPlay={() => setIsPlaying(true)}
                  onPause={() => setIsPlaying(false)}
                  onEnded={() => setIsPlaying(false)}
                  className="hidden"
                />
              </div>
            </div>
          ) : null}
        </div>

      </div>
    </div>
  );
}