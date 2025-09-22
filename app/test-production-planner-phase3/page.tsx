"use client";

import { useEffect, useState } from 'react';
import { 
  CreateBlueprintRequest, 
  StudioBlueprint, 
  BlueprintGenerationInput 
} from '../../types/studio-blueprint';
import { validateBlueprintInput } from '../../validators/studio-blueprint';

export default function TestProductionPlannerPhase3() {
  const [results, setResults] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [generatedBlueprint, setGeneratedBlueprint] = useState<StudioBlueprint | null>(null);

  const addResult = (message: string) => {
    setResults((prev) => [...prev, message]);
  };

  useEffect(() => {
    const runTests = async () => {
      addResult("--- Starting Production Planner Phase 3 Tests ---");

      // Test 1: Input Validation
      addResult("\n--- Input Validation Tests ---");
      const testInput: BlueprintGenerationInput = {
        userIntent: "Create a 60-second educational video about the benefits of online learning",
        userAssets: [
          {
            id: "asset_1",
            type: "image",
            description: "Graduation photo of a student",
            url: "https://example.com/graduation.jpg"
          },
          {
            id: "asset_2", 
            type: "video",
            description: "Classroom discussion footage",
            url: "https://example.com/classroom.mp4"
          }
        ],
        constraints: {
          duration: 60,
          language: "English",
          aspectRatio: "16:9",
          platform: "YouTube",
          tone: "Professional"
        },
        options: {
          creativeLevel: "professional",
          includeMusicArc: true,
          includeConsistencyRules: true,
          maxScenes: 5
        }
      };

      const inputValidation = validateBlueprintInput(testInput);
      if (inputValidation.valid) {
        addResult("✅ Input Validation: Test input passes validation.");
      } else {
        addResult(`❌ Input Validation: Test input failed validation - ${inputValidation.error}`);
      }

      // Test 2: Studio Blueprint Generation
      addResult("\n--- Studio Blueprint Generation Test ---");
      const blueprintRequest: CreateBlueprintRequest = {
        userId: "00000000-0000-0000-0000-000000000001",
        input: testInput,
        options: {
          model: "gpt-5",
          temperature: 0.7,
          maxTokens: 4000
        }
      };

      try {
        addResult("🔄 Generating Studio Blueprint with GPT-5...");
        const response = await fetch('/api/production-planner/studio-blueprint', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(blueprintRequest),
        });

        const result = await response.json();

        if (result.success && result.data) {
          setGeneratedBlueprint(result.data);
          addResult(`✅ Studio Blueprint Generation: Successfully generated blueprint "${result.data.projectTitle}"`);
          addResult(`   - ID: ${result.data.id}`);
          addResult(`   - Status: ${result.data.status}`);
          addResult(`   - Quality Score: ${result.data.qualityScore || 'N/A'}`);
          addResult(`   - Processing Time: ${result.processingTimeMs}ms`);
          addResult(`   - Scenes: ${result.data.scenes.length}`);
          addResult(`   - Warnings: ${result.warnings?.length || 0}`);
          
          if (result.warnings && result.warnings.length > 0) {
            result.warnings.forEach((warning: string) => {
              addResult(`   - Warning: ${warning}`);
            });
          }
        } else {
          addResult(`❌ Studio Blueprint Generation: Failed - ${result.error}`);
        }
      } catch (error) {
        addResult(`❌ Studio Blueprint Generation: Network error - ${error}`);
      }

      // Test 3: Blueprint Retrieval
      if (generatedBlueprint) {
        addResult("\n--- Blueprint Retrieval Test ---");
        try {
          const response = await fetch(`/api/production-planner/studio-blueprint?id=${generatedBlueprint.id}`);
          const result = await response.json();

          if (result.success && result.data) {
            addResult(`✅ Blueprint Retrieval: Successfully retrieved blueprint "${result.data.projectTitle}"`);
            addResult(`   - Scenes: ${result.data.scenes.length}`);
            addResult(`   - Audio Arc: ${result.data.audioArc ? 'Present' : 'Missing'}`);
            addResult(`   - Consistency Rules: ${result.data.consistencyRules ? 'Present' : 'Missing'}`);
          } else {
            addResult(`❌ Blueprint Retrieval: Failed - ${result.error}`);
          }
        } catch (error) {
          addResult(`❌ Blueprint Retrieval: Network error - ${error}`);
        }
      }

      // Test 4: Status Update
      if (generatedBlueprint) {
        addResult("\n--- Status Update Test ---");
        try {
          const response = await fetch('/api/production-planner/studio-blueprint/status', {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              id: generatedBlueprint.id,
              status: 'reviewed',
              reviewData: {
                reviewedBy: 'test-user',
                feedback: 'Great creative direction!',
                suggestedChanges: ['Consider adding more visual variety in scene 2']
              }
            }),
          });

          const result = await response.json();

          if (result.success) {
            addResult(`✅ Status Update: Successfully updated blueprint status to 'reviewed'`);
          } else {
            addResult(`❌ Status Update: Failed - ${result.error}`);
          }
        } catch (error) {
          addResult(`❌ Status Update: Network error - ${error}`);
        }
      }

      // Test 5: User Blueprints List
      addResult("\n--- User Blueprints List Test ---");
      try {
        const response = await fetch('/api/production-planner/studio-blueprint?userId=00000000-0000-0000-0000-000000000001');
        const result = await response.json();

        if (result.success && result.data) {
          addResult(`✅ User Blueprints List: Retrieved ${result.data.length} blueprints for user`);
          result.data.forEach((blueprint: StudioBlueprint, index: number) => {
            addResult(`   ${index + 1}. "${blueprint.projectTitle}" (${blueprint.status})`);
          });
        } else {
          addResult(`❌ User Blueprints List: Failed - ${result.error}`);
        }
      } catch (error) {
        addResult(`❌ User Blueprints List: Network error - ${error}`);
      }

      addResult("\n--- Production Planner Phase 3 Tests Complete ---");
      setLoading(false);
    };

    runTests();
  }, []);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Production Planner Phase 3 Test Results</h1>
      <p className="text-gray-600 mb-4">
        Testing Studio Blueprint generation with GPT-5 reasoning model
      </p>
      
      {loading ? (
        <div className="flex items-center space-x-2">
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
          <p>Running tests...</p>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Test Results */}
          <div className="bg-gray-100 p-4 rounded-md">
            <h2 className="text-lg font-semibold mb-2">Test Results</h2>
            <div className="whitespace-pre-wrap font-mono text-sm">
              {results.map((result, index) => (
                <p 
                  key={index} 
                  className={
                    result.startsWith('✅') ? 'text-green-700' : 
                    result.startsWith('❌') ? 'text-red-700' : 
                    result.startsWith('🔄') ? 'text-blue-700' :
                    'text-gray-800'
                  }
                >
                  {result}
                </p>
              ))}
            </div>
          </div>

          {/* Generated Blueprint Details */}
          {generatedBlueprint && (
            <div className="bg-blue-50 p-4 rounded-md">
              <h2 className="text-lg font-semibold mb-2">Generated Studio Blueprint</h2>
              <div className="space-y-2 text-sm">
                <p><strong>Title:</strong> {generatedBlueprint.projectTitle}</p>
                <p><strong>Duration:</strong> {generatedBlueprint.overview.duration} seconds</p>
                <p><strong>Platform:</strong> {generatedBlueprint.overview.platform}</p>
                <p><strong>Tone:</strong> {generatedBlueprint.overview.tone}</p>
                <p><strong>Scenes:</strong> {generatedBlueprint.scenes.length}</p>
                
                <div className="mt-3">
                  <h3 className="font-medium">Scene Breakdown:</h3>
                  {generatedBlueprint.scenes.map((scene, index) => (
                    <div key={scene.id} className="ml-4 mt-1 p-2 bg-white rounded border">
                      <p><strong>Scene {index + 1}:</strong> {scene.purpose} ({scene.duration}s)</p>
                      <p><strong>Narration:</strong> "{scene.narration.substring(0, 100)}..."</p>
                      <p><strong>Visuals:</strong> {scene.visuals.length} elements</p>
                      <p><strong>Effects:</strong> {scene.effects.join(', ') || 'None'}</p>
                    </div>
                  ))}
                </div>

                <div className="mt-3">
                  <h3 className="font-medium">Audio Arc:</h3>
                  <p><strong>Intro:</strong> {generatedBlueprint.audioArc.intro.description}</p>
                  <p><strong>Build:</strong> {generatedBlueprint.audioArc.build.description}</p>
                  <p><strong>Outro:</strong> {generatedBlueprint.audioArc.outro.description}</p>
                  {generatedBlueprint.audioArc.soundEffects.length > 0 && (
                    <p><strong>SFX:</strong> {generatedBlueprint.audioArc.soundEffects.map(sfx => sfx.name).join(', ')}</p>
                  )}
                </div>

                <div className="mt-3">
                  <h3 className="font-medium">Consistency Rules:</h3>
                  <p><strong>Faces:</strong> {generatedBlueprint.consistencyRules.faces}</p>
                  <p><strong>Voice:</strong> {generatedBlueprint.consistencyRules.voice}</p>
                  <p><strong>Colors:</strong> {generatedBlueprint.consistencyRules.colorPalette.join(', ')}</p>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
