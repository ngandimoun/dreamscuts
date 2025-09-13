"use client"

import UnifiedInput from "@/components/UnifiedInput";
import { MediaItem } from "./mediaTypes";

interface ChatInputProps {
  value: string;
  onChange: (value: string) => void;
  onSend: () => void;
  onKeyPress: (e: React.KeyboardEvent) => void;
  disabled?: boolean;
  selectedMedia?: MediaItem[];
  onMediaChange?: (media: MediaItem[]) => void;
}

export default function ChatInput({
  value,
  onChange,
  onSend,
  onKeyPress,
  disabled = false,
  selectedMedia = [],
  onMediaChange,
}: ChatInputProps) {
  return (
    <UnifiedInput
      value={value}
      onChange={onChange}
      onSend={onSend}
      onKeyPress={onKeyPress}
      disabled={disabled}
      showFileAttachment={true}
      mediaPreviewSize="large"
      placeholder="Describe your idea, and I'll bring it to life"
      selectedMedia={selectedMedia}
      onMediaChange={onMediaChange}
    />
  );
}
