import { useMemo } from 'react';
import { useAppStore } from '@/store/useStore';

export interface UserAvatarInfo {
  avatarUrl: string | null;
  displayName: string;
  email: string;
  initial: string;
}

export function useUserAvatar(): UserAvatarInfo | null {
  const user = useAppStore((state) => state.user);

  return useMemo(() => {
    if (!user) return null;

    // Récupération de l'avatar Google - essayer plusieurs propriétés possibles
    const avatarUrl = user.user_metadata?.picture || 
                     user.user_metadata?.avatar_url || 
                     user.user_metadata?.avatar ||
                     null;

    // Récupération du nom d'affichage
    const displayName = user.user_metadata?.full_name || 
                       user.user_metadata?.name || 
                       user.email || 
                       'Utilisateur';

    // Récupération de l'email
    const email = user.email || '';

    // Génération de l'initiale
    const initial = displayName.charAt(0).toUpperCase();

    return {
      avatarUrl,
      displayName,
      email,
      initial
    };
  }, [user]);
}

