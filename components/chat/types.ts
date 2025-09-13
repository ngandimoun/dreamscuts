import { MediaItem } from "./mediaTypes";

export interface Message {
  id: string;
  type: "user" | "assistant";
  content: string;
  timestamp: Date;
  mediaUrl?: string; // Deprecated: use mediaItems instead
  mediaItems?: MediaItem[]; // Support for multiple media items
  isConceptionSummary?: boolean;
  isAssistantResponse?: boolean;
}

export interface GenerationStep {
  id: string;
  title: string;
  description: string;
  status: "pending" | "active" | "completed";
}

export interface ChatState {
  messages: Message[];
  isGenerating: boolean;
  generationSteps: string[];
  currentStep: number;
  finalResult: string | null;
}
