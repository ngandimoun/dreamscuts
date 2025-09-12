"use client"

import UnifiedInput from "@/components/UnifiedInput";

interface ChatInputProps {
  value: string;
  onChange: (value: string) => void;
  onSend: () => void;
  onKeyPress: (e: React.KeyboardEvent) => void;
  disabled?: boolean;
}

export default function ChatInput({
  value,
  onChange,
  onSend,
  onKeyPress,
  disabled = false,
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
    />
  );
}
