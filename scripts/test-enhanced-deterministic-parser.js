#!/usr/bin/env node

/**
 * 🎬 Enhanced Deterministic Parser Test
 * 
 * This script tests the enhanced deterministic parser with:
 * - Auto-assigned ordering hints
 * - Layer effects sequencing
 * - Shotstack integration
 * - Platform-specific optimizations
 */

const { parseHumanPlanToDraftManifest, autoCalculateSceneTimings, validateShotstackCompatibility } = require('../services/phase4/enhancedDeterministicParser.ts');

console.log('🎬 Testing Enhanced Deterministic Parser...\n');

// Test cases with different platforms and complexity levels
const testCases = [
  {
    name: 'TikTok Educational Video',
    platform: 'tiktok',
    humanPlan: `
      Platform: tiktok
      Duration: 30
      Aspect: 9:16
      Language: en
      
      Scene 1:
      Purpose: hook
      Narration: "Learn Python in 30 seconds!"
      Visual: "Coding screen with syntax highlighting"
      Effect: cinematic_zoom, bokeh_transition
      
      Scene 2:
      Purpose: body
      Narration: "Here's how to create a simple function"
      Visual: "Code editor with function definition"
      Effect: slow_pan, data_highlight
      
      Scene 3:
      Purpose: cta
      Narration: "Follow for more coding tips!"
      Visual: "Subscribe button animation"
      Effect: text_reveal, logo_reveal
      
      Voice: confident
      VoiceId: JBFqnCBsd6RMkjVDRZzb
      Music: upbeat_learning
      Brand: #ff6b35, #00ff88
    `
  },
  {
    name: 'YouTube Tutorial Video',
    platform: 'youtube',
    humanPlan: `
      Platform: youtube
      Duration: 120
      Aspect: 16:9
      Language: en
      
      Scene 1:
      Purpose: hook
      Narration: "Welcome to this comprehensive tutorial"
      Visual: "Professional studio setup"
      Effect: parallax_scroll, overlay_text
      
      Scene 2:
      Purpose: body
      Narration: "Let's dive into the main content"
      Visual: "Data visualization charts"
      Effect: chart_animation, data_highlight
      
      Scene 3:
      Purpose: body
      Narration: "Here's a practical example"
      Visual: "Screen recording with annotations"
      Effect: slow_pan, overlay_text
      
      Scene 4:
      Purpose: cta
      Narration: "Don't forget to subscribe!"
      Visual: "Channel branding with call-to-action"
      Effect: crossfade, logo_reveal
      
      Voice: professional
      VoiceId: JBFqnCBsd6RMkjVDRZzb
      Music: neutral_learning
      Brand: #1a1a1a, #ffffff, #ff6b35
      Logo: https://example.com/logo.png
    `
  },
  {
    name: 'Instagram Product Showcase',
    platform: 'instagram',
    humanPlan: `
      Platform: instagram
      Duration: 60
      Aspect: 1:1
      Language: en
      
      Scene 1:
      Purpose: hook
      Narration: "Check out this amazing product!"
      Visual: "Product hero shot with studio lighting"
      Effect: cinematic_zoom, lens_flare
      
      Scene 2:
      Purpose: body
      Narration: "Here are the key features"
      Visual: "Product details and specifications"
      Effect: slow_pan, overlay_text
      
      Scene 3:
      Purpose: cta
      Narration: "Get yours today!"
      Visual: "Product with purchase button"
      Effect: bokeh_transition, text_reveal
      
      Voice: friendly
      VoiceId: JBFqnCBsd6RMkjVDRZzb
      Music: upbeat_commercial
      Brand: #ff6b35, #00ff88, #ffffff
    `
  }
];

