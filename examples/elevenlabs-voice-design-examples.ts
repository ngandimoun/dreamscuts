/**
 * ElevenLabs Voice Design Examples
 * 
 * This file demonstrates how to design and create custom voices from text descriptions
 * Based on the official ElevenLabs Voice Design documentation
 */

import { elevenLabs, voiceDesignManager, AudioUtils } from '@/lib/elevenlabs';
import type { VoiceDesignOptions, CreateVoiceOptions } from '@/lib/elevenlabs/types';

// Example 1: Basic voice design
export async function basicVoiceDesignExample() {
  try {
    console.log("=== Basic Voice Design Example ===");

    const basicVoices = [
      "A calm male narrator with perfect audio quality",
      "A young female voice with a warm, friendly tone",
      "A professional businessman in his 40s with a confident voice",
      "An elderly woman with a gentle, grandmotherly voice",
      "A energetic teenager with an excited, enthusiastic tone"
    ];

    const results = [];

    for (const voiceDescription of basicVoices) {
      console.log(`\nDesigning voice: "${voiceDescription}"`);
      
      // Validate the description first
      const validation = voiceDesignManager.validateVoiceDescription(voiceDescription);
      console.log(`Validation: Valid: ${validation.isValid}`);
      if (validation.suggestions.length > 0) {
        console.log(`Suggestions: ${validation.suggestions.join(', ')}`);
      }

      // Generate preview text
      const previewText = voiceDesignManager.generatePreviewText(voiceDescription);
      console.log(`Generated preview text: "${previewText.substring(0, 100)}..."`);

      // Design the voice
      const result = await elevenLabs.designVoice(voiceDescription, {
        text: previewText,
        guidance_scale: 30,
        loudness: 0.5
      });

      results.push({
        voiceDescription,
        validation,
        previewText,
        result
      });

      console.log(`Generated ${result.previews.length} voice previews`);
      
      // Play the first preview
      if (result.previews.length > 0) {
        const firstPreview = result.previews[0];
        const audioBuffer = Buffer.from(firstPreview.audio_base_64, 'base64');
        await AudioUtils.playAudio(audioBuffer);
        await new Promise(resolve => setTimeout(resolve, 2000));
      }
    }

    return results;
  } catch (error) {
    console.error("Basic voice design example failed:", error);
    throw error;
  }
}

// Example 2: Professional voices
export async function professionalVoicesExample() {
  try {
    console.log("=== Professional Voices Example ===");

    const professionalVoices = [
      "A professional male narrator with perfect audio quality, ideal for business presentations",
      "A confident businesswoman in her 30s with a clear, authoritative voice",
      "A mature male voice with studio-quality recording, perfect for educational content",
      "A professional female announcer with crisp pronunciation and engaging tone"
    ];

    const results = [];

    for (const voiceDescription of professionalVoices) {
      console.log(`\nDesigning professional voice: "${voiceDescription}"`);
      
      // Get recommended options for professional category
      const recommendedOptions = voiceDesignManager.getRecommendedOptions('professional', voiceDescription);
      console.log(`Recommended options:`, recommendedOptions);

      // Generate appropriate preview text
      const previewText = voiceDesignManager.generatePreviewText(voiceDescription, 'professional');
      console.log(`Preview text: "${previewText.substring(0, 100)}..."`);

      // Design the voice with recommended options
      const result = await elevenLabs.designVoice(voiceDescription, {
        text: previewText,
        ...recommendedOptions
      });

      results.push({
        voiceDescription,
        recommendedOptions,
        previewText,
        result
      });

      console.log(`Generated ${result.previews.length} professional voice previews`);
      
      // Play the first preview
      if (result.previews.length > 0) {
        const firstPreview = result.previews[0];
        const audioBuffer = Buffer.from(firstPreview.audio_base_64, 'base64');
        await AudioUtils.playAudio(audioBuffer);
        await new Promise(resolve => setTimeout(resolve, 2000));
      }
    }

    return results;
  } catch (error) {
    console.error("Professional voices example failed:", error);
    throw error;
  }
}

