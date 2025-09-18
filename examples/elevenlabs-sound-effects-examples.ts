/**
 * ElevenLabs Sound Effects Examples
 * 
 * This file demonstrates how to generate high-quality sound effects from text descriptions
 * Based on the official ElevenLabs Sound Effects documentation
 */

import { elevenLabs, soundEffectsManager, AudioUtils } from '@/lib/elevenlabs';
import type { SoundEffectCategory } from '@/lib/elevenlabs';

// Example 1: Basic sound effects generation
export async function basicSoundEffectsExample() {
  try {
    console.log("=== Basic Sound Effects Example ===");

    const basicEffects = [
      "Glass shattering on concrete",
      "Heavy wooden door creaking open",
      "Thunder rumbling in the distance",
      "Footsteps on gravel",
      "Metal door slamming shut"
    ];

    const results = [];

    for (const effect of basicEffects) {
      console.log(`\nGenerating: "${effect}"`);
      
      const result = await elevenLabs.generateSoundEffect(effect, {
        duration_seconds: 3.0,
        prompt_influence: 0.3
      });

      results.push({
        text: effect,
        result
      });

      console.log(`Generated ${result.audio.byteLength} bytes of audio`);
      await elevenLabs.playAudio(result.audio);
      await new Promise(resolve => setTimeout(resolve, 1000)); // Pause between effects
    }

    return results;
  } catch (error) {
    console.error("Basic sound effects example failed:", error);
    throw error;
  }
}

// Example 2: Complex sequences
export async function complexSequencesExample() {
  try {
    console.log("=== Complex Sequences Example ===");

    const complexSequences = [
      "Footsteps on gravel, then a metallic door opens",
      "Wind whistling through trees, followed by leaves rustling",
      "Sword being drawn, then clashing with another blade",
      "Car engine starting, then driving away",
      "Phone ringing, then being answered"
    ];

    const results = [];

    for (const sequence of complexSequences) {
      console.log(`\nGenerating sequence: "${sequence}"`);
      
      const result = await elevenLabs.generateSoundEffect(sequence, {
        duration_seconds: 5.0,
        prompt_influence: 0.4
      });

      results.push({
        text: sequence,
        result
      });

      await elevenLabs.playAudio(result.audio);
      await new Promise(resolve => setTimeout(resolve, 1500));
    }

    return results;
  } catch (error) {
    console.error("Complex sequences example failed:", error);
    throw error;
  }
}

// Example 3: Musical elements
export async function musicalElementsExample() {
  try {
    console.log("=== Musical Elements Example ===");

    const musicalElements = [
      "90s hip-hop drum loop, 90 BPM",
      "Vintage brass stabs in F minor",
      "Atmospheric synth pad with subtle modulation",
      "Jazz piano chord progression",
      "Electronic beat with reverb"
    ];

    const results = [];

    for (const element of musicalElements) {
      console.log(`\nGenerating musical element: "${element}"`);
      
      const result = await elevenLabs.generateSoundEffect(element, {
        duration_seconds: 4.0,
        prompt_influence: 0.5,
        loop: true
      });

      results.push({
        text: element,
        result
      });

      await elevenLabs.playAudio(result.audio);
      await new Promise(resolve => setTimeout(resolve, 2000));
    }

    return results;
  } catch (error) {
    console.error("Musical elements example failed:", error);
    throw error;
  }
}

// Example 4: Cinematic effects
export async function cinematicEffectsExample() {
  try {
    console.log("=== Cinematic Effects Example ===");

    const cinematicEffects = [
      "Cinematic braam, horror",
      "Epic trailer whoosh",
      "Dramatic crescendo",
      "Movie impact hit",
      "Cinematic transition"
    ];

    const results = [];

    for (const effect of cinematicEffects) {
      console.log(`\nGenerating cinematic effect: "${effect}"`);
      
      const result = await elevenLabs.generateSoundEffect(effect, {
        duration_seconds: 3.0,
        prompt_influence: 0.6 // Higher influence for cinematic effects
      });

      results.push({
        text: effect,
        result
      });

      await elevenLabs.playAudio(result.audio);
      await new Promise(resolve => setTimeout(resolve, 2000));
    }

    return results;
  } catch (error) {
    console.error("Cinematic effects example failed:", error);
    throw error;
  }
}

