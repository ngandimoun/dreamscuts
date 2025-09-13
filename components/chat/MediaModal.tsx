"use client"

import { useState, useRef, useEffect } from "react";
import { X, Upload, Palette, Image as ImageIcon, FileText, Video, Music, Sparkles, Search, Eye, Play, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { MediaItem } from "./mediaTypes";
import { useMediaStore } from "@/store/useMediaStore";
import { mediaService } from "@/lib/api/mediaService";
import { templateSubMenus, MediaCategory } from "@/lib/api/categories";
import MediaPreviewModal from "./MediaPreviewModal";
import ImageHoverPreview from "./ImageHoverPreview";
import SoundCard from "./SoundCard";

interface MediaModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectMedia: (media: MediaItem) => void;
}

export default function MediaModal({ isOpen, onClose, onSelectMedia }: MediaModalProps) {
  const [activeTab, setActiveTab] = useState<'uploads' | 'designs' | 'templates'>('uploads');
  const [activeSubMenu, setActiveSubMenu] = useState<'images' | 'videos' | 'sounds'>('images');
  const [activeCategory, setActiveCategory] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState('');
  const [templates, setTemplates] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [previewMedia, setPreviewMedia] = useState<MediaItem | null>(null);
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  
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

  // Charger les templates depuis les APIs
  useEffect(() => {
    if (activeTab === 'templates') {
      loadTemplates();
    }
  }, [activeTab, activeSubMenu, activeCategory, searchQuery]);

  const loadTemplates = async () => {
    setLoading(true);
    try {
      let results: MediaItem[] = [];
      const query = searchQuery || activeCategory;
      const hasSearchQuery = searchQuery.trim() !== '';
      const hasCategoryQuery = activeCategory.trim() !== '';

      switch (activeSubMenu) {
        case 'images':
          results = (hasSearchQuery || hasCategoryQuery) ? await mediaService.getImages(query) : await mediaService.getPopularImages();
          break;
        case 'videos':
          results = (hasSearchQuery || hasCategoryQuery) ? await mediaService.getVideos(query) : await mediaService.getPopularVideos();
          break;
        case 'sounds':
          results = (hasSearchQuery || hasCategoryQuery) ? await mediaService.getSounds(query) : await mediaService.getPopularSounds();
          break;
      }

      setTemplates(results);
    } catch (error) {
      console.error('Error loading templates:', error);
      setTemplates([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSubMenuChange = (subMenu: 'images' | 'videos' | 'sounds') => {
    setActiveSubMenu(subMenu);
    setActiveCategory('');
    setSearchQuery('');
  };

  const handleCategorySelect = (categoryQuery: string) => {
    setActiveCategory(categoryQuery);
    setSearchQuery('');
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setActiveCategory('');
  };

  const handlePreviewMedia = (media: MediaItem) => {
    setPreviewMedia(media);
    setShowPreviewModal(true);
  };

  // Calculer le ratio d'aspect d'un média en utilisant width et height
  const getAspectRatio = (media: MediaItem): string => {
    if (media.width && media.height) {
      // Utiliser directement width et height pour calculer le ratio simplifié
      const gcd = (a: number, b: number): number => b === 0 ? a : gcd(b, a % b);
      const divisor = gcd(media.width, media.height);
      const simplifiedWidth = media.width / divisor;
      const simplifiedHeight = media.height / divisor;
      
      // Vérifier les ratios d'aspect standards
      const ratio = media.width / media.height;
      
      if (Math.abs(ratio - 16/9) < 0.01) return '16:9';
      if (Math.abs(ratio - 4/3) < 0.01) return '4:3';
      if (Math.abs(ratio - 3/2) < 0.01) return '3:2';
      if (Math.abs(ratio - 1/1) < 0.01) return '1:1';
      if (Math.abs(ratio - 21/9) < 0.01) return '21:9';
      if (Math.abs(ratio - 9/16) < 0.01) return '9:16';
      if (Math.abs(ratio - 2/3) < 0.01) return '2:3';
      if (Math.abs(ratio - 3/4) < 0.01) return '3:4';
      if (Math.abs(ratio - 5/4) < 0.01) return '5:4';
      if (Math.abs(ratio - 8/5) < 0.01) return '8:5';
      
      // Retourner le ratio simplifié basé sur width et height
      return `${Math.round(simplifiedWidth)}:${Math.round(simplifiedHeight)}`;
    }
    
    return 'N/A';
  };

  const currentMedia = activeTab === 'uploads' ? uploadedMedia : 
                     activeTab === 'designs' ? generatedMedia : 
                     templates;

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
          {/* Titre seulement pour uploads et designs */}
          {activeTab !== 'templates' && (
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-medium text-gray-900 dark:text-gray-50">
                {activeTab === 'uploads' ? 'Media uploads' : 'Generated designs'}
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
          )}

          {/* Interface pour les templates */}
          {activeTab === 'templates' && (
            <div className="mb-6">
              {/* Sous-menus */}
              <div className="flex gap-2 mb-4">
                {templateSubMenus.map((subMenu) => (
                  <button
                    key={subMenu.id}
                    onClick={() => handleSubMenuChange(subMenu.id)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
                      activeSubMenu === subMenu.id
                        ? 'bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300'
                        : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800'
                    }`}
                  >
                    <span className="text-lg">{subMenu.icon}</span>
                    {subMenu.name}
                  </button>
                ))}
              </div>

              {/* Barre de recherche et sélecteur de catégorie en grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                {/* Barre de recherche */}
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    type="text"
                    placeholder={`Search ${activeSubMenu}...`}
                    value={searchQuery}
                    onChange={(e) => handleSearch(e.target.value)}
                    className="pl-10"
                  />
                </div>

                {/* Sélecteur de catégorie */}
                <Select
                  value={activeCategory || "all"}
                  onValueChange={(value) => handleCategorySelect(value === "all" ? "" : value)}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    {templateSubMenus
                      .find(menu => menu.id === activeSubMenu)
                      ?.categories.map((category) => (
                        <SelectItem key={category.id} value={category.query}>
                          {category.name}
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}

                     <div className="flex-1 overflow-y-auto scrollbar-thin">
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
                <span className="ml-3 text-gray-600 dark:text-gray-400">Loading {activeSubMenu}...</span>
              </div>
            ) : (
              <div className={`grid gap-4 pb-4 ${
                activeSubMenu === 'sounds' 
                  ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3' 
                  : 'grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5'
              }`}>
                {currentMedia.map((media) => {
                  // Utiliser SoundCard pour les sons
                  if (activeSubMenu === 'sounds' && media.type === 'audio') {
                    return (
                      <SoundCard
                        key={media.id}
                        media={media}
                        onSelect={onSelectMedia}
                        onPreview={handlePreviewMedia}
                      />
                    );
                  }

                  // Utiliser le design standard pour les images et vidéos
                  return (
                    <ImageHoverPreview key={media.id} media={media}>
                      <div
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
                          ) : media.type === 'video' ? (
                            <div className="w-full h-full flex items-center justify-center bg-background relative">
                              <img
                                src={media.thumbnail}
                                alt={media.name}
                                className="max-w-full max-h-full object-contain"
                              />
                              <div className="absolute inset-0 flex items-center justify-center">
                                <div className="bg-black/50 rounded-full p-2">
                                  <Play className="w-6 h-6 text-white" />
                                </div>
                              </div>
                            </div>
                          ) : (
                            <div className="w-full h-full flex items-center justify-center bg-background">
                              {getFileIcon(media.type)}
                            </div>
                          )}
                          
                          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                            <div className="opacity-0 group-hover:opacity-100 transition-opacity flex gap-2">
                              <div className="bg-background rounded-full p-2">
                                {activeTab === 'templates' ? (
                                  <Sparkles className="w-4 h-4 text-purple-600" />
                                ) : (
                                  <ImageIcon className="w-4 h-4 text-gray-700" />
                                )}
                              </div>
                              {(media.type === 'video' || media.type === 'audio') && (
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handlePreviewMedia(media);
                                  }}
                                  className="bg-background rounded-full p-2 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                                  title="Preview"
                                >
                                  <Eye className="w-4 h-4 text-gray-700" />
                                </button>
                              )}
                            </div>
                          </div>
                        </div>
                        
                        <div className="p-2">
                          <p className="text-xs text-gray-700 dark:text-gray-50 truncate" title={media.name}>
                            {media.name}
                          </p>
                          {activeTab === 'templates' ? (
                            <div className="flex items-center justify-between">
                              <p className="text-xs text-purple-600 font-medium capitalize">
                                {media.source} • {media.type}
                              </p>
                              <span className="text-xs text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded-full">
                                {getAspectRatio(media)}
                              </span>
                            </div>
                          ) : (
                            <p className="text-xs text-gray-500 dark:text-gray-50">
                              {media.uploadedAt.toLocaleDateString()}
                            </p>
                          )}
                        </div>
                      </div>
                    </ImageHoverPreview>
                  );
                })}
              </div>
            )}
          </div>

          {currentMedia.length === 0 && !loading && (
            <div className="text-center py-12 flex flex-col items-center justify-center flex-1">
              <div className="w-16 h-16 bg-background rounded-full flex items-center justify-center mx-auto mb-4">
                {activeTab === 'uploads' ? (
                  <Upload className="w-8 h-8 text-gray-400 dark:text-gray-50" />
                ) : activeTab === 'designs' ? (
                  <Palette className="w-8 h-8 text-gray-400 dark:text-gray-50" />
                ) : (
                  <Sparkles className="w-8 h-8 text-gray-400 dark:text-gray-50" />
                )}
              </div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-gray-50 mb-2">
                {activeTab === 'uploads' ? 'No uploaded media' : 
                 activeTab === 'designs' ? 'No generated designs' :
                 `No ${activeSubMenu} found`}
              </h3>
              <p className="text-gray-500 dark:text-gray-50">
                {activeTab === 'uploads' 
                  ? 'Upload your first media file to get started'
                  : activeTab === 'designs'
                  ? 'Generate your first design to see it here'
                  : `Try searching for different ${activeSubMenu} or browse categories`
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

        {/* Modal de prévisualisation */}
        <MediaPreviewModal
          isOpen={showPreviewModal}
          media={previewMedia}
          onClose={() => {
            setShowPreviewModal(false);
            setPreviewMedia(null);
          }}
        />
      </div>
    </div>
  );
}
