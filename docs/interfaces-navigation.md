# Interfaces de Navigation

## Vue d'ensemble

Nous avons créé un système de navigation complet avec trois interfaces distinctes :
- **Canva AI** : Interface principale avec la zone de saisie unifiée
- **Your Designs** : Galerie des réalisations de l'utilisateur
- **Templates** : Bibliothèque de templates pour l'inspiration créative

## Architecture

### 1. Navigation Partagée

**Fichier :** `components/SharedHeader.tsx`

Le composant `SharedHeader` fournit une navigation cohérente entre toutes les interfaces :
- Boutons de navigation avec états actifs
- Profil utilisateur
- Design responsive

### 2. Interface Your Designs

**Fichier :** `components/YourDesigns.tsx`

**Fonctionnalités :**
- Affichage en grille ou liste
- Filtrage par catégorie
- Recherche textuelle
- Statistiques (vues, likes, date)
- Actions (partage, export)

**Design :**
- Cartes modernes avec hover effects
- Badges de catégorie
- Tags colorés
- Scroll personnalisé

### 3. Interface Templates

**Fichier :** `components/Templates.tsx`

**Fonctionnalités :**
- Filtrage par catégorie et difficulté
- Filtre Premium
- Système de notation
- Badges Trending et Premium
- Statistiques détaillées

**Design :**
- Badges Premium avec gradient
- Indicateurs de difficulté colorés
- Système de notation avec étoiles
- Actions de téléchargement

## Navigation

### État de Navigation

```tsx
const [activeTab, setActiveTab] = useState<"ai" | "designs" | "templates">("ai");
```

### Rendu Conditionnel

```tsx
{activeTab === "designs" && <YourDesigns activeTab={activeTab} setActiveTab={setActiveTab} user={user} />}
{activeTab === "templates" && <Templates activeTab={activeTab} setActiveTab={setActiveTab} user={user} />}
{activeTab === "ai" && <AIInterface />}
```

## Design System

### Couleurs
- **Primaire :** Purple gradient (#abf4fd → purple-300)
- **Secondaire :** Gray tones pour le contenu
- **Accent :** Purple-600 pour les actions

### Composants UI
- **Badges :** Catégories, difficulté, statuts
- **Cards :** Design moderne avec ombres
- **Buttons :** Actions principales et secondaires
- **Inputs :** Recherche avec icônes

### Responsive Design
- **Mobile :** Navigation empilée
- **Tablet :** Grille 2 colonnes
- **Desktop :** Grille 3 colonnes

## Scroll Personnalisé

Chaque interface utilise le scroll personnalisé défini dans `globals.css` :

```css
.custom-scrollbar {
  scrollbar-width: thin;
  scrollbar-color: rgba(156, 163, 175, 0.5) transparent;
}
```

## Données Mock

### Your Designs
- 6 designs de démonstration
- Catégories : Logo, Website, Mobile, Branding, Social Media, Print
- Statistiques réalistes

### Templates
- 8 templates de démonstration
- Difficultés : Beginner, Intermediate, Advanced
- Badges Premium et Trending
- Système de notation 4.5-4.9

## Interactions

### Hover Effects
- Scale sur les images
- Opacité sur les actions
- Ombres dynamiques

### Transitions
- Durée : 300ms
- Easing : ease-in-out
- Propriétés : transform, opacity, box-shadow

## Accessibilité

### Navigation
- États actifs visuels
- Focus indicators
- Contraste suffisant

### Contenu
- Alt text sur les images
- Labels descriptifs
- Structure sémantique

## Performance

### Optimisations
- Lazy loading des images
- Composants conditionnels
- Scroll virtuel pour les grandes listes

### Bundle Size
- Composants modulaires
- Imports optimisés
- Tree shaking

## Extensibilité

### Ajout de Nouvelles Interfaces
1. Créer le composant
2. Ajouter au type `activeTab`
3. Intégrer dans la navigation
4. Passer les props nécessaires

### Personnalisation
- Props configurables
- Thèmes CSS variables
- Composants réutilisables

## Utilisation

### Navigation Basique
```tsx
// Cliquer sur un onglet
<button onClick={() => setActiveTab("designs")}>
  Your Designs
</button>
```

### Interface Complète
```tsx
<YourDesigns 
  activeTab={activeTab} 
  setActiveTab={setActiveTab} 
  user={user} 
/>
```

## Maintenance

### Ajout de Données
- Modifier les arrays `mockDesigns` et `mockTemplates`
- Ajouter de nouvelles catégories
- Étendre les interfaces TypeScript

### Modifications UI
- Utiliser les composants UI existants
- Respecter le design system
- Tester la responsivité

Cette architecture permet une navigation fluide et une expérience utilisateur cohérente entre toutes les interfaces de l'application.
