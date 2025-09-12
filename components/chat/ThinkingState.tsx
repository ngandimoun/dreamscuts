"use client"

import { Sparkles, CheckCircle, Clock } from "lucide-react";

interface ThinkingStateProps {
  generationSteps: string[];
  currentStep: number;
  isGenerating: boolean;
  finalResult: string | null;
}

export default function ThinkingState({ 
  generationSteps, 
  currentStep, 
  isGenerating,
  finalResult 
}: ThinkingStateProps) {
  // Si la génération est terminée, afficher le résultat final
  if (!isGenerating && finalResult) {
    return (
      <div className="space-y-4">
        {/* Résumé de Conception */}
        <div className="flex justify-start">
          <div className="flex items-start gap-3 max-w-[80%]">
            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-purple-500 flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-2xl px-4 py-3 border border-purple-200 text-purple-800">
              <div className="mb-2 pb-2 border-b border-purple-200">
                <h4 className="font-semibold text-purple-700 flex items-center gap-2">
                  <Sparkles className="w-4 h-4" />
                  Résumé de Conception
                </h4>
              </div>
              <div className="text-sm leading-relaxed">
                🎨 **Analyse de votre demande** : J'ai analysé votre prompt et identifié les éléments clés pour créer une image qui correspond exactement à vos attentes.

                💡 **Conception créative** : J'ai développé une approche artistique qui combine les éléments visuels que vous avez mentionnés avec des techniques modernes de design.

                🔧 **Choix techniques** : J'ai sélectionné les meilleures méthodes de génération pour garantir un résultat de haute qualité et fidèle à votre vision.

                ✨ **Innovation** : J'ai ajouté des touches créatives uniques pour rendre votre création vraiment spéciale.
              </div>
            </div>
          </div>
        </div>

        {/* Réponse de l'Assistant */}
        <div className="flex justify-start">
          <div className="flex items-start gap-3 max-w-[80%]">
            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-green-500 flex items-center justify-center">
              <CheckCircle className="w-4 h-4 text-white" />
            </div>
            <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl px-4 py-3 border border-green-200 text-green-800">
              <div className="mb-2 pb-2 border-b border-green-200">
                <h4 className="font-semibold text-green-700 flex items-center gap-2">
                  <CheckCircle className="w-4 h-4" />
                  Réponse de l'Assistant
                </h4>
              </div>
              <div className="text-sm leading-relaxed">
                🖼️ **Image créée** : Une composition artistique moderne qui capture l'essence de votre idée

                🎯 **Détails techniques** : Résolution haute qualité, style cohérent, couleurs harmonieuses

                💎 **Points forts** : Design unique, composition équilibrée, impact visuel immédiat

                L'image est maintenant prête dans la colonne de droite. Vous pouvez la télécharger ou la partager selon vos besoins !
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // État de génération normal
  return (
    <div className="flex justify-start">
      <div className="flex items-start gap-3 max-w-[80%]">
        {/* Avatar de l'IA */}
        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-purple-500 flex items-center justify-center">
          <Sparkles className="w-4 h-4 text-white animate-pulse" />
        </div>

        {/* État de réflexion */}
        <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-2xl px-4 py-3 border border-purple-200">
          {/* Indicateur de réflexion */}
          <div className="flex items-center gap-2 mb-3">
            <div className="flex space-x-1">
              <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce"></div>
              <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
              <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
            </div>
            <span className="text-sm font-medium text-purple-700">IA en réflexion...</span>
          </div>

          {/* Étapes de génération */}
          <div className="space-y-2">
            {generationSteps.map((step, index) => {
              const isCompleted = index < currentStep;
              const isActive = index === currentStep - 1;
              
              return (
                <div
                  key={index}
                  className={`flex items-center gap-2 text-sm transition-all duration-500 ${
                    isCompleted 
                      ? "text-green-700" 
                      : isActive 
                        ? "text-purple-700 font-medium" 
                        : "text-gray-500"
                  }`}
                >
                  {isCompleted ? (
                    <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0" />
                  ) : isActive ? (
                    <Clock className="w-4 h-4 text-purple-600 flex-shrink-0 animate-spin" />
                  ) : (
                    <div className="w-4 h-4 rounded-full border-2 border-gray-300 flex-shrink-0" />
                  )}
                  
                  <span className={isActive ? "animate-pulse" : ""}>
                    {step}
                  </span>
                  
                  {isActive && (
                    <div className="ml-2">
                      <div className="w-2 h-2 bg-purple-500 rounded-full animate-ping"></div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Message de contexte */}
          {currentStep > 0 && (
            <div className="mt-3 pt-3 border-t border-purple-200">
              <p className="text-xs text-purple-600">
                L'IA analyse votre demande et prépare une réponse détaillée...
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
