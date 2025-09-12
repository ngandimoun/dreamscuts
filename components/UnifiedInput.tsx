"use client"

import { useState, useRef } from "react";
import { Paperclip, X, Plus, Mic, ArrowRight, Video, Music, FileText } from "lucide-react";
import MediaModal from "./chat/MediaModal";
import MediaPreviewModal from "./chat/MediaPreviewModal";
import { MediaItem } from "./chat/mediaTypes";
import AspectRatioSelector from "@/components/ui/aspect-ratio-selector";
import ModelSelector from "@/components/ui/model-selector";
import { useAppStore } from "@/store/useStore";
import { supabase } from "@/lib/supabase/client";

interface UnifiedInputProps {
    // Props pour le mode chat
    value: string;
    onChange: (value: string) => void;
    onSend?: () => void;
    onKeyPress?: (e: React.KeyboardEvent) => void;
    disabled?: boolean;

    // Props pour le mode authentification
    onAuthenticatedSend?: (prompt: string, media: MediaItem[]) => void;
    showLoginModal?: () => void;

    // Props pour la personnalisation
    placeholder?: string;
    className?: string;
    showFileAttachment?: boolean;
    mediaPreviewSize?: "small" | "large";
}

export default function UnifiedInput({
    value,
    onChange,
    onSend,
    onKeyPress,
    disabled = false,
    onAuthenticatedSend,
    showLoginModal,
    placeholder = "Describe your idea, and I'll bring it to life",
    className = "",
    showFileAttachment = false,
    mediaPreviewSize = "small"
}: UnifiedInputProps) {
    const [attachedFile, setAttachedFile] = useState<File | null>(null);
    const [selectedMedia, setSelectedMedia] = useState<MediaItem[]>([]);
    const [showMediaModal, setShowMediaModal] = useState(false);
    const [previewMedia, setPreviewMedia] = useState<MediaItem | null>(null);
    const [showPreviewModal, setShowPreviewModal] = useState(false);
    const [previewPosition, setPreviewPosition] = useState<{ x: number; y: number } | null>(null);
    const [aspectRatio, setAspectRatio] = useState("16:9");
    const [selectedModel, setSelectedModel] = useState("claude-4-sonnet");
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Accès au store pour l'authentification
    const { user, setPromptBeforeLogin } = useAppStore();

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setAttachedFile(file);
        }
    };

    const removeFile = () => {
        setAttachedFile(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
    };

    const handleSelectMedia = (media: MediaItem) => {
        setSelectedMedia(prev => [...prev, media]);
        setShowMediaModal(false);
    };

    const removeSelectedMedia = (mediaId: string) => {
        setSelectedMedia(prev => prev.filter(media => media.id !== mediaId));
    };

    const handleMediaPreview = (media: MediaItem, event: React.MouseEvent) => {
        const rect = event.currentTarget.getBoundingClientRect();
        setPreviewMedia(media);
        setPreviewPosition({ x: rect.left + rect.width / 2, y: rect.top });
        setShowPreviewModal(true);
    };

    const handleMediaPreviewClose = () => {
        setShowPreviewModal(false);
        setPreviewMedia(null);
        setPreviewPosition(null);
    };

    // Détermine si le bouton d'envoi doit être actif
    const isSendActive = value.trim().length > 0 || selectedMedia.length > 0 || (showFileAttachment && attachedFile);

    const handleSubmit = () => {
        if (!isSendActive || disabled) return;

        if (onAuthenticatedSend && showLoginModal) {
            // Mode authentification (comme dans app/page.tsx)
            if (user) {
                // Utilisateur connecté, on peut traiter le prompt
                onAuthenticatedSend(value, selectedMedia);
            } else {
                // Utilisateur non connecté, sauvegarder et ouvrir la modale
                setPromptBeforeLogin(value);
                showLoginModal();
            }
        } else if (onSend) {
            // Mode chat (comme dans ChatInput.tsx)
            onSend();
            setAttachedFile(null);
            setSelectedMedia([]);
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSubmit();
        }
        onKeyPress?.(e);
    };

    const previewSize = mediaPreviewSize === "large" ? "w-16 h-16" : "w-10 h-10";

    return (
        <div className={`w-full ${className}`}>
            <div className="relative">
                {/* Effet de fond flou */}
                <div
                    className="absolute inset-x-4 top-5 h-full bg-gradient-to-r from-cyan-200 to-purple-300 dark:from-cyan-400 dark:to-purple-500 rounded-2xl filter blur-2xl opacity-50 -z-10"
                    aria-hidden="true"
                />

                {/* Conteneur principal avec gradient */}
                <div className="relative rounded-2xl bg-gradient-to-r from-[#d1f5fa] to-purple-200 dark:from-cyan-400 dark:to-purple-500 p-[1.5px]">
                    <div className="bg-background backdrop-blur-lg rounded-[15px] p-4">
                        <div className="relative">
                            {/* Zone de saisie principale */}
                            <textarea
                                value={value}
                                onChange={(e) => onChange(e.target.value)}
                                onKeyDown={handleKeyDown}
                                placeholder={placeholder}
                                className="w-full border-0 bg-transparent text-sm placeholder:text-gray-500 focus-visible:ring-0 focus-visible:ring-offset-0 py-1 resize-none min-h-[3rem]"
                                rows={2.5}
                                disabled={disabled}
                            />

                            {/* Boutons d'action */}
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <button
                                        onClick={() => setShowMediaModal(true)}
                                        disabled={disabled}
                                        className="bg-gray-100 hover:bg-gray-200 text-gray-600 rounded-full h-8 w-8 flex items-center justify-center transition-colors"
                                    >
                                        <Plus className="w-4 h-4" />
                                    </button>
                                    <AspectRatioSelector
                                        value={aspectRatio}
                                        onChange={setAspectRatio}
                                        disabled={disabled}
                                    />
                                    <ModelSelector
                                        value={selectedModel}
                                        onChange={setSelectedModel}
                                        disabled={disabled}
                                    />
                                </div>

                                <div className="flex items-center gap-2">
                                    <button
                                        className="bg-gray-100 hover:bg-gray-200 rounded-full p-2 transition-colors"
                                        disabled={disabled}
                                    >
                                        <Mic className="w-5 h-5 text-gray-700" />
                                    </button>

                                    {/* Bouton d'envoi avec flèche */}
                                    <button
                                        onClick={handleSubmit}
                                        disabled={disabled || !isSendActive}
                                        className={`rounded-full p-2 transition-colors ${isSendActive && !disabled
                                                ? 'bg-purple-600 hover:bg-purple-700 text-white cursor-pointer'
                                                : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                                            }`}
                                    >
                                        <ArrowRight className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>

                            {/* Zone des previews des médias */}
                            {selectedMedia.length > 0 && (
                                <div className="flex flex-wrap gap-2 mt-3 bg-gradient-to-r from-[#defbff] to-purple-100 -mx-4 -mb-4 px-4 pb-4 pt-3 rounded-b-2xl">
                                    {selectedMedia.map((media) => (
                                        <div key={media.id} className="relative group">
                                            <div
                                                className={`${previewSize} bg-white rounded-lg border-2 border-gray-200 overflow-hidden shadow-sm hover:shadow-lg hover:scale-105 transition-all duration-200 cursor-pointer`}
                                                onMouseEnter={(e) => handleMediaPreview(media, e)}
                                                onMouseLeave={handleMediaPreviewClose}
                                            >
                                                {media.type === 'image' ? (
                                                    <img
                                                        src={media.thumbnail || media.url}
                                                        alt={media.name}
                                                        className="w-full h-full object-cover"
                                                    />
                                                ) : (
                                                    <div className="w-full h-full flex items-center justify-center bg-gray-50">
                                                        {media.type === 'video' ? (
                                                            <Video className="w-6 h-6 text-gray-500" />
                                                        ) : media.type === 'audio' ? (
                                                            <Music className="w-6 h-6 text-gray-500" />
                                                        ) : (
                                                            <FileText className="w-6 h-6 text-gray-500" />
                                                        )}
                                                    </div>
                                                )}
                                            </div>
                                            {/* Bouton de suppression */}
                                            <button
                                                onClick={() => removeSelectedMedia(media.id)}
                                                className="absolute -top-2 -right-2 w-5 h-5 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-sm"
                                            >
                                                <X className="w-3 h-3" />
                                            </button>
                                            {/* Nom du fichier pour les grandes previews */}
                                            {mediaPreviewSize === "large" && (
                                                <div className="mt-1 text-xs text-gray-600 text-center truncate max-w-16">
                                                    {media.name.length > 12 ? `${media.name.substring(0, 12)}...` : media.name}
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Fichier attaché (optionnel) */}
            {showFileAttachment && attachedFile && (
                <div className="mt-3 flex items-center gap-2 bg-gray-50 rounded-lg p-3">
                    <Paperclip className="w-4 h-4 text-gray-500" />
                    <span className="text-sm text-gray-700 flex-1 truncate">
                        {attachedFile.name}
                    </span>
                    <button
                        onClick={removeFile}
                        className="text-gray-500 hover:text-gray-700 transition-colors"
                    >
                        <X className="w-4 h-4" />
                    </button>
                </div>
            )}

            {/* Modal des médias */}
            <MediaModal
                isOpen={showMediaModal}
                onClose={() => setShowMediaModal(false)}
                onSelectMedia={handleSelectMedia}
            />

            {/* Modal de preview des médias */}
            <MediaPreviewModal
                isOpen={showPreviewModal}
                media={previewMedia}
                position={previewPosition}
            />

            {/* Input file caché (optionnel) */}
            {showFileAttachment && (
                <input
                    ref={fileInputRef}
                    type="file"
                    onChange={handleFileSelect}
                    accept="image/*,video/*,.pdf,.doc,.docx,.txt"
                    className="hidden"
                    disabled={disabled}
                />
            )}
        </div>
    );
}
