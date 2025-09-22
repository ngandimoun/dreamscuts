# Nano Banana Advanced Capabilities Guide

## 🌟 Overview

Nano Banana Enhanced is a powerful AI image generation model based on Google's Gemini 2.5 Flash Image with 11 foundational capabilities plus advanced cinematic photography, emotional storytelling, and complex scene composition features. This guide showcases the model's exceptional ability to create photorealistic portraits, cinematic compositions, and sophisticated visual narratives.

## 🎯 Enhanced Capabilities

### **Cinematic Photography Mastery**
- **After-the-rain atmospheric scenes** with blue hour lighting
- **Professional studio portraits** with dramatic lighting
- **Vintage 8K grainy aesthetics** with nostalgic mood
- **Cinematic black and white** color grading
- **Hyper-realistic compositions** with luxury editorial vibe

### **Complex Scene Composition**
- **Therapy room visualization** with dual-age characters
- **Holographic projection scenes** with futuristic elements
- **Reflection and mirror work** with perfect symmetry
- **Collage and montage creation** with vintage aesthetics
- **Typographic illustration** with object-shaped text

### **Emotional Storytelling**
- **Nostalgic mood creation** with vintage Polaroid collages
- **Emotional therapy room scenes** with dual perspectives
- **Romantic and ethereal** portrait compositions
- **Dreamy atmospheric scenes** with wind and movement
- **Cinematic goodbye scenes** with emotional depth

## 🎨 Advanced Prompt Examples

### **1. Cinematic Rooftop Scene (Your Featured Example)**

```typescript
const rooftopResult = await nanoBanana.generateImage({
  prompt: {
    concept: "After-the-rain school rooftop at blue hour; quiet cinematic goodbye.",
    subject: "Adult Korean woman (not a minor) in school-style blazer, knit vest, tie, pleated skirt; knee-high socks; polished black loafers; earbuds plugged to phone.",
    pose: "full-body by the chain-link fence; one hand holding phone at side, the other resting on fence; calm, direct gaze.",
    environment: {
      setting: "concrete rooftop with painted court arcs and shallow puddles reflecting city neon; chain-link fence; metal stairwell door ajar; distant skyline and passing train lights.",
      weather_time: "rain just ended; thin mist; teal-to-warm sky gradient.",
      props_micro: [
        "paper timetable taped to fence, edges fluttering",
        "single chalk piece near her loafer",
        "on wet concrete near her shoes: a chalk smiling face and the handwritten phrase 'i miss you' (lowercase), slightly rain-smeared yet legible",
        "spinning roof vent",
        "folded umbrella against railing"
      ]
    },
    lighting: {
      key: "ambient blue-hour sky",
      rim: "warm sodium rim from stairwell door behind her",
      practicals: "city windows and rooftop safety lamp reflecting in puddles",
      accents: "phone screen glow on fingers; crisp eye catchlights; breeze lifts hair tips"
    },
    camera: {
      lens_mm: 35,
      aperture: 2.0,
      iso: 200,
      shutter_speed: "1/160",
      angle: "slight low angle to include sky and fence leading lines",
      focus: "sharp on face; shoes clearly resolved; background gently soft",
      framing: "vertical full-body with headroom; include chalk writing at feet"
    },
    grade: "cinematic teal–orange; low-contrast film curve; subtle grain 6–8; clean blacks; no clipped highlights.",
    emotion_notes: "nostalgia + forward motion—storm passed, city waking.",
    output: { resolution: "2048x2560", format: "png" }
  },
  negative: [
    "any additional text overlays or watermarks (the ONLY allowed text is the chalk 'i miss you')",
    "plastic skin, cartoon look, HDR halos, banding",
    "warped anatomy or proportions"
  ]
});
```

**Key Elements Showcased:**
- Complex environmental storytelling
- Detailed lighting specifications
- Technical camera parameters
- Emotional narrative through visual elements
- Micro-details that enhance storytelling
- Professional color grading specifications

### **2. Studio Portrait with Cinematic Black & White**

```typescript
const studioResult = await nanoBanana.generateImage({
  prompt: "Make this a studio portrait. Adjust the skin tone and give it a cinematic black-and-white color grade. The man is wearing a black shirt and sitting on the back side of a chair. Change the photo angle from eye level. Use a black background. The photo should look realistic in 8K without any pixel loss.",
  style: "cinematic-black-white",
  resolution: "8K"
});
```

