# Migration vers UnifiedInput

## Vue d'ensemble

Nous avons fusionné les deux zones de saisie distinctes (`app/page.tsx` et `ChatInput.tsx`) en un seul composant unifié `UnifiedInput` qui gère à la fois l'authentification et l'envoi de messages.

## Changements effectués

### 1. Nouveau composant UnifiedInput

**Fichier :** `components/UnifiedInput.tsx`

**Fonctionnalités :**
- Gestion unifiée de l'authentification et de l'envoi
- Support des médias (images, vidéos, audio, documents)
- Gestion des fichiers attachés (optionnel)
- Prévisualisation des médias avec tailles configurables
- Sélecteurs d'aspect ratio et de modèle
- Logique d'authentification intégrée

**Props principales :**
- `value` / `onChange` : Contrôle du texte
- `onSend` : Callback pour le mode chat
- `onAuthenticatedSend` : Callback pour le mode authentification
- `showLoginModal` : Callback pour afficher la modale de connexion
- `showFileAttachment` : Active la gestion des fichiers
- `mediaPreviewSize` : Taille des previews ("small" | "large")

### 2. Modification de app/page.tsx

**Changements :**
- Suppression de la logique de saisie dupliquée
- Utilisation du composant `UnifiedInput` avec le mode authentification
- Simplification des états et fonctions
- Conservation de la logique d'authentification existante

**Avant :**
```tsx
// Logique complexe avec états multiples
const [selectedMedia, setSelectedMedia] = useState<MediaItem[]>([]);
const [showMediaModal, setShowMediaModal] = useState(false);
// ... plus de 100 lignes de code pour la zone de saisie
```

**Après :**
```tsx
// Utilisation simple du composant unifié
<UnifiedInput
  value={prompt}
  onChange={setPrompt}
  onAuthenticatedSend={handleAuthenticatedSend}
  showLoginModal={() => setShowLoginModal(true)}
  mediaPreviewSize="small"
/>
```

### 3. Modification de ChatInput.tsx

**Changements :**
- Remplacement complet par le composant `UnifiedInput`
- Activation du mode fichier attaché
- Utilisation des grandes previews de médias

**Avant :**
```tsx
// Composant complexe avec 200+ lignes
export default function ChatInput({ value, onChange, onSend, onKeyPress, disabled }) {
  // Logique complexe pour les médias, fichiers, etc.
}
```

**Après :**
```tsx
// Composant simple qui délègue à UnifiedInput
export default function ChatInput({ value, onChange, onSend, onKeyPress, disabled }) {
  return (
    <UnifiedInput
      value={value}
      onChange={onChange}
      onSend={onSend}
      onKeyPress={onKeyPress}
      disabled={disabled}
      showFileAttachment={true}
      mediaPreviewSize="large"
    />
  );
}
```

## Avantages de cette approche

### 1. DRY (Don't Repeat Yourself)
- Élimination de la duplication de code
- Maintenance centralisée
- Cohérence entre les interfaces

### 2. Flexibilité
- Un seul composant pour deux cas d'usage
- Configuration via props
- Extensibilité facile

### 3. Maintenabilité
- Code plus lisible
- Tests simplifiés
- Bugs centralisés

### 4. Performance
- Moins de code à charger
- Réutilisation des composants
- Optimisations centralisées

## Utilisation

### Mode Authentification (app/page.tsx)
```tsx
<UnifiedInput
  value={prompt}
  onChange={setPrompt}
  onAuthenticatedSend={handleAuthenticatedSend}
  showLoginModal={() => setShowLoginModal(true)}
  mediaPreviewSize="small"
/>
```

### Mode Chat (ChatInput.tsx)
```tsx
<UnifiedInput
  value={value}
  onChange={onChange}
  onSend={onSend}
  onKeyPress={onKeyPress}
  disabled={disabled}
  showFileAttachment={true}
  mediaPreviewSize="large"
/>
```

## Migration complète

La migration est terminée et le code compile sans erreurs. Les deux interfaces utilisent maintenant le même composant de base, garantissant une expérience utilisateur cohérente tout en réduisant la complexité du code.