// Example 5: Ambient and atmospheric sounds
export async function ambientAtmosphericExample() {
  try {
    console.log("=== Ambient and Atmospheric Example ===");

    const ambientSounds = [
      "Soft rain on leaves",
      "Forest ambience with birds",
      "Ocean waves on shore",
      "Wind through trees",
      "Haunted house atmosphere"
    ];

    const results = [];

    for (const sound of ambientSounds) {
      console.log(`\nGenerating ambient sound: "${sound}"`);
      
      const result = await elevenLabs.generateSoundEffect(sound, {
        duration_seconds: 10.0,
        loop: true,
        prompt_influence: 0.2 // Lower influence for more creative ambience
      });

      results.push({
        text: sound,
        result
      });

      await elevenLabs.playAudio(result.audio);
      await new Promise(resolve => setTimeout(resolve, 3000));
    }

    return results;
  } catch (error) {
    console.error("Ambient atmospheric example failed:", error);
    throw error;
  }
}

// Example 6: Sound effects by category
export async function soundEffectsByCategoryExample() {
  try {
    console.log("=== Sound Effects by Category Example ===");

    const categories = soundEffectsManager.getSoundEffectCategories();
    const results = [];

    for (const category of categories.slice(0, 5)) { // Test first 5 categories
      console.log(`\n--- Testing ${category} category ---`);
      
      const guide = soundEffectsManager.getPromptingGuide(category);
      console.log(`Description: ${guide.description}`);
      console.log(`Examples: ${guide.examples.slice(0, 2).join(', ')}`);

      // Get recommended options for this category
      const recommendedOptions = soundEffectsManager.getRecommendedOptions(category, guide.examples[0]);
      console.log(`Recommended options:`, recommendedOptions);

      // Generate an example from this category
      const example = guide.examples[0];
      console.log(`Generating: "${example}"`);

      const result = await elevenLabs.generateSoundEffect(example, recommendedOptions);

      results.push({
        category,
        guide,
        example,
        recommendedOptions,
        result
      });

      await elevenLabs.playAudio(result.audio);
      await new Promise(resolve => setTimeout(resolve, 2000));
    }

    return results;
  } catch (error) {
    console.error("Sound effects by category example failed:", error);
    throw error;
  }
}

// Example 7: Looping sound effects
export async function loopingSoundEffectsExample() {
  try {
    console.log("=== Looping Sound Effects Example ===");

    const loopingEffects = [
      "Soft rain loop",
      "Heartbeat rhythm",
      "Clock ticking",
      "Engine idling",
      "Breathing pattern"
    ];

    const results = [];

    for (const effect of loopingEffects) {
      console.log(`\nGenerating looping effect: "${effect}"`);
      
      const result = await elevenLabs.generateSoundEffect(effect, {
        duration_seconds: 8.0,
        loop: true,
        prompt_influence: 0.3
      });

      results.push({
        text: effect,
        result
      });

      console.log(`Generated looping sound effect (${result.audio.byteLength} bytes)`);
      await elevenLabs.playAudio(result.audio);
      await new Promise(resolve => setTimeout(resolve, 3000));
    }

    return results;
  } catch (error) {
    console.error("Looping sound effects example failed:", error);
    throw error;
  }
}

// Example 8: Prompt influence demonstration
export async function promptInfluenceExample() {
  try {
    console.log("=== Prompt Influence Example ===");

    const testText = "Cinematic impact hit";
    const influenceLevels = [0.1, 0.3, 0.5, 0.7, 0.9];
    const results = [];

    for (const influence of influenceLevels) {
      console.log(`\nTesting prompt influence: ${influence}`);
      console.log(`Text: "${testText}"`);
      
      const result = await elevenLabs.generateSoundEffect(testText, {
        duration_seconds: 2.0,
        prompt_influence: influence
      });

      results.push({
        text: testText,
        prompt_influence: influence,
        result
      });

      await elevenLabs.playAudio(result.audio);
      await new Promise(resolve => setTimeout(resolve, 1500));
    }

    return results;
  } catch (error) {
    console.error("Prompt influence example failed:", error);
    throw error;
  }
}

// Example 9: Duration variations
export async function durationVariationsExample() {
  try {
    console.log("=== Duration Variations Example ===");

    const testText = "Thunder rumbling in the distance";
    const durations = [1.0, 3.0, 5.0, 8.0, 12.0];
    const results = [];

    for (const duration of durations) {
      console.log(`\nTesting duration: ${duration} seconds`);
      console.log(`Text: "${testText}"`);
      
      const result = await elevenLabs.generateSoundEffect(testText, {
        duration_seconds: duration,
        prompt_influence: 0.3
      });

      results.push({
        text: testText,
        duration_seconds: duration,
        result
      });

      await elevenLabs.playAudio(result.audio);
      await new Promise(resolve => setTimeout(resolve, 1000));
    }

    return results;
  } catch (error) {
    console.error("Duration variations example failed:", error);
    throw error;
  }
}

