/**
 * Registry Integration Test
 * 
 * This test verifies that the registry files (JSON) can be loaded
 * and contain the expected data structure.
 */

import { describe, test, expect } from '@jest/globals';
import { readFileSync } from 'fs';
import { join } from 'path';

describe('Registry Integration Test', () => {
  test('should load profile-pipeline-matrix.json', () => {
    const matrixPath = join(process.cwd(), 'registry', 'profile-pipeline-matrix.json');
    const matrixData = readFileSync(matrixPath, 'utf-8');
    const matrix = JSON.parse(matrixData);
    
    expect(matrix).toBeDefined();
    expect(matrix.profiles).toBeDefined();
    expect(typeof matrix.profiles).toBe('object');
    
    // Check that we have the expected profiles
    const profileIds = Object.keys(matrix.profiles);
    expect(profileIds).toContain('educational_explainer');
    expect(profileIds).toContain('marketing_dynamic');
    expect(profileIds).toContain('ugc_testimonial');
    expect(profileIds).toContain('ugc_reaction');
    expect(profileIds).toContain('cinematic_trailer');
  });

  test('should load workflow-recipes.json', () => {
    const recipesPath = join(process.cwd(), 'registry', 'workflow-recipes.json');
    const recipesData = readFileSync(recipesPath, 'utf-8');
    const recipes = JSON.parse(recipesData);
    
    expect(recipes).toBeDefined();
    expect(recipes.recipes).toBeDefined();
    expect(typeof recipes.recipes).toBe('object');
    
    // Check that we have the expected recipes
    const recipeIds = Object.keys(recipes.recipes);
    expect(recipeIds).toContain('ugc_testimonial_recipe');
    expect(recipeIds).toContain('ugc_reaction_recipe');
    expect(recipeIds).toContain('product_ad_recipe');
    expect(recipeIds).toContain('educational_explainer_recipe');
    expect(recipeIds).toContain('cinematic_trailer_recipe');
  });

  test('should have valid profile structure', () => {
    const matrixPath = join(process.cwd(), 'registry', 'profile-pipeline-matrix.json');
    const matrixData = readFileSync(matrixPath, 'utf-8');
    const matrix = JSON.parse(matrixData);
    
    const educationalProfile = matrix.profiles.educational_explainer;
    
    expect(educationalProfile).toBeDefined();
    expect(educationalProfile.profileId).toBe('educational_explainer');
    expect(educationalProfile.profileName).toBe('Educational Explainer');
    expect(educationalProfile.coreConcept).toBeDefined();
    expect(educationalProfile.visualApproach).toBeDefined();
    expect(educationalProfile.styleDirection).toBeDefined();
    expect(educationalProfile.moodGuidance).toBeDefined();
    expect(educationalProfile.pipelineConfiguration).toBeDefined();
    expect(educationalProfile.enhancementPolicy).toBe('additive');
    expect(educationalProfile.hardConstraints).toBeDefined();
  });

  test('should have valid recipe structure', () => {
    const recipesPath = join(process.cwd(), 'registry', 'workflow-recipes.json');
    const recipesData = readFileSync(recipesPath, 'utf-8');
    const recipes = JSON.parse(recipesData);
    
    const ugcRecipe = recipes.recipes.ugc_testimonial_recipe;
    
    expect(ugcRecipe).toBeDefined();
    expect(ugcRecipe.recipeId).toBe('ugc_testimonial_recipe');
    expect(ugcRecipe.recipeName).toBe('UGC Testimonial Workflow');
    expect(ugcRecipe.description).toBeDefined();
    expect(ugcRecipe.profileId).toBe('ugc_testimonial');
    expect(ugcRecipe.workflow).toBeDefined();
    expect(ugcRecipe.workflow.steps).toBeDefined();
    expect(Array.isArray(ugcRecipe.workflow.steps)).toBe(true);
    expect(ugcRecipe.workflow.steps.length).toBeGreaterThan(0);
  });

  test('should have consistent profile-recipe mapping', () => {
    const matrixPath = join(process.cwd(), 'registry', 'profile-pipeline-matrix.json');
    const recipesPath = join(process.cwd(), 'registry', 'workflow-recipes.json');
    
    const matrixData = readFileSync(matrixPath, 'utf-8');
    const recipesData = readFileSync(recipesPath, 'utf-8');
    
    const matrix = JSON.parse(matrixData);
    const recipes = JSON.parse(recipesData);
    
    // Check that recipes reference valid profiles
    Object.values(recipes.recipes).forEach((recipe: any) => {
      expect(matrix.profiles[recipe.profileId]).toBeDefined();
    });
  });

  test('should have valid hard constraints structure', () => {
    const matrixPath = join(process.cwd(), 'registry', 'profile-pipeline-matrix.json');
    const matrixData = readFileSync(matrixPath, 'utf-8');
    const matrix = JSON.parse(matrixData);
    
    const educationalProfile = matrix.profiles.educational_explainer;
    const constraints = educationalProfile.hardConstraints;
    
    expect(constraints).toBeDefined();
    expect(constraints.style).toBeDefined();
    expect(constraints.effects).toBeDefined();
    expect(constraints.audioStyle).toBeDefined();
    
    // Check style constraints
    expect(constraints.style.palette).toBeDefined();
    expect(Array.isArray(constraints.style.palette)).toBe(true);
    expect(constraints.style.visualStyle).toBe('minimalist');
    
    // Check effects constraints
    expect(constraints.effects.forbiddenTypes).toBeDefined();
    expect(Array.isArray(constraints.effects.forbiddenTypes)).toBe(true);
    expect(constraints.effects.forbiddenTypes).toContain('dramatic');
    
    // Check audio constraints
    expect(constraints.audioStyle.tone).toBe('professional');
    expect(constraints.audioStyle.voiceStyle).toBe('clear');
  });

  test('should have valid pipeline configuration', () => {
    const matrixPath = join(process.cwd(), 'registry', 'profile-pipeline-matrix.json');
    const matrixData = readFileSync(matrixPath, 'utf-8');
    const matrix = JSON.parse(matrixData);
    
    const educationalProfile = matrix.profiles.educational_explainer;
    const config = educationalProfile.pipelineConfiguration;
    
    expect(config).toBeDefined();
    expect(config.imageModel).toBe('nano_banana');
    expect(config.videoModel).toBe('veo3_fast');
    expect(config.ttsModel).toBe('elevenlabs_dialogue');
  });

  test('should have valid workflow steps', () => {
    const recipesPath = join(process.cwd(), 'registry', 'workflow-recipes.json');
    const recipesData = readFileSync(recipesPath, 'utf-8');
    const recipes = JSON.parse(recipesData);
    
    const ugcRecipe = recipes.recipes.ugc_testimonial_recipe;
    
    ugcRecipe.workflow.steps.forEach((step: any) => {
      expect(step.jobType).toBeDefined();
      expect(typeof step.jobType).toBe('string');
      expect(step.jobType.length).toBeGreaterThan(0);
    });
    
    // Check that we have the expected step types
    const stepTypes = ugcRecipe.workflow.steps.map((step: any) => step.jobType);
    expect(stepTypes).toContain('enhance_image_falai');
    expect(stepTypes).toContain('gen_video_falai');
    expect(stepTypes).toContain('tts_elevenlabs');
    expect(stepTypes).toContain('render_shotstack');
  });
});
