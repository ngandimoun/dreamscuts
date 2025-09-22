/**
 * Profile-Pipeline Matrix Loader
 * 
 * This module loads the profile-pipeline matrix configuration
 * that maps creative profiles to specific AI models and settings.
 */

import { readFileSync } from 'fs';
import { join } from 'path';

export interface ProfilePipelineMatrix {
  profiles: Record<string, ProfileConfig>;
}

export interface ProfileConfig {
  profileId: string;
  profileName: string;
  coreConcept: string;
  visualApproach: string;
  styleDirection: string;
  moodGuidance: string;
  pipelineConfiguration: {
    imageModel?: string;
    videoModel?: string;
    ttsModel?: string;
    lipSyncModel?: string;
    chartModel?: string;
    musicModel?: string;
    soundEffectsModel?: string;
  };
  enhancementPolicy: 'additive' | 'transform_lite';
  costLimits?: {
    maxCostPerJob?: number;
    maxTotalCost?: number;
  };
  timeouts?: {
    maxJobTimeout?: number;
    maxTotalTimeout?: number;
  };
  hardConstraints?: {
    style?: {
      palette?: string[];
      fonts?: string[];
      visualStyle?: string;
    };
    effects?: {
      maxIntensity?: number;
      allowedTypes?: string[];
      forbiddenTypes?: string[];
    };
    pacing?: {
      maxSpeed?: number;
      transitionStyle?: string;
    };
    audioStyle?: {
      tone?: string;
      musicIntensity?: number;
      voiceStyle?: string;
    };
    aspectRatio?: string;
    platform?: string;
  };
}

/**
 * Load the profile-pipeline matrix from the registry
 */
export async function loadProfilePipelineMatrix(): Promise<ProfilePipelineMatrix> {
  try {
    const matrixPath = join(process.cwd(), 'registry', 'profile-pipeline-matrix.json');
    const matrixData = readFileSync(matrixPath, 'utf-8');
    return JSON.parse(matrixData);
  } catch (error) {
    console.warn('Failed to load profile-pipeline matrix, using defaults:', error);
    return getDefaultMatrix();
  }
}

/**
 * Get default profile-pipeline matrix
 */
function getDefaultMatrix(): ProfilePipelineMatrix {
  return {
    profiles: {
      educational_explainer: {
        profileId: 'educational_explainer',
        profileName: 'Educational Explainer',
        coreConcept: 'Clear, educational content',
        visualApproach: 'Minimalist, clean design',
        styleDirection: 'Professional, accessible',
        moodGuidance: 'Calm, informative',
        pipelineConfiguration: {
          imageModel: 'nano_banana',
          videoModel: 'veo3_fast',
          ttsModel: 'elevenlabs_dialogue'
        },
        enhancementPolicy: 'additive',
        hardConstraints: {
          style: {
            palette: ['#FFFFFF', '#000000', '#CCCCCC'],
            visualStyle: 'minimalist'
          },
          effects: {
            forbiddenTypes: ['dramatic', 'cinematic_zoom']
          },
          audioStyle: {
            tone: 'professional',
            voiceStyle: 'clear'
          }
        }
      }
    }
  };
}