**Key Elements:**
- Professional studio setup
- Cinematic black and white grading
- 8K resolution specification
- Angle and composition control
- Realistic rendering requirements

### **3. Stickwoman Character with 3D Head**

```typescript
const stickwomanResult = await nanoBanana.generateImage({
  prompt: "A stickwoman character with a photorealistic 3D-rendered female head is taking on her couch with a laptop. Created Using: digital chalkboard-style concept illustration with 3D head rendering, white chalk-like vector linework for body on textured navy surface, soft spotlight simulating classroom lighting, dynamic composition with exaggerated body language and joyful posture, slightly top-down camera perspective, subtle ambient shadows, clean background texture simulating real chalk residue, minimalistic educational aesthetic blended with character-driven visual storytelling",
  style: "educational-aesthetic",
  resolution: "4K"
});
```

**Key Elements:**
- Hybrid 2D/3D composition
- Educational aesthetic design
- Dynamic body language
- Chalkboard texture simulation
- Character-driven storytelling

### **4. Hyper-Realistic Cinematic Portrait**

```typescript
const hyperrealisticResult = await nanoBanana.generateImage({
  prompt: "Hyper-realistic cinematic portrait on a deep burgundy backdrop. Maroon velvet blazer, black silk shirt, slim trousers. Leaning on elegant chair, one arm draped, confident gaze. Rich waves with highlights. Golden spotlight, dramatic shadows, ultra-detailed fabrics, skin tones, luxury editorial vibe. 85mm lens, 9:16 Instagram style.",
  style: "luxury-editorial",
  aspect_ratio: "9:16",
  resolution: "4K"
});
```

**Key Elements:**
- Luxury editorial aesthetic
- Detailed fabric and material rendering
- Professional lighting setup
- Instagram-optimized aspect ratio
- Ultra-realistic detail capture

### **5. Vintage 8K Grainy Portrait**

```typescript
const vintageResult = await nanoBanana.generateImage({
  prompt: "Retro vintage 8K grainy bright portrait of [insert your face reference], wearing a pastel green linen shirt with white linen pants, holding a rose. Dreamy 90s romantic film feel, windy atmosphere, solid wall and dramatic deep shadows. On the wall appears the shadow silhouette of a woman in traditional abaya with dupatta softly flowing in the wind. Emotional nostalgic mood.",
  style: "vintage-8k-grainy",
  resolution: "8K"
});
```

**Key Elements:**
- Vintage 90s aesthetic
- 8K grainy texture
- Wind and movement effects
- Shadow silhouette composition
- Emotional nostalgic mood

### **6. Holographic Projection Scene**

```typescript
const holographicResult = await nanoBanana.generateImage({
  prompt: "A man looking intently at a holographic projection of himself, which is emanating from a small device on a table. The man has dark hair and a beard, and he is wearing a dark blue t-shirt and a watch. His expression is one of curiosity and slight confusion. The holographic figure is glowing blue and appears to be in an active pose, gesturing with one hand. The background is a slightly blurred indoor setting, possibly a home or office",
  style: "holographic",
  resolution: "4K"
});
```

**Key Elements:**
- Futuristic holographic effects
- Dual character composition
- Emotional expression capture
- Indoor environmental context
- Blue glow lighting effects

### **7. Ethereal Reflection Portrait**

```typescript
const etherealResult = await nanoBanana.generateImage({
  prompt: "A dreamy, ultra-realistic portrait of a handsome man lying gracefully beside white lilies, his head resting gently on his arms, reflected perfectly on a glossy black surface. Soft cinematic lighting highlights his glowing skin and sharp yet delicate facial features, with slightly wet strands of hair falling naturally across his forehead. The mood is ethereal, romantic, artistic, with a serene atmosphere. High detail, professional studio photography, 8K resolution.",
  style: "ethereal-romantic",
  resolution: "8K"
});
```

**Key Elements:**
- Perfect reflection symmetry
- Ethereal romantic mood
- Professional studio quality
- 8K high detail
- Soft cinematic lighting

### **8. Therapy Room Dual-Age Visualization**

