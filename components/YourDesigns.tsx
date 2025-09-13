"use client"

import { useState, useEffect } from "react";
import { Search, Filter, Grid3X3, List, Download, Share2, MoreVertical, Calendar, Eye, Heart, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import SharedHeader from "./SharedHeader";
import { User } from "@supabase/supabase-js";
import { getUserDesigns, getAvailableCategories, type Design, type DesignFilters } from "@/lib/api/designs";

const defaultCategories = ["All", "Logo", "Website", "Mobile", "Branding", "Social Media", "Print"];

interface YourDesignsProps {
  activeTab: "ai" | "designs" | "templates";
  setActiveTab: (tab: "ai" | "designs" | "templates") => void;
  user: User | null;
}

export default function YourDesigns({ activeTab, setActiveTab, user }: YourDesignsProps) {
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [designs, setDesigns] = useState<Design[]>([]);
  const [categories, setCategories] = useState<string[]>(defaultCategories);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch user designs and available categories
  useEffect(() => {
    const fetchData = async () => {
      if (!user) {
        setDesigns([]);
        setLoading(false);
        return;
      }

      setLoading(true);
      setError(null);

      try {
        // Fetch user designs
        const filters: DesignFilters = {
          category: selectedCategory === "All" ? undefined : selectedCategory,
          search: searchQuery || undefined,
        };

        const { data: designsData, error: designsError } = await getUserDesigns(user, filters);
        
        if (designsError) {
          setError(designsError);
        } else {
          setDesigns(designsData || []);
        }

        // Fetch available categories
        const { data: categoriesData, error: categoriesError } = await getAvailableCategories();
        
        if (!categoriesError && categoriesData) {
          const allCategories = ["All", ...categoriesData];
          setCategories(allCategories);
        }
      } catch (err) {
        setError("Failed to fetch designs");
        console.error("Error fetching designs:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user, selectedCategory, searchQuery]);

  // Filter designs based on search query (client-side filtering for better UX)
  const filteredDesigns = designs.filter(design => {
    if (!searchQuery) return true;
    
    const searchLower = searchQuery.toLowerCase();
    return (
      design.title.toLowerCase().includes(searchLower) ||
      (design.description && design.description.toLowerCase().includes(searchLower)) ||
      design.tags.some(tag => tag.toLowerCase().includes(searchLower))
    );
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

          {/* Loading State */}
          {loading && (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-8 h-8 animate-spin text-purple-600" />
              <span className="ml-2 text-gray-600">Loading your designs...</span>
            </div>
          )}

          {/* Error State */}
          {error && (
            <div className="text-center py-12">
              <div className="w-24 h-24 mx-auto mb-4 bg-red-100 rounded-full flex items-center justify-center">
                <Search className="w-8 h-8 text-red-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Error loading designs</h3>
              <p className="text-gray-600 mb-4">{error}</p>
              <Button 
                onClick={() => window.location.reload()} 
                variant="outline"
              >
                Try Again
              </Button>
            </div>
          )}

          {/* Designs Grid/List */}
          {!loading && !error && (
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
          )}

          {/* Empty State */}
          {!loading && !error && filteredDesigns.length === 0 && (
            <div className="text-center py-12">
              <div className="w-24 h-24 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                <Search className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                {user ? "No designs found" : "Please sign in to view your designs"}
              </h3>
              <p className="text-gray-600">
                {user 
                  ? "Try adjusting your search or filter criteria, or create your first design!"
                  : "Sign in to start creating and managing your designs."
                }
              </p>
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
          src={design.image_url}
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
        
        {design.description && (
          <p className="text-sm text-gray-600 mb-3 line-clamp-2">{design.description}</p>
        )}
        
        {/* Tags */}
        {design.tags && design.tags.length > 0 && (
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
        )}

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
            {new Date(design.created_at).toLocaleDateString()}
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
            src={design.image_url}
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
          
          {design.description && (
            <p className="text-sm text-gray-600 mb-2">{design.description}</p>
          )}
          
          {/* Tags */}
          {design.tags && design.tags.length > 0 && (
            <div className="flex flex-wrap gap-1 mb-3">
              {design.tags.map((tag) => (
                <span key={tag} className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                  {tag}
                </span>
              ))}
            </div>
          )}

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
                {new Date(design.created_at).toLocaleDateString()}
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