// Example 3: Character voices
export async function characterVoicesExample() {
  try {
    console.log("=== Character Voices Example ===");

    const characterVoices = [
      "A wise old wizard with a deep, mystical voice and perfect audio quality",
      "A mischievous fairy with a high-pitched, playful tone",
      "A gruff pirate captain with a thick Scottish accent",
      "A young hero with an energetic, determined voice",
      "A mysterious villain with a dark, menacing tone"
    ];

    const results = [];

    for (const voiceDescription of characterVoices) {
      console.log(`\nDesigning character voice: "${voiceDescription}"`);
      
      // Get recommended options for character category
      const recommendedOptions = voiceDesignManager.getRecommendedOptions('character', voiceDescription);
      console.log(`Recommended options:`, recommendedOptions);

      // Generate appropriate preview text
      const previewText = voiceDesignManager.generatePreviewText(voiceDescription, 'character');
      console.log(`Preview text: "${previewText.substring(0, 100)}..."`);

      // Design the voice with recommended options
      const result = await elevenLabs.designVoice(voiceDescription, {
        text: previewText,
        ...recommendedOptions
      });

      results.push({
        voiceDescription,
        recommendedOptions,
        previewText,
        result
      });

      console.log(`Generated ${result.previews.length} character voice previews`);
      
      // Play the first preview
      if (result.previews.length > 0) {
        const firstPreview = result.previews[0];
        const audioBuffer = Buffer.from(firstPreview.audio_base_64, 'base64');
        await AudioUtils.playAudio(audioBuffer);
        await new Promise(resolve => setTimeout(resolve, 2000));
      }
    }

    return results;
  } catch (error) {
    console.error("Character voices example failed:", error);
    throw error;
  }
}

// Example 4: Accent variations
export async function accentVariationsExample() {
  try {
    console.log("=== Accent Variations Example ===");

    const accentVoices = [
      "A middle-aged man with a thick French accent, speaking at a natural pace",
      "A young woman with a slight Southern drawl and a warm, friendly tone",
      "An old man with a heavy Eastern European accent, speaking slowly",
      "A cheerful woman speaking with a crisp British accent",
      "A younger male with a soft Irish lilt and perfect audio quality"
    ];

    const results = [];

    for (const voiceDescription of accentVoices) {
      console.log(`\nDesigning accent voice: "${voiceDescription}"`);
      
      // Analyze the description
      const analysis = voiceDesignManager.analyzeVoiceDescription(voiceDescription);
      console.log(`Analysis score: ${analysis.score}/100`);
      console.log(`Strengths: ${analysis.strengths.join(', ')}`);
      if (analysis.improvements.length > 0) {
        console.log(`Improvements: ${analysis.improvements.join(', ')}`);
      }

      // Generate appropriate preview text
      const previewText = voiceDesignManager.generatePreviewText(voiceDescription);
      console.log(`Preview text: "${previewText.substring(0, 100)}..."`);

      // Design the voice
      const result = await elevenLabs.designVoice(voiceDescription, {
        text: previewText,
        guidance_scale: 35, // Higher for accent accuracy
        loudness: 0.5
      });

      results.push({
        voiceDescription,
        analysis,
        previewText,
        result
      });

      console.log(`Generated ${result.previews.length} accent voice previews`);
      
      // Play the first preview
      if (result.previews.length > 0) {
        const firstPreview = result.previews[0];
        const audioBuffer = Buffer.from(firstPreview.audio_base_64, 'base64');
        await AudioUtils.playAudio(audioBuffer);
        await new Promise(resolve => setTimeout(resolve, 2000));
      }
    }

    return results;
  } catch (error) {
    console.error("Accent variations example failed:", error);
    throw error;
  }
}

// Example 5: Guidance scale variations
export async function guidanceScaleVariationsExample() {
  try {
    console.log("=== Guidance Scale Variations Example ===");

    const testDescription = "A professional male narrator with perfect audio quality";
    const guidanceScales = [10, 25, 40, 60, 80];
    const results = [];

    for (const guidanceScale of guidanceScales) {
      console.log(`\nTesting guidance scale: ${guidanceScale}`);
      console.log(`Description: "${testDescription}"`);
      
      const result = await elevenLabs.designVoice(testDescription, {
        text: "Welcome to today's presentation. I'm excited to share with you the latest developments in our industry.",
        guidance_scale: guidanceScale,
        loudness: 0.5
      });

      results.push({
        guidanceScale,
        testDescription,
        result
      });

      console.log(`Generated ${result.previews.length} voice previews with guidance scale ${guidanceScale}`);
      
      // Play the first preview
      if (result.previews.length > 0) {
        const firstPreview = result.previews[0];
        const audioBuffer = Buffer.from(firstPreview.audio_base_64, 'base64');
        await AudioUtils.playAudio(audioBuffer);
        await new Promise(resolve => setTimeout(resolve, 1500));
      }
    }

    return results;
  } catch (error) {
    console.error("Guidance scale variations example failed:", error);
    throw error;
  }
}

