import { 
  applyDeterministicParser,
  applyDeterministicParserWithPlatform,
  applyCompleteDeterministicParser,
  validateSceneEnrichment,
  getEnrichmentStats
} from "../services/phase4/enrichedDeterministicParser";
import type { ProductionManifest } from "../types/production-manifest";

describe("Enhanced Deterministic Parser", () => {
  const baseManifest: ProductionManifest = {
    userId: "test_user",
    metadata: {
      intent: "video",
      durationSeconds: 30,
      aspectRatio: "16:9",
      platform: "youtube",
      language: "en"
    },
    scenes: [
      { 
        id: "s1", 
        durationSeconds: 5, 
        startAtSec: 0, 
        purpose: "hook", 
        visuals: [] 
      },
      { 
        id: "s2", 
        durationSeconds: 10, 
        startAtSec: 0, 
        purpose: "body", 
        visuals: [] 
      },
      { 
        id: "s3", 
        durationSeconds: 15, 
        startAtSec: 0, 
        purpose: "cta", 
        visuals: [] 
      }
    ],
    assets: {},
    audio: {
      ttsDefaults: { provider: "elevenlabs" },
      music: { cueMap: {} }
    },
    visuals: { defaultAspect: "16:9" },
    effects: { allowed: [] },
    consistency: {},
    jobs: []
  };

  describe("Basic Scene Enrichment", () => {
    it("should assign sequential startAtSec correctly", () => {
      const enriched = applyDeterministicParser(baseManifest);

      expect(enriched.scenes[0].startAtSec).toBe(0);
      expect(enriched.scenes[1].startAtSec).toBe(5);
      expect(enriched.scenes[2].startAtSec).toBe(15);
    });

    it("should assign orderingHint in sequence", () => {
      const enriched = applyDeterministicParser(baseManifest);

      expect(enriched.scenes[0].orderingHint).toBe(1);
      expect(enriched.scenes[1].orderingHint).toBe(2);
      expect(enriched.scenes[2].orderingHint).toBe(3);
    });

    it("should rotate transitions deterministically", () => {
      const enriched = applyDeterministicParser(baseManifest);

      const transitions = enriched.scenes.map(s => s.effects?.transitions?.[0]);
      expect(transitions).toEqual(["fade", "slide_left", "bokeh_transition"]);
    });

    it("should assign layeredEffects based on purpose", () => {
      const enriched = applyDeterministicParser(baseManifest);

      expect(enriched.scenes[0].effects?.layeredEffects).toContain("cinematic_zoom"); // hook
      expect(enriched.scenes[1].effects?.layeredEffects).toContain("parallax_scroll"); // body
      expect(enriched.scenes[2].effects?.layeredEffects).toContain("overlay_text"); // cta
    });

    it("should default to neutral_pro gradePreset", () => {
      const enriched = applyDeterministicParser(baseManifest);
      enriched.scenes.forEach(scene => {
        expect(scene.effects?.gradePreset).toBe("neutral_pro");
      });
    });
  });

  describe("Platform-Specific Optimization", () => {
    it("should apply TikTok-specific effects", () => {
      const tiktokManifest = {
        ...baseManifest,
        metadata: { ...baseManifest.metadata, platform: "tiktok" }
      };
      
      const enriched = applyDeterministicParserWithPlatform(tiktokManifest);

      // TikTok hook should have cinematic_zoom and bokeh_transition
      expect(enriched.scenes[0].effects?.layeredEffects).toContain("cinematic_zoom");
      expect(enriched.scenes[0].effects?.layeredEffects).toContain("bokeh_transition");

      // TikTok body should have slow_pan and data_highlight
      expect(enriched.scenes[1].effects?.layeredEffects).toContain("slow_pan");
      expect(enriched.scenes[1].effects?.layeredEffects).toContain("data_highlight");

      // TikTok CTA should have text_reveal and logo_reveal
      expect(enriched.scenes[2].effects?.layeredEffects).toContain("text_reveal");
      expect(enriched.scenes[2].effects?.layeredEffects).toContain("logo_reveal");
    });

    it("should apply YouTube-specific effects", () => {
      const youtubeManifest = {
        ...baseManifest,
        metadata: { ...baseManifest.metadata, platform: "youtube" }
      };
      
      const enriched = applyDeterministicParserWithPlatform(youtubeManifest);

      // YouTube hook should have parallax_scroll and overlay_text
      expect(enriched.scenes[0].effects?.layeredEffects).toContain("parallax_scroll");
      expect(enriched.scenes[0].effects?.layeredEffects).toContain("overlay_text");

      // YouTube body should have slow_pan and chart_animation
      expect(enriched.scenes[1].effects?.layeredEffects).toContain("slow_pan");
      expect(enriched.scenes[1].effects?.layeredEffects).toContain("chart_animation");
    });

    it("should apply Instagram-specific effects", () => {
      const instagramManifest = {
        ...baseManifest,
        metadata: { ...baseManifest.metadata, platform: "instagram" }
      };
      
      const enriched = applyDeterministicParserWithPlatform(instagramManifest);

      // Instagram hook should have cinematic_zoom and lens_flare
      expect(enriched.scenes[0].effects?.layeredEffects).toContain("cinematic_zoom");
      expect(enriched.scenes[0].effects?.layeredEffects).toContain("lens_flare");

      // Instagram body should have slow_pan and overlay_text
      expect(enriched.scenes[1].effects?.layeredEffects).toContain("slow_pan");
      expect(enriched.scenes[1].effects?.layeredEffects).toContain("overlay_text");
    });
  });

  describe("Cinematic Level Enhancement", () => {
    it("should apply basic cinematic level effects", () => {
      const basicManifest = {
        ...baseManifest,
        metadata: { ...baseManifest.metadata, cinematicLevel: "basic", platform: "youtube" }
      };
      
      const enriched = applyCompleteDeterministicParser(basicManifest);

      // Basic level should have simpler effects (using platform optimization since cinematicLevel is basic)
      expect(enriched.scenes[0].effects?.layeredEffects).toContain("parallax_scroll"); // YouTube hook
      expect(enriched.scenes[0].effects?.layeredEffects).toContain("overlay_text"); // YouTube hook
      expect(enriched.scenes[1].effects?.layeredEffects).toContain("slow_pan"); // YouTube body
      expect(enriched.scenes[1].effects?.layeredEffects).toContain("chart_animation"); // YouTube body
    });

    it("should apply pro cinematic level effects", () => {
      const proManifest = {
        ...baseManifest,
        metadata: { ...baseManifest.metadata, cinematicLevel: "pro" }
      };
      
      const enriched = applyCompleteDeterministicParser(proManifest);

      // Pro level should have more complex effects
      expect(enriched.scenes[0].effects?.layeredEffects).toContain("cinematic_zoom");
      expect(enriched.scenes[0].effects?.layeredEffects).toContain("lens_flare");
      expect(enriched.scenes[0].effects?.layeredEffects).toContain("overlay_text");

      expect(enriched.scenes[1].effects?.layeredEffects).toContain("parallax_scroll");
      expect(enriched.scenes[1].effects?.layeredEffects).toContain("data_highlight");
      expect(enriched.scenes[1].effects?.layeredEffects).toContain("slow_pan");

      expect(enriched.scenes[2].effects?.layeredEffects).toContain("bokeh_transition");
      expect(enriched.scenes[2].effects?.layeredEffects).toContain("text_reveal");
      expect(enriched.scenes[2].effects?.layeredEffects).toContain("logo_reveal");
    });
  });

  describe("Timeline Continuity", () => {
    it("should handle scenes with existing startAtSec", () => {
      const manifestWithTiming = {
        ...baseManifest,
        scenes: [
          { ...baseManifest.scenes[0], startAtSec: 0, durationSeconds: 3 },
          { ...baseManifest.scenes[1], startAtSec: 3, durationSeconds: 7 },
          { ...baseManifest.scenes[2], startAtSec: 10, durationSeconds: 12 }
        ]
      };

      const enriched = applyDeterministicParser(manifestWithTiming);

      // Should preserve existing timing
      expect(enriched.scenes[0].startAtSec).toBe(0);
      expect(enriched.scenes[1].startAtSec).toBe(3);
      expect(enriched.scenes[2].startAtSec).toBe(10);
    });

    it("should recalculate startAtSec for scenes without timing", () => {
      const manifestWithoutTiming = {
        ...baseManifest,
        scenes: [
          { ...baseManifest.scenes[0], startAtSec: 0, durationSeconds: 4 },
          { ...baseManifest.scenes[1], startAtSec: 0, durationSeconds: 8 }, // Should be recalculated
          { ...baseManifest.scenes[2], startAtSec: 0, durationSeconds: 6 }  // Should be recalculated
        ]
      };

      const enriched = applyDeterministicParser(manifestWithoutTiming);

      expect(enriched.scenes[0].startAtSec).toBe(0);
      expect(enriched.scenes[1].startAtSec).toBe(4);
      expect(enriched.scenes[2].startAtSec).toBe(12);
    });
  });

  describe("Effect Preservation", () => {
    it("should preserve existing effects when present", () => {
      const manifestWithEffects = {
        ...baseManifest,
        scenes: [
          {
            ...baseManifest.scenes[0],
            effects: {
              transitions: ["custom_transition"],
              layeredEffects: ["custom_effect"],
              gradePreset: "custom_grade"
            }
          }
        ]
      };

      const enriched = applyDeterministicParser(manifestWithEffects);

      expect(enriched.scenes[0].effects?.transitions).toEqual(["custom_transition"]);
      expect(enriched.scenes[0].effects?.layeredEffects).toEqual(["custom_effect"]);
      expect(enriched.scenes[0].effects?.gradePreset).toBe("custom_grade");
    });

    it("should add default effects when missing", () => {
      const manifestWithoutEffects = {
        ...baseManifest,
        scenes: [
          { ...baseManifest.scenes[0], effects: undefined }
        ]
      };

      const enriched = applyDeterministicParser(manifestWithoutEffects);

      expect(enriched.scenes[0].effects?.transitions).toEqual(["fade"]);
      expect(enriched.scenes[0].effects?.layeredEffects).toEqual(["cinematic_zoom"]);
      expect(enriched.scenes[0].effects?.gradePreset).toBe("neutral_pro");
    });
  });

  describe("Validation", () => {
    it("should validate correct scene enrichment", () => {
      const enriched = applyDeterministicParser(baseManifest);
      const validation = validateSceneEnrichment(enriched.scenes);

      expect(validation.isValid).toBe(true);
      expect(validation.errors).toHaveLength(0);
    });

    it("should detect timeline overlaps", () => {
      const overlappingScenes = [
        { ...baseManifest.scenes[0], startAtSec: 0, durationSeconds: 10 },
        { ...baseManifest.scenes[1], startAtSec: 5, durationSeconds: 10 } // Overlaps with scene 0
      ];

      const validation = validateSceneEnrichment(overlappingScenes);

      expect(validation.isValid).toBe(false);
      expect(validation.errors).toContain("Scene s1 overlaps with s2");
    });

    it("should detect missing ordering hints", () => {
      const manifestWithoutOrdering = {
        ...baseManifest,
        scenes: [
          { ...baseManifest.scenes[0], orderingHint: 1 },
          { ...baseManifest.scenes[1], orderingHint: undefined }, // Missing ordering hint
          { ...baseManifest.scenes[2], orderingHint: 3 }
        ]
      };

      const validation = validateSceneEnrichment(manifestWithoutOrdering.scenes);

      expect(validation.isValid).toBe(false);
      expect(validation.errors).toContain("Some scenes are missing orderingHint");
    });

    it("should detect non-sequential ordering hints", () => {
      const scenesWithBadOrdering = [
        { ...baseManifest.scenes[0], orderingHint: 1 },
        { ...baseManifest.scenes[1], orderingHint: 3 }, // Should be 2
        { ...baseManifest.scenes[2], orderingHint: 2 }  // Should be 3
      ];

      const validation = validateSceneEnrichment(scenesWithBadOrdering);

      expect(validation.isValid).toBe(false);
      expect(validation.errors.some(error => error.includes("OrderingHint sequence is not sequential"))).toBe(true);
    });
  });

  describe("Statistics", () => {
    it("should provide accurate enrichment statistics", () => {
      const enriched = applyDeterministicParser(baseManifest);
      const stats = getEnrichmentStats(enriched.scenes);


      expect(stats.totalScenes).toBe(3);
      expect(stats.scenesWithEffects).toBe(3);
      expect(stats.scenesWithOrderingHint).toBe(3);
      expect(stats.totalDuration).toBe(30);
      expect(stats.averageSceneDuration).toBe(10);

      // Check effect type counts based on actual results
      expect(stats.effectTypes["cinematic_zoom"]).toBe(2); // hook scene + cta scene
      expect(stats.effectTypes["parallax_scroll"]).toBe(1); // body scene
      expect(stats.effectTypes["overlay_text"]).toBe(1); // cta scene only

      // Check transition type counts
      expect(stats.transitionTypes["fade"]).toBe(1);
      expect(stats.transitionTypes["slide_left"]).toBe(1);
      expect(stats.transitionTypes["bokeh_transition"]).toBe(1);
    });

    it("should handle empty scenes array", () => {
      const stats = getEnrichmentStats([]);

      expect(stats.totalScenes).toBe(0);
      expect(stats.scenesWithEffects).toBe(0);
      expect(stats.scenesWithOrderingHint).toBe(0);
      expect(stats.totalDuration).toBe(0);
      expect(stats.averageSceneDuration).toBe(0);
      expect(Object.keys(stats.effectTypes)).toHaveLength(0);
      expect(Object.keys(stats.transitionTypes)).toHaveLength(0);
    });
  });

  describe("Edge Cases", () => {
    it("should handle single scene", () => {
      const singleSceneManifest = {
        ...baseManifest,
        scenes: [baseManifest.scenes[0]]
      };

      const enriched = applyDeterministicParser(singleSceneManifest);

      expect(enriched.scenes).toHaveLength(1);
      expect(enriched.scenes[0].startAtSec).toBe(0);
      expect(enriched.scenes[0].orderingHint).toBe(1);
      expect(enriched.scenes[0].effects?.transitions).toEqual(["fade"]);
    });

    it("should handle empty scenes array", () => {
      const emptyManifest = {
        ...baseManifest,
        scenes: []
      };

      const enriched = applyDeterministicParser(emptyManifest);

      expect(enriched.scenes).toHaveLength(0);
    });

    it("should handle scenes with zero duration", () => {
      const zeroDurationManifest = {
        ...baseManifest,
        scenes: [
          { ...baseManifest.scenes[0], durationSeconds: 0 },
          { ...baseManifest.scenes[1], durationSeconds: 5 }
        ]
      };

      const enriched = applyDeterministicParser(zeroDurationManifest);

      expect(enriched.scenes[0].startAtSec).toBe(0);
      expect(enriched.scenes[1].startAtSec).toBe(0); // Should start at 0 since previous scene has 0 duration
    });

    it("should handle unknown scene purposes", () => {
      const unknownPurposeManifest = {
        ...baseManifest,
        scenes: [
          { ...baseManifest.scenes[0], purpose: "unknown_purpose" }
        ]
      };

      const enriched = applyDeterministicParser(unknownPurposeManifest);

      // Should default to cinematic_zoom for unknown purposes
      expect(enriched.scenes[0].effects?.layeredEffects).toEqual(["cinematic_zoom"]);
    });
  });

  describe("Integration with Existing Parser", () => {
    it("should work with existing parseHumanPlanToDraftManifest output", () => {
      // Simulate output from existing parser
      const existingParserOutput: Partial<ProductionManifest> = {
        userId: "test_user",
        metadata: {
          intent: "video",
          durationSeconds: 30,
          aspectRatio: "16:9",
          platform: "youtube",
          language: "en"
        },
        scenes: [
          {
            id: "s1",
            startAtSec: 0,
            durationSeconds: 10,
            purpose: "hook",
            narration: "Welcome to our video",
            visuals: []
          }
        ],
        assets: {},
        audio: {
          ttsDefaults: { provider: "elevenlabs" },
          music: { cueMap: {} }
        },
        visuals: { defaultAspect: "16:9" },
        effects: { allowed: [] },
        consistency: {},
        jobs: []
      };

      // Convert to full manifest and enrich
      const fullManifest = existingParserOutput as ProductionManifest;
      const enriched = applyDeterministicParser(fullManifest);

      expect(enriched.scenes[0].orderingHint).toBe(1);
      expect(enriched.scenes[0].effects?.transitions).toEqual(["fade"]);
      expect(enriched.scenes[0].effects?.layeredEffects).toEqual(["cinematic_zoom"]);
    });
  });
});
