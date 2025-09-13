// Configuration des APIs de médias
export const API_CONFIG = {
  // APIs activées/désactivées
  PEXELS_ENABLED: true,
  PIXABAY_ENABLED: true,
  UNSPLASH_ENABLED: false, // Désactivé temporairement à cause des erreurs
  FREESOUND_ENABLED: true,
  
  // Limites de requêtes
  MAX_IMAGES_PER_API: 10,
  MAX_VIDEOS_PER_API: 10,
  MAX_SOUNDS_PER_API: 20,
  
  // Timeouts
  REQUEST_TIMEOUT: 10000, // 10 secondes
  
  // Retry
  MAX_RETRIES: 2,
  RETRY_DELAY: 1000, // 1 seconde
};

// Fonction pour vérifier si une API est activée
export function isAPIEnabled(apiName: keyof typeof API_CONFIG): boolean {
  return API_CONFIG[apiName] as boolean;
}

// Fonction pour obtenir la répartition des requêtes
export function getRequestDistribution(total: number, enabledAPIs: number[]): number[] {
  if (enabledAPIs.length === 0) return [];
  
  const basePerAPI = Math.floor(total / enabledAPIs.length);
  const remainder = total % enabledAPIs.length;
  
  return enabledAPIs.map((_, index) => 
    basePerAPI + (index < remainder ? 1 : 0)
  );
}