// Example 6: Model comparison
export async function modelComparisonExample() {
  try {
    console.log("=== Model Comparison Example ===");

    const testDescription = "A warm, expressive female voice with perfect audio quality";
    const models = ['eleven_multilingual_ttv_v2', 'eleven_ttv_v3'];
    const results = [];

    for (const modelId of models) {
      console.log(`\nTesting model: ${modelId}`);
      console.log(`Description: "${testDescription}"`);
      
      const result = await elevenLabs.designVoice(testDescription, {
        text: "Hello there! I hope you're having a wonderful day. This is a sample of my voice, and I'm excited to share it with you.",
        model_id: modelId as any,
        guidance_scale: 30,
        loudness: 0.5
      });

      results.push({
        modelId,
        testDescription,
        result
      });

      console.log(`Generated ${result.previews.length} voice previews with model ${modelId}`);
      
      // Play the first preview
      if (result.previews.length > 0) {
        const firstPreview = result.previews[0];
        const audioBuffer = Buffer.from(firstPreview.audio_base_64, 'base64');
        await AudioUtils.playAudio(audioBuffer);
        await new Promise(resolve => setTimeout(resolve, 2000));
      }
    }

    return results;
  } catch (error) {
    console.error("Model comparison example failed:", error);
    throw error;
  }
}

// Example 7: Complete voice creation workflow
export async function completeVoiceCreationWorkflowExample() {
  try {
    console.log("=== Complete Voice Creation Workflow Example ===");

    // Step 1: Choose a voice description
    const voiceDescription = "A professional female narrator with perfect audio quality, ideal for educational content";
    console.log(`\n1. Voice Description: "${voiceDescription}"`);

    // Step 2: Validate the description
    const validation = voiceDesignManager.validateVoiceDescription(voiceDescription);
    console.log(`2. Validation: Valid: ${validation.isValid}`);
    if (validation.suggestions.length > 0) {
      console.log(`   Suggestions: ${validation.suggestions.join(', ')}`);
    }

    // Step 3: Analyze the description
    const analysis = voiceDesignManager.analyzeVoiceDescription(voiceDescription);
    console.log(`3. Analysis Score: ${analysis.score}/100`);
    console.log(`   Strengths: ${analysis.strengths.join(', ')}`);

    // Step 4: Get recommended options
    const recommendedOptions = voiceDesignManager.getRecommendedOptions('educational', voiceDescription);
    console.log(`4. Recommended Options:`, recommendedOptions);

    // Step 5: Generate preview text
    const previewText = voiceDesignManager.generatePreviewText(voiceDescription, 'educational');
    console.log(`5. Preview Text: "${previewText}"`);

    // Step 6: Design the voice
    console.log(`6. Designing voice...`);
    const designResult = await elevenLabs.designVoice(voiceDescription, {
      text: previewText,
      ...recommendedOptions
    });

    console.log(`   Generated ${designResult.previews.length} voice previews`);

    // Step 7: Play previews and select one
    let selectedPreview = null;
    for (let i = 0; i < designResult.previews.length; i++) {
      const preview = designResult.previews[i];
      console.log(`\n7. Playing preview ${i + 1}/${designResult.previews.length}`);
      
      const audioBuffer = Buffer.from(preview.audio_base_64, 'base64');
      await AudioUtils.playAudio(audioBuffer);
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // For demo purposes, select the first preview
      if (i === 0) {
        selectedPreview = preview;
        console.log(`   Selected preview ${i + 1} for voice creation`);
      }
    }

    // Step 8: Create the voice
    if (selectedPreview) {
      console.log(`\n8. Creating voice from selected preview...`);
      const voiceName = "Educational Narrator";
      const createResult = await elevenLabs.createVoice(
        voiceName,
        voiceDescription,
        selectedPreview.generated_voice_id,
        {
          labels: {
            category: 'educational',
            use_case: 'narration',
            quality: 'professional'
          }
        }
      );

      console.log(`   Voice created successfully!`);
      console.log(`   Voice ID: ${createResult.voice_id}`);
      console.log(`   Name: ${createResult.name}`);
      console.log(`   Description: ${createResult.description}`);
      console.log(`   Preview URL: ${createResult.preview_url}`);

      return {
        voiceDescription,
        validation,
        analysis,
        recommendedOptions,
        previewText,
        designResult,
        selectedPreview,
        createResult
      };
    } else {
      throw new Error('No preview selected for voice creation');
    }
  } catch (error) {
    console.error("Complete voice creation workflow example failed:", error);
    throw error;
  }
}

