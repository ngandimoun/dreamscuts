"use client"

import { useState } from "react";
import { Message } from "./types";
import { MediaItem } from "./mediaTypes";
import MessageBubble from "./MessageBubble";
import ChatInput from "./ChatInput";
import ThinkingState from "./ThinkingState";

interface ChatColumnProps {
  messages: Message[];
  onSendMessage: (content: string, mediaItems?: MediaItem[]) => void;
  isGenerating: boolean;
  generationSteps: string[];
  currentStep: number;
  finalResult: string | null;
}

export default function ChatColumn({
  messages,
  onSendMessage,
  isGenerating,
  generationSteps,
  currentStep,
  finalResult,
}: ChatColumnProps) {
  const [inputValue, setInputValue] = useState("");
  const [selectedMedia, setSelectedMedia] = useState<MediaItem[]>([]);

  const handleSendMessage = (mediaItems?: MediaItem[]) => {
    if (inputValue.trim() || (mediaItems && mediaItems.length > 0)) {
      onSendMessage(inputValue.trim(), mediaItems);
      setInputValue("");
      setSelectedMedia([]);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage(selectedMedia);
    }
  };

  return (
    <div className="flex flex-col h-full overflow-hidden">
      {/* Zone des messages avec scroll local uniquement */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4 custom-scrollbar">
        {messages
          .filter((message) => message.type === "user")
          .map((message) => (
            <MessageBubble key={message.id} message={message} />
          ))}
        
        {/* État de réflexion de l'IA - seulement pendant la génération */}
        {isGenerating && (
          <ThinkingState 
            generationSteps={generationSteps}
            currentStep={currentStep}
            isGenerating={isGenerating}
            finalResult={finalResult}
          />
        )}
      </div>

      {/* Zone de saisie fixe en bas */}
      <div className="border-t border-gray-200 p-4 bg-background flex-shrink-0">
        <ChatInput
          value={inputValue}
          onChange={setInputValue}
          onSend={() => handleSendMessage(selectedMedia)}
          onKeyPress={handleKeyPress}
          disabled={isGenerating}
          selectedMedia={selectedMedia}
          onMediaChange={setSelectedMedia}
        />
      </div>
    </div>
  );
}
