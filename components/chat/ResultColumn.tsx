"use client"

import { useEffect, useState } from "react";
import { Sparkles, Image, Video, FileText, Download, Share2 } from "lucide-react";
import { FinalResult } from "./FinalResult";

interface ResultColumnProps {
  isGenerating: boolean;
  generationSteps: string[];
  currentStep: number;
  finalResult: string | null;
}

export default function ResultColumn({
  isGenerating,
  generationSteps,
  currentStep,
  finalResult,
}: ResultColumnProps) {
  const [animationPhase, setAnimationPhase] = useState(0);

  // Gérer les phases d'animation
  useEffect(() => {
    if (isGenerating) {
      const interval = setInterval(() => {
        setAnimationPhase(prev => (prev + 1) % 4);
      }, 800);
      
      return () => clearInterval(interval);
    }
  }, [isGenerating]);

  return (
    <div className="h-full flex flex-col bg-background">
      {/* Header moderne et épuré */}
      <div className="border-b border-gray-100 dark:border-gray-800 p-4 bg-background flex-shrink-0">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
              Résultat de la génération
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-50">
              {isGenerating ? "Génération en cours..." : "Résultat final"}
            </p>
          </div>
          {!isGenerating && finalResult && (
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-sm text-green-600 dark:text-green-400 font-medium">
                Terminé
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Contenu principal - Optimisé pour l'adaptation */}
      <div className="flex-1 min-h-0">
        {isGenerating ? (
          // État de génération avec animations modernes
          <div className="h-full flex flex-col items-center justify-center p-6 bg-gradient-to-br from-purple-50 to-blue-50 dark:from-purple-950 dark:to-blue-950">
            {/* Animation principale moderne */}
            <div className="relative mb-8">
              {/* Cercle de base avec gradient moderne */}
              <div className="w-32 h-32 rounded-full bg-gradient-to-r from-purple-400 via-blue-500 to-purple-600 flex items-center justify-center shadow-2xl">
                <div className="w-24 h-24 rounded-full bg-gradient-to-r from-purple-300 via-blue-400 to-purple-500 flex items-center justify-center">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-r from-purple-200 via-blue-300 to-purple-400 flex items-center justify-center">
                    <Sparkles className="w-8 h-8 text-white animate-pulse" />
                  </div>
                </div>
              </div>

              {/* Particules animées améliorées */}
              {[...Array(8)].map((_, i) => (
                <div
                  key={i}
                  className="absolute w-3 h-3 bg-gradient-to-r from-purple-400 to-blue-400 rounded-full animate-ping shadow-lg"
                  style={{
                    top: `${50 + 40 * Math.sin((i * Math.PI * 2) / 8)}%`,
                    left: `${50 + 40 * Math.cos((i * Math.PI * 2) / 8)}%`,
                    animationDelay: `${i * 0.1}s`,
                    animationDuration: '1.5s'
                  }}
                />
              ))}
            </div>

            {/* Barre de progression moderne */}
            <div className="w-full max-w-md mb-6">
              <div className="flex justify-between text-sm text-gray-700 dark:text-gray-300 mb-2">
                <span className="font-medium">Progression</span>
                <span className="font-semibold text-purple-600 dark:text-purple-400">
                  {Math.round((currentStep / generationSteps.length) * 100)}%
                </span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 overflow-hidden">
                <div 
                  className="bg-gradient-to-r from-purple-500 via-blue-500 to-purple-600 h-2 rounded-full transition-all duration-700 ease-out shadow-lg"
                  style={{ width: `${(currentStep / generationSteps.length) * 100}%` }}
                />
              </div>
            </div>

            {/* Étape actuelle avec design moderne */}
            <div className="text-center mb-6">
              <div className="inline-flex items-center gap-2 bg-background text-purple-800 dark:text-purple-200 px-4 py-2 rounded-full shadow-lg border border-purple-100 dark:border-purple-900">
                <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse"></div>
                <span className="text-sm font-semibold">
                  {generationSteps[currentStep - 1] || "Initialisation..."}
                </span>
              </div>
            </div>

            {/* Animation secondaire moderne */}
            <div className="flex space-x-2">
              {[...Array(4)].map((_, i) => (
                <div
                  key={i}
                  className={`w-2 h-2 rounded-full transition-all duration-500 ${
                    animationPhase === i ? 'bg-purple-500 scale-150 shadow-lg' : 'bg-gray-300 dark:bg-gray-600'
                  }`}
                />
              ))}
            </div>
          </div>
        ) : (
          // Résultat final - Directement intégré sans conteneurs supplémentaires
          finalResult ? (
            <FinalResult />
          ) : (
            // État d'attente avec design moderne
            <div className="h-full flex flex-col items-center justify-center p-6 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
              <div className="text-center">
                <div className="w-20 h-20 mx-auto mb-4 bg-gradient-to-r from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-600 rounded-full flex items-center justify-center">
                  <Image className="w-10 h-10 text-gray-400 dark:text-gray-500" />
                </div>
                <h3 className="text-base font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  En attente du résultat
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Votre génération sera affichée ici une fois terminée
                </p>
              </div>
            </div>
          )
        )}
      </div>
    </div>
  );
}