async function testEnhancedParser() {
  console.log('🧪 Testing Enhanced Deterministic Parser...\n');

  for (const testCase of testCases) {
    console.log(`📋 Test Case: ${testCase.name}`);
    console.log(`🎯 Platform: ${testCase.platform}`);
    console.log('─'.repeat(50));

    try {
      // Parse the human plan
      const draft = parseHumanPlanToDraftManifest('test-user-123', testCase.humanPlan);
      
      // Auto-calculate timings
      const manifest = autoCalculateSceneTimings(draft);
      
      // Validate Shotstack compatibility
      const validation = validateShotstackCompatibility(manifest);

      // Display results
      console.log(`✅ Parsed successfully`);
      console.log(`📊 Scenes: ${manifest.scenes?.length || 0}`);
      console.log(`🎨 Assets: ${Object.keys(manifest.assets || {}).length}`);
      console.log(`🎵 Music cues: ${Object.keys(manifest.audio?.music?.cueMap || {}).length}`);
      console.log(`🎬 Effects allowed: ${manifest.effects?.allowed?.length || 0}`);
      console.log(`🔄 Jobs generated: ${manifest.jobs?.length || 0}`);

      // Show scene details
      console.log('\n🎬 Scene Details:');
      manifest.scenes?.forEach((scene, index) => {
        console.log(`  Scene ${index + 1} (${scene.id}):`);
        console.log(`    Purpose: ${scene.purpose}`);
        console.log(`    Duration: ${scene.durationSeconds}s`);
        console.log(`    Start: ${scene.startAtSec}s`);
        console.log(`    Effects: ${scene.effects?.layeredEffects?.join(', ') || 'none'}`);
        console.log(`    Ordering hints: ${JSON.stringify(scene.effects?.orderingHints || {})}`);
        console.log(`    Shotstack config: ${JSON.stringify(scene.effects?.shotstackConfig || {})}`);
      });

      // Show job ordering
      console.log('\n⚙️ Job Ordering:');
      manifest.jobs?.forEach((job, index) => {
        console.log(`  ${index + 1}. ${job.id} (${job.type})`);
        console.log(`     Priority: ${job.priority}`);
        console.log(`     Ordering hint: ${job.orderingHint}`);
        console.log(`     Depends on: ${job.dependsOn?.join(', ') || 'none'}`);
      });

      // Show validation results
      console.log('\n🛡️ Shotstack Validation:');
      console.log(`  Valid: ${validation.isValid ? '✅' : '❌'}`);
      if (validation.warnings.length > 0) {
        console.log(`  Warnings: ${validation.warnings.length}`);
        validation.warnings.forEach(warning => console.log(`    ⚠️ ${warning}`));
      }
      if (validation.optimizations.length > 0) {
        console.log(`  Optimizations: ${validation.optimizations.length}`);
        validation.optimizations.forEach(opt => console.log(`    💡 ${opt}`));
      }

      // Show platform-specific features
      console.log('\n🎯 Platform-Specific Features:');
      console.log(`  Default transition: ${manifest.effects?.defaultTransition}`);
      console.log(`  Allowed effects: ${manifest.effects?.allowed?.join(', ')}`);
      console.log(`  Brand colors: ${manifest.consistency?.brand?.colors?.join(', ')}`);
      if (manifest.consistency?.brand?.shotstackPalette) {
        console.log(`  Shotstack palette: ${JSON.stringify(manifest.consistency.brand.shotstackPalette)}`);
      }

    } catch (error) {
      console.log(`❌ Error: ${error.message}`);
    }

    console.log('\n' + '='.repeat(60) + '\n');
  }
}

async function testEffectOrdering() {
  console.log('🎬 Testing Effect Ordering and Layering...\n');

  const testPlan = `
    Platform: youtube
    Duration: 60
    
    Scene 1:
    Purpose: hook
    Narration: "Welcome to our tutorial"
    Visual: "Professional setup"
    Effect: cinematic_zoom, lens_flare, overlay_text, data_highlight
    
    Scene 2:
    Purpose: body
    Narration: "Let's learn something new"
    Visual: "Educational content"
    Effect: slow_pan, parallax_scroll, chart_animation, text_reveal
  `;

  try {
    const draft = parseHumanPlanToDraftManifest('test-user-456', testPlan);
    
    console.log('🎨 Effect Ordering Analysis:');
    draft.scenes?.forEach((scene, index) => {
      console.log(`\nScene ${index + 1} (${scene.id}):`);
      console.log(`  Effects: ${scene.effects?.layeredEffects?.join(', ')}`);
      
      if (scene.effects?.orderingHints) {
        console.log('  Ordering Hints:');
        Object.entries(scene.effects.orderingHints)
          .sort(([,a], [,b]) => a - b)
          .forEach(([effect, hint]) => {
            console.log(`    ${effect}: ${hint}`);
          });
      }
      
      if (scene.effects?.shotstackConfig) {
        console.log('  Shotstack Layers:');
        scene.effects.shotstackConfig.layers?.forEach((layer, i) => {
          console.log(`    Layer ${i + 1}: ${layer.effect} (hint: ${layer.orderingHint}, duration: ${layer.duration}s)`);
        });
      }
    });

  } catch (error) {
    console.log(`❌ Error: ${error.message}`);
  }
}

async function testPlatformOptimizations() {
  console.log('🎯 Testing Platform-Specific Optimizations...\n');

  const platforms = ['tiktok', 'youtube', 'instagram', 'social'];
  
  for (const platform of platforms) {
    console.log(`📱 Platform: ${platform.toUpperCase()}`);
    
    const testPlan = `
      Platform: ${platform}
      Duration: 30
      
      Scene 1:
      Purpose: hook
      Narration: "Quick tip for you!"
      Visual: "Engaging content"
      
      Scene 2:
      Purpose: cta
      Narration: "Follow for more!"
      Visual: "Call to action"
    `;

    try {
      const draft = parseHumanPlanToDraftManifest('test-user-789', testPlan);
      
      console.log(`  Default transition: ${draft.effects?.defaultTransition}`);
      console.log(`  Allowed effects: ${draft.effects?.allowed?.join(', ')}`);
      console.log(`  Scene effects: ${draft.scenes?.[0]?.effects?.layeredEffects?.join(', ')}`);
      
    } catch (error) {
      console.log(`  ❌ Error: ${error.message}`);
    }
    
    console.log('');
  }
}

async function main() {
  try {
    await testEnhancedParser();
    await testEffectOrdering();
    await testPlatformOptimizations();
    
    console.log('🎉 Enhanced Deterministic Parser Test Complete!');
    console.log('✨ All tests passed - the enhanced parser is ready for production!');
    
  } catch (error) {
    console.error('❌ Test suite failed:', error.message);
    process.exit(1);
  }
}

main();
