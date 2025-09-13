"use client"

import { useState, useEffect, useRef, useCallback } from "react";
import { Message } from "./types";
import { MediaItem } from "./mediaTypes";
import ChatColumn from "./ChatColumn";
import ResultColumn from "./ResultColumn";
import { HomeIcon, Sidebar } from "lucide-react";
import { Button } from "../ui/button";
import { ThemeToggle } from "../ui/theme-toggle";

interface ChatInterfaceProps {
  initialPrompt: string;
  initialMedia?: MediaItem[];
  onBack: () => void;
  user?: any;
}

export default function ChatInterface({ initialPrompt, initialMedia, onBack, user }: ChatInterfaceProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: `initial-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      type: "user",
      content: initialPrompt,
      timestamp: new Date(),
      mediaItems: initialMedia || [],
    },
  ]);
  const [isGenerating, setIsGenerating] = useState(true);
  const [generationSteps, setGenerationSteps] = useState<string[]>([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [finalResult, setFinalResult] = useState<string | null>(null);
  
  // États pour le redimensionnement et la visibilité
  const [leftColumnWidth, setLeftColumnWidth] = useState(30); // 35% par défaut
  const [isLeftColumnVisible, setIsLeftColumnVisible] = useState(true);
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
    
    // Limiter le redimensionnement entre 25% et 70%
    const clampedWidth = Math.max(25, Math.min(70, newLeftWidth));
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
    
    // Ajouter les réponses de l'assistant au tableau des messages
    addAssistantResponse();
  };

  // Fonction pour ajouter la réponse de l'assistant
  const addAssistantResponse = () => {
    const conceptionSummary: Message = {
      id: `assistant-conception-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      type: "assistant",
      content: `🎨 **Analyse de votre demande** : J'ai analysé votre prompt et identifié les éléments clés pour créer une image qui correspond exactement à vos attentes.

💡 **Conception créative** : J'ai développé une approche artistique qui combine les éléments visuels que vous avez mentionnés avec des techniques modernes de design.

🔧 **Choix techniques** : J'ai sélectionné les meilleures méthodes de génération pour garantir un résultat de haute qualité et fidèle à votre vision.

✨ **Innovation** : J'ai ajouté des touches créatives uniques pour rendre votre création vraiment spéciale.`,
      timestamp: new Date(),
      isConceptionSummary: true,
    };

    const assistantResponse: Message = {
      id: `assistant-response-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      type: "assistant",
      content: `🖼️ **Image créée** : Une composition artistique moderne qui capture l'essence de votre idée

🎯 **Détails techniques** : Résolution haute qualité, style cohérent, couleurs harmonieuses

💎 **Points forts** : Design unique, composition équilibrée, impact visuel immédiat

L'image est maintenant prête dans la colonne de droite. Vous pouvez la télécharger ou la partager selon vos besoins !`,
      timestamp: new Date(),
      isAssistantResponse: true,
    };

    setMessages(prev => [...prev, conceptionSummary, assistantResponse]);
  };

  // Démarrer la simulation au montage du composant
  useEffect(() => {
    simulateGeneration();
  }, []);

  const addMessage = (content: string, mediaItems?: MediaItem[]) => {
    const newMessage: Message = {
      id: `msg-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      type: "user",
      content,
      timestamp: new Date(),
      mediaItems: mediaItems || [],
    };
    setMessages(prev => [...prev, newMessage]);
    
    // Déclencher une nouvelle génération de réponse
    if (content.trim() || (mediaItems && mediaItems.length > 0)) {
      simulateGeneration();
    }
  };

  return (
    <div className="fixed inset-0 bg-background z-50">
      {/* Header avec bouton retour et toggle */}
      <header className="bg-background px-6 py-2">
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-sm cursor-pointer text-gray-600 dark:text-gray-50 hover:text-gray-800 dark:hover:text-gray-200 transition-colors"
          >
           <HomeIcon className="w-4 h-4" />
            Back to creation
          </button>
          
          <Button
            onClick={() => setIsLeftColumnVisible(!isLeftColumnVisible)}
            className="flex items-center justify-center cursor-pointer w-7 h-7 text-gray-600 dark:text-gray-50 hover:text-gray-800 dark:hover:text-gray-200 transition-colors"
            title={isLeftColumnVisible ? "Hide chat" : "Show chat"}
          >
            <Sidebar className="w-4 h-4" />
          </Button>

          <ThemeToggle />
        </div>
      </header>

      {/* Interface en deux colonnes redimensionnables */}
      <div 
        ref={containerRef}
        className="flex h-[calc(100vh-80px)] relative"
      >
        {/* Colonne de gauche - Chat */}
        {isLeftColumnVisible && (
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
        )}

        {/* Colonne de droite - Résultats */}
        <div 
          className={`relative ${isLeftColumnVisible ? 'rounded-md' : 'rounded-md'} rounded-md border border-gray-200 m-2 group`}
          style={{ width: isLeftColumnVisible ? `calc(${100 - leftColumnWidth}% - 16px)` : 'calc(100% - 16px)' }}
        >
          {/* Zone de redimensionnement intégrée dans la bordure gauche de la colonne droite */}
          {isLeftColumnVisible && (
            <div
              className="absolute top-0 left-0 w-1 h-full cursor-col-resize opacity-0 group-hover:opacity-100 transition-opacity duration-200 bg-blue-400 hover:bg-blue-500 shadow-lg rounded-l-md"
              onMouseDown={handleMouseDown}
              title="Resize columns"
            />
          )}
          
          <ResultColumn
            isGenerating={isGenerating}
            generationSteps={generationSteps}
            currentStep={currentStep}
            finalResult={finalResult}
            user={user}
          />
        </div>
      </div>
    </div>
  );
}
