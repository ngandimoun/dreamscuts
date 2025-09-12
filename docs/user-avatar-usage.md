# Gestion de l'Avatar Utilisateur

## Vue d'ensemble

Ce système permet de récupérer et afficher l'avatar Google de l'utilisateur connecté via Supabase. Il inclut un fallback vers l'initiale de l'utilisateur si l'avatar n'est pas disponible.

## Composants disponibles

### 1. Hook `useUserAvatar`

Le hook `useUserAvatar` centralise la logique de récupération des informations utilisateur.

```typescript
import { useUserAvatar } from '@/hooks/useUserAvatar';

function MonComposant() {
  const userInfo = useUserAvatar();
  
  if (!userInfo) return null;
  
  const { avatarUrl, displayName, email, initial } = userInfo;
  // ...
}
```

**Propriétés retournées :**
- `avatarUrl`: URL de l'avatar Google (ou null si non disponible)
- `displayName`: Nom complet de l'utilisateur
- `email`: Email de l'utilisateur
- `initial`: Première lettre du nom pour le fallback

### 2. Composant `UserAvatar`

Composant réutilisable pour afficher l'avatar utilisateur avec fallback automatique.

```typescript
import { UserAvatar } from '@/components/ui/user-avatar';

function MonComposant() {
  return (
    <UserAvatar 
      avatarUrl={avatarUrl}
      displayName="John Doe"
      size="md"
      showTooltip={true}
    />
  );
}
```

**Props :**
- `avatarUrl`: URL de l'avatar (optionnel)
- `displayName`: Nom d'affichage (requis)
- `size`: Taille de l'avatar ('sm', 'md', 'lg', 'xl')
- `className`: Classes CSS supplémentaires
- `showTooltip`: Afficher un tooltip au survol

### 3. Composant `UserProfile`

Composant complet avec menu déroulant pour la gestion du profil utilisateur.

```typescript
import UserProfile from '@/components/auth/UserProfile';

function Header() {
  return (
    <header>
      <UserProfile />
    </header>
  );
}
```

## Récupération de l'avatar Google

L'avatar Google est automatiquement récupéré lors de la connexion via OAuth. Le système essaie plusieurs propriétés dans l'ordre :

1. `user.user_metadata.picture` (propriété standard Google)
2. `user.user_metadata.avatar_url` (propriété alternative)
3. `user.user_metadata.avatar` (propriété alternative)

## Gestion des erreurs

- Si l'avatar ne peut pas être chargé, le système affiche automatiquement l'initiale
- Les erreurs de chargement sont loggées dans la console pour le débogage
- Le composant `UserAvatar` gère automatiquement les erreurs d'image

## Débogage

Pour déboguer les problèmes d'avatar, vérifiez la console du navigateur. Les informations utilisateur sont automatiquement loggées :

```javascript
console.log('User info:', userInfo);
```

## Exemple d'utilisation complète

```typescript
import { useUserAvatar } from '@/hooks/useUserAvatar';
import { UserAvatar } from '@/components/ui/user-avatar';

function UserCard() {
  const userInfo = useUserAvatar();
  
  if (!userInfo) return <div>Non connecté</div>;
  
  return (
    <div className="flex items-center gap-3 p-4 border rounded-lg">
      <UserAvatar 
        avatarUrl={userInfo.avatarUrl}
        displayName={userInfo.displayName}
        size="lg"
        showTooltip={true}
      />
      <div>
        <h3 className="font-semibold">{userInfo.displayName}</h3>
        <p className="text-sm text-gray-500">{userInfo.email}</p>
      </div>
    </div>
  );
}
```

