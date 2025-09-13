# API Media Services

Ce module fournit des services pour intégrer les APIs de médias (Pexels, Pixabay, Unsplash, Freesound) dans l'application.

## Services disponibles

### MediaService
Service principal qui unifie l'accès à toutes les APIs de médias.

```typescript
import { mediaService } from '@/lib/api/mediaService';

// Récupérer des images
const images = await mediaService.getImages('nature', 1, 20);

// Récupérer des vidéos
const videos = await mediaService.getVideos('business', 1, 20);

// Récupérer des sons
const sounds = await mediaService.getSounds('ambient', 1, 20);

// Récupérer du contenu populaire
const popularImages = await mediaService.getPopularImages(1, 20);
const popularVideos = await mediaService.getPopularVideos(1, 20);
const popularSounds = await mediaService.getPopularSounds(1, 20);
```

### APIs individuelles

#### Pexels API
```typescript
import { pexelsAPI } from '@/lib/api/pexels';

const photos = await pexelsAPI.searchPhotos('nature', 1, 20);
const videos = await pexelsAPI.searchVideos('business', 1, 20);
```

#### Pixabay API
```typescript
import { pixabayAPI } from '@/lib/api/pixabay';

const images = await pixabayAPI.searchImages('landscape', 1, 20);
const videos = await pixabayAPI.searchVideos('city', 1, 20);
```

#### Unsplash API
```typescript
import { unsplashAPI } from '@/lib/api/unsplash';

const photos = await unsplashAPI.searchPhotos('abstract', 1, 20);
const curated = await unsplashAPI.getCuratedPhotos(1, 20);
```

#### Freesound API
```typescript
import { freesoundAPI } from '@/lib/api/freesound';

const sounds = await freesoundAPI.searchSounds('music', 1, 20);
const popular = await freesoundAPI.getPopularSounds(1, 20);
```

## Catégories

Le module fournit des catégories prédéfinies pour organiser le contenu :

```typescript
import { imageCategories, videoCategories, soundCategories } from '@/lib/api/categories';

// Catégories d'images
console.log(imageCategories); // Nature, Business, Technology, etc.

// Catégories de vidéos
console.log(videoCategories); // Nature, Business, Technology, etc.

// Catégories de sons
console.log(soundCategories); // Ambient, Music, Nature, etc.
```

## Types

```typescript
import { MediaItem, PexelsPhoto, PixabayImage, UnsplashPhoto, FreesoundSound } from '@/lib/api/types';

// MediaItem est le type unifié pour tous les médias
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
}
```

## Configuration

Les clés API sont configurées dans chaque service :

- **Pexels**: `PEXELS_API_KEY`
- **Pixabay**: `PIXABAY_API_KEY`
- **Unsplash**: `UNSPLASH_ACCESS_KEY`
- **Freesound**: `FREESOUND_API_KEY`

## Utilisation dans MediaModal

Le composant `MediaModal` utilise ces services pour afficher :

1. **Sous-menus** : Images, Vidéos, Sons
2. **Catégories** : Filtres par catégorie
3. **Recherche** : Recherche textuelle
4. **Prévisualisation** : Aperçu au survol pour les images, modal pour vidéos/sons

## Fonctionnalités

- ✅ Intégration de 4 APIs de médias
- ✅ Recherche par catégories
- ✅ Recherche textuelle
- ✅ Prévisualisation des images au survol
- ✅ Modal de prévisualisation pour vidéos et sons
- ✅ Gestion des erreurs
- ✅ Types TypeScript complets
- ✅ Interface responsive
