"use client"

import { useState } from "react";
import { Search, Grid3X3, List, Download, Share2, MoreVertical, Calendar, Eye, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

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

export default function YourDesignsContent() {
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
    <div className="w-full h-full relative">
      {/* Effet de fond flou */}
      <div
        className="absolute inset-x-4 top-5 h-full bg-gradient-to-r from-cyan-200 to-purple-300 dark:from-cyan-400 dark:to-purple-500 rounded-2xl filter blur-2xl opacity-50 -z-10"
        aria-hidden="true"
      />
        
      {/* Content Container with Rounded Borders */}
      <div className="relative h-full bg-background rounded-sm border border-[#ffdcf1] overflow-hidden">
        <div className="custom-scrollbar overflow-y-auto h-full">
          {/* Page Header */}
          <div className="p-6 pb-4">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-50 mb-2">Your Designs</h1>
            <p className="text-gray-600 dark:text-gray-50">Manage and showcase your creative work</p>
            <div className="mt-4">
              <Button className="bg-purple-100 cursor-pointer hover:bg-purple-200/80 text-purple-800 rounded-lg px-4 py-2 font-medium shadow-sm border border-purple-200/50">
                <Download className="w-4 h-4 mr-2" /> Export All
              </Button>
            </div>
          </div>

          {/* Controls - devient sticky lors du scroll */}
          <div className="sticky top-0 bg-background z-10 px-6 py-2 pb-4 border-b border-gray-100">
            <div className="flex flex-col sm:flex-row gap-4">
              {/* Search */}
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-50 w-4 h-4" />
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
          </div>

          {/* Designs Grid/List */}
          <div className="p-6 pt-4">
            {viewMode === "grid" ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {filteredDesigns.map((design) => (
                  <DesignCard key={design.id} design={design} />
                ))}
              </div>
            ) : (
              <div className="space-y-3">
                {filteredDesigns.map((design) => (
                  <DesignListItem key={design.id} design={design} />
                ))}
              </div>
            )}

            {/* Empty State */}
            {filteredDesigns.length === 0 && (
              <div className="text-center py-12">
                <div className="w-24 h-24 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                  <Search className="w-8 h-8 text-gray-400 dark:text-gray-50" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-gray-50 mb-2">No designs found</h3>
                <p className="text-gray-600 dark:text-gray-50">Try adjusting your search or filter criteria</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function DesignCard({ design }: { design: Design }) {
  return (
    <div className="bg-background rounded-lg border border-gray-200 overflow-hidden hover:shadow-md transition-shadow group cursor-pointer">
      {/* Image */}
      <div className="aspect-square bg-background relative overflow-hidden">
        <img
          src={design.imageUrl}
          alt={design.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 transition-all duration-300" />
        
        {/* Category Badge */}
        <div className="absolute top-2 left-2">
          <Badge variant="secondary" className="text-xs bg-white/90 text-gray-700">
            {design.category}
          </Badge>
        </div>
      </div>

      {/* Content */}
      <div className="p-3">
        <h3 className="font-medium text-gray-900 dark:text-gray-50 text-sm line-clamp-1 mb-1">{design.title}</h3>
        <p className="text-xs text-gray-500 dark:text-gray-50 line-clamp-1 mb-2">{design.description}</p>
        
        {/* Stats */}
        <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-50">
          <div className="flex items-center gap-2">
            <span className="flex items-center gap-1">
              <Eye className="w-3 h-3" />
              {design.views}
            </span>
            <span className="flex items-center gap-1">
              <Heart className="w-3 h-3" />
              {design.likes}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

function DesignListItem({ design }: { design: Design }) {
  return (
    <div className="bg-background rounded-xl shadow-sm border border-gray-200 p-4 hover:shadow-lg transition-shadow">
      <div className="flex gap-4">
        {/* Image */}
        <div className="w-32 h-24 bg-background rounded-lg overflow-hidden flex-shrink-0">
          <img
            src={design.imageUrl}
            alt={design.title}
            className="w-full h-full object-cover"
          />
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between mb-2">
            <h3 className="font-semibold text-gray-500 dark:text-gray-50">{design.title}</h3>
            <Badge variant="outline" className="text-xs">
              {design.category}
            </Badge>
          </div>
          
          <p className="text-sm text-gray-600 dark:text-gray-50 mb-2">{design.description}</p>
          
          {/* Tags */}
          <div className="flex flex-wrap gap-1 mb-3">
            {design.tags.map((tag) => (
              <span key={tag} className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                {tag}
              </span>
            ))}
          </div>

          {/* Stats */}
          <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-50">
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