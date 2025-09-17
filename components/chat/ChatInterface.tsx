"use client"

import { useState, useEffect, useRef, useCallback } from "react";
import { Message } from "./types";
import { MediaItem } from "./mediaTypes";
import ChatColumn from "./ChatColumn";
import ResultColumn from "./ResultColumn";
import QueryAnalyzerIntegration from "./QueryAnalyzerIntegration";
import { HomeIcon, Sidebar } from "lucide-react";
import { Button } from "../ui/button";
import { ThemeToggle } from "../ui/theme-toggle";
import { useQueryAnalyzer, type BriefPackage } from "@/hooks/useQueryAnalyzer";

interface ChatInterfaceProps {
  initialPrompt: string;
  initialMedia?: MediaItem[];
  onBack: () => void;
  user?: any;
  initialParameters?: {
    mediaType?: string;
    aspectRatio?: string;
    imageCount?: number;
    videoDuration?: number;
  };
}

export default function ChatInterface({ initialPrompt, initialMedia, onBack, user, initialParameters }: ChatInterfaceProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: `initial-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      type: "user",
      content: initialPrompt,
      timestamp: new Date(),
      mediaItems: initialMedia || [],
    },
  ]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationSteps, setGenerationSteps] = useState<string[]>([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [finalResult, setFinalResult] = useState<string | null>(null);
  const [currentBrief, setCurrentBrief] = useState<BriefPackage | null>(null);
  const [analysisError, setAnalysisError] = useState<string | null>(null);
  const [userParameters, setUserParameters] = useState(initialParameters || {});
  
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

  // Real Query Analyzer integration
  const handleAnalysisComplete = (brief: BriefPackage) => {
    setCurrentBrief(brief);
    setAnalysisError(null);
    
    // Update generation steps based on real analysis
    const steps = [
      "Step 1: Query Analysis Complete",
      "Step 2: Asset Processing Plan Ready",
      "Step 3: Creative Options Generated",
      "Step 4: Brief Package Created",
      "Step 5: Ready for Next Steps"
    ];
    
    setGenerationSteps(steps);
    setCurrentStep(steps.length);
    setFinalResult("Analysis completed successfully!");
    setIsGenerating(false);
    
    // Add real assistant response based on brief
    addRealAssistantResponse(brief);
  };

  const handleAnalysisError = (error: string) => {
    setAnalysisError(error);
    setIsGenerating(false);
    setFinalResult("Analysis failed");
    
    // Add error message to chat
    const errorMessage: Message = {
      id: `error-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      type: "assistant",
      content: `❌ **Analysis Failed**: ${error}\n\nPlease try again with a different query or check your assets.`,
      timestamp: new Date(),
      isError: true,
    };
    setMessages(prev => [...prev, errorMessage]);
  };

  // Real assistant response based on brief analysis
  const addRealAssistantResponse = (brief: BriefPackage) => {
    const analysisSummary: Message = {
      id: `assistant-analysis-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      type: "assistant",
      content: `🎯 **Query Analysis Complete** : I've analyzed your request and identified the key elements for your creative project.

📊 **Asset Analysis** : Processed ${Object.keys(brief.analysis || {}).length} asset types with specialized AI models.

💡 **Creative Options** : Generated ${brief.plan?.creativeOptions?.length || 0} creative approaches tailored to your vision.

🔧 **Processing Plan** : Created a detailed plan for ${Object.keys(brief.plan?.assetProcessing || {}).length} assets with specific enhancement steps.

✨ **Brief Package** : Your creative brief (ID: ${brief.briefId}) is ready for the next steps in the DreamCut pipeline!`,
      timestamp: new Date(),
      isConceptionSummary: true,
    };

    const creativeOptions: Message = {
      id: `assistant-options-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      type: "assistant",
      content: `🎨 **Creative Options Generated** :

${(brief.plan?.creativeOptions || []).slice(0, 3).map((option, index) => 
  `**Option ${index + 1}**: ${option.title || `Creative Approach ${index + 1}`}\n${option.description || 'AI-generated creative direction'}\n`
).join('\n')}

💰 **Cost Estimate** : ${brief.plan?.costEstimate ? `${brief.plan.costEstimate.toFixed(2)} credits` : 'Calculating...'}

📋 **Next Steps** : Your brief is ready! The system will now proceed with asset processing and content generation based on your selected creative direction.`,
      timestamp: new Date(),
      isAssistantResponse: true,
    };

    setMessages(prev => [...prev, analysisSummary, creativeOptions]);
  };

  const addMessage = (content: string, mediaItems?: MediaItem[]) => {
    const newMessage: Message = {
      id: `msg-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      type: "user",
      content,
      timestamp: new Date(),
      mediaItems: mediaItems || [],
    };
    setMessages(prev => [...prev, newMessage]);
    
    // Reset states for new analysis
    setCurrentBrief(null);
    setAnalysisError(null);
    setFinalResult(null);
    setGenerationSteps([]);
    setCurrentStep(0);
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
            
            {/* Query Analyzer Integration */}
            {messages.length > 0 && !currentBrief && !analysisError && (
              <div className="p-4 border-t border-gray-200">
                <QueryAnalyzerIntegration
                  query={messages[messages.length - 1]?.content || initialPrompt}
                  mediaItems={messages[messages.length - 1]?.mediaItems || initialMedia || []}
                  userParameters={userParameters}
                  onAnalysisComplete={handleAnalysisComplete}
                  onError={handleAnalysisError}
                />
              </div>
            )}
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
            currentBrief={currentBrief}
            analysisError={analysisError}
            userParameters={userParameters}
            mediaItems={messages[messages.length - 1]?.mediaItems || initialMedia || []}
          />
        </div>
      </div>
    </div>
  );
}
