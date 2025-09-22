// app/test-production-planner-phase4/page.tsx
"use client";

import { useEffect, useState } from 'react';

export default function TestProductionPlannerPhase4() {
  const [results, setResults] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [manifestId, setManifestId] = useState<string | null>(null);
  const [manifestData, setManifestData] = useState<any>(null);
  const [jobsData, setJobsData] = useState<any[]>([]);

  const addResult = (message: string) => {
    setResults((prev) => [...prev, message]);
  };

  useEffect(() => {
    const runTests = async () => {
      addResult("--- Starting Production Planner Phase 4 Tests ---");

      const dummyUserId = "00000000-0000-0000-0000-000000000007";

      // Mock treatment text (from Phase 3 example)
      const mockTreatmentText = `# Production Plan: Build a Vid — 3-Step Data-Driven Social

## Overview
- Intent: Educational explainer video (short-form, professional tone)
- Duration: ~5 seconds total
- Aspect Ratio: Smart Auto (platform-optimized)
- Platform: Cross-platform (LinkedIn / TikTok)
- Language: English
- Tone: Serious, trustworthy, motivating

## Scenes
### Scene 1 — Hook (Step One: Pick Footage)
- Duration: ~2.0s
- Narration: "Step one: pick footage."
- Voice: ElevenLabs, clear professional male, mid-range tone
- Visuals:
  - Stock footage of an analyst at a sleek corporate desk opening a laptop
  - Onscreen UI: clean navy-white dashboard, subtle push-in toward the screen
  - Overlay text: Step 1: Pick clean market footage (top-left)
- Effects: Fade-in, gentle zoom, pointer highlight on clip thumbnail
- Music: Soft marimba/piano bed fades in; gentle whoosh at overlay reveal

### Scene 2 — Body (Step Two: Add Data)
- Duration: ~1.5s
- Narration: "Step two: add data."
- Voice: Same ElevenLabs voice (consistency enforced)
- Visuals:
  - Continuation of chosen footage (laptop as backbone)
  - Animated candlestick chart overlay on right side
  - KPI card pops in (example: "Q3 Revenue +7.2%")
  - Bottom ticker sliding in with finance headlines
  - Overlay text: Step 2: Add trusted data
- Effects: Dissolve-in for chart/KPI, slide-in ticker, KPI pulse highlight
- Music: Light upward motif accent on KPI highlight (continuation from Scene 1)

### Scene 3 — Outro (Step Three: Publish Confidently)
- Duration: ~1.5s
- Narration: "Step three: publish confidently."
- Voice: Same ElevenLabs voice (confidence, clarity)
- Visuals:
  - Smartphone mockup previewing final video in a social feed
  - Green Approved checkmark overlay, progress bar reaching 100%
  - Post button press → fade to brand end-card with logo
  - Overlay text: Step 3: Publish confidently
- Effects: Highlight ring on post button, zoom on checkmark, fade-out to end card
- Music: Soft resolution chime; tail-out into brand card

## Audio Arc
- Intro: Light, neutral educational bed (piano/marimba)
- Build: Slight lift during data overlays
- Outro: Gentle resolve + approval chime
- SFX: Whoosh for transitions, subtle UI ticks for overlays

## Consistency Rules
- Faces: Locked (no changes across scenes)
- Voice: Single ElevenLabs config, consistent across all steps
- Typography: Modern sans-serif, aligned with corporate style
- Color Palette: Navy, white, teal highlights
- Branding: End-card with logo placement, safe margins enforced`;

      // Mock inputs
      const mockInput = {
        studioBlueprintId: "00000000-0000-0000-0000-000000000001", // Dummy blueprint ID
        treatmentText: mockTreatmentText,
        analyzerJson: {
          id: "analyzer-mock-123",
          duration_seconds: 5,
          language: "en",
          aspect_ratio: "Smart Auto",
          platform: "social",
          user_intent_description: "Educational explainer video for data-driven social media."
        },
        refinerJson: {
          id: "refiner-mock-456",
          profile: "educational_explainer",
          effects: ["cinematic_zoom", "overlay_text", "fade"],
          style_direction: "professional",
          tone: "serious, trustworthy, motivating"
        },
        scriptJson: {
          id: "script-mock-789",
          duration_seconds: 5,
          language: "en",
          profile: "educational_explainer"
        },
        userUI: {
          userId: dummyUserId,
          durationSeconds: 5,
          aspectRatio: "Smart Auto",
          platform: "social",
          language: "en",
          tone: "professional"
        }
      };

      // Test 1: Phase 4 Processing
      addResult("\n--- Test 1: Phase 4 Processing ---");
      try {
        const response = await fetch('/api/production-planner/phase4', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(mockInput),
        });
        const data = await response.json();

        if (response.ok) {
          addResult(`✅ Phase 4 API: Successfully processed treatment. Manifest ID: ${data.manifestId}`);
          addResult(`   - Jobs created: ${data.jobCount}`);
          addResult(`   - Processing time: ${data.processingTimeMs}ms`);
          addResult(`   - Used repair: ${data.usedRepair ? 'Yes' : 'No'}`);
          if (data.warnings && data.warnings.length > 0) {
            addResult(`   - Warnings: ${data.warnings.join(', ')}`);
          }
          setManifestId(data.manifestId);
        } else {
          addResult(`❌ Phase 4 API: Failed to process treatment - ${data.error}`);
          if (data.details) {
            if (Array.isArray(data.details)) {
              data.details.forEach((detail: any) => addResult(`   - ${detail.path}: ${detail.message}`));
            } else {
              addResult(`   - Details: ${JSON.stringify(data.details)}`);
            }
          }
        }
      } catch (e: any) {
        addResult(`❌ Phase 4 API: Fetch error - ${e.message}`);
      }

      // Test 2: Retrieve Manifest and Jobs (if processing was successful)
      if (manifestId) {
        addResult("\n--- Test 2: Retrieving Manifest and Jobs ---");
        try {
          const response = await fetch(`/api/production-planner/phase4?manifestId=${manifestId}`);
          const data = await response.json();

          if (response.ok) {
            addResult(`✅ Retrieval API: Successfully retrieved manifest ${manifestId}.`);
            addResult(`   - Manifest status: ${data.manifest.status}`);
            addResult(`   - Jobs count: ${data.jobs.length}`);
            
            // Show job breakdown
            const jobTypes = data.jobs.reduce((acc: any, job: any) => {
              acc[job.type] = (acc[job.type] || 0) + 1;
              return acc;
            }, {});
            Object.entries(jobTypes).forEach(([type, count]) => {
              addResult(`   - ${type}: ${count} jobs`);
            });
            
            setManifestData(data.manifest);
            setJobsData(data.jobs);
          } else {
            addResult(`❌ Retrieval API: Failed to retrieve manifest - ${data.error}`);
          }
        } catch (e: any) {
          addResult(`❌ Retrieval API: Fetch error - ${e.message}`);
        }
      } else {
        addResult("Skipping retrieval test as no manifest was created.");
      }

      // Test 3: Validate Manifest Structure
      if (manifestData) {
        addResult("\n--- Test 3: Manifest Structure Validation ---");
        try {
          const manifest = manifestData.manifest_json;
          
          // Check required fields
          const requiredFields = ['userId', 'sourceRefs', 'metadata', 'scenes', 'assets', 'audio', 'jobs'];
          const missingFields = requiredFields.filter(field => !manifest[field]);
          
          if (missingFields.length === 0) {
            addResult("✅ Manifest Structure: All required fields present.");
          } else {
            addResult(`❌ Manifest Structure: Missing fields: ${missingFields.join(', ')}`);
          }
          
          // Check scenes
          if (manifest.scenes && Array.isArray(manifest.scenes)) {
            addResult(`✅ Scenes: ${manifest.scenes.length} scenes defined.`);
            manifest.scenes.forEach((scene: any, index: number) => {
              addResult(`   - Scene ${index + 1}: ${scene.durationSeconds}s, ${scene.visuals?.length || 0} visuals`);
            });
          } else {
            addResult("❌ Scenes: Invalid or missing scenes array.");
          }
          
          // Check jobs
          if (manifest.jobs && Array.isArray(manifest.jobs)) {
            addResult(`✅ Jobs: ${manifest.jobs.length} jobs defined.`);
            const renderJob = manifest.jobs.find((job: any) => job.type === 'render_shotstack');
            if (renderJob) {
              addResult(`   - Render job depends on ${renderJob.dependsOn?.length || 0} other jobs`);
            }
          } else {
            addResult("❌ Jobs: Invalid or missing jobs array.");
          }
          
        } catch (e: any) {
          addResult(`❌ Manifest Validation: Error - ${e.message}`);
        }
      } else {
        addResult("Skipping manifest validation as no manifest data was retrieved.");
      }

      addResult("\n--- Production Planner Phase 4 Tests Complete ---");
      setLoading(false);
    };

    runTests();
  }, [manifestId]); // Re-run if manifest ID changes

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Production Planner Phase 4 Test Results</h1>
      {loading ? (
        <p>Running tests...</p>
      ) : (
        <div className="space-y-6">
          <div className="bg-gray-100 p-4 rounded-md whitespace-pre-wrap font-mono text-sm">
            {results.map((result, index) => (
              <p key={index} className={result.startsWith('✅') ? 'text-green-700' : result.startsWith('❌') ? 'text-red-700' : 'text-gray-800'}>
                {result}
              </p>
            ))}
          </div>

          {manifestData && (
            <>
              <div>
                <h2 className="text-xl font-bold mb-2">Generated Manifest:</h2>
                <pre className="bg-white p-4 rounded-md border border-gray-300 overflow-auto max-h-96">
                  {JSON.stringify(manifestData.manifest_json, null, 2)}
                </pre>
              </div>
            </>
          )}

          {jobsData.length > 0 && (
            <>
              <div>
                <h2 className="text-xl font-bold mb-2">Generated Jobs ({jobsData.length} total):</h2>
                <div className="space-y-2">
                  {jobsData.map((job, index) => (
                    <div key={index} className="bg-white p-3 rounded border border-gray-200">
                      <div className="font-semibold">{job.job_id} ({job.type})</div>
                      <div className="text-sm text-gray-600">
                        Priority: {job.priority} | Status: {job.status}
                        {job.depends_on && job.depends_on.length > 0 && (
                          <span> | Depends on: {job.depends_on.join(', ')}</span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}
