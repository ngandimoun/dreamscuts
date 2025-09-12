"use client";

import { useState } from 'react';
import { cn } from '@/lib/utils';

interface UserAvatarProps {
  avatarUrl?: string | null;
  displayName: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  showTooltip?: boolean;
}

const sizeClasses = {
  sm: 'w-8 h-8 text-sm',
  md: 'w-8 h-8 text-base',
  lg: 'w-8 h-8 text-lg',
  xl: 'w-8 h-8 text-xl'
};

export function UserAvatar({ 
  avatarUrl, 
  displayName, 
  size = 'md', 
  className,
  showTooltip = false 
}: UserAvatarProps) {
  const [imageError, setImageError] = useState(false);
  const [showTooltipState, setShowTooltipState] = useState(false);

  const initial = displayName.charAt(0).toUpperCase();
  const shouldShowImage = avatarUrl && !imageError;

  return (
    <div className="relative inline-block">
      <div
        className={cn(
          'flex items-center justify-center rounded-full bg-gray-200 hover:bg-gray-300 transition-colors',
          sizeClasses[size],
          className
        )}
        onMouseEnter={() => showTooltip && setShowTooltipState(true)}
        onMouseLeave={() => showTooltip && setShowTooltipState(false)}
      >
        {shouldShowImage ? (
          <img
            src={avatarUrl}
            alt={`Avatar de ${displayName}`}
            className="w-full h-full rounded-full object-cover"
            onError={() => setImageError(true)}
            onLoad={() => setImageError(false)}
          />
        ) : (
          <span className="font-semibold text-gray-700">{initial}</span>
        )}
      </div>

      {/* Tooltip */}
      {showTooltip && showTooltipState && (
        <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 text-xs text-white bg-gray-900 rounded whitespace-nowrap z-50">
          {displayName}
          <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900"></div>
        </div>
      )}
    </div>
  );
}