```typescript
const therapyResult = await nanoBanana.generateImage({
  prompt: "Use the two uploaded photos for likeness: Adult reference: [ADULT_PHOTO] Child reference: [CHILD_PHOTO] Photorealistic minimalist therapy room; light walls, grey sofa, wooden coffee table with a tissue box, notebook and a glass of water, simple frame and floor lamp, soft natural daylight. The same person at two ages sits side-by-side: adult on the left speaking with open hands; child on the right listening with head slightly down. Both wear matching [OUTFIT] (same color & style). Clean studio vibe, centered composition, shallow depth of field, 50mm look, 4K, vertical 3:4. No extra people, no text, no watermark.",
  style: "therapy-room",
  aspect_ratio: "3:4",
  resolution: "4K"
});
```

**Key Elements:**
- Dual-age character composition
- Minimalist therapy room setting
- Matching outfit consistency
- Professional therapy environment
- Clean studio aesthetic

### **9. Vintage Polaroid Collage**

```typescript
const collageResult = await nanoBanana.generateImage({
  prompt: "Create an artistic collage of 6 vintage Polaroid photos, attached with a decorative rope and mini clothespins, like a home photo gallery. Each Polaroid frame has a slight fading and an old paper effect. The background is a soft pastel wall with light shadows, creating a cozy and creatively chaotic atmosphere. Emotions and poses: Light laughter — eyes closed, natural joy. Dreamy gaze upwards, relaxed pose. Playful wink. Calm smile with a head tilted to the side. Dynamic gesture hands raised high, full of energy. Romantic half-glance over the shoulder. The atmosphere is an art-retro style with elements of a '70s fashion magazine, soft diffused lighting, and muted warm and golden tones. Each photograph looks like a unique behind-the-scenes shot, with a touch of nostalgia and a sense of personal history.",
  style: "vintage-collage",
  resolution: "4K"
});
```

**Key Elements:**
- 6-photo collage composition
- Vintage Polaroid aesthetics
- Multiple emotional expressions
- 70s fashion magazine style
- Nostalgic personal history feel

### **10. Typographic Illustration**

```typescript
const typographicResult = await nanoBanana.generateImage({
  prompt: "Create a typographic illustration shaped like a {OBJECT}, where the text itself forms the shape — bold and playful lettering style that fills the entire silhouette — letters adapt fluidly to the curves and contours of the object — vibrant and contrasting color palette that fits the theme — background is solid and enhances the focus on the main shape — vector-style, clean, high resolution, poster format, 1:1 aspect ratio.",
  style: "typographic",
  aspect_ratio: "1:1",
  resolution: "4K"
});
```

**Key Elements:**
- Text-formed object shapes
- Fluid letter adaptation
- Vibrant color palettes
- Vector-style clean design
- Poster format optimization

## 🔧 Advanced Prompt Techniques

### **Structured Prompt Format**

Use the structured format for complex scenes:

```typescript
{
  "prompt": {
    "concept": "Main concept or theme",
    "subject": "Detailed subject description",
    "pose": "Specific pose and positioning",
    "environment": {
      "setting": "Main environment description",
      "weather_time": "Atmospheric conditions",
      "props_micro": ["Detailed micro-elements"]
    },
    "lighting": {
      "key": "Main lighting source",
      "rim": "Rim lighting details",
      "practicals": "Practical lighting elements",
      "accents": "Accent lighting details"
    },
    "camera": {
      "lens_mm": 35,
      "aperture": 2.0,
      "iso": 200,
      "shutter_speed": "1/160",
      "angle": "Camera angle description",
      "focus": "Focus specifications",
      "framing": "Composition details"
    },
    "grade": "Color grading specifications",
    "emotion_notes": "Emotional tone and mood",
    "output": { "resolution": "2048x2560", "format": "png" }
  },
  "negative": ["Elements to avoid"]
}
```

### **Lightroom-Style Grading Specifications**

Include professional color grading details:

```typescript
// Basic Settings
"Temp 5000 | Tint +8, Exposure +0.30, Contrast +12, Highlights −20, Shadows +25, Whites +14, Blacks −12, Texture +10, Clarity +8, Dehaze +6, Vibrance +18, Saturation −4"

// Tone Curve
"Tone Curve (filmic S + slight fade), RGB: lifted blacks, soft S, Red: 0,0 → 64,58 → 128,128 → 192,196 → 255,255"

// HSL Adjustments
"Hue: Red +5, Orange −2, Yellow −10, Green −20, Aqua −10, Blue −20, Sat: Red −5, Orange +4, Yellow −25, Green −40, Aqua +8, Blue −18"

// Color Grading
"Shadows 200° / +12, Midtones 180° / +8, Highlights 38° / +20, Blending 50, Balance +10"

// Effects
"Grain 12 (Size 25, Roughness 50), Post-Crop Vignette −10 (Midpoint 35, Roundness +10, Feather 75, Highlight +10)"
```

