"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  ThumbsUp,
  ThumbsDown,
  Share2,
  RotateCcw,
  Crop,
  Scissors,
  Palette,
  PaintBucket,
  FlipHorizontal,
  Maximize2,
  Info,
  Download,
  Settings,
  Play,
  Pause,
  Volume2,
  VolumeX,
  Image as ImageIcon,
  Video as VideoIcon,
  FileText,
  ChevronDown,
  ChevronUp,
} from "lucide-react"
import { cn } from "@/lib/utils"

interface GeneratedImage {
  id: string
  url: string
  prompt: string
  borderColor: string
  type: "image" | "video"
}

interface ResultColumnProps {
  images?: GeneratedImage[]
  prompt?: string
}

export function FinalResult({
  images = [
    {
      id: "1",
      url: "/cute-little-girl-in-blue-hat-and-blue-dress-with-f.png",
      prompt: "Cute little girl in blue hat and blue dress with floral pattern",
      borderColor: "border-lime-400",
      type: "image",
    },
    {
      id: "2",
      url: "/cute-anime-girl-in-green-dress-with-floral-pattern.png",
      prompt: "Cute anime girl in green dress with floral pattern and hat",
      borderColor: "border-orange-400",
      type: "image",
    },
  ],
  prompt = "Cute little girl in blue hat and blue dress with floral pattern",
}: ResultColumnProps) {
  const [likedImages, setLikedImages] = useState<Set<string>>(new Set())
  const [dislikedImages, setDislikedImages] = useState<Set<string>>(new Set())
  const [selectedImage, setSelectedImage] = useState<string>("1")
  const [activeTool, setActiveTool] = useState<string>("Cut")
  const [isPlaying, setIsPlaying] = useState(false)
  const [isMuted, setIsMuted] = useState(false)
  const [showSettings, setShowSettings] = useState(false)

  const handleLike = (imageId: string) => {
    const newLiked = new Set(likedImages)
    const newDisliked = new Set(dislikedImages)

    if (likedImages.has(imageId)) {
      newLiked.delete(imageId)
    } else {
      newLiked.add(imageId)
      newDisliked.delete(imageId)
    }

    setLikedImages(newLiked)
    setDislikedImages(newDisliked)
  }

  const handleDislike = (imageId: string) => {
    const newLiked = new Set(likedImages)
    const newDisliked = new Set(dislikedImages)

    if (dislikedImages.has(imageId)) {
      newDisliked.delete(imageId)
    } else {
      newDisliked.add(imageId)
      newLiked.delete(imageId)
    }

    setLikedImages(newLiked)
    setDislikedImages(newDisliked)
  }

  const imageEditingTools = [
    { icon: Crop, label: "Crop", action: () => setActiveTool("Crop") },
    { icon: Scissors, label: "Cut", action: () => setActiveTool("Cut") },
    { icon: Palette, label: "Color", action: () => setActiveTool("Color") },
    { icon: PaintBucket, label: "Fill", action: () => setActiveTool("Fill") },
    { icon: FlipHorizontal, label: "Flip", action: () => setActiveTool("Flip") },
    { icon: Maximize2, label: "Expand", action: () => setActiveTool("Expand") },
  ]

  const videoEditingTools = [
    { icon: Crop, label: "Trim", action: () => setActiveTool("Trim") },
    { icon: Scissors, label: "Split", action: () => setActiveTool("Split") },
    { icon: Palette, label: "Filter", action: () => setActiveTool("Filter") },
    { icon: Volume2, label: "Audio", action: () => setActiveTool("Audio") },
    { icon: FlipHorizontal, label: "Flip", action: () => setActiveTool("Flip") },
    { icon: Maximize2, label: "Resize", action: () => setActiveTool("Resize") },
  ]

  const selectedImageData = images.find(img => img.id === selectedImage)
  const contentType = selectedImageData?.type || "image"

  return (
    <div className="h-full flex bg-white dark:bg-gray-900">
      {/* Colonne gauche - Grille des résultats */}
      <div className="w-1/2 p-4 border-r border-gray-100 dark:border-gray-800">
        {/* Header avec prompt */}
        <div className="flex items-center gap-2 mb-4">
          <div className="w-6 h-6 bg-lime-500 rounded-full flex items-center justify-center shadow-sm">
            <div className="w-3 h-3 bg-white rounded-full flex items-center justify-center">
              <div className="w-1.5 h-1.5 bg-lime-500 rounded-full" />
            </div>
          </div>
          <h2 className="text-sm font-medium text-gray-900 dark:text-white flex-1 truncate">
            {prompt}
          </h2>
          <Button
            variant="ghost"
            size="icon"
            className="w-6 h-6 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
          >
            <Info className="w-3 h-3" />
          </Button>
        </div>

        {/* Grille des images */}
        <div className="grid grid-cols-2 gap-3 mb-4">
          {images.map((image) => (
            <Card
              key={image.id}
              className={cn(
                "relative overflow-hidden rounded-lg border cursor-pointer transition-all duration-200 hover:shadow-md",
                selectedImage === image.id ? "ring-2 ring-blue-500 shadow-lg" : "border-gray-200 dark:border-gray-700",
                image.borderColor,
              )}
              onClick={() => setSelectedImage(image.id)}
            >
              <div className="aspect-square relative overflow-hidden bg-gray-50 dark:bg-gray-800">
                {image.type === "video" ? (
                  <div className="w-full h-full flex items-center justify-center">
                    <VideoIcon className="w-8 h-8 text-gray-400" />
                  </div>
                ) : (
                  <img 
                    src={image.url || "/placeholder.svg"} 
                    alt={image.prompt} 
                    className="w-full h-full object-cover"
                  />
                )}
                {/* Type indicator */}
                <div className="absolute top-2 right-2">
                  {image.type === "video" ? (
                    <div className="w-6 h-6 bg-black/50 rounded-full flex items-center justify-center">
                      <Play className="w-3 h-3 text-white" />
                    </div>
                  ) : (
                    <div className="w-6 h-6 bg-black/50 rounded-full flex items-center justify-center">
                      <ImageIcon className="w-3 h-3 text-white" />
                    </div>
                  )}
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Boutons d'action */}
        <div className="flex items-center justify-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            className={cn(
              "w-8 h-8 rounded-full hover:bg-green-100 dark:hover:bg-green-900/30 transition-all duration-200",
              likedImages.size > 0 && "bg-green-100 dark:bg-green-900/30",
            )}
            onClick={() => images.forEach((img) => handleLike(img.id))}
          >
            <ThumbsUp
              className={cn(
                "w-4 h-4 transition-all duration-200", 
                likedImages.size > 0 ? "text-green-600 fill-current" : "text-gray-500 dark:text-gray-400"
              )}
            />
          </Button>

          <Button
            variant="ghost"
            size="icon"
            className={cn(
              "w-8 h-8 rounded-full hover:bg-red-100 dark:hover:bg-red-900/30 transition-all duration-200",
              dislikedImages.size > 0 && "bg-red-100 dark:bg-red-900/30",
            )}
            onClick={() => images.forEach((img) => handleDislike(img.id))}
          >
            <ThumbsDown
              className={cn(
                "w-4 h-4 transition-all duration-200", 
                dislikedImages.size > 0 ? "text-red-600 fill-current" : "text-gray-500 dark:text-gray-400"
              )}
            />
          </Button>

          <Button
            variant="ghost"
            size="icon"
            className="w-8 h-8 rounded-full hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-all duration-200"
            onClick={() => console.log("Share")}
          >
            <Share2 className="w-4 h-4 text-gray-500 dark:text-gray-400" />
          </Button>

          <Button
            variant="ghost"
            size="icon"
            className="w-8 h-8 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-200"
            onClick={() => console.log("Regenerate")}
          >
            <RotateCcw className="w-4 h-4 text-gray-500 dark:text-gray-400" />
          </Button>
        </div>
      </div>

      {/* Colonne droite - Éditeur et configuration */}
      <div className="w-1/2 p-4 flex flex-col">
        {/* Tabs pour Image/Video */}
        <Tabs value={contentType} className="flex-1 flex flex-col">
          <TabsList className="grid w-full grid-cols-2 mb-4 h-8">
            <TabsTrigger value="image" className="text-xs">
              <ImageIcon className="w-3 h-3 mr-1" />
              Image
            </TabsTrigger>
            <TabsTrigger value="video" className="text-xs">
              <VideoIcon className="w-3 h-3 mr-1" />
              Vidéo
            </TabsTrigger>
          </TabsList>

          <TabsContent value="image" className="flex-1 flex flex-col">
            {/* Aperçu de l'image sélectionnée */}
            <div className="flex-1 mb-4 bg-gray-50 dark:bg-gray-800 rounded-lg overflow-hidden">
              {selectedImageData && (
                <div className="w-full h-full flex items-center justify-center">
                  <img 
                    src={selectedImageData.url || "/placeholder.svg"} 
                    alt={selectedImageData.prompt} 
                    className="max-w-full max-h-full object-contain"
                  />
                </div>
              )}
            </div>

            {/* Outils d'édition d'image */}
            <div className="mb-4">
              <div className="bg-gray-900 dark:bg-gray-800 rounded-lg px-3 py-2 flex items-center gap-2">
                {imageEditingTools.map((tool, index) => (
                  <Button
                    key={index}
                    variant="ghost"
                    size="sm"
                    className={cn(
                      "flex flex-col items-center gap-1 text-white hover:bg-white/10 h-auto py-1 px-2 rounded text-xs",
                      activeTool === tool.label && "bg-white/20"
                    )}
                    onClick={tool.action}
                  >
                    <tool.icon className="w-3 h-3" />
                    <span className="text-xs">{tool.label}</span>
                  </Button>
                ))}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="video" className="flex-1 flex flex-col">
            {/* Aperçu de la vidéo sélectionnée */}
            <div className="flex-1 mb-4 bg-gray-50 dark:bg-gray-800 rounded-lg overflow-hidden relative">
              {selectedImageData && (
                <div className="w-full h-full flex items-center justify-center">
                  <div className="text-center">
                    <VideoIcon className="w-16 h-16 text-gray-400 mx-auto mb-2" />
                    <p className="text-sm text-gray-500 dark:text-gray-400">Aperçu vidéo</p>
                  </div>
                </div>
              )}
              {/* Contrôles vidéo */}
              <div className="absolute bottom-2 left-2 right-2 flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="icon"
                  className="w-6 h-6 bg-black/50 rounded-full hover:bg-black/70"
                  onClick={() => setIsPlaying(!isPlaying)}
                >
                  {isPlaying ? (
                    <Pause className="w-3 h-3 text-white" />
                  ) : (
                    <Play className="w-3 h-3 text-white" />
                  )}
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="w-6 h-6 bg-black/50 rounded-full hover:bg-black/70"
                  onClick={() => setIsMuted(!isMuted)}
                >
                  {isMuted ? (
                    <VolumeX className="w-3 h-3 text-white" />
                  ) : (
                    <Volume2 className="w-3 h-3 text-white" />
                  )}
                </Button>
              </div>
            </div>

            {/* Outils d'édition vidéo */}
            <div className="mb-4">
              <div className="bg-gray-900 dark:bg-gray-800 rounded-lg px-3 py-2 flex items-center gap-2">
                {videoEditingTools.map((tool, index) => (
                  <Button
                    key={index}
                    variant="ghost"
                    size="sm"
                    className={cn(
                      "flex flex-col items-center gap-1 text-white hover:bg-white/10 h-auto py-1 px-2 rounded text-xs",
                      activeTool === tool.label && "bg-white/20"
                    )}
                    onClick={tool.action}
                  >
                    <tool.icon className="w-3 h-3" />
                    <span className="text-xs">{tool.label}</span>
                  </Button>
                ))}
              </div>
            </div>
          </TabsContent>
        </Tabs>

        {/* Boutons d'action et configuration */}
        <div className="space-y-3">
          {/* Boutons principaux */}
          <div className="flex gap-2">
            <Button
              variant="default"
              size="sm"
              className="flex-1 h-8 text-xs bg-blue-600 hover:bg-blue-700"
              onClick={() => console.log("Download")}
            >
              <Download className="w-3 h-3 mr-1" />
              Télécharger
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="h-8 text-xs"
              onClick={() => console.log("Share")}
            >
              <Share2 className="w-3 h-3 mr-1" />
              Partager
            </Button>
          </div>

          {/* Configuration */}
          <div className="border border-gray-200 dark:border-gray-700 rounded-lg">
            <Button
              variant="ghost"
              size="sm"
              className="w-full h-8 text-xs justify-between"
              onClick={() => setShowSettings(!showSettings)}
            >
              <div className="flex items-center gap-2">
                <Settings className="w-3 h-3" />
                Configuration
              </div>
              {showSettings ? (
                <ChevronUp className="w-3 h-3" />
              ) : (
                <ChevronDown className="w-3 h-3" />
              )}
            </Button>
            
            {showSettings && (
              <div className="px-3 pb-3 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span>Qualité</span>
                  <select className="text-xs border border-gray-300 dark:border-gray-600 rounded px-2 py-1 bg-white dark:bg-gray-800">
                    <option>HD</option>
                    <option>Normal</option>
                    <option>Basique</option>
                  </select>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span>Format</span>
                  <select className="text-xs border border-gray-300 dark:border-gray-600 rounded px-2 py-1 bg-white dark:bg-gray-800">
                    <option>PNG</option>
                    <option>JPG</option>
                    <option>WEBP</option>
                  </select>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span>Taille</span>
                  <select className="text-xs border border-gray-300 dark:border-gray-600 rounded px-2 py-1 bg-white dark:bg-gray-800">
                    <option>1024x1024</option>
                    <option>512x512</option>
                    <option>256x256</option>
                  </select>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
