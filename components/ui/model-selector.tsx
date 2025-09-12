"use client"

import { useState, useRef, useEffect } from "react";
import { ChevronDown, Check } from "lucide-react";

export interface ModelOption {
  value: string;
  label: string;
  description?: string;
}

const modelOptions: ModelOption[] = [
  { value: "claude-4-sonnet", label: "claude-4-sonnet" },
  { value: "claude-4.1-opus", label: "claude-4.1-opus" },
  { value: "claude-4-opus", label: "claude-4-opus" },
];

interface ModelSelectorProps {
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
}

export default function ModelSelector({ value, onChange, disabled = false }: ModelSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isAutoMode, setIsAutoMode] = useState(true);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const selectedModel = modelOptions.find(model => model.value === value) || modelOptions[0];

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

  const handleModelSelect = (model: ModelOption) => {
    onChange(model.value);
    setIsOpen(false);
  };

  const toggleAutoMode = () => {
    setIsAutoMode(!isAutoMode);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => !disabled && setIsOpen(!isOpen)}
        disabled={disabled}
        className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-gray-700 border border-gray-200 hover:bg-gray-200 rounded-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <span>{isAutoMode ? "Auto" : selectedModel.label}</span>
        <ChevronDown className={`w-3 h-3 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 mt-1 bg-gray-900 text-white border border-gray-700 rounded-lg shadow-lg z-50 min-w-64">
          {isAutoMode ? (
            // Mode Auto avec switch
            <div className="p-4">
              <div className="flex items-center justify-between mb-2">
                <div>
                  <div className="text-xs font-medium text-white">Auto</div>
                  <div className="text-xs text-gray-400">
                    Balanced quality and speed,<br />
                    recommended for most tasks
                  </div>
                </div>
                <button
                  onClick={toggleAutoMode}
                  className={`relative inline-flex h-4 w-8 items-center rounded-full transition-colors ${
                    isAutoMode ? 'bg-gradient-to-r from-cyan-400 to-purple-400 ' : 'bg-gray-600'
                  }`}
                >
                  <span
                    className={`inline-block h-3 w-3 transform rounded-full bg-white transition-transform ${
                      isAutoMode ? 'translate-x-4.5' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>
            </div>
          ) : (
            // Mode sélection de modèles
            <div className="py-2">
              <div className="px-4 py-1 border-b border-gray-700">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-xs font-medium text-white">Auto</div>
                    <div className="text-xs text-gray-400">
                      Balanced quality and speed,<br />
                      recommended for most tasks
                    </div>
                  </div>
                  <button
                    onClick={toggleAutoMode}
                    className={`relative inline-flex h-4 w-8 items-center rounded-full transition-colors ${
                      isAutoMode ? 'bg-blue-600' : 'bg-gray-600'
                    }`}
                  >
                    <span
                      className={`inline-block h-3 w-3 transform rounded-full bg-white transition-transform ${
                        isAutoMode ? 'translate-x-5' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>
                {/* <div className="flex items-center gap-2 mt-2">
                  <span className="text-xs text-gray-400">MAX Mode</span>
                  <button
                    className="relative inline-flex h-6 w-11 items-center rounded-full bg-blue-600"
                  >
                    <span className="inline-block h-4 w-4 transform rounded-full bg-white translate-x-6" />
                  </button>
                </div> */}
              </div>
              
              {modelOptions.map((model) => (
                <button
                  key={model.value}
                  type="button"
                  onClick={() => handleModelSelect(model)}
                  className={`w-full flex items-center justify-between px-4 py-2 text-xs hover:bg-gray-800 transition-colors ${
                    model.value === value && !isAutoMode ? 'text-blue-400' : 'text-gray-300'
                  }`}
                >
                  <span>{model.label}</span>
                  {model.value === value && !isAutoMode && (
                    <Check className="w-3 h-3 text-blue-400" />
                  )}
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
