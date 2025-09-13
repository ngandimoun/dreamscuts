# 📚 Documentation des APIs - DreamCuts

## Table des matières

1. [Vue d'ensemble](#vue-densemble)
2. [Configuration des APIs](#configuration-des-apis)
3. [Freesound API](#freesound-api)
4. [Pexels API](#pexels-api)
5. [Pixabay API](#pixabay-api)
6. [Unsplash API](#unsplash-api)
7. [Types et Interfaces](#types-et-interfaces)
8. [Gestion des erreurs](#gestion-des-erreurs)
9. [Limites et quotas](#limites-et-quotas)
10. [Exemples d'utilisation](#exemples-dutilisation)

---

## Vue d'ensemble

Le projet DreamCuts utilise quatre APIs principales pour récupérer différents types de médias :

| API | Type de contenu | Statut | Limite |
|-----|----------------|--------|--------|
| **Freesound** | Sons et effets sonores | ✅ Actif | 200 req/jour |
| **Pexels** | Photos et vidéos | ✅ Actif | 200 req/heure |
| **Pixabay** | Photos et vidéos | ✅ Actif | 5000 req/mois |
| **Unsplash** | Photos haute qualité | ⚠️ Temporairement désactivé | 50 req/heure |

---

## 🔐 Sécurité et bonnes pratiques

### Gestion des clés API

**⚠️ RÈGLES DE SÉCURITÉ IMPORTANTES :**

1. **Ne jamais commiter les clés API** dans le code source
2. **Utiliser des variables d'environnement** pour stocker les clés
3. **Ajouter `.env` au `.gitignore`** pour éviter les fuites
4. **Rotation régulière** des clés API
5. **Surveillance** des quotas et des accès

### Fichier .env (à créer)

```bash
# Créer un fichier .env.local à la racine du projet
FREESOUND_CLIENT_ID=your_actual_client_id
FREESOUND_API_KEY=your_actual_api_key
PEXELS_API_KEY=your_actual_pexels_key
PIXABAY_API_KEY=your_actual_pixabay_key
UNSPLASH_API_KEY=your_actual_unsplash_key
UNSPLASH_SECRET_KEY=your_actual_unsplash_secret
```

### Fichier .gitignore

```gitignore
# Variables d'environnement
.env
.env.local
.env.development.local
.env.test.local
.env.production.local

# Clés API
**/api-keys.json
**/secrets.json
```

### Configuration Next.js

Pour utiliser les variables d'environnement dans Next.js, ajoutez-les au fichier `next.config.mjs` :

```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    FREESOUND_CLIENT_ID: process.env.FREESOUND_CLIENT_ID,
    FREESOUND_API_KEY: process.env.FREESOUND_API_KEY,
    PEXELS_API_KEY: process.env.PEXELS_API_KEY,
    PIXABAY_API_KEY: process.env.PIXABAY_API_KEY,
    UNSPLASH_API_KEY: process.env.UNSPLASH_API_KEY,
    UNSPLASH_SECRET_KEY: process.env.UNSPLASH_SECRET_KEY,
  },
};

export default nextConfig;
```

### Utilisation dans le code

```typescript
// ✅ Correct - Utiliser les variables d'environnement
const apiKey = process.env.PEXELS_API_KEY;

// ❌ Incorrect - Ne jamais hardcoder les clés
const apiKey = 'DeI1tUe77tinbWsJ9MDAIoGUe9pCJZK592LkghzjENl1pXf9wJm7QBZP';
```

---

## Configuration des APIs

### Variables d'environnement

```bash
# Freesound API
FREESOUND_CLIENT_ID=your_freesound_client_id
FREESOUND_API_KEY=your_freesound_api_key

# Pexels API
PEXELS_API_KEY=your_pexels_api_key

# Pixabay API
PIXABAY_API_KEY=your_pixabay_api_key

# Unsplash API (temporairement désactivé)
UNSPLASH_API_KEY=your_unsplash_access_key
UNSPLASH_SECRET_KEY=your_unsplash_secret_key
```

> ⚠️ **Important** : Remplacez les valeurs d'exemple par vos vraies clés API. Ne commitez jamais vos clés API dans le code source.

### Structure des fichiers

```
lib/api/
├── freesound.ts      # API Freesound pour les sons
├── pexels.ts         # API Pexels pour photos/vidéos
├── pixabay.ts        # API Pixabay pour photos/vidéos
├── unsplash.ts       # API Unsplash pour photos
├── mediaService.ts   # Service unifié
├── types.ts          # Types TypeScript
└── config.ts         # Configuration centralisée
```

---

## Freesound API

### 🔧 Configuration

- **Base URL**: `https://freesound.org/apiv2`
- **Authentification**: Token dans l'URL et header Authorization
- **Limite**: 200 requêtes par jour

### 📋 Méthodes disponibles

#### `searchSounds(query, page, pageSize)`
Recherche des sons par mots-clés.

**Paramètres:**
- `query` (string): Termes de recherche
- `page` (number): Numéro de page (défaut: 1)
- `pageSize` (number): Nombre de résultats par page (défaut: 20)

**Exemple:**
```typescript
const sounds = await freesoundAPI.searchSounds('guitar', 1, 10);
```

#### `getPopularSounds(page, pageSize)`
Récupère les sons les plus téléchargés.

**Paramètres:**
- `page` (number): Numéro de page (défaut: 1)
- `pageSize` (number): Nombre de résultats par page (défaut: 20)

**Exemple:**
```typescript
const popularSounds = await freesoundAPI.getPopularSounds(1, 20);
```

#### `getSoundById(id)`
Récupère un son spécifique par son ID.

**Paramètres:**
- `id` (number): ID du son

**Exemple:**
```typescript
const sound = await freesoundAPI.getSoundById(12345);
```

### 🎵 Filtres appliqués

- **Durée maximale**: 30 secondes
- **Tri par défaut**: Score de pertinence
- **Champs récupérés**: Tous les champs disponibles

### 📊 Structure de réponse

```typescript
interface FreesoundSound {
  id: number;
  name: string;
  description: string;
  duration: number;
  username: string;
  num_downloads: number;
  avg_rating: number;
  previews: {
    'preview-hq-mp3': string;
    'preview-lq-mp3': string;
  };
  images: {
    waveform_m: string;
    spectral_m: string;
  };
  // ... autres champs
}
```

---

## Pexels API

### 🔧 Configuration

- **Base URL**: `https://api.pexels.com/v1`
- **Authentification**: Clé API dans le header Authorization
- **Limite**: 200 requêtes par heure

### 📋 Méthodes disponibles

#### `searchPhotos(query, page, perPage)`
Recherche de photos par mots-clés.

**Paramètres:**
- `query` (string): Termes de recherche
- `page` (number): Numéro de page (défaut: 1)
- `perPage` (number): Nombre de résultats par page (défaut: 20)

#### `searchVideos(query, page, perPage)`
Recherche de vidéos par mots-clés.

**Paramètres:**
- `query` (string): Termes de recherche
- `page` (number): Numéro de page (défaut: 1)
- `perPage` (number): Nombre de résultats par page (défaut: 20)

#### `getCuratedPhotos(page, perPage)`
Récupère les photos sélectionnées par Pexels.

#### `getPopularVideos(page, perPage)`
Récupère les vidéos populaires.

### 📊 Structure de réponse

```typescript
interface PexelsPhoto {
  id: number;
  width: number;
  height: number;
  url: string;
  photographer: string;
  src: {
    original: string;
    large: string;
    medium: string;
    small: string;
  };
  alt: string;
}
```

---

## Pixabay API

### 🔧 Configuration

- **Base URL**: `https://pixabay.com/api`
- **Authentification**: Clé API dans l'URL
- **Limite**: 5000 requêtes par mois

### 📋 Méthodes disponibles

#### `searchImages(query, page, perPage)`
Recherche d'images par mots-clés.

**Paramètres:**
- `query` (string): Termes de recherche
- `page` (number): Numéro de page (défaut: 1)
- `perPage` (number): Nombre de résultats par page (défaut: 20)

#### `searchVideos(query, page, perPage)`
Recherche de vidéos par mots-clés.

#### `getPopularImages(page, perPage)`
Récupère les images populaires.

#### `getPopularVideos(page, perPage)`
Récupère les vidéos populaires.

### 🔍 Filtres appliqués

- **Type d'image**: Photo uniquement
- **Orientation**: Toutes
- **Catégorie**: Toutes
- **SafeSearch**: Activé
- **Tri**: Par popularité

### 📊 Structure de réponse

```typescript
interface PixabayImage {
  id: number;
  pageURL: string;
  tags: string;
  previewURL: string;
  webformatURL: string;
  largeImageURL: string;
  imageWidth: number;
  imageHeight: number;
  views: number;
  downloads: number;
  likes: number;
  user: string;
}
```

---

## Unsplash API

### ⚠️ Statut actuel

L'API Unsplash est **temporairement désactivée** dans le projet en raison de problèmes de configuration des clés API.

### 🔧 Configuration

- **Base URL**: `https://api.unsplash.com`
- **Authentification**: Clé d'accès dans l'URL
- **Limite**: 50 requêtes par heure

### 📋 Méthodes disponibles

#### `searchPhotos(query, page, perPage)`
Recherche de photos par mots-clés.

#### `getCuratedPhotos(page, perPage)`
Récupère les photos sélectionnées par Unsplash.

#### `getRandomPhotos(count, query)`
Récupère des photos aléatoires.

#### `testConnection()`
Teste la connectivité à l'API.

### 📊 Structure de réponse

```typescript
interface UnsplashPhoto {
  id: string;
  width: number;
  height: number;
  color: string;
  description: string;
  urls: {
    raw: string;
    full: string;
    regular: string;
    small: string;
    thumb: string;
  };
  user: {
    name: string;
    username: string;
    profile_image: {
      small: string;
      medium: string;
      large: string;
    };
  };
}
```

---

## Types et Interfaces

### Interface MediaItem unifiée

```typescript
interface MediaItem {
  id: string;
  name: string;
  type: 'image' | 'video' | 'document' | 'audio';
  url: string;
  thumbnail?: string;
  uploadedAt: Date;
  isGenerated?: boolean;
  source?: 'pexels' | 'pixabay' | 'unsplash' | 'freesound';
  originalData?: any;
  width?: number;
  height?: number;
  description?: string;
  // Propriétés spécifiques aux sons
  duration?: number;
  artist?: string;
  downloads?: number;
  rating?: number;
  comments?: number;
  hasLocation?: boolean;
}
```

### Service unifié MediaService

Le `MediaService` centralise l'accès à toutes les APIs et normalise les réponses :

```typescript
class MediaService {
  // Images
  async getImages(query: string): Promise<MediaItem[]>
  async getPopularImages(): Promise<MediaItem[]>
  
  // Vidéos
  async getVideos(query: string): Promise<MediaItem[]>
  async getPopularVideos(): Promise<MediaItem[]>
  
  // Sons
  async getSounds(query: string): Promise<MediaItem[]>
  async getPopularSounds(): Promise<MediaItem[]>
}
```

---

## Gestion des erreurs

### Stratégie de fallback

Le système implémente une stratégie de fallback en cas d'échec d'une API :

1. **Pexels** → **Pixabay** (pour les images)
2. **Unsplash** → Désactivé temporairement
3. **Freesound** → Aucun fallback (unique pour les sons)

### Gestion des erreurs par API

```typescript
try {
  const results = await mediaService.getImages(query);
  return results;
} catch (error) {
  console.error('API Error:', error);
  // Fallback vers une autre API ou retour d'un tableau vide
  return [];
}
```

### Types d'erreurs courantes

- **401 Unauthorized**: Clé API invalide
- **429 Too Many Requests**: Limite de quota atteinte
- **500 Internal Server Error**: Erreur serveur
- **Network Error**: Problème de connectivité

---

## Limites et quotas

### Résumé des limites

| API | Limite | Période | Impact |
|-----|--------|---------|--------|
| Freesound | 200 req | Jour | ⚠️ Limite basse |
| Pexels | 200 req | Heure | ✅ Suffisant |
| Pixabay | 5000 req | Mois | ✅ Très généreux |
| Unsplash | 50 req | Heure | ⚠️ Limite basse |

### Recommandations

1. **Cache des résultats** pour réduire les appels API
2. **Pagination intelligente** pour éviter les requêtes inutiles
3. **Monitoring des quotas** pour éviter les blocages
4. **Fallback automatique** entre APIs similaires

---

## Exemples d'utilisation

### Recherche d'images

```typescript
import { mediaService } from '@/lib/api/mediaService';

// Recherche d'images
const images = await mediaService.getImages('nature landscape');

// Images populaires
const popularImages = await mediaService.getPopularImages();
```

### Recherche de sons

```typescript
// Recherche de sons
const sounds = await mediaService.getSounds('guitar music');

// Sons populaires
const popularSounds = await mediaService.getPopularSounds();
```

### Gestion des erreurs

```typescript
try {
  const results = await mediaService.getImages('query');
  console.log(`Trouvé ${results.length} résultats`);
} catch (error) {
  console.error('Erreur lors de la recherche:', error);
  // Afficher un message d'erreur à l'utilisateur
}
```

### Utilisation dans un composant React

```typescript
import { useState, useEffect } from 'react';
import { mediaService } from '@/lib/api/mediaService';

function MediaGallery() {
  const [media, setMedia] = useState([]);
  const [loading, setLoading] = useState(false);

  const searchMedia = async (query: string) => {
    setLoading(true);
    try {
      const results = await mediaService.getImages(query);
      setMedia(results);
    } catch (error) {
      console.error('Erreur de recherche:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {/* Interface utilisateur */}
    </div>
  );
}
```

---

## 🔧 Maintenance et mise à jour

### Vérification des quotas

```typescript
// Vérifier les quotas restants
const checkQuotas = async () => {
  // Implémenter la vérification des quotas pour chaque API
};
```

### Rotation des clés API

1. **Surveillance** des erreurs 401/403
2. **Rotation automatique** des clés si disponible
3. **Notification** en cas de problème

### Monitoring

- **Logs des requêtes** pour chaque API
- **Métriques de performance** (temps de réponse)
- **Alertes** en cas de dépassement de quota

---

## 📞 Support et ressources

### Documentation officielle

- [Freesound API](https://freesound.org/docs/api/)
- [Pexels API](https://www.pexels.com/api/)
- [Pixabay API](https://pixabay.com/api/docs/)
- [Unsplash API](https://unsplash.com/developers)

### Contact

Pour toute question concernant l'intégration des APIs, consultez la documentation officielle ou contactez l'équipe de développement.

---

*Dernière mise à jour: Décembre 2024*
