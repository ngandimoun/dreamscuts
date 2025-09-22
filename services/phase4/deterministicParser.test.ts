// deterministicParser.test.ts
import { parseHumanPlanToDraftManifest } from "./deterministicParser";

describe("deterministicParser", () => {
  const samplePlan = `
  Language: en
  Duration: 60
  Platform: YouTube
  Aspect: 16:9
  Style: educational_explainer
  Tone: inspiring

  Scene 1:
    Purpose: hook
    Narration: Welcome to the future of education.
    Duration: 8 sec
    Effect: cinematic_zoom
    Asset: https://example.com/asset1.jpg

  Scene 2:
    Purpose: body
    Narration: Learn anytime, anywhere.
    Duration: 45 sec
    Effect: parallax_scroll

  Scene 3:
    Purpose: cta
    Narration: Join us today.
    Duration: 7 sec
    Effect: bokeh_transition
    Logo: https://example.com/logo.png

  Voice: confident
  VoiceId: eva
  Music: uplifting intro
  Music: motivational build
  Music: strong outro
  #3B82F6 #06B6D4
  Faces locked
  Voice consistent
  `;

  it("parses metadata correctly", () => {
    const draft = parseHumanPlanToDraftManifest("user_1", samplePlan);
    expect(draft.metadata?.platform).toBe("youtube");
    expect(draft.metadata?.durationSeconds).toBe(60);
  });

  it("extracts scenes", () => {
    const draft = parseHumanPlanToDraftManifest("user_1", samplePlan);
    expect(draft.scenes?.length).toBe(3);
    expect(draft.scenes?.[0].narration).toContain("Welcome to the future");
  });

  it("extracts assets", () => {
    const draft = parseHumanPlanToDraftManifest("user_1", samplePlan);
    expect(Object.keys(draft.assets || {}).length).toBeGreaterThan(0);
  });

  it("parses consistency rules", () => {
    const draft = parseHumanPlanToDraftManifest("user_1", samplePlan);
    expect(draft.consistency?.character_faces).toBe("locked");
    expect(draft.consistency?.voice_style).toBe("consistent");
  });

  it("generates jobs", () => {
    const draft = parseHumanPlanToDraftManifest("user_1", samplePlan);
    expect(draft.jobs?.some((j) => j.type === "tts")).toBe(true);
  });
});
