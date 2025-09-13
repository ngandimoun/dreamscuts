"use client"

import { useState, useEffect } from "react";
import { Search, Grid3X3, List, Download, Share2, MoreVertical, Calendar, Eye, Heart, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { User } from "@supabase/supabase-js";
import { getUserDesigns, getAvailableCategories, type Design, type DesignFilters } from "@/lib/api/designs";

const defaultCategories = ["All", "Logo", "Website", "Mobile", "Branding", "Social Media", "Print"];

interface YourDesignsContentProps {
  user: User | null;
}

export default function YourDesignsContent({ user }: YourDesignsContentProps) {
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
              <h3 className="text-lg font-medium text-gray-900 dark:text-gray-50 mb-2">Error loading designs</h3>
              <p className="text-gray-600 dark:text-gray-50 mb-4">{error}</p>
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
              </div>
            )}

            {/* Empty State */}
          {!loading && !error && filteredDesigns.length === 0 && (
              <div className="text-center py-12">
                <div className="w-24 h-24 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                  <Search className="w-8 h-8 text-gray-400 dark:text-gray-50" />
                </div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-gray-50 mb-2">
                {user ? "No designs found" : "Please sign in to view your designs"}
              </h3>
              <p className="text-gray-600 dark:text-gray-50">
                {user 
                  ? "Try adjusting your search or filter criteria, or create your first design!"
                  : "Sign in to start creating and managing your designs."
                }
              </p>
              </div>
            )}
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
          src={design.image_url}
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
        {design.description && (
        <p className="text-xs text-gray-500 dark:text-gray-50 line-clamp-1 mb-2">{design.description}</p>
        )}
        
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
            src={design.image_url}
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
          
          {design.description && (
          <p className="text-sm text-gray-600 dark:text-gray-50 mb-2">{design.description}</p>
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