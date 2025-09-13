"use client"

import { useState, useRef, useEffect } from "react";
import { ChevronDown, Check, Image, Video, Music, Minus, Plus } from "lucide-react";

export interface MediaType {
  value: string;
  label: string;
  icon: React.ReactNode;
  description: string;
}

const mediaTypes: MediaType[] = [
  { 
    value: "image", 
    label: "Image", 
    icon: <Image className="w-3 h-3" />,
    description: "Generate images" 
  },
  { 
    value: "video", 
    label: "Video", 
    icon: <Video className="w-3 h-3" />,
    description: "Generate videos" 
  },
  { 
    value: "audio", 
    label: "Audio", 
    icon: <Music className="w-3 h-3" />,
    description: "Generate audio" 
  },
];

interface MediaTypeSelectorProps {
  value?: string;
  onChange: (value: string) => void;
  disabled?: boolean;
  onImageCountChange?: (count: number) => void;
  onVideoDurationChange?: (duration: number) => void;
  imageCount?: number;
  videoDuration?: number;
}

export default function MediaTypeSelector({ 
  value = "image", 
  onChange, 
  disabled = false,
  onImageCountChange,
  onVideoDurationChange,
  imageCount = 1,
  videoDuration = 5
}: MediaTypeSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [menuPosition, setMenuPosition] = useState<'bottom' | 'top'>('bottom');
  const dropdownRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  // S'assurer qu'une valeur par défaut est sélectionnée
  useEffect(() => {
    if (!value || value === "") {
      onChange("image");
    }
  }, [value, onChange]);

  const currentValue = value || "image";
  const selectedType = mediaTypes.find(type => type.value === currentValue) || mediaTypes[0];

  // Calculer la position du menu pour éviter les débordements
  useEffect(() => {
    if (isOpen && buttonRef.current) {
      const buttonRect = buttonRef.current.getBoundingClientRect();
      const viewportHeight = window.innerHeight;
      const menuHeight = 200; // Hauteur estimée du menu
      
      if (buttonRect.bottom + menuHeight > viewportHeight - 20) {
        setMenuPosition('top');
      } else {
        setMenuPosition('bottom');
      }
    }
  }, [isOpen]);

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

  const handleSelect = (type: MediaType) => {
    onChange(type.value);
    setIsOpen(false);
  };

  const handleImageCountChange = (newCount: number) => {
    if (newCount >= 1 && newCount <= 20 && onImageCountChange) {
      onImageCountChange(newCount);
    }
  };

  const handleVideoDurationChange = (newDuration: number) => {
    if (newDuration >= 5 && newDuration <= 180 && onVideoDurationChange) {
      onVideoDurationChange(newDuration);
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        ref={buttonRef}
        type="button"
        onClick={() => !disabled && setIsOpen(!isOpen)}
        disabled={disabled}
        className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <div className="flex items-center gap-1">
          {selectedType.icon}
          <span>{selectedType.label}</span>
        </div>
        <ChevronDown className={`w-3 h-3 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className={`absolute left-0 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-lg shadow-xl z-[9999] min-w-48 max-h-80 overflow-y-auto custom-scrollbar ${
          menuPosition === 'top' ? 'bottom-full mb-1' : 'top-full mt-1'
        }`}>
          {/* Options de type de média */}
          {mediaTypes.map((type) => (
            <button
              key={type.value}
              type="button"
              onClick={() => handleSelect(type)}
              className={`w-full flex items-center gap-3 px-3 py-3 text-xs hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors ${
                type.value === currentValue 
                  ? 'bg-purple-50 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300' 
                  : 'text-gray-700 dark:text-gray-300'
              }`}
            >
              {type.icon}
              <div className="flex-1 text-left">
                <div className="font-medium">{type.label}</div>
                <div className="text-gray-500 dark:text-gray-400 text-xs mt-0.5">{type.description}</div>
              </div>
              {type.value === currentValue && (
                <Check className="w-3 h-3 text-purple-600 dark:text-purple-400" />
              )}
            </button>
          ))}

          {/* Contrôles spécifiques selon le type sélectionné */}
          {currentValue === "image" && (
            <div className="border-t border-gray-200 dark:border-gray-600 px-3 py-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-gray-700 dark:text-gray-300">Number of images</span>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => handleImageCountChange(imageCount - 1)}
                    disabled={imageCount <= 1}
                    className="w-6 h-6 rounded-full bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 flex items-center justify-center transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Minus className="w-3 h-3" />
                  </button>
                  <span className="text-xs font-medium text-gray-700 dark:text-gray-300 min-w-[2rem] text-center">
                    {imageCount}
                  </span>
                  <button
                    type="button"
                    onClick={() => handleImageCountChange(imageCount + 1)}
                    disabled={imageCount >= 20}
                    className="w-6 h-6 rounded-full bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 flex items-center justify-center transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Plus className="w-3 h-3" />
                  </button>
                </div>
              </div>
            </div>
          )}

          {currentValue === "video" && (
            <div className="border-t border-gray-200 dark:border-gray-600 px-3 py-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-gray-700 dark:text-gray-300">Duration (s)</span>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => handleVideoDurationChange(videoDuration - 5)}
                    disabled={videoDuration <= 5}
                    className="w-6 h-6 rounded-full bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 flex items-center justify-center transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Minus className="w-3 h-3" />
                  </button>
                  <span className="text-xs font-medium text-gray-700 dark:text-gray-300 min-w-[3rem] text-center">
                    {videoDuration}s
                  </span>
                  <button
                    type="button"
                    onClick={() => handleVideoDurationChange(videoDuration + 5)}
                    disabled={videoDuration >= 180}
                    className="w-6 h-6 rounded-full bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 flex items-center justify-center transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Plus className="w-3 h-3" />
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
