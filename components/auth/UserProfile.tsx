"use client";

import { useState, useEffect } from 'react';
import { supabase } from "@/lib/supabase/client";
import { useUserAvatar } from "@/hooks/useUserAvatar";
import { UserAvatar } from "@/components/ui/user-avatar";
import { LogOut } from 'lucide-react';
import { Button } from '../ui/button';

export default function UserProfile() {
  const userInfo = useUserAvatar();
  const [isOpen, setIsOpen] = useState(false);

  // Debug: Afficher les informations utilisateur dans la console
  useEffect(() => {
    if (userInfo) {
      console.log('User info:', userInfo);
    }
  }, [userInfo]);

  if (!userInfo) return null;

  const { avatarUrl, displayName, email } = userInfo;

  const handleLogout = async () => {
    await supabase.auth.signOut();
    // Le re-rendu sera géré par le listener onAuthStateChange
  };

  return (
    <div className="relative">
      <Button 
        onClick={() => setIsOpen(!isOpen)} 
        className="p-0 h-8 w-8 cursor-pointer bg-transparent hover:bg-transparent focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
      >
        <UserAvatar 
          avatarUrl={avatarUrl}
          displayName={displayName}
          size="md"
          showTooltip={true}
        />
      </Button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-xl z-20 border border-gray-200">
          <div className="p-4 border-b">
            <p className="font-semibold text-gray-800">{displayName}</p>
            <p className="text-sm text-gray-500">{email}</p>
          </div>
          <button onClick={handleLogout} className="w-full text-left cursor-pointer flex items-center gap-3 px-4 py-3 text-sm text-red-600 hover:bg-red-50">
            <LogOut className="w-4 h-4" />
            Logout
          </button>
        </div>
      )}
    </div>
  );
}