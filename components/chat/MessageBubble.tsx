"use client"

import { Message } from "./types";
import { MediaItem } from "./mediaTypes";
import { User, Bot, Sparkles, CheckCircle, Play, Pause, Volume2 } from "lucide-react";
import { useState } from "react";

interface MessageBubbleProps {
  message: Message;
}

export default function MessageBubble({ message }: MessageBubbleProps) {
  const isUser = message.type === "user";
  const isConceptionSummary = message.isConceptionSummary;
  const isAssistantResponse = message.isAssistantResponse;
  const [playingAudio, setPlayingAudio] = useState<string | null>(null);

  // Helper function to render a single media item
  const renderMediaItem = (media: MediaItem, isInGrid = false, index = 0) => {
    const isAudio = media.type === 'audio';
    const isVideo = media.type === 'video';
    const isImage = media.type === 'image';
    const isDocument = media.type === 'document';

    if (isAudio) {
      return (
        <div key={`${media.id}_${index}`} className="bg-gray-100 dark:bg-gray-800 rounded-lg p-2 flex items-center gap-2 max-w-xs">
          <button
            type="button"
            onClick={() => {
              const audio = new Audio(media.url);
              if (playingAudio === media.id) {
                audio.pause();
                setPlayingAudio(null);
              } else {
                audio.play();
                setPlayingAudio(media.id);
                audio.onended = () => setPlayingAudio(null);
              }
            }}
            className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-500 text-white flex items-center justify-center hover:bg-blue-600 transition-colors"
          >
            {playingAudio === media.id ? (
              <Pause className="w-3 h-3" />
            ) : (
              <Play className="w-3 h-3 ml-0.5" />
            )}
          </button>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1">
              <Volume2 className="w-3 h-3 text-gray-500" />
              <span className="text-xs font-medium truncate">{media.name}</span>
            </div>
            {media.duration && (
              <span className="text-xs text-gray-500">
                {Math.floor(media.duration / 60)}:{(media.duration % 60).toString().padStart(2, '0')}
              </span>
            )}
          </div>
        </div>
      );
    }

    if (isVideo) {
      const maxSize = isInGrid ? '150px' : '200px';
      const maxWidth = isInGrid ? '200px' : '320px';
      
      return (
        <div key={`${media.id}_${index}`} className="relative max-w-xs">
          <video 
            src={media.url} 
            controls 
            className="w-full h-auto rounded-lg"
            poster={media.thumbnail}
            style={{ 
              maxHeight: maxSize,
              maxWidth: maxWidth,
              minHeight: '60px'
            }}
            preload="metadata"
          />
          {media.name && (
            <div className="text-xs text-gray-500 mt-1 truncate">{media.name}</div>
          )}
        </div>
      );
    }

    if (isImage) {
      const maxSize = isInGrid ? '150px' : '200px';
      const maxWidth = isInGrid ? '200px' : '320px';
      
      return (
        <div key={`${media.id}_${index}`} className="relative max-w-xs">
          <img 
            src={media.url} 
            alt={media.name || "Media"} 
            className="w-full h-auto rounded-lg object-cover cursor-pointer hover:opacity-90 transition-opacity"
            style={{ 
              maxHeight: maxSize,
              maxWidth: maxWidth,
              minHeight: '60px'
            }}
            loading="lazy"
          />
          {media.name && (
            <div className="text-xs text-gray-500 mt-1 truncate">{media.name}</div>
          )}
        </div>
      );
    }

    if (isDocument) {
      return (
        <div key={`${media.id}_${index}`} className="bg-gray-100 dark:bg-gray-800 rounded-lg p-2 flex items-center gap-2 max-w-xs">
          <div className="flex-shrink-0 w-6 h-6 rounded bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
            <span className="text-xs font-medium text-gray-600 dark:text-gray-300">
              {media.name.split('.').pop()?.toUpperCase()}
            </span>
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-xs font-medium truncate">{media.name}</div>
            {media.fileSize && (
              <span className="text-xs text-gray-500">
                {(media.fileSize / 1024 / 1024).toFixed(1)} MB
              </span>
            )}
          </div>
        </div>
      );
    }

    return null;
  };

  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"}`}>
      <div className={`flex items-start gap-3 max-w-[80%] ${isUser ? "flex-row-reverse" : "flex-row"}`}>
        {/* Avatar */}
        <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
          isUser ? "bg-blue-500" : "bg-purple-500"
        }`}>
          {isUser ? (
            <User className="w-4 h-4 text-white" />
          ) : (
            <Bot className="w-4 h-4 text-white" />
          )}
        </div>

        {/* Contenu du message */}
        <div className={`rounded-2xl px-4 py-3 ${
          isUser 
            ? "bg-blue-500 text-white" 
            : isConceptionSummary
              ? "bg-gradient-to-r from-purple-50 to-blue-50 border border-purple-200 text-purple-800"
              : isAssistantResponse
                ? "bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 text-green-800"
                : "bg-background text-gray-800 dark:text-gray-50"
        }`}>
          {/* Titre spécial pour les messages de conception et de réponse */}
          {isConceptionSummary && (
            <div className="mb-2 pb-2 border-b border-purple-200">
              <h4 className="font-semibold text-purple-700 flex items-center gap-2">
                <Sparkles className="w-4 h-4" />
                Résumé de Conception
              </h4>
            </div>
          )}
          
          {isAssistantResponse && (
            <div className="mb-2 pb-2 border-b border-green-200">
              <h4 className="font-semibold text-green-700 flex items-center gap-2">
                <CheckCircle className="w-4 h-4" />
                Réponse de l'Assistant
              </h4>
            </div>
          )}
          
          <div className="text-sm leading-relaxed whitespace-pre-line">{message.content}</div>
          
          {/* Affichage des médias si présents */}
          {(message.mediaItems && message.mediaItems.length > 0) && (
            <div className="mt-3 space-y-2">
              {message.mediaItems.length === 1 ? (
                // Un seul média : affichage normal
                renderMediaItem(message.mediaItems[0], false)
              ) : (
                // Plusieurs médias : grille responsive
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-w-md">
                  {message.mediaItems.map((media, index) => renderMediaItem(media, true, index))}
                </div>
              )}
            </div>
          )}
          
          {/* Support pour l'ancien format mediaUrl (deprecated) */}
          {message.mediaUrl && !message.mediaItems && (
            <div className="mt-3">
              {message.mediaUrl.match(/\.(jpg|jpeg|png|gif|webp)$/i) ? (
                <img 
                  src={message.mediaUrl} 
                  alt="Media" 
                  className="max-w-full rounded-lg"
                />
              ) : message.mediaUrl.match(/\.(mp4|webm|mov)$/i) ? (
                <video 
                  src={message.mediaUrl} 
                  controls 
                  className="max-w-full rounded-lg"
                />
              ) : (
                <div className="bg-background rounded-lg p-3 text-center">
                  <span className="text-xs text-gray-600 dark:text-gray-50">Fichier joint</span>
                </div>
              )}
            </div>
          )}
          
          {/* Timestamp */}
          <div className={`text-xs mt-2 ${
            isUser ? "text-blue-100" : "text-gray-500 dark:text-gray-50"
          }`}>
            {message.timestamp.toLocaleTimeString([], { 
              hour: '2-digit', 
              minute: '2-digit' 
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
