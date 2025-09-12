"use client"

import { useState, useRef } from "react";
import { X, Upload, Palette, Image as ImageIcon, FileText, Video, Music, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { MediaItem } from "./mediaTypes";
import { useMediaStore } from "@/store/useMediaStore";

interface MediaModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectMedia: (media: MediaItem) => void;
}

export default function MediaModal({ isOpen, onClose, onSelectMedia }: MediaModalProps) {
  const [activeTab, setActiveTab] = useState<'uploads' | 'designs' | 'templates'>('uploads');
  const { uploadedMedia, generatedMedia, addUploadedMedia } = useMediaStore();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    for (const file of Array.from(files)) {
      const newMedia: MediaItem = {
        id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
        name: file.name,
        type: getFileType(file.type),
        url: URL.createObjectURL(file),
        thumbnail: URL.createObjectURL(file),
        uploadedAt: new Date(),
      };

      addUploadedMedia(newMedia);
    }

    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const getFileType = (mimeType: string): 'image' | 'video' | 'document' | 'audio' => {
    if (mimeType.startsWith('image/')) return 'image';
    if (mimeType.startsWith('video/')) return 'video';
    if (mimeType.startsWith('audio/')) return 'audio';
    return 'document';
  };

  const getFileIcon = (type: string) => {
    switch (type) {
      case 'image':
        return <ImageIcon className="w-4 h-4" />;
      case 'video':
        return <Video className="w-4 h-4" />;
      case 'audio':
        return <Music className="w-4 h-4" />;
      default:
        return <FileText className="w-4 h-4" />;
    }
  };

  const currentMedia = activeTab === 'uploads' ? uploadedMedia : 
                     activeTab === 'designs' ? generatedMedia : 
                     []; // Templates seront gérés séparément

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
             <div className="bg-background rounded-2xl shadow-2xl w-full max-w-4xl h-[80vh] flex flex-col">
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-50">Add media</h2>
          <button
            onClick={onClose}
            className="text-gray-400 dark:text-gray-50 cursor-pointer hover:text-gray-600 dark:hover:text-gray-200 transition-colors rounded-full bg-primary p-2"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="flex border-b border-gray-100">
          <button
            onClick={() => setActiveTab('uploads')}
            className={`flex items-center gap-2 px-6 py-4 font-medium transition-colors ${
              activeTab === 'uploads'
                ? 'text-purple-600 border-b-2 border-purple-600'
                : 'text-gray-600 dark:text-gray-50 hover:text-gray-900 dark:hover:text-gray-200'
            }`}
          >
            <Upload className="w-4 h-4" />
            Uploads
          </button>
          <button
            onClick={() => setActiveTab('designs')}
            className={`flex items-center gap-2 px-6 py-4 font-medium transition-colors ${
              activeTab === 'designs'
                ? 'text-purple-600 border-b-2 border-purple-600'
                : 'text-gray-600 dark:text-gray-50 hover:text-gray-900 dark:hover:text-gray-200'
            }`}
          >
            <Palette className="w-4 h-4" />
            Designs
          </button>
          <button
            onClick={() => setActiveTab('templates')}
            className={`flex items-center gap-2 px-6 py-4 font-medium transition-colors ${
              activeTab === 'templates'
                ? 'text-purple-600 border-b-2 border-purple-600'
                : 'text-gray-600 dark:text-gray-50 hover:text-gray-900 dark:hover:text-gray-200'
            }`}
          >
            <Sparkles className="w-4 h-4" />
            Templates
          </button>
        </div>

                 <div className="p-6 flex-1 flex flex-col min-h-0">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-medium text-gray-900 dark:text-gray-50">
              {activeTab === 'uploads' ? 'Media uploads' : 
               activeTab === 'designs' ? 'Generated designs' : 
               'AI Templates'}
            </h3>
            {activeTab === 'uploads' && (
              <Button
                onClick={() => fileInputRef.current?.click()}
                className="bg-purple-600 hover:bg-purple-700 text-white"
              >
                <Upload className="w-4 h-4 mr-2" />
                Upload files
              </Button>
            )}
          </div>

                     <div className="flex-1 overflow-y-auto scrollbar-thin">
             <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 pb-4">
            {(activeTab === 'templates' ? [
              { id: '1', name: 'Logo Template', type: 'image' as const, url: '/placeholder-logo.png', thumbnail: '/placeholder-logo.png', uploadedAt: new Date(), isGenerated: true },
              { id: '2', name: 'Social Media Post', type: 'image' as const, url: '/placeholder.jpg', thumbnail: '/placeholder.jpg', uploadedAt: new Date(), isGenerated: true },
              { id: '3', name: 'Business Card', type: 'image' as const, url: '/placeholder.svg', thumbnail: '/placeholder.svg', uploadedAt: new Date(), isGenerated: true },
              { id: '4', name: 'Presentation Slide', type: 'image' as const, url: '/placeholder.jpg', thumbnail: '/placeholder.jpg', uploadedAt: new Date(), isGenerated: true },
              { id: '5', name: 'Banner Design', type: 'image' as const, url: '/placeholder.svg', thumbnail: '/placeholder.svg', uploadedAt: new Date(), isGenerated: true },
              { id: '6', name: 'Icon Set', type: 'image' as const, url: '/placeholder-logo.png', thumbnail: '/placeholder-logo.png', uploadedAt: new Date(), isGenerated: true },
              { id: '7', name: 'Web Template', type: 'image' as const, url: '/placeholder.jpg', thumbnail: '/placeholder.jpg', uploadedAt: new Date(), isGenerated: true },
              { id: '8', name: 'Mobile App', type: 'image' as const, url: '/placeholder.svg', thumbnail: '/placeholder.svg', uploadedAt: new Date(), isGenerated: true },
              { id: '9', name: 'Email Template', type: 'image' as const, url: '/placeholder-logo.png', thumbnail: '/placeholder-logo.png', uploadedAt: new Date(), isGenerated: true },
              { id: '10', name: 'Brochure Design', type: 'image' as const, url: '/placeholder.jpg', thumbnail: '/placeholder.jpg', uploadedAt: new Date(), isGenerated: true },
            ] : currentMedia).map((media) => (
              <div
                key={media.id}
                onClick={() => onSelectMedia(media)}
                className="group cursor-pointer rounded-lg border border-gray-200 hover:border-purple-300 transition-colors overflow-hidden"
              >
                                 <div className="aspect-square bg-background relative overflow-hidden">
                   {media.type === 'image' ? (
                     <div className="w-full h-full flex items-center justify-center bg-background">
                       <img
                         src={media.thumbnail || media.url}
                         alt={media.name}
                         className="max-w-full max-h-full object-contain"
                       />
                     </div>
                   ) : (
                     <div className="w-full h-full flex items-center justify-center bg-background">
                       {getFileIcon(media.type)}
                     </div>
                   )}
                  
                                     <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                     <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                       <div className="bg-background rounded-full p-2">
                         {activeTab === 'templates' ? (
                           <Sparkles className="w-4 h-4 text-purple-600" />
                         ) : (
                           <ImageIcon className="w-4 h-4 text-gray-700" />
                         )}
                       </div>
                     </div>
                   </div>
                </div>
                
                                 <div className="p-2">
                   <p className="text-xs text-gray-700 dark:text-gray-50 truncate" title={media.name}>
                     {media.name}
                   </p>
                   {activeTab === 'templates' ? (
                     <p className="text-xs text-purple-600 font-medium">
                       AI Template
                     </p>
                   ) : (
                     <p className="text-xs text-gray-500 dark:text-gray-50">
                       {media.uploadedAt.toLocaleDateString()}
                     </p>
                   )}
                 </div>
              </div>
            ))}
            </div>
          </div>

                     {currentMedia.length === 0 && activeTab !== 'templates' && (
             <div className="text-center py-12 flex flex-col items-center justify-center flex-1">
              <div className="w-16 h-16 bg-background rounded-full flex items-center justify-center mx-auto mb-4">
                {activeTab === 'uploads' ? (
                  <Upload className="w-8 h-8 text-gray-400 dark:text-gray-50" />
                ) : (
                  <Palette className="w-8 h-8 text-gray-400 dark:text-gray-50" />
                )}
              </div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-gray-50 mb-2">
                {activeTab === 'uploads' ? 'No uploaded media' : 'No generated designs'}
              </h3>
              <p className="text-gray-500 dark:text-gray-50">
                {activeTab === 'uploads' 
                  ? 'Upload your first media file to get started'
                  : 'Generate your first design to see it here'
                }
              </p>
            </div>
          )}


        </div>

        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept="image/*,video/*,audio/*,.pdf,.doc,.docx,.txt"
          onChange={handleFileUpload}
          className="hidden"
        />
      </div>
    </div>
  );
}
