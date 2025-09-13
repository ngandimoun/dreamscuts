"use client"

import { Image } from "lucide-react";

interface ResultColumnProps {
  isGenerating: boolean;
  generationSteps: string[];
  currentStep: number;
  finalResult: string | null;
  user?: any;
}

export default function ResultColumn({
  isGenerating,
  generationSteps,
  currentStep,
  finalResult,
  user,
}: ResultColumnProps) {

  return (
    <div className="h-full flex flex-col bg-background">
      {/* Header simplifié */}
      <div className="border-b border-gray-100 dark:border-gray-800 p-3 bg-background flex-shrink-0">
        <div className="text-center">
          <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400">
            Results area
          </h3>
        </div>
      </div>

      {/* Contenu principal - Version simplifiée */}
      <div className="flex-1 min-h-0">
        <div className="h-full flex flex-col items-center justify-center p-6 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
          <div className="text-center">
            <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-600 rounded-full flex items-center justify-center">
              <Image className="w-8 h-8 text-gray-400 dark:text-gray-500" />
            </div>
            <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-2">
              Generation results
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 max-w-xs">
              Your generation results will appear here when complete
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
