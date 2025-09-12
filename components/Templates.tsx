"use client"

import { useState } from "react";
import { Search, Grid3X3, List, Star, Download, Eye, Heart, Sparkles, Filter, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import SharedHeader from "./SharedHeader";
import { User } from "@supabase/supabase-js";

interface Template {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  category: string;
  difficulty: "Beginner" | "Intermediate" | "Advanced";
  rating: number;
  downloads: number;
  views: number;
  likes: number;
  tags: string[];
  isPremium: boolean;
  isTrending: boolean;
}

const mockTemplates: Template[] = [
  {
    id: "1",
    title: "Modern Business Card",
    description: "Professional business card design with clean typography",
    imageUrl: "/placeholder.jpg",
    category: "Print",
    difficulty: "Beginner",
    rating: 4.8,
    downloads: 1247,
    views: 8923,
    likes: 456,
    tags: ["business card", "print", "professional"],
    isPremium: false,
    isTrending: true
  },
  {
    id: "2",
    title: "E-commerce Landing Page",
    description: "High-converting landing page for online stores",
    imageUrl: "/placeholder.jpg",
    category: "Website",
    difficulty: "Intermediate",
    rating: 4.9,
    downloads: 2156,
    views: 15678,
    likes: 892,
    tags: ["landing page", "e-commerce", "conversion"],
    isPremium: true,
    isTrending: true
  },
  {
    id: "3",
    title: "Social Media Kit",
    description: "Complete Instagram and Facebook post templates",
    imageUrl: "/placeholder.jpg",
    category: "Social Media",
    difficulty: "Beginner",
    rating: 4.7,
    downloads: 3421,
    views: 23456,
    likes: 1234,
    tags: ["social media", "instagram", "facebook"],
    isPremium: false,
    isTrending: false
  },
  {
    id: "4",
    title: "Mobile App Wireframe",
    description: "User experience wireframes for mobile applications",
    imageUrl: "/placeholder.jpg",
    category: "Mobile",
    difficulty: "Advanced",
    rating: 4.6,
    downloads: 987,
    views: 5678,
    likes: 234,
    tags: ["wireframe", "mobile", "ux"],
    isPremium: true,
    isTrending: false
  },
  {
    id: "5",
    title: "Brand Identity Package",
    description: "Complete branding kit including logo, colors, and guidelines",
    imageUrl: "/placeholder.jpg",
    category: "Branding",
    difficulty: "Intermediate",
    rating: 4.9,
    downloads: 1893,
    views: 12345,
    likes: 678,
    tags: ["branding", "logo", "identity"],
    isPremium: true,
    isTrending: true
  },
  {
    id: "6",
    title: "Newsletter Template",
    description: "Professional email newsletter design",
    imageUrl: "/placeholder.jpg",
    category: "Email",
    difficulty: "Beginner",
    rating: 4.5,
    downloads: 2765,
    views: 9876,
    likes: 345,
    tags: ["newsletter", "email", "marketing"],
    isPremium: false,
    isTrending: false
  },
  {
    id: "7",
    title: "Product Catalog",
    description: "Elegant product catalog layout for retail businesses",
    imageUrl: "/placeholder.jpg",
    category: "Print",
    difficulty: "Intermediate",
    rating: 4.7,
    downloads: 1567,
    views: 7890,
    likes: 567,
    tags: ["catalog", "print", "retail"],
    isPremium: false,
    isTrending: true
  },
  {
    id: "8",
    title: "Dashboard UI Kit",
    description: "Modern dashboard interface components",
    imageUrl: "/placeholder.jpg",
    category: "Website",
    difficulty: "Advanced",
    rating: 4.8,
    downloads: 2341,
    views: 14567,
    likes: 789,
    tags: ["dashboard", "ui", "components"],
    isPremium: true,
    isTrending: false
  }
];

const categories = ["All", "Print", "Website", "Social Media", "Mobile", "Branding", "Email"];
const difficulties = ["All", "Beginner", "Intermediate", "Advanced"];

interface TemplatesProps {
  activeTab: "ai" | "designs" | "templates";
  setActiveTab: (tab: "ai" | "designs" | "templates") => void;
  user: User | null;
}

export default function Templates({ activeTab, setActiveTab, user }: TemplatesProps) {
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedDifficulty, setSelectedDifficulty] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [showPremiumOnly, setShowPremiumOnly] = useState(false);

  const filteredTemplates = mockTemplates.filter(template => {
    const matchesCategory = selectedCategory === "All" || template.category === selectedCategory;
    const matchesDifficulty = selectedDifficulty === "All" || template.difficulty === selectedDifficulty;
    const matchesSearch = template.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         template.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         template.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesPremium = !showPremiumOnly || template.isPremium;
    
    return matchesCategory && matchesDifficulty && matchesSearch && matchesPremium;
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
            <h1 className="text-4xl font-bold text-gray-900 mb-2">Templates</h1>
            <p className="text-gray-600">Discover professional templates to inspire your next project</p>
            <div className="mt-4">
              <Button className="bg-purple-100 cursor-pointer hover:bg-purple-200/80 text-purple-800 rounded-lg px-4 py-2 font-medium shadow-sm border border-purple-200/50">
                <Sparkles className="w-4 h-4 mr-2" /> Premium Access
              </Button>
            </div>
          </div>

          {/* Controls */}
          <div className="flex flex-col gap-4 mb-8">
            {/* Search and Filters Row */}
            <div className="flex flex-col sm:flex-row gap-4">
              {/* Search */}
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Search templates..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>

              {/* Premium Filter */}
              <Button
                variant={showPremiumOnly ? "default" : "outline"}
                onClick={() => setShowPremiumOnly(!showPremiumOnly)}
                className="whitespace-nowrap"
              >
                <Sparkles className="w-4 h-4 mr-2" />
                Premium Only
              </Button>

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

            {/* Category and Difficulty Filters */}
            <div className="flex flex-col sm:flex-row gap-4">
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

              {/* Difficulty Filter */}
              <div className="flex gap-2 overflow-x-auto pb-2">
                {difficulties.map((difficulty) => (
                  <Badge
                    key={difficulty}
                    variant={selectedDifficulty === difficulty ? "default" : "secondary"}
                    className="cursor-pointer whitespace-nowrap"
                    onClick={() => setSelectedDifficulty(difficulty)}
                  >
                    {difficulty}
                  </Badge>
                ))}
              </div>
            </div>
          </div>

          {/* Templates Grid/List */}
          <div className="custom-scrollbar overflow-y-auto max-h-[calc(100vh-300px)]">
            {viewMode === "grid" ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredTemplates.map((template) => (
                  <TemplateCard key={template.id} template={template} />
                ))}
              </div>
            ) : (
              <div className="space-y-4">
                {filteredTemplates.map((template) => (
                  <TemplateListItem key={template.id} template={template} />
                ))}
              </div>
            )}
          </div>

          {/* Empty State */}
          {filteredTemplates.length === 0 && (
            <div className="text-center py-12">
              <div className="w-24 h-24 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                <Search className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No templates found</h3>
              <p className="text-gray-600">Try adjusting your search or filter criteria</p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

function TemplateCard({ template }: { template: Template }) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow group">
      {/* Image */}
      <div className="aspect-video bg-gray-100 relative overflow-hidden">
        <img
          src={template.imageUrl}
          alt={template.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300" />
        
        {/* Premium Badge */}
        {template.isPremium && (
          <div className="absolute top-3 left-3">
            <Badge className="bg-gradient-to-r from-purple-600 to-pink-600 text-white">
              <Sparkles className="w-3 h-3 mr-1" />
              Premium
            </Badge>
          </div>
        )}

        {/* Trending Badge */}
        {template.isTrending && (
          <div className="absolute top-3 right-3">
            <Badge className="bg-gradient-to-r from-orange-500 to-red-500 text-white">
              <TrendingUp className="w-3 h-3 mr-1" />
              Trending
            </Badge>
          </div>
        )}

        {/* Actions */}
        <div className="absolute bottom-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
          <Button size="sm" variant="secondary">
            <Download className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        <div className="flex items-start justify-between mb-2">
          <h3 className="font-semibold text-gray-900 line-clamp-1">{template.title}</h3>
          <div className="flex items-center gap-1">
            <Star className="w-4 h-4 text-yellow-500 fill-current" />
            <span className="text-sm font-medium">{template.rating}</span>
          </div>
        </div>
        
        <p className="text-sm text-gray-600 mb-3 line-clamp-2">{template.description}</p>
        
        {/* Tags */}
        <div className="flex flex-wrap gap-1 mb-3">
          {template.tags.slice(0, 2).map((tag) => (
            <span key={tag} className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
              {tag}
            </span>
          ))}
          {template.tags.length > 2 && (
            <span className="text-xs text-gray-500">+{template.tags.length - 2}</span>
          )}
        </div>

        {/* Stats and Difficulty */}
        <div className="flex items-center justify-between text-xs text-gray-500">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1">
              <Eye className="w-3 h-3" />
              {template.views.toLocaleString()}
            </span>
            <span className="flex items-center gap-1">
              <Download className="w-3 h-3" />
              {template.downloads.toLocaleString()}
            </span>
          </div>
          <Badge 
            variant="outline" 
            className={`text-xs ${
              template.difficulty === "Beginner" ? "text-green-600 border-green-200" :
              template.difficulty === "Intermediate" ? "text-yellow-600 border-yellow-200" :
              "text-red-600 border-red-200"
            }`}
          >
            {template.difficulty}
          </Badge>
        </div>
      </div>
    </div>
  );
}

function TemplateListItem({ template }: { template: Template }) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 hover:shadow-lg transition-shadow">
      <div className="flex gap-4">
        {/* Image */}
        <div className="w-32 h-24 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0 relative">
          <img
            src={template.imageUrl}
            alt={template.title}
            className="w-full h-full object-cover"
          />
          {template.isPremium && (
            <div className="absolute top-1 left-1">
              <Badge className="bg-gradient-to-r from-purple-600 to-pink-600 text-white text-xs">
                <Sparkles className="w-2 h-2 mr-1" />
                Premium
              </Badge>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between mb-2">
            <div className="flex items-center gap-2">
              <h3 className="font-semibold text-gray-900">{template.title}</h3>
              {template.isTrending && (
                <Badge className="bg-gradient-to-r from-orange-500 to-red-500 text-white text-xs">
                  <TrendingUp className="w-2 h-2 mr-1" />
                  Trending
                </Badge>
              )}
            </div>
            <div className="flex items-center gap-1">
              <Star className="w-4 h-4 text-yellow-500 fill-current" />
              <span className="text-sm font-medium">{template.rating}</span>
            </div>
          </div>
          
          <p className="text-sm text-gray-600 mb-2">{template.description}</p>
          
          {/* Tags */}
          <div className="flex flex-wrap gap-1 mb-3">
            {template.tags.map((tag) => (
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
                {template.views.toLocaleString()}
              </span>
              <span className="flex items-center gap-1">
                <Download className="w-3 h-3" />
                {template.downloads.toLocaleString()}
              </span>
              <span className="flex items-center gap-1">
                <Heart className="w-3 h-3" />
                {template.likes.toLocaleString()}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Badge 
                variant="outline" 
                className={`text-xs ${
                  template.difficulty === "Beginner" ? "text-green-600 border-green-200" :
                  template.difficulty === "Intermediate" ? "text-yellow-600 border-yellow-200" :
                  "text-red-600 border-red-200"
                }`}
              >
                {template.difficulty}
              </Badge>
              <Button size="sm" variant="outline">
                <Download className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