// Example 8: Voice design manager features
export async function voiceDesignManagerFeaturesExample() {
  try {
    console.log("=== Voice Design Manager Features Example ===");

    // Get all models
    const models = voiceDesignManager.getVoiceDesignModels();
    console.log(`\nAvailable models: ${models.length}`);
    models.forEach(model => {
      console.log(`- ${model.name}: ${model.description}`);
    });

    // Get all categories
    const categories = voiceDesignManager.getVoiceDesignCategories();
    console.log(`\nAvailable categories: ${categories.length}`);
    console.log(`Categories: ${categories.join(', ')}`);

    // Get prompting guides
    console.log(`\nPrompting guides:`);
    categories.forEach(category => {
      const guide = voiceDesignManager.getPromptingGuide(category);
      console.log(`- ${category}: ${guide.description}`);
      console.log(`  Examples: ${guide.examples.slice(0, 2).join(', ')}`);
    });

    // Get attributes
    const attributes = voiceDesignManager.getVoiceDesignAttributes();
    console.log(`\nVoice design attributes:`);
    Object.entries(attributes).forEach(([category, values]) => {
      console.log(`- ${category}: ${values.slice(0, 5).join(', ')}${values.length > 5 ? '...' : ''}`);
    });

    // Get examples
    const examples = voiceDesignManager.getVoiceDesignExamples();
    console.log(`\nVoice design examples: ${examples.length}`);
    examples.slice(0, 3).forEach(example => {
      console.log(`- ${example.voice_type}: ${example.prompt.substring(0, 100)}...`);
    });

    // Search examples
    const searchResults = voiceDesignManager.searchExamples('professional');
    console.log(`\nSearch results for "professional": ${searchResults.length}`);
    searchResults.forEach(result => {
      console.log(`- ${result.voice_type}: ${result.expected_characteristics.join(', ')}`);
    });

    // Get random example
    const randomExample = voiceDesignManager.getRandomExample();
    console.log(`\nRandom example: ${randomExample.voice_type}`);
    console.log(`Prompt: ${randomExample.prompt.substring(0, 100)}...`);

    // Test validation
    const testDescriptions = [
      "A professional male narrator", // Good
      "Voice", // Too short
      "This is a very long description that exceeds the maximum character limit and should trigger validation errors because it's way too verbose and contains too many unnecessary words that don't add value to the voice description", // Too long
      "" // Empty
    ];

    console.log(`\nValidation tests:`);
    for (const description of testDescriptions) {
      const validation = voiceDesignManager.validateVoiceDescription(description);
      console.log(`"${description}": Valid: ${validation.isValid}, Suggestions: ${validation.suggestions.join(', ')}`);
    }

    // Test analysis
    console.log(`\nAnalysis tests:`);
    for (const description of testDescriptions.slice(0, 2)) {
      const analysis = voiceDesignManager.analyzeVoiceDescription(description);
      console.log(`"${description}": Score: ${analysis.score}/100, Strengths: ${analysis.strengths.join(', ')}`);
    }

    return {
      models,
      categories,
      attributes,
      examples,
      searchResults,
      randomExample,
      validationTests: testDescriptions.map(desc => ({
        description: desc,
        validation: voiceDesignManager.validateVoiceDescription(desc),
        analysis: voiceDesignManager.analyzeVoiceDescription(desc)
      }))
    };
  } catch (error) {
    console.error("Voice design manager features example failed:", error);
    throw error;
  }
}

// Example 9: Official examples demonstration
export async function officialExamplesDemonstration() {
  try {
    console.log("=== Official Examples Demonstration ===");

    const officialExamples = voiceDesignManager.getVoiceDesignExamples();
    const results = [];

    // Test a few official examples
    for (let i = 0; i < Math.min(3, officialExamples.length); i++) {
      const example = officialExamples[i];
      console.log(`\n--- Testing Official Example: ${example.voice_type} ---`);
      console.log(`Prompt: ${example.prompt}`);
      console.log(`Expected characteristics: ${example.expected_characteristics.join(', ')}`);
      console.log(`Guidance scale: ${example.guidance_scale}`);

      const result = await elevenLabs.designVoice(example.prompt, {
        text: example.text_preview,
        guidance_scale: example.guidance_scale,
        model_id: example.model_id,
        loudness: 0.5
      });

      results.push({
        example,
        result
      });

      console.log(`Generated ${result.previews.length} voice previews`);
      
      // Play the first preview
      if (result.previews.length > 0) {
        const firstPreview = result.previews[0];
        const audioBuffer = Buffer.from(firstPreview.audio_base_64, 'base64');
        await AudioUtils.playAudio(audioBuffer);
        await new Promise(resolve => setTimeout(resolve, 2000));
      }
    }

    return results;
  } catch (error) {
    console.error("Official examples demonstration failed:", error);
    throw error;
  }
}

// Export all examples
export const voiceDesignExamples = {
  basicVoiceDesignExample,
  professionalVoicesExample,
  characterVoicesExample,
  accentVariationsExample,
  guidanceScaleVariationsExample,
  modelComparisonExample,
  completeVoiceCreationWorkflowExample,
  voiceDesignManagerFeaturesExample,
  officialExamplesDemonstration
};
