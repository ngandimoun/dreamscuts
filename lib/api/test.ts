// Script de test pour vérifier le fonctionnement des APIs
import { mediaService } from './mediaService';

export async function testAPIs() {
  console.log('Testing APIs...');
  
  try {
    // Test des images
    console.log('Testing images...');
    const images = await mediaService.getImages('nature', 1, 5);
    console.log('Images found:', images.length);
    
    // Test des vidéos
    console.log('Testing videos...');
    const videos = await mediaService.getVideos('business', 1, 5);
    console.log('Videos found:', videos.length);
    
    // Test des sons
    console.log('Testing sounds...');
    const sounds = await mediaService.getSounds('ambient', 1, 5);
    console.log('Sounds found:', sounds.length);
    
    console.log('All tests completed successfully!');
  } catch (error) {
    console.error('Test failed:', error);
  }
}

// Uncomment to run tests
// testAPIs();
