"use client"

import { Folder, FileText, Sparkles, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { User } from "@supabase/supabase-js";
import UserProfile from "@/components/auth/UserProfile";

interface SharedHeaderProps {
  activeTab: "ai" | "designs" | "templates";
  setActiveTab: (tab: "ai" | "designs" | "templates") => void;
  user: User | null;
}

export default function SharedHeader({ activeTab, setActiveTab, user }: SharedHeaderProps) {
  return (
    <header className="flex justify-between items-center p-6">
      <div className="flex-1" />
      
      {/* Tab Navigation */}
      <div className="flex items-center gap-2">
        <button 
          onClick={() => setActiveTab("designs")}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            activeTab === "designs" 
              ? "text-purple-800 bg-gradient-to-r from-cyan-100/70 to-purple-200/70 shadow-sm border border-purple-200/50"
              : "text-gray-600 hover:bg-gray-100"
          }`}
        >
          <Folder className="w-4 h-4" /> Your designs
        </button>
        <button 
          onClick={() => setActiveTab("templates")}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            activeTab === "templates" 
              ? "text-purple-800 bg-gradient-to-r from-cyan-100/70 to-purple-200/70 shadow-sm border border-purple-200/50"
              : "text-gray-600 hover:bg-gray-100"
          }`}
        >
          <FileText className="w-4 h-4" /> Templates
        </button>
        <button 
          onClick={() => setActiveTab("ai")}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            activeTab === "ai" 
              ? "text-purple-800 bg-gradient-to-r from-cyan-100/70 to-purple-200/70 shadow-sm border border-purple-200/50"
              : "text-gray-600 hover:bg-gray-100"
          }`}
        >
          <Sparkles className="w-4 h-4 text-purple-600" /> Canva AI <X className="w-3 h-3 ml-1" />
        </button>
      </div>

      {/* User Profile */}
      <div className="flex items-center gap-2">
        {user ? (
          <UserProfile />
        ) : (
          <Button className="bg-purple-100 hover:bg-purple-200/80 text-purple-800 rounded-lg px-4 py-2 font-medium shadow-sm border border-purple-200/50">
            Sign In
          </Button>
        )}
      </div>
    </header>
  );
}