### **Technical Photography Specifications**

Include detailed camera settings:

```typescript
// Lens and Camera Settings
"35mm lens, f/2.0, ISO 200, 1/160 shutter speed"

// Focus and Composition
"slight low angle to include sky and fence leading lines, sharp on face, shoes clearly resolved, background gently soft"

// Framing
"vertical full-body with headroom, include chalk writing at feet"
```

### **Emotional and Atmospheric Details**

Specify mood and atmosphere:

```typescript
// Emotional Tone
"nostalgia + forward motion—storm passed, city waking"

// Atmospheric Conditions
"rain just ended, thin mist, teal-to-warm sky gradient"

// Micro-details for Storytelling
"paper timetable taped to fence, edges fluttering, single chalk piece near her loafer, on wet concrete near her shoes: a chalk smiling face and the handwritten phrase 'i miss you'"
```

## 🎬 Style Categories

### **Cinematic Photography**
- **Use For**: Professional photography, dramatic scenes, emotional storytelling
- **Key Elements**: Technical camera specs, lighting setup, color grading
- **Example**: "Cinematic teal–orange; low-contrast film curve; subtle grain 6–8"

### **Studio Portrait**
- **Use For**: Professional headshots, commercial photography, clean compositions
- **Key Elements**: Controlled lighting, clean backgrounds, professional quality
- **Example**: "Black background, cinematic black-and-white color grade, 8K resolution"

### **Vintage Aesthetic**
- **Use For**: Nostalgic content, retro styling, period-specific looks
- **Key Elements**: Grain texture, period-appropriate styling, nostalgic mood
- **Example**: "Retro vintage 8K grainy bright portrait, dreamy 90s romantic film feel"

### **Holographic Effects**
- **Use For**: Futuristic scenes, sci-fi content, technological themes
- **Key Elements**: Blue glow effects, projection elements, futuristic settings
- **Example**: "Holographic projection emanating from device, glowing blue figure"

### **Reflection Work**
- **Use For**: Symmetrical compositions, artistic effects, mirror imagery
- **Key Elements**: Perfect reflections, glossy surfaces, symmetrical composition
- **Example**: "Reflected perfectly on a glossy black surface, perfect symmetry"

### **Collage and Montage**
- **Use For**: Multiple image compositions, vintage aesthetics, personal history
- **Key Elements**: Multiple frames, vintage effects, nostalgic atmosphere
- **Example**: "6 vintage Polaroid photos, decorative rope and mini clothespins"

### **Typographic Illustration**
- **Use For**: Text-based designs, poster creation, creative typography
- **Key Elements**: Text-formed shapes, fluid lettering, vibrant colors
- **Example**: "Text itself forms the shape, letters adapt fluidly to curves"

## 🎯 Use Case Applications

### **1. Professional Photography**
- Studio portraits with cinematic grading
- Commercial headshots with luxury aesthetic
- Product photography with perfect detail capture
- Architectural visualization with atmospheric lighting

### **2. Cinematic Content Creation**
- After-the-rain atmospheric scenes
- Blue hour photography with city reflections
- Emotional storytelling through visual composition
- Professional color grading and post-processing

### **3. Creative and Artistic Projects**
- Vintage Polaroid collage creation
- Typographic illustration design
- Holographic and futuristic scene composition
- Reflection and mirror work for artistic effects

### **4. Therapeutic and Educational Content**
- Therapy room visualization with dual-age characters
- Educational character design with 3D/2D hybrid
- Emotional narrative through visual storytelling
- Professional therapy environment creation

### **5. Commercial and Marketing**
- Luxury editorial photography
- Brand storytelling through visual composition
- Product placement with perfect lighting
- Lifestyle photography with emotional depth

## 💡 Best Practices

### **Prompt Construction**
1. **Use Structured Format**: Break down complex scenes into organized components
2. **Include Technical Specs**: Add camera settings, lighting details, and color grading
3. **Specify Emotional Tone**: Define the mood and atmosphere clearly
4. **Add Micro-details**: Include small elements that enhance storytelling
5. **Use Negative Prompts**: Specify what to avoid for better results

