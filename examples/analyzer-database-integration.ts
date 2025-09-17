/**
 * DreamCut Analyzer Database Integration Example
 * 
 * This example shows how to use the analyzer database schema
 * to store, query, and stream analyzer results in realtime.
 */

import { createAnalyzerDatabaseManager } from '../lib/analyzer/database';
import type { CompleteAnalyzerResult } from '../lib/analyzer/types';

// Example analyzer JSON from your terminal output
const exampleAnalyzerJson = {
  "user_request": {
    "original_prompt": "build a vid with these",
    "intent": "image",
    "duration_seconds": 5,
    "aspect_ratio": "Smart Auto",
    "platform": "social",
    "image_count": 1
  },
  "prompt_analysis": {
    "user_intent_description": "Create a Smart Auto image for social platform featuring: \"build a vid with these\"",
    "reformulated_prompt": "Create a visually striking image with strong composition, appealing colors, and professional quality that stands out on social media platforms.",
    "clarity_score": 5,
    "suggested_improvements": [
      "Specify the style, mood, or tone you prefer",
      "Mention preferred colors or composition style"
    ],
    "content_type_analysis": {
      "needs_explanation": false,
      "needs_charts": false,
      "needs_diagrams": false,
      "needs_educational_content": false,
      "content_complexity": "simple",
      "requires_visual_aids": false,
      "is_instructional": false,
      "needs_data_visualization": false,
      "requires_interactive_elements": false,
      "content_category": "general"
    }
  },
  "assets": [
    {
      "id": "ast_ima01",
      "type": "image",
      "user_description": "use her as main character",
      "ai_caption": "1. Subject matter: The image features a young woman wearing a graduation gown and cap, sitting on the grass. She is holding a red and white graduation cape.\n\n2. Composition: The woman is positioned in the center of the image, with the grass surrounding her. The focus is on her, and the background is blurred, emphasizing her as the main subject.\n\n3. Technical quality: The image is in high resolution, with good clarity and lighting. The colors are vibrant, and the details are sharp.\n\n4. Visual sty",
      "objects_detected": ["person", "car"],
      "style": "unknown",
      "mood": "happy",
      "quality_score": 0.6,
      "role": "primary source footage",
      "recommended_edits": ["enhance-contrast"]
    }
  ],
  "global_analysis": {
    "goal": "Create a high-quality social image with professional styling and optimization.",
    "constraints": {
      "duration_seconds": 5,
      "aspect_ratio": "Smart Auto",
      "platform": "social"
    },
    "asset_roles": {
      "ast_ima01": "primary source footage"
    },
    "conflicts": []
  },
  "creative_options": [
    {
      "id": "opt_modern",
      "title": "Modern Professional",
      "short": "Contemporary design with clean lines and professional aesthetics.",
      "reasons": [
        "Versatile and professional",
        "Works across platforms"
      ],
      "estimatedWorkload": "low"
    },
    {
      "id": "opt_creative",
      "title": "Creative Artistic",
      "short": "Artistic approach with creative elements and visual interest.",
      "reasons": [
        "More engaging and memorable",
        "Stands out on social media"
      ],
      "estimatedWorkload": "medium"
    }
  ],
  "creative_direction": {
    "core_concept": "**",
    "visual_approach": "Apply platform-appropriate default styling",
    "style_direction": "Apply platform-appropriate default styling",
    "mood_atmosphere": "Maintain consistent happy mood throughout the content"
  },
  "production_pipeline": {
    "workflow_steps": [
      "Enhance image quality",
      "Apply chosen creative style",
      "Optimize for target platform",
      "Export in required format"
    ],
    "estimated_time": "30-45 minutes",
    "success_probability": 0.9,
    "quality_targets": {
      "technical_quality_target": "high",
      "creative_quality_target": "appealing",
      "consistency_target": "good",
      "polish_level_target": "refined"
    }
  },
  "quality_metrics": {
    "overall_confidence": 0.75,
    "analysis_quality": 8,
    "completion_status": "complete",
    "feasibility_score": 0.85
  },
  "challenges": [
    {
      "type": "quality",
      "description": "Some assets require quality enhancement before processing",
      "impact": "moderate"
    }
  ],
  "recommendations": [
    {
      "type": "quality",
      "recommendation": "Enhance asset quality before applying creative direction.",
      "priority": "recommended"
    },
    {
      "type": "creative",
      "recommendation": "Offer multiple style treatments for user approval.",
      "priority": "recommended"
    }
  ],
  "processing_time_ms": 38999,
  "models_used": ["gpt-4", "claude-3"],
  "cost_estimate": 0.15
};