// Example 10: Sound effects manager features
export async function soundEffectsManagerExample() {
  try {
    console.log("=== Sound Effects Manager Features Example ===");

    // Get all models
    const models = soundEffectsManager.getSoundEffectModels();
    console.log(`Available models: ${models.length}`);
    models.forEach(model => {
      console.log(`- ${model.name}: ${model.description}`);
    });

    // Get all categories
    const categories = soundEffectsManager.getSoundEffectCategories();
    console.log(`\nAvailable categories: ${categories.length}`);
    console.log(`Categories: ${categories.join(', ')}`);

    // Search for examples
    const searchResults = soundEffectsManager.searchSoundEffectExamples('cinematic');
    console.log(`\nSearch results for "cinematic": ${searchResults.length}`);
    searchResults.forEach(result => {
      console.log(`- ${result.category}: ${result.example}`);
    });

    // Get random example
    const randomExample = soundEffectsManager.getRandomExample();
    console.log(`\nRandom example: ${randomExample.category} - ${randomExample.example}`);

    // Get popular combinations
    const popularCombinations = soundEffectsManager.getPopularCombinations();
    console.log(`\nPopular combinations: ${popularCombinations.length}`);
    popularCombinations.forEach(combo => {
      console.log(`- ${combo.name}: ${combo.description}`);
      console.log(`  Examples: ${combo.examples.slice(0, 2).join(', ')}`);
    });

    // Validate text
    const validationTests = [
      "Glass shattering", // Good
      "Sound", // Too short
      "This is a very long description that might not work as well because it's too verbose and contains too many words that could confuse the model", // Too long
      "" // Empty
    ];

    console.log(`\nText validation tests:`);
    for (const text of validationTests) {
      const validation = soundEffectsManager.validateSoundEffectText(text);
      console.log(`"${text}": Valid: ${validation.isValid}, Suggestions: ${validation.suggestions.join(', ')}`);
    }

    return {
      models,
      categories,
      searchResults,
      randomExample,
      popularCombinations,
      validationTests: validationTests.map(text => ({
        text,
        validation: soundEffectsManager.validateSoundEffectText(text)
      }))
    };
  } catch (error) {
    console.error("Sound effects manager example failed:", error);
    throw error;
  }
}

// Example 11: Complete sound effects workflow
export async function completeSoundEffectsWorkflowExample() {
  try {
    console.log("=== Complete Sound Effects Workflow Example ===");

    // Step 1: Choose a category and get guidance
    const category: SoundEffectCategory = 'cinematic';
    const guide = soundEffectsManager.getPromptingGuide(category);
    console.log(`\n1. Selected category: ${category}`);
    console.log(`   Description: ${guide.description}`);
    console.log(`   Tips: ${guide.tips.join(', ')}`);

    // Step 2: Choose an example and validate
    const example = guide.examples[0];
    console.log(`\n2. Selected example: "${example}"`);
    
    const validation = soundEffectsManager.validateSoundEffectText(example);
    console.log(`   Validation: Valid: ${validation.isValid}`);
    if (validation.suggestions.length > 0) {
      console.log(`   Suggestions: ${validation.suggestions.join(', ')}`);
    }

    // Step 3: Get recommended options
    const recommendedOptions = soundEffectsManager.getRecommendedOptions(category, example);
    console.log(`\n3. Recommended options:`, recommendedOptions);

    // Step 4: Generate the sound effect
    console.log(`\n4. Generating sound effect...`);
    const result = await elevenLabs.generateSoundEffect(example, recommendedOptions);
    
    console.log(`   Generated ${result.audio.byteLength} bytes of audio`);
    console.log(`   Duration: ${result.duration_seconds} seconds`);
    console.log(`   Loop: ${result.loop}`);
    console.log(`   Prompt influence: ${result.prompt_influence}`);

    // Step 5: Play the result
    console.log(`\n5. Playing generated sound effect...`);
    await elevenLabs.playAudio(result.audio);

    return {
      category,
      guide,
      example,
      validation,
      recommendedOptions,
      result
    };
  } catch (error) {
    console.error("Complete sound effects workflow example failed:", error);
    throw error;
  }
}

// Export all examples
export const soundEffectsExamples = {
  basicSoundEffectsExample,
  complexSequencesExample,
  musicalElementsExample,
  cinematicEffectsExample,
  ambientAtmosphericExample,
  soundEffectsByCategoryExample,
  loopingSoundEffectsExample,
  promptInfluenceExample,
  durationVariationsExample,
  soundEffectsManagerExample,
  completeSoundEffectsWorkflowExample
};
