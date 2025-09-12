"use client"

import { useState } from "react";
import { Message } from "./types";
import MessageBubble from "./MessageBubble";
import ChatInput from "./ChatInput";
import ThinkingState from "./ThinkingState";

interface ChatColumnProps {
  messages: Message[];
  onSendMessage: (content: string) => void;
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

  const handleSendMessage = () => {
    if (inputValue.trim()) {
      onSendMessage(inputValue.trim());
      setInputValue("");
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="flex flex-col h-full overflow-hidden">
      {/* Zone des messages avec scroll local uniquement */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
        {messages.map((message) => (
          <MessageBubble key={message.id} message={message} />
        ))}
        
        {/* État de réflexion de l'IA */}
        {isGenerating && (
          <ThinkingState 
            generationSteps={generationSteps}
            currentStep={currentStep}
            isGenerating={isGenerating}
            finalResult={finalResult}
          />
        )}
        
        {/* Afficher le résultat final même quand la génération est terminée */}
        {!isGenerating && finalResult && (
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
          onSend={handleSendMessage}
          onKeyPress={handleKeyPress}
          disabled={isGenerating}
        />
      </div>
    </div>
  );
}
