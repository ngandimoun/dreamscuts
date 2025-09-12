"use client"

import { useState, useEffect, useRef, useCallback } from "react";
import { Message } from "./types";
import ChatColumn from "./ChatColumn";
import ResultColumn from "./ResultColumn";

interface ChatInterfaceProps {
  initialPrompt: string;
  onBack: () => void;
}

export default function ChatInterface({ initialPrompt, onBack }: ChatInterfaceProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      type: "user",
      content: initialPrompt,
      timestamp: new Date(),
    },
  ]);
  const [isGenerating, setIsGenerating] = useState(true);
  const [generationSteps, setGenerationSteps] = useState<string[]>([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [finalResult, setFinalResult] = useState<string | null>(null);
  
  // États pour le redimensionnement
  const [leftColumnWidth, setLeftColumnWidth] = useState(50); // Pourcentage
  const [isResizing, setIsResizing] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Gestion du redimensionnement
  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    setIsResizing(true);
    document.body.classList.add('resizing');
  }, []);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!isResizing || !containerRef.current) return;

    const containerRect = containerRef.current.getBoundingClientRect();
    const newLeftWidth = ((e.clientX - containerRect.left) / containerRect.width) * 100;
    
    // Limiter le redimensionnement entre 20% et 80%
    const clampedWidth = Math.max(20, Math.min(80, newLeftWidth));
    setLeftColumnWidth(clampedWidth);
  }, [isResizing]);

  const handleMouseUp = useCallback(() => {
    setIsResizing(false);
    document.body.classList.remove('resizing');
  }, []);

  // Ajouter/retirer les event listeners
  useEffect(() => {
    if (isResizing) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isResizing, handleMouseMove, handleMouseUp]);

  // Simuler la génération des étapes et du résultat final
  const simulateGeneration = async () => {
    setIsGenerating(true);
    
    // Simuler les étapes de génération
    const steps = [
      "Étape 1: Analyse de la demande",
      "Étape 2: Conception de l'idée",
      "Étape 3: Préparation des ressources",
      "Étape 4: Génération du contenu",
      "Étape 5: Finalisation et optimisation"
    ];
    
    setGenerationSteps(steps);
    
    // Simuler l'affichage progressif des étapes
    for (let i = 0; i < steps.length; i++) {
      await new Promise(resolve => setTimeout(resolve, 1500));
      setCurrentStep(i + 1);
    }
    
    // Simuler la génération du résultat final
    await new Promise(resolve => setTimeout(resolve, 2000));
    setFinalResult("Résultat généré avec succès !");
    setIsGenerating(false);
    
    // SUPPRIMÉ : L'ajout des messages dupliqués est maintenant géré par ThinkingState
  };

  // Démarrer la simulation au montage du composant
  useEffect(() => {
    simulateGeneration();
  }, []);

  const addMessage = (content: string) => {
    const newMessage: Message = {
      id: Date.now().toString(),
      type: "user",
      content,
      timestamp: new Date(),
    };
    setMessages(prev => [...prev, newMessage]);
  };

  return (
    <div className="fixed inset-0 bg-background z-50">
      {/* Header avec bouton retour */}
      <header className="border-b border-gray-200 bg-background px-6 py-4">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-gray-600 dark:text-gray-50 hover:text-gray-800 dark:hover:text-gray-200 transition-colors"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Retour à la création
        </button>
      </header>

      {/* Interface en deux colonnes redimensionnables */}
      <div 
        ref={containerRef}
        className="flex h-[calc(100vh-80px)] relative"
      >
        {/* Colonne de gauche - Chat */}
        <div 
          className="border-r border-gray-200 relative"
          style={{ width: `${leftColumnWidth}%` }}
        >
          <ChatColumn
            messages={messages}
            onSendMessage={addMessage}
            isGenerating={isGenerating}
            generationSteps={generationSteps}
            currentStep={currentStep}
            finalResult={finalResult}
          />
        </div>

        {/* Séparateur redimensionnable */}
        <div
          className="resize-handle"
          style={{ left: `calc(${leftColumnWidth}% - 2px)` }}
          onMouseDown={handleMouseDown}
          title="Redimensionner les colonnes"
        />

        {/* Colonne de droite - Résultats */}
        <div 
          className="relative"
          style={{ width: `${100 - leftColumnWidth}%` }}
        >
          <ResultColumn
            isGenerating={isGenerating}
            generationSteps={generationSteps}
            currentStep={currentStep}
            finalResult={finalResult}
          />
        </div>
      </div>
    </div>
  );
}
