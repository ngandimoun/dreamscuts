"use client"

import { useState, useRef, useEffect } from "react";
import { ChevronDown, Check } from "lucide-react";

export interface AspectRatio {
  value: string;
  label: string;
  width: number;
  height: number;
}

const aspectRatios: AspectRatio[] = [
  { value: "Auto", label: "Auto", width: 0, height: 0 },
  { value: "16:9", label: "16:9", width: 16, height: 9 },
  { value: "4:3", label: "4:3", width: 4, height: 3 },
  { value: "1:1", label: "1:1", width: 1, height: 1 },
  { value: "3:2", label: "3:2", width: 3, height: 2 },
  { value: "21:9", label: "21:9", width: 21, height: 9 },
  { value: "9:16", label: "9:16", width: 9, height: 16 },
  { value: "3:4", label: "3:4", width: 3, height: 4 },
];

interface AspectRatioSelectorProps {
  value?: string;
  onChange: (value: string) => void;
  disabled?: boolean;
}

export default function AspectRatioSelector({ value = "Auto", onChange, disabled = false }: AspectRatioSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const selectedRatio = aspectRatios.find(ratio => ratio.value === value) || aspectRatios[0];

  // S'assurer que "Auto" est sélectionné par défaut
  useEffect(() => {
    if (!value || value === "") {
      onChange("Auto");
    }
  }, [value, onChange]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleSelect = (ratio: AspectRatio) => {
    onChange(ratio.value);
    setIsOpen(false);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => !disabled && setIsOpen(!isOpen)}
        disabled={disabled}
        className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-gray-700 border border-gray-200 hover:bg-gray-200 rounded-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <div className="flex items-center gap-1">
          {selectedRatio.value === "Auto" ? (
            <div className="w-3 h-2 bg-background border border-gray-400 rounded flex items-center justify-center">
              <div className="w-1.5 h-1 bg-gray-400 rounded-sm"></div>
            </div>
          ) : (
            <div
              className="w-3 bg-background border border-gray-400 rounded"
              style={{
                aspectRatio: `${selectedRatio.width}/${selectedRatio.height}`
              }}
            />
          )}
          <span>{selectedRatio.label}</span>
        </div>
        <ChevronDown className={`w-3 h-3 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-50 min-w-32">
          {aspectRatios.map((ratio) => (
            <button
              key={ratio.value}
              type="button"
              onClick={() => handleSelect(ratio)}
              className={`w-full flex items-center gap-2 px-3 py-2 text-xs hover:bg-gray-50 transition-colors ${ratio.value === value ? 'bg-purple-50 text-purple-700' : 'text-gray-700'
                }`}
            >
               {ratio.value === "Auto" ? (
                 <div className="w-3 h-2 bg-background border border-gray-400 rounded flex items-center justify-center">
                   <div className="w-1.5 h-1 bg-gray-400 rounded-sm"></div>
                 </div>
               ) : (
                 <div
                   className="w-3 bg-background border border-gray-400 rounded"
                   style={{
                     aspectRatio: `${ratio.width}/${ratio.height}`
                   }}
                 />
               )}
               <span>{ratio.label}</span>
               {ratio.value === value && (
                 <Check className="w-3 h-3 text-purple-600 ml-auto" />
               )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
