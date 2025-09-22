/**
 * Workflow Recipes Loader
 * 
 * This module loads workflow recipes that define
 * high-signal sequences of operations for common use cases.
 */

import { readFileSync } from 'fs';
import { join } from 'path';

export interface WorkflowRecipes {
  recipes: Record<string, WorkflowRecipe>;
}

export interface WorkflowRecipe {
  recipeId: string;
  name: string;
  description: string;
  targetProfileId: string;
  steps: WorkflowStep[];
  defaultInputs?: Record<string, any>;
}

export interface WorkflowStep {
  type: string;
  model?: string;
  description?: string;
  inputs?: Record<string, any>;
}

/**
 * Load workflow recipes from the registry
 */
export async function loadWorkflowRecipes(): Promise<WorkflowRecipes> {
  try {
    const recipesPath = join(process.cwd(), 'registry', 'workflow-recipes.json');
    const recipesData = readFileSync(recipesPath, 'utf-8');
    return JSON.parse(recipesData);
  } catch (error) {
    console.warn('Failed to load workflow recipes, using defaults:', error);
    return getDefaultRecipes();
  }
}

/**
 * Get default workflow recipes
 */
function getDefaultRecipes(): WorkflowRecipes {
  return {
    recipes: {
      educational_explainer_recipe: {
        recipeId: 'educational_explainer_recipe',
        name: 'Educational Explainer Recipe',
        description: 'Step-by-step educational content creation',
        targetProfileId: 'educational_explainer',
        steps: [
          { type: 'image_generation', model: 'nano_banana' },
          { type: 'video_animation', model: 'veo3_fast' },
          { type: 'voice_generation', model: 'elevenlabs_dialogue' },
          { type: 'render', model: 'shotstack' }
        ]
      }
    }
  };
}
