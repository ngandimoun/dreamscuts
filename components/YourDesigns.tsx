"use client"

import { useState } from "react";
import { Search, Filter, Grid3X3, List, Download, Share2, MoreVertical, Calendar, Eye, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import SharedHeader from "./SharedHeader";
import { User } from "@supabase/supabase-js";

interface Design {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  category: string;
  createdAt: string;
  views: number;
  likes: number;
  tags: string[];
}

const mockDesigns: Design[] = [
  {
    id: "1",
    title: "Modern Logo Design",
    description: "Clean and minimalist logo for tech startup",
    imageUrl: "/placeholder.jpg",
    category: "Logo",
    createdAt: "2024-01-15",
    views: 1247,
    likes: 89,
    tags: ["logo", "minimalist", "tech"]
  },
  {
    id: "2",
    title: "E-commerce Website",
    description: "Responsive design for online store",
    imageUrl: "/placeholder.jpg",
    category: "Website",
    createdAt: "2024-01-10",
    views: 2156,
    likes: 156,
    tags: ["website", "e-commerce", "responsive"]
  },
  {
    id: "3",
    title: "Mobile App UI",
    description: "User interface for fitness tracking app",
    imageUrl: "/placeholder.jpg",
    category: "Mobile",
    createdAt: "2024-01-08",
    views: 1893,
    likes: 234,
    tags: ["mobile", "ui", "fitness"]
  },
  {
    id: "4",
    title: "Brand Identity",
    description: "Complete brand package for restaurant",
    imageUrl: "/placeholder.jpg",
    category: "Branding",
    createdAt: "2024-01-05",
    views: 987,
    likes: 67,
    tags: ["branding", "restaurant", "identity"]
  },
  {
    id: "5",
    title: "Social Media Graphics",
    description: "Instagram post templates for beauty brand",
    imageUrl: "/placeholder.jpg",
    category: "Social Media",
    createdAt: "2024-01-03",
    views: 3421,
    likes: 298,
    tags: ["social media", "instagram", "beauty"]
  },
  {
    id: "6",
    title: "Print Advertisement",
    description: "Magazine ad for luxury car brand",
    imageUrl: "/placeholder.jpg",
    category: "Print",
    createdAt: "2024-01-01",
    views: 1567,
    likes: 123,
    tags: ["print", "advertisement", "luxury"]
  }
];

const categories = ["All", "Logo", "Website", "Mobile", "Branding", "Social Media", "Print"];

interface YourDesignsProps {
  activeTab: "ai" | "designs" | "templates";
  setActiveTab: (tab: "ai" | "designs" | "templates") => void;
  user: User | null;
}

export default function YourDesigns({ activeTab, setActiveTab, user }: YourDesignsProps) {
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredDesigns = mockDesigns.filter(design => {
    const matchesCategory = selectedCategory === "All" || design.category === selectedCategory;
    const matchesSearch = design.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         design.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         design.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-background">
      {/* Header avec masque de fondu */}
      <div
        className="absolute top-0 left-0 w-full h-1/4 bg-gradient-to-r from-[#abf4fd] via-blue-100 to-purple-300"
        style={{ maskImage: 'linear-gradient(to bottom, black 20%, transparent 100%)' }}
      />

      <div className="relative z-10 max-w-7xl mx-auto">
        {/* Header Section */}
        <SharedHeader activeTab={activeTab} setActiveTab={setActiveTab} user={user} />

        {/* Main Content */}
        <main className="px-6 pb-10 pt-16">
          {/* Page Header */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-2">Your Designs</h1>
            <p className="text-gray-600">Manage and showcase your creative work</p>
            <div className="mt-4">
              <Button className="bg-purple-100 cursor-pointer hover:bg-purple-200/80 text-purple-800 rounded-lg px-4 py-2 font-medium shadow-sm border border-purple-200/50">
                <Download className="w-4 h-4 mr-2" /> Export All
              </Button>
            </div>
          </div>

          {/* Controls */}
          <div className="flex flex-col sm:flex-row gap-4 mb-8">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Search designs..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Category Filter */}
            <div className="flex gap-2 overflow-x-auto pb-2">
              {categories.map((category) => (
                <Badge
                  key={category}
                  variant={selectedCategory === category ? "default" : "secondary"}
                  className="cursor-pointer whitespace-nowrap"
                  onClick={() => setSelectedCategory(category)}
                >
                  {category}
                </Badge>
              ))}
            </div>

            {/* View Mode Toggle */}
            <div className="flex items-center gap-2">
              <Button
                variant={viewMode === "grid" ? "default" : "outline"}
                size="sm"
                onClick={() => setViewMode("grid")}
              >
                <Grid3X3 className="w-4 h-4" />
              </Button>
              <Button
                variant={viewMode === "list" ? "default" : "outline"}
                size="sm"
                onClick={() => setViewMode("list")}
              >
                <List className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Designs Grid/List */}
          <div className="custom-scrollbar overflow-y-auto max-h-[calc(100vh-300px)]">
            {viewMode === "grid" ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredDesigns.map((design) => (
                  <DesignCard key={design.id} design={design} />
                ))}
              </div>
            ) : (
              <div className="space-y-4">
                {filteredDesigns.map((design) => (
                  <DesignListItem key={design.id} design={design} />
                ))}
              </div>
            )}
          </div>

          {/* Empty State */}
          {filteredDesigns.length === 0 && (
            <div className="text-center py-12">
              <div className="w-24 h-24 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                <Search className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No designs found</h3>
              <p className="text-gray-600">Try adjusting your search or filter criteria</p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

function DesignCard({ design }: { design: Design }) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow group">
      {/* Image */}
      <div className="aspect-video bg-gray-100 relative overflow-hidden">
        <img
          src={design.imageUrl}
          alt={design.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300" />
        
        {/* Actions */}
        <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
          <Button size="sm" variant="secondary" className="mr-2">
            <Share2 className="w-4 h-4" />
          </Button>
          <Button size="sm" variant="secondary">
            <MoreVertical className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        <div className="flex items-start justify-between mb-2">
          <h3 className="font-semibold text-gray-900 line-clamp-1">{design.title}</h3>
          <Badge variant="outline" className="text-xs">
            {design.category}
          </Badge>
        </div>
        
        <p className="text-sm text-gray-600 mb-3 line-clamp-2">{design.description}</p>
        
        {/* Tags */}
        <div className="flex flex-wrap gap-1 mb-3">
          {design.tags.slice(0, 2).map((tag) => (
            <span key={tag} className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
              {tag}
            </span>
          ))}
          {design.tags.length > 2 && (
            <span className="text-xs text-gray-500">+{design.tags.length - 2}</span>
          )}
        </div>

        {/* Stats */}
        <div className="flex items-center justify-between text-xs text-gray-500">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1">
              <Eye className="w-3 h-3" />
              {design.views}
            </span>
            <span className="flex items-center gap-1">
              <Heart className="w-3 h-3" />
              {design.likes}
            </span>
          </div>
          <span className="flex items-center gap-1">
            <Calendar className="w-3 h-3" />
            {new Date(design.createdAt).toLocaleDateString()}
          </span>
        </div>
      </div>
    </div>
  );
}

function DesignListItem({ design }: { design: Design }) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 hover:shadow-lg transition-shadow">
      <div className="flex gap-4">
        {/* Image */}
        <div className="w-32 h-24 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
          <img
            src={design.imageUrl}
            alt={design.title}
            className="w-full h-full object-cover"
          />
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between mb-2">
            <h3 className="font-semibold text-gray-900">{design.title}</h3>
            <Badge variant="outline" className="text-xs">
              {design.category}
            </Badge>
          </div>
          
          <p className="text-sm text-gray-600 mb-2">{design.description}</p>
          
          {/* Tags */}
          <div className="flex flex-wrap gap-1 mb-3">
            {design.tags.map((tag) => (
              <span key={tag} className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                {tag}
              </span>
            ))}
          </div>

          {/* Stats */}
          <div className="flex items-center justify-between text-xs text-gray-500">
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1">
                <Eye className="w-3 h-3" />
                {design.views}
              </span>
              <span className="flex items-center gap-1">
                <Heart className="w-3 h-3" />
                {design.likes}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="flex items-center gap-1">
                <Calendar className="w-3 h-3" />
                {new Date(design.createdAt).toLocaleDateString()}
              </span>
              <Button size="sm" variant="outline">
                <Share2 className="w-4 h-4" />
              </Button>
              <Button size="sm" variant="outline">
                <MoreVertical className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
