"use client"

import { Message } from "./types";
import { User, Bot, Sparkles, CheckCircle } from "lucide-react";

interface MessageBubbleProps {
  message: Message;
}

export default function MessageBubble({ message }: MessageBubbleProps) {
  const isUser = message.type === "user";
  const isConceptionSummary = message.isConceptionSummary;
  const isAssistantResponse = message.isAssistantResponse;

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
          
          {/* Affichage du média si présent */}
          {message.mediaUrl && (
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
