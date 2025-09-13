"use client"

import { useState, useRef, useEffect } from "react";
import { Paperclip, X, Plus, Mic, ArrowRight, Video, Music, FileText, Play, Pause, Info, Edit3, Square, Trash2 } from "lucide-react";
import MediaModal from "./chat/MediaModal";
import MediaPreviewModal from "./chat/MediaPreviewModal";
import DescriptionModal from "./chat/DescriptionModal";
import { MediaItem } from "./chat/mediaTypes";
import AspectRatioSelector from "@/components/ui/aspect-ratio-selector";
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
    
    // Props pour la gestion des médias
    selectedMedia?: MediaItem[];
    onMediaChange?: (media: MediaItem[]) => void;
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
    mediaPreviewSize = "small",
    selectedMedia: externalSelectedMedia,
    onMediaChange
}: UnifiedInputProps) {
    const [attachedFile, setAttachedFile] = useState<File | null>(null);
    const [internalSelectedMedia, setInternalSelectedMedia] = useState<MediaItem[]>([]);
    
    // Use external media if provided, otherwise use internal state
    const selectedMedia = externalSelectedMedia || internalSelectedMedia;
    const setSelectedMedia = (media: MediaItem[] | ((prev: MediaItem[]) => MediaItem[])) => {
        if (onMediaChange) {
            const newMedia = typeof media === 'function' ? media(selectedMedia) : media;
            onMediaChange(newMedia);
        } else {
            setInternalSelectedMedia(media);
        }
    };
    const [showMediaModal, setShowMediaModal] = useState(false);
    const [previewMedia, setPreviewMedia] = useState<MediaItem | null>(null);
    const [showPreviewModal, setShowPreviewModal] = useState(false);
    const [previewPosition, setPreviewPosition] = useState<{ x: number; y: number } | null>(null);
    const [aspectRatio, setAspectRatio] = useState("Smart Auto");
    const [isRecording, setIsRecording] = useState(false);
    const [recordedAudio, setRecordedAudio] = useState<MediaItem | null>(null);
    const [isPlayingAudio, setIsPlayingAudio] = useState(false);
    const [audioDuration, setAudioDuration] = useState<number>(0);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const mediaRecorderRef = useRef<MediaRecorder | null>(null);
    const audioChunksRef = useRef<Blob[]>([]);
    const audioRef = useRef<HTMLAudioElement | null>(null);
    
    // États pour le preview au survol
    const [hoveredMedia, setHoveredMedia] = useState<MediaItem | null>(null);
    const [hoverPosition, setHoverPosition] = useState<{ x: number; y: number } | null>(null);
    const [showHoverPreview, setShowHoverPreview] = useState(false);
    const [isVideoPlaying, setIsVideoPlaying] = useState(false);
    const hoverTimeoutRef = useRef<NodeJS.Timeout | null>(null);
    const videoRef = useRef<HTMLVideoElement>(null);
    
    // États pour la gestion des descriptions
    const [showDescriptionModal, setShowDescriptionModal] = useState(false);
    const [editingMedia, setEditingMedia] = useState<MediaItem | null>(null);
    const [showDescriptionTooltip, setShowDescriptionTooltip] = useState<string | null>(null);

    // Accès au store pour l'authentification
    const { user, setPromptBeforeLogin } = useAppStore();

    // Nettoyage des timeouts
    useEffect(() => {
        return () => {
            if (hoverTimeoutRef.current) {
                clearTimeout(hoverTimeoutRef.current);
            }
        };
    }, []);

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

    const handleMediaHover = (media: MediaItem, event: React.MouseEvent) => {
        const rect = event.currentTarget.getBoundingClientRect();
        const viewportWidth = window.innerWidth;
        const previewWidth = 320; // Largeur du preview
        
        // Positionner à droite par défaut, mais à gauche si pas assez de place
        let x = rect.right + 10;
        if (x + previewWidth > viewportWidth) {
            x = rect.left - previewWidth - 10;
        }
        
        setHoveredMedia(media);
        setHoverPosition({
            x: Math.max(10, x), // Éviter de sortir à gauche
            y: rect.top,
        });
        
        // Délai avant d'afficher le preview
        hoverTimeoutRef.current = setTimeout(() => {
            setShowHoverPreview(true);
            // Pour les vidéos, démarrer la lecture automatiquement
            if (media.type === 'video') {
                setIsVideoPlaying(true);
            }
        }, 300);
    };

    const handleMediaHoverLeave = () => {
        if (hoverTimeoutRef.current) {
            clearTimeout(hoverTimeoutRef.current);
        }
        setShowHoverPreview(false);
        setHoveredMedia(null);
        setHoverPosition(null);
        setIsVideoPlaying(false);
    };

    const handleMediaClick = (media: MediaItem, event: React.MouseEvent) => {
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

    // Fonctions pour gérer les descriptions
    const handleEditDescription = (media: MediaItem) => {
        setEditingMedia(media);
        setShowDescriptionModal(true);
    };

    const handleSaveDescription = (description: string) => {
        if (editingMedia) {
            setSelectedMedia(prev => prev.map(media => 
                media.id === editingMedia.id 
                    ? { ...media, description: description.trim() || undefined }
                    : media
            ));
        }
        setShowDescriptionModal(false);
        setEditingMedia(null);
    };

    const handleCloseDescriptionModal = () => {
        setShowDescriptionModal(false);
        setEditingMedia(null);
    };

    // Détermine si le bouton d'envoi doit être actif
    const isSendActive = value.trim().length > 0 || selectedMedia.length > 0 || recordedAudio || (showFileAttachment && attachedFile);

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
            // Ne pas appeler onKeyPress si on a déjà géré l'événement
            return;
        }
        onKeyPress?.(e);
    };

    // Fonctions pour l'enregistrement vocal
    const startRecording = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            const mediaRecorder = new MediaRecorder(stream);
            mediaRecorderRef.current = mediaRecorder;
            audioChunksRef.current = [];

            mediaRecorder.ondataavailable = (event) => {
                if (event.data.size > 0) {
                    audioChunksRef.current.push(event.data);
                }
            };

            mediaRecorder.onstop = () => {
                const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' });
                const audioUrl = URL.createObjectURL(audioBlob);
                
                const audioMediaItem: MediaItem = {
                    id: `voice_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
                    name: `Voice recording ${new Date().toLocaleTimeString()}`,
                    type: 'audio',
                    url: audioUrl,
                    thumbnail: '', // Pas de thumbnail pour l'audio
                    uploadedAt: new Date(),
                    fileSize: audioBlob.size,
                    mimeType: 'audio/wav',
                    isGenerated: true,
                    source: 'voice_recording'
                };

                setRecordedAudio(audioMediaItem);
                setSelectedMedia(prev => [...prev, audioMediaItem]);
                setAudioDuration(0); // Reset duration for new recording
                
                // Arrêter le stream
                stream.getTracks().forEach(track => track.stop());
            };

            mediaRecorder.start();
            setIsRecording(true);
        } catch (error) {
            console.error('Error starting recording:', error);
            alert('Unable to access microphone. Please check permissions.');
        }
    };

    const stopRecording = () => {
        if (mediaRecorderRef.current && isRecording) {
            mediaRecorderRef.current.stop();
            setIsRecording(false);
        }
    };

    const playRecordedAudio = () => {
        if (recordedAudio && audioRef.current) {
            if (isPlayingAudio) {
                audioRef.current.pause();
                setIsPlayingAudio(false);
            } else {
                audioRef.current.play();
                setIsPlayingAudio(true);
            }
        }
    };

    const formatDuration = (seconds: number): string => {
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    const deleteRecordedAudio = () => {
        if (recordedAudio) {
            URL.revokeObjectURL(recordedAudio.url);
            setRecordedAudio(null);
            setAudioDuration(0);
            setSelectedMedia(prev => prev.filter(media => media.id !== recordedAudio.id));
        }
    };

    // Nettoyer les URLs d'audio quand le composant se démonte
    useEffect(() => {
        return () => {
            if (recordedAudio) {
                URL.revokeObjectURL(recordedAudio.url);
            }
        };
    }, [recordedAudio]);

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
                                </div>

                                <div className="flex items-center gap-2">
                                    <button
                                        onClick={isRecording ? stopRecording : startRecording}
                                        className={`rounded-full p-2 transition-colors ${
                                            isRecording 
                                                ? 'bg-red-500 hover:bg-red-600 text-white animate-pulse' 
                                                : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                                        }`}
                                        disabled={disabled}
                                        title={isRecording ? 'Stop recording' : 'Start voice recording'}
                                    >
                                        {isRecording ? (
                                            <Square className="w-5 h-5" />
                                        ) : (
                                            <Mic className="w-5 h-5" />
                                        )}
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

                            {/* Preview de l'audio enregistré */}
                            {recordedAudio && (
                                <div className="mt-3 bg-gradient-to-r from-[#defbff] to-purple-100 dark:from-cyan-300 dark:to-purple-300 -mx-4 -mb-4 px-4 pb-4 pt-3 rounded-b-2xl">
                                    <div className="flex items-center gap-3 p-3 bg-white rounded-lg border-2 border-purple-200 shadow-sm">
                                        <div className="flex items-center gap-2">
                                            <button
                                                onClick={playRecordedAudio}
                                                className="w-8 h-8 bg-purple-600 hover:bg-purple-700 text-white rounded-full flex items-center justify-center transition-colors"
                                                title={isPlayingAudio ? 'Pause' : 'Play'}
                                            >
                                                {isPlayingAudio ? (
                                                    <Pause className="w-4 h-4" />
                                                ) : (
                                                    <Play className="w-4 h-4" />
                                                )}
                                            </button>
                                            <div className="flex flex-col">
                                                <span className="text-sm font-medium text-gray-700">
                                                    Voice recording
                                                </span>
                                                <span className="text-xs text-gray-500">
                                                    {audioDuration > 0 ? formatDuration(audioDuration) : 'Loading...'}
                                                </span>
                                            </div>
                                        </div>
                                        <button
                                            onClick={deleteRecordedAudio}
                                            className="ml-auto w-6 h-6 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center transition-colors"
                                            title="Delete recording"
                                        >
                                            <Trash2 className="w-3 h-3" />
                                        </button>
                                    </div>
                                    <audio
                                        ref={audioRef}
                                        src={recordedAudio.url}
                                        onEnded={() => setIsPlayingAudio(false)}
                                        onPause={() => setIsPlayingAudio(false)}
                                        onPlay={() => setIsPlayingAudio(true)}
                                        onLoadedMetadata={(e) => {
                                            const audio = e.currentTarget;
                                            setAudioDuration(audio.duration);
                                        }}
                                        className="hidden"
                                    />
                                </div>
                            )}

                            {/* Zone des previews des médias */}
                            {selectedMedia.length > 0 && (
                                <div className="flex flex-wrap gap-2 mt-3 bg-gradient-to-r from-[#defbff] to-purple-100 dark:from-cyan-300 dark:to-purple-300 -mx-4 -mb-4 px-4 pb-4 pt-3 rounded-b-2xl">
                                    {selectedMedia.map((media) => (
                                        <div key={media.id} className="relative group">
                                            <div
                                                className={`${previewSize} bg-white rounded-lg border-2 border-gray-200 overflow-hidden shadow-sm hover:shadow-lg hover:scale-105 transition-all duration-200 cursor-pointer`}
                                                onMouseEnter={(e) => handleMediaHover(media, e)}
                                                onMouseLeave={handleMediaHoverLeave}
                                                onClick={(e) => handleMediaClick(media, e)}
                                            >
                                                {media.type === 'image' ? (
                                                    <img
                                                        src={media.thumbnail || media.url}
                                                        alt={media.name}
                                                        className="w-full h-full object-cover"
                                                    />
                                                ) : media.type === 'video' ? (
                                                    <div className="w-full h-full relative flex items-center justify-center bg-gray-50">
                                                        <Video className="w-6 h-6 text-gray-500" />
                                                        {isVideoPlaying && hoveredMedia?.id === media.id && (
                                                            <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                                                                <Pause className="w-4 h-4 text-white" />
                                                            </div>
                                                        )}
                                                    </div>
                                                ) : (
                                                    <div className="w-full h-full flex items-center justify-center bg-gray-50">
                                                        {media.type === 'audio' ? (
                                                            <Music className="w-6 h-6 text-gray-500" />
                                                        ) : (
                                                            <FileText className="w-6 h-6 text-gray-500" />
                                                        )}
                                                    </div>
                                                )}
                                            </div>
                                            
                                            {/* Bouton d'information pour la description */}
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleEditDescription(media);
                                                }}
                                                onMouseEnter={() => {
                                                    if (media.description) {
                                                        setShowDescriptionTooltip(media.id);
                                                    }
                                                }}
                                                onMouseLeave={() => setShowDescriptionTooltip(null)}
                                                className="absolute -top-2 -left-2 w-5 h-5 bg-blue-500 hover:bg-blue-600 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-sm"
                                                title={media.description ? "Edit description" : "Add a description"}
                                            >
                                                <Info className="w-3 h-3" />
                                            </button>
                                            
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
                onClose={handleMediaPreviewClose}
            />

            {/* Modal de description */}
            <DescriptionModal
                isOpen={showDescriptionModal}
                media={editingMedia}
                onClose={handleCloseDescriptionModal}
                onSave={handleSaveDescription}
            />

            {/* Preview au survol */}
            {showHoverPreview && hoveredMedia && hoverPosition && (
                <div
                    className="fixed z-50 pointer-events-none"
                    style={{
                        left: `${hoverPosition.x}px`,
                        top: `${hoverPosition.y}px`,
                        transform: 'translateY(-50%)',
                    }}
                >
                    <div className="bg-background border border-gray-200 rounded-lg shadow-2xl p-3">
                        <div className="relative w-80 h-48">
                            {hoveredMedia.type === 'image' ? (
                                <img
                                    src={hoveredMedia.url}
                                    alt={hoveredMedia.name}
                                    className="w-full h-full object-contain rounded"
                                />
                            ) : hoveredMedia.type === 'video' ? (
                                <div className="w-full h-full relative bg-black rounded overflow-hidden">
                                    <video
                                        ref={videoRef}
                                        src={hoveredMedia.url}
                                        className="w-full h-full object-contain"
                                        autoPlay={isVideoPlaying}
                                        muted
                                        loop
                                        onPlay={() => setIsVideoPlaying(true)}
                                        onPause={() => setIsVideoPlaying(false)}
                                    />
                                    <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                                        {isVideoPlaying ? (
                                            <Pause className="w-8 h-8 text-white" />
                                        ) : (
                                            <Play className="w-8 h-8 text-white" />
                                        )}
                                    </div>
                                </div>
                            ) : hoveredMedia.type === 'audio' ? (
                                <div className="w-full h-full flex items-center justify-center bg-gray-100 rounded">
                                    <div className="text-center">
                                        <Music className="w-12 h-12 text-gray-500 mx-auto mb-2" />
                                        <p className="text-sm text-gray-600">{hoveredMedia.name}</p>
                                    </div>
                                </div>
                            ) : (
                                <div className="w-full h-full flex items-center justify-center bg-gray-100 rounded">
                                    <div className="text-center">
                                        <FileText className="w-12 h-12 text-gray-500 mx-auto mb-2" />
                                        <p className="text-sm text-gray-600">{hoveredMedia.name}</p>
                                    </div>
                                </div>
                            )}
                            <div className="absolute bottom-2 left-2 right-2 bg-black/70 text-white text-xs p-2 rounded">
                                <p className="truncate font-medium">{hoveredMedia.name}</p>
                                <p className="text-gray-300 capitalize">{hoveredMedia.source}</p>
                                {hoveredMedia.description && (
                                    <p className="text-gray-200 mt-1 text-xs line-clamp-2">{hoveredMedia.description}</p>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Tooltip de description */}
            {showDescriptionTooltip && selectedMedia.find(m => m.id === showDescriptionTooltip)?.description && (
                <div className="fixed z-50 pointer-events-none">
                    <div className="bg-gray-900 text-white text-xs rounded-lg p-2 shadow-lg max-w-xs">
                        {selectedMedia.find(m => m.id === showDescriptionTooltip)?.description}
                    </div>
                </div>
            )}

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