/**
 * Example 1: Store Analyzer Result
 */
export async function storeAnalyzerResult() {
  const db = createAnalyzerDatabaseManager();
  const userId = "user-123"; // Replace with actual user ID

  try {
    // Store the complete analyzer result
    const result = await db.insertAnalyzerResult(userId, exampleAnalyzerJson);
    
    if (result.success) {
      console.log(`✅ Analyzer result stored with ID: ${result.queryId}`);
      return result.queryId;
    } else {
      console.error(`❌ Failed to store analyzer result: ${result.error}`);
      return null;
    }
  } catch (error) {
    console.error('Error storing analyzer result:', error);
    return null;
  }
}

/**
 * Example 2: Retrieve Complete Analyzer Result
 */
export async function getAnalyzerResult(queryId: string) {
  const db = createAnalyzerDatabaseManager();

  try {
    const result = await db.getAnalyzerResult(queryId);
    
    if (result.success && result.result) {
      console.log('✅ Retrieved analyzer result:', result.result);
      return result.result;
    } else {
      console.error(`❌ Failed to retrieve analyzer result: ${result.error}`);
      return null;
    }
  } catch (error) {
    console.error('Error retrieving analyzer result:', error);
    return null;
  }
}

/**
 * Example 3: Query User's Analyzer History
 */
export async function getUserAnalyzerHistory(userId: string) {
  const db = createAnalyzerDatabaseManager();

  try {
    // Get all queries for user
    const allQueries = await db.getUserAnalyzerQueries(userId);
    
    if (allQueries.success) {
      console.log(`✅ Found ${allQueries.total} analyzer queries for user`);
      return allQueries.queries;
    }

    // Get only completed queries
    const completedQueries = await db.getUserAnalyzerQueries(userId, {
      completion_status: 'complete',
      limit: 10
    });

    if (completedQueries.success) {
      console.log(`✅ Found ${completedQueries.queries?.length} completed queries`);
      return completedQueries.queries;
    }

    // Get queries by intent
    const imageQueries = await db.getUserAnalyzerQueries(userId, {
      intent: 'image',
      limit: 5
    });

    if (imageQueries.success) {
      console.log(`✅ Found ${imageQueries.queries?.length} image queries`);
      return imageQueries.queries;
    }

    return null;
  } catch (error) {
    console.error('Error getting user analyzer history:', error);
    return null;
  }
}

/**
 * Example 4: Realtime Subscription
 */
export function subscribeToAnalyzerUpdates(queryId: string) {
  const db = createAnalyzerDatabaseManager();

  // Subscribe to realtime updates
  const unsubscribe = db.subscribeToAnalyzerQuery(queryId, {
    onQueryUpdate: (query) => {
      console.log('🔄 Query updated:', query);
      // Update UI with new query data
    },
    onAssetUpdate: (asset) => {
      console.log('🖼️ Asset updated:', asset);
      // Update UI with new asset data
    },
    onCreativeOptionUpdate: (option) => {
      console.log('🎨 Creative option updated:', option);
      // Update UI with new creative option
    },
    onChallengeUpdate: (challenge) => {
      console.log('⚠️ Challenge updated:', challenge);
      // Update UI with new challenge
    },
    onRecommendationUpdate: (recommendation) => {
      console.log('💡 Recommendation updated:', recommendation);
      // Update UI with new recommendation
    },
    onError: (error) => {
      console.error('❌ Realtime error:', error);
      // Handle realtime errors
    }
  });

  // Return unsubscribe function
  return unsubscribe;
}