### **Style Selection**
1. **Match Style to Content**: Choose appropriate style for the intended use
2. **Consider Resolution**: Use 8K for detail-heavy content, 4K for most applications
3. **Plan Composition**: Think about aspect ratio and framing requirements
4. **Test Different Approaches**: Experiment with various prompt structures

### **Quality Optimization**
1. **Use Professional Terminology**: Include technical photography terms
2. **Specify Color Grading**: Add Lightroom-style grading specifications
3. **Include Atmospheric Details**: Add weather, lighting, and environmental conditions
4. **Test Different Styles**: Experiment with various aesthetic approaches

## 🚀 Advanced Workflows

### **Cinematic Scene Creation Workflow**
1. **Define the Concept**: Identify the main theme and emotional tone
2. **Plan the Environment**: Design the setting with atmospheric details
3. **Specify Technical Details**: Include camera settings and lighting
4. **Add Micro-details**: Include small elements that enhance storytelling
5. **Apply Color Grading**: Specify professional post-processing details

### **Portrait Enhancement Workflow**
1. **Choose the Style**: Select appropriate portrait style (studio, vintage, etc.)
2. **Define Lighting**: Specify lighting setup and mood
3. **Set Technical Parameters**: Include camera settings and resolution
4. **Add Emotional Elements**: Include mood and atmosphere details
5. **Apply Post-Processing**: Specify color grading and effects

### **Complex Composition Workflow**
1. **Plan the Layout**: Design the overall composition structure
2. **Define Elements**: Specify all visual elements and their relationships
3. **Set Environmental Context**: Include setting and atmospheric details
4. **Add Technical Specs**: Include camera and lighting specifications
5. **Refine Details**: Add micro-elements and finishing touches

## 📊 Performance Optimization

### **Resolution Selection**
- **8K**: Best for detail-heavy content, professional photography, print applications
- **4K**: Good balance for most applications, social media, web content
- **1080p**: Suitable for quick tests and previews

### **Style Optimization**
- **Cinematic**: Best for dramatic scenes and professional photography
- **Studio Portrait**: Ideal for clean, professional headshots
- **Vintage**: Perfect for nostalgic and retro content
- **Holographic**: Great for futuristic and sci-fi themes

### **Prompt Efficiency**
- **Structured Format**: Use organized prompt structure for complex scenes
- **Technical Specs**: Include detailed camera and lighting specifications
- **Negative Prompts**: Specify what to avoid for better results
- **Micro-details**: Add small elements that enhance storytelling

## 🎨 Creative Applications

### **Artistic Projects**
- Cinematic scene creation with atmospheric lighting
- Vintage collage and montage composition
- Typographic illustration with creative text shapes
- Reflection and mirror work for artistic effects

### **Commercial Use**
- Professional studio photography with luxury aesthetic
- Product photography with perfect detail capture
- Brand storytelling through visual composition
- Lifestyle photography with emotional depth

### **Educational Content**
- Therapy room visualization for mental health education
- Character design for educational materials
- Complex scene composition for storytelling
- Professional environment creation for training

## 🔮 Future Possibilities

Nano Banana's advanced capabilities open up numerous creative possibilities:

- **Interactive Storytelling**: Create branching narrative visualizations
- **Professional Photography**: Generate studio-quality portraits and scenes
- **Commercial Innovation**: Create unique brand experiences and marketing content
- **Educational Revolution**: Transform complex concepts into visual narratives
- **Artistic Expression**: Develop new forms of visual storytelling and composition

## 📚 Conclusion

Nano Banana Enhanced represents a significant advancement in AI image generation, particularly in its ability to handle complex cinematic compositions, emotional storytelling, and professional photography techniques. By leveraging its strengths in structured prompt handling, technical specification support, and advanced scene composition, creators can produce sophisticated visual content that rivals professional photography and cinematic production.

The model's exceptional performance with detailed prompt structures, technical photography specifications, and emotional narrative visualization makes it an invaluable tool for photographers, filmmakers, marketers, educators, and artists seeking to push the boundaries of visual storytelling.

**Ready to explore Nano Banana's advanced capabilities? Start with the cinematic rooftop example and experiment with different styles and techniques to discover the full potential of this powerful model!**