/**
 * Example 5: Update Creative Option Selection
 */
export async function selectCreativeOption(queryId: string, optionId: string) {
  const db = createAnalyzerDatabaseManager();

  try {
    // First, get all creative options for this query
    const queryResult = await db.getAnalyzerQuery(queryId);
    
    if (!queryResult.success || !queryResult.creative_options) {
      console.error('Failed to get creative options');
      return false;
    }

    // Deselect all options
    for (const option of queryResult.creative_options) {
      await db.updateCreativeOption(option.id, { is_selected: false });
    }

    // Select the chosen option
    const selectedOption = queryResult.creative_options.find(opt => opt.option_id === optionId);
    if (selectedOption) {
      const result = await db.updateCreativeOption(selectedOption.id, {
        is_selected: true,
        selection_reason: 'User selected this option'
      });

      if (result.success) {
        console.log(`✅ Selected creative option: ${optionId}`);
        return true;
      }
    }

    return false;
  } catch (error) {
    console.error('Error selecting creative option:', error);
    return false;
  }
}

/**
 * Example 6: Mark Challenge as Resolved
 */
export async function resolveChallenge(queryId: string, challengeType: string, resolutionNotes: string) {
  const db = createAnalyzerDatabaseManager();

  try {
    const queryResult = await db.getAnalyzerQuery(queryId);
    
    if (!queryResult.success || !queryResult.challenges) {
      console.error('Failed to get challenges');
      return false;
    }

    const challenge = queryResult.challenges.find(c => c.type === challengeType);
    if (challenge) {
      const result = await db.updateChallenge(challenge.id, {
        is_resolved: true,
        resolution_notes: resolutionNotes,
        resolved_at: new Date().toISOString()
      });

      if (result.success) {
        console.log(`✅ Resolved challenge: ${challengeType}`);
        return true;
      }
    }

    return false;
  } catch (error) {
    console.error('Error resolving challenge:', error);
    return false;
  }
}

/**
 * Example 7: Get Analytics
 */
export async function getAnalyzerAnalytics(userId: string) {
  const db = createAnalyzerDatabaseManager();

  try {
    const result = await db.getAnalyzerAnalytics(userId);
    
    if (result.success && result.analytics) {
      console.log('📊 Analyzer Analytics:', result.analytics);
      return result.analytics;
    } else {
      console.error(`❌ Failed to get analytics: ${result.error}`);
      return null;
    }
  } catch (error) {
    console.error('Error getting analytics:', error);
    return null;
  }
}

/**
 * Example 8: Complete Workflow
 */
export async function completeAnalyzerWorkflow() {
  const userId = "user-123";
  
  try {
    // 1. Store analyzer result
    console.log('1. Storing analyzer result...');
    const queryId = await storeAnalyzerResult();
    if (!queryId) return;

    // 2. Subscribe to realtime updates
    console.log('2. Setting up realtime subscription...');
    const unsubscribe = subscribeToAnalyzerUpdates(queryId);

    // 3. Get the stored result
    console.log('3. Retrieving stored result...');
    const result = await getAnalyzerResult(queryId);
    if (!result) return;

    // 4. Select a creative option
    console.log('4. Selecting creative option...');
    await selectCreativeOption(queryId, 'opt_modern');

    // 5. Resolve a challenge
    console.log('5. Resolving challenge...');
    await resolveChallenge(queryId, 'quality', 'Applied contrast enhancement');

    // 6. Get analytics
    console.log('6. Getting analytics...');
    await getAnalyzerAnalytics(userId);

    // 7. Clean up subscription
    console.log('7. Cleaning up...');
    unsubscribe();

    console.log('✅ Complete workflow finished successfully!');
  } catch (error) {
    console.error('❌ Workflow failed:', error);
  }
}

// Export all examples
export const analyzerExamples = {
  storeAnalyzerResult,
  getAnalyzerResult,
  getUserAnalyzerHistory,
  subscribeToAnalyzerUpdates,
  selectCreativeOption,
  resolveChallenge,
  getAnalyzerAnalytics,
  completeAnalyzerWorkflow
};
