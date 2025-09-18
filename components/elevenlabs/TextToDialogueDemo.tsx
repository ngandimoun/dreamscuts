/**
 * Text to Dialogue Demo Component
 * 
 * A React component demonstrating ElevenLabs Text to Dialogue functionality
 * with audio tags, multi-speaker conversations, and expressive dialogue generation.
 */

'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Loader2, Play, Pause, Square, Download, Volume2, Mic, Users, Sparkles } from 'lucide-react';
import { elevenLabs, dialogueManager, v3VoiceLibrary, languageManager, AudioUtils } from '@/lib/elevenlabs';
import type { AudioTag, DialogueSettings, V3Voice, LanguageInfo, LanguageCode } from '@/lib/elevenlabs';

interface AudioPlayer {
  play: () => Promise<void>;
  pause: () => void;
  stop: () => void;
  setVolume: (volume: number) => void;
  setPlaybackRate: (rate: number) => void;
  getDuration: () => number;
  getCurrentTime: () => number;
  setCurrentTime: (time: number) => void;
  onEnded: (callback: () => void) => void;
  onTimeUpdate: (callback: (currentTime: number) => void) => void;
  destroy: () => void;
}

export function TextToDialogueDemo() {
  // State management
  const [text, setText] = useState(`[excited] Okay, you are NOT going to believe this.

You know how I've been totally stuck on that short story?

Like, staring at the screen for HOURS, just... nothing?

[frustrated sigh] I was seriously about to just trash the whole thing. Start over.

Give up, probably. But then!

Last night, I was just doodling, not even thinking about it, right?

And this one little phrase popped into my head. Just... completely out of the blue.

And it wasn't even for the story, initially.

But then I typed it out, just to see. And it was like... the FLOODGATES opened!

Suddenly, I knew exactly where the character needed to go, what the ending had to be...

It all just CLICKED. [happy gasp] I stayed up till, like, 3 AM, just typing like a maniac.

Didn't even stop for coffee! [laughs] And it's... it's GOOD! Like, really good.

It feels so... complete now, you know? Like it finally has a soul.

I am so incredibly PUMPED to finish editing it now.

It went from feeling like a chore to feeling like... MAGIC. Seriously, I'm still buzzing!`);
  
  const [isGenerating, setIsGenerating] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [audioPlayer, setAudioPlayer] = useState<AudioPlayer | null>(null);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [usageStats, setUsageStats] = useState<any>(null);

  // Dialogue settings
  const [dialogueSettings, setDialogueSettings] = useState<DialogueSettings>({
    stability: 'natural',
    use_audio_tags: true,
    enhance_emotion: true,
    multi_speaker: false
  });

  // Audio tag management
  const [availableTags, setAvailableTags] = useState<AudioTag[]>([]);
  const [selectedTagCategory, setSelectedTagCategory] = useState<string>('emotions');
  const [selectedTag, setSelectedTag] = useState<string>('');

  // V3 Voice management
  const [v3Voices, setV3Voices] = useState<V3Voice[]>([]);
  const [selectedV3Voice, setSelectedV3Voice] = useState<V3Voice | null>(null);
  const [voiceCategory, setVoiceCategory] = useState<string>('DIALOGUE_EXCELLENT');

  // Language management
  const [supportedLanguages, setSupportedLanguages] = useState<LanguageInfo[]>([]);
  const [selectedLanguage, setSelectedLanguage] = useState<LanguageCode>('en');
  const [detectedLanguage, setDetectedLanguage] = useState<LanguageCode | null>(null);
  const [autoDetectLanguage, setAutoDetectLanguage] = useState<boolean>(true);

  // Load audio tags on component mount
  useEffect(() => {
    loadAudioTags();
    loadUsageStats();
    loadV3Voices();
    loadSupportedLanguages();
  }, []);

  // Update current time when playing
  useEffect(() => {
    if (audioPlayer && isPlaying) {
      const interval = setInterval(() => {
        setCurrentTime(audioPlayer.getCurrentTime());
      }, 100);
      return () => clearInterval(interval);
    }
  }, [audioPlayer, isPlaying]);

  const loadAudioTags = () => {
    const tags = elevenLabs.getAudioTags();
    setAvailableTags(tags);
  };

  const loadUsageStats = async () => {
    try {
      const stats = await elevenLabs.getUsageStats();
      setUsageStats(stats);
    } catch (error) {
      console.error('Failed to load usage stats:', error);
    }
  };

  const loadV3Voices = () => {
    try {
      const voices = v3VoiceLibrary.getVoicesByRecommendation(voiceCategory as any);
      setV3Voices(voices);
      if (voices.length > 0 && !selectedV3Voice) {
        setSelectedV3Voice(voices[0]);
      }
    } catch (error) {
      console.error('Failed to load V3 voices:', error);
    }
  };

  const loadSupportedLanguages = () => {
    try {
      const languages = languageManager.getMajorLanguages();
      setSupportedLanguages(languages);
    } catch (error) {
      console.error('Failed to load supported languages:', error);
    }
  };

  // Auto-detect language when text changes
  useEffect(() => {
    if (autoDetectLanguage && text.trim()) {
      const detected = languageManager.detectLanguageFromText(text);
      setDetectedLanguage(detected);
      if (detected && detected !== selectedLanguage) {
        setSelectedLanguage(detected);
      }
    }
  }, [text, autoDetectLanguage, selectedLanguage]);

  const handleGenerateDialogue = useCallback(async () => {
    if (!text.trim()) {
      setError('Please enter some text to convert to dialogue.');
      return;
    }

    setIsGenerating(true);
    setError(null);

    try {
      // Clean up previous audio player
      if (audioPlayer) {
        audioPlayer.destroy();
        setAudioPlayer(null);
      }

      const result = await elevenLabs.dialogue(text, {
        voiceId: selectedV3Voice?.voice_id || "JBFqnCBsd6RMkjVDRZzb",
        modelId: 'eleven_multilingual_v2',
        languageCode: selectedLanguage,
        dialogueSettings,
        voiceSettings: selectedV3Voice?.settings
      });

      const player = elevenLabs.createAudioPlayer(result.audio, result.output_format);
      
      // Set up event listeners
      player.onEnded(() => {
        setIsPlaying(false);
        setCurrentTime(0);
      });

      player.onTimeUpdate((time) => {
        setCurrentTime(time);
      });

      setAudioPlayer(player);
      setDuration(player.getDuration());
      setCurrentTime(0);

      // Auto-play the generated dialogue
      await player.play();
      setIsPlaying(true);

      // Update usage stats
      await loadUsageStats();

    } catch (error) {
      console.error('Dialogue generation failed:', error);
      setError(`Dialogue generation failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsGenerating(false);
    }
  }, [text, dialogueSettings, audioPlayer]);

  const handlePlayPause = async () => {
    if (!audioPlayer) return;

    try {
      if (isPlaying) {
        audioPlayer.pause();
        setIsPlaying(false);
      } else {
        await audioPlayer.play();
        setIsPlaying(true);
      }
    } catch (error) {
      console.error('Playback failed:', error);
      setError('Playback failed. Please try again.');
    }
  };

  const handleStop = () => {
    if (!audioPlayer) return;

    audioPlayer.stop();
    setIsPlaying(false);
    setCurrentTime(0);
  };

  const handleAddAudioTag = () => {
    if (!selectedTag) return;

    const cursorPosition = (document.getElementById('dialogue-text') as HTMLTextAreaElement)?.selectionStart || 0;
    const newText = text.slice(0, cursorPosition) + selectedTag + ' ' + text.slice(cursorPosition);
    setText(newText);
    setSelectedTag('');
  };

  const handleEnhanceText = () => {
    const enhancedText = elevenLabs.enhanceTextWithAudioTags(text, {
      enhance_emotion: true,
      add_audio_tags: true,
      max_tags_per_sentence: 2
    });
    setText(enhancedText);
  };

  const handleLoadExample = (exampleIndex: number) => {
    const examples = elevenLabs.getDialogueExamples();
    if (examples[exampleIndex]) {
      setText(examples[exampleIndex].text);
    }
  };

  const formatTime = (seconds: number) => {
    return AudioUtils.formatDuration(seconds);
  };

  const getTagsByCategory = (category: string) => {
    return dialogueManager.getAudioTagsByCategory(category as any);
  };

  const examples = elevenLabs.getDialogueExamples();

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5" />
            ElevenLabs Text to Dialogue Demo
          </CardTitle>
          <CardDescription>
            Create immersive, natural-sounding dialogue with audio tags and expressive speech
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <Tabs defaultValue="single" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="single">Single Speaker</TabsTrigger>
              <TabsTrigger value="multi">Multi-Speaker</TabsTrigger>
              <TabsTrigger value="examples">Examples</TabsTrigger>
            </TabsList>

            <TabsContent value="single" className="space-y-6">
              {/* Text Input */}
              <div className="space-y-2">
                <label htmlFor="dialogue-text" className="text-sm font-medium">
                  Dialogue Text (with Audio Tags)
                </label>
                <Textarea
                  id="dialogue-text"
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  placeholder="Enter your dialogue text with audio tags like [excited], [whispers], [laughs]..."
                  rows={8}
                  className="resize-none font-mono text-sm"
                />
                <div className="text-xs text-muted-foreground">
                  {text.length} characters • Estimated duration: {formatTime(AudioUtils.estimateDuration(text))}
                </div>
              </div>

              {/* Language Selection */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Language Selection</CardTitle>
                  <CardDescription>
                    Same voice can speak different languages with proper pronunciation
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="auto-detect-language"
                      checked={autoDetectLanguage}
                      onChange={(e) => setAutoDetectLanguage(e.target.checked)}
                      className="rounded"
                    />
                    <label htmlFor="auto-detect-language" className="text-sm">
                      Auto-detect language from text
                    </label>
                  </div>

                  <div className="flex gap-2">
                    <Select 
                      value={selectedLanguage} 
                      onValueChange={(value: LanguageCode) => setSelectedLanguage(value)}
                      disabled={autoDetectLanguage}
                    >
                      <SelectTrigger className="w-64">
                        <SelectValue placeholder="Select language" />
                      </SelectTrigger>
                      <SelectContent>
                        {supportedLanguages.map((lang) => (
                          <SelectItem key={lang.code} value={lang.code}>
                            {lang.flag} {lang.name} ({lang.nativeName})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>

                    {detectedLanguage && autoDetectLanguage && (
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <span>Detected:</span>
                        <Badge variant="outline">
                          {supportedLanguages.find(l => l.code === detectedLanguage)?.flag} {supportedLanguages.find(l => l.code === detectedLanguage)?.name}
                        </Badge>
                      </div>
                    )}
                  </div>

                  {selectedLanguage && (
                    <div className="p-3 bg-muted rounded-md">
                      <div className="flex items-center gap-2 mb-2">
                        <h4 className="font-medium">
                          {supportedLanguages.find(l => l.code === selectedLanguage)?.flag} {supportedLanguages.find(l => l.code === selectedLanguage)?.name}
                        </h4>
                        <Badge variant="secondary">
                          {supportedLanguages.find(l => l.code === selectedLanguage)?.nativeName}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Region: {supportedLanguages.find(l => l.code === selectedLanguage)?.region}
                      </p>
                      <div className="mt-2 text-xs text-muted-foreground">
                        Model Support: Eleven v3 ✓ | Multilingual v2 ✓ | Turbo v2.5 ✓
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* V3 Voice Selection */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">V3 Voice Selection</CardTitle>
                  <CardDescription>
                    Choose from optimized voices for Eleven v3 with audio tags
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex gap-2">
                    <Select value={voiceCategory} onValueChange={(value) => {
                      setVoiceCategory(value);
                      const voices = v3VoiceLibrary.getVoicesByRecommendation(value as any);
                      setV3Voices(voices);
                      if (voices.length > 0) {
                        setSelectedV3Voice(voices[0]);
                      }
                    }}>
                      <SelectTrigger className="w-48">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="DIALOGUE_EXCELLENT">Dialogue Excellent</SelectItem>
                        <SelectItem value="PROFESSIONAL">Professional</SelectItem>
                        <SelectItem value="CHARACTERS">Characters</SelectItem>
                        <SelectItem value="SOCIAL_MEDIA">Social Media</SelectItem>
                        <SelectItem value="AUDIOBOOKS">Audiobooks</SelectItem>
                      </SelectContent>
                    </Select>

                    <Select value={selectedV3Voice?.voice_id || ''} onValueChange={(value) => {
                      const voice = v3Voices.find(v => v.voice_id === value);
                      setSelectedV3Voice(voice || null);
                    }}>
                      <SelectTrigger className="w-64">
                        <SelectValue placeholder="Select a V3 voice" />
                      </SelectTrigger>
                      <SelectContent>
                        {v3Voices.map((voice) => (
                          <SelectItem key={voice.voice_id} value={voice.voice_id}>
                            {voice.name} ({voice.accent})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {selectedV3Voice && (
                    <div className="p-3 bg-muted rounded-md">
                      <div className="flex items-center gap-2 mb-2">
                        <h4 className="font-medium">{selectedV3Voice.name}</h4>
                        <Badge variant="secondary">{selectedV3Voice.emotional_range}</Badge>
                        <Badge variant="outline">{selectedV3Voice.audio_tag_compatibility}</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">
                        {selectedV3Voice.description}
                      </p>
                      <div className="flex flex-wrap gap-1">
                        {selectedV3Voice.personality.map((trait) => (
                          <Badge key={trait} variant="outline" className="text-xs">
                            {trait}
                          </Badge>
                        ))}
                      </div>
                      <div className="mt-2 text-xs text-muted-foreground">
                        Best for: {selectedV3Voice.best_for.join(', ')}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Audio Tag Helper */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Audio Tag Helper</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex gap-2">
                    <Select value={selectedTagCategory} onValueChange={setSelectedTagCategory}>
                      <SelectTrigger className="w-48">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="emotions">Emotions</SelectItem>
                        <SelectItem value="nonVerbal">Non-Verbal</SelectItem>
                        <SelectItem value="speechFlow">Speech Flow</SelectItem>
                        <SelectItem value="soundEffects">Sound Effects</SelectItem>
                        <SelectItem value="special">Special</SelectItem>
                      </SelectContent>
                    </Select>

                    <Select value={selectedTag} onValueChange={setSelectedTag}>
                      <SelectTrigger className="w-48">
                        <SelectValue placeholder="Select a tag" />
                      </SelectTrigger>
                      <SelectContent>
                        {getTagsByCategory(selectedTagCategory).map((tag) => (
                          <SelectItem key={tag} value={tag}>
                            {tag}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>

                    <Button onClick={handleAddAudioTag} disabled={!selectedTag}>
                      Add Tag
                    </Button>
                  </div>

                  <div className="flex gap-2">
                    <Button variant="outline" onClick={handleEnhanceText}>
                      <Sparkles className="h-4 w-4 mr-2" />
                      Auto-Enhance Text
                    </Button>
                  </div>

                  <div className="text-xs text-muted-foreground">
                    <p>Available tags: {availableTags.length}</p>
                    <p>Selected category: {selectedTagCategory} ({getTagsByCategory(selectedTagCategory).length} tags)</p>
                  </div>
                </CardContent>
              </Card>

              {/* Dialogue Settings */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Dialogue Settings</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Stability</label>
                      <Select 
                        value={dialogueSettings.stability} 
                        onValueChange={(value) => setDialogueSettings(prev => ({ ...prev, stability: value as any }))}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="creative">Creative (More expressive, prone to hallucinations)</SelectItem>
                          <SelectItem value="natural">Natural (Balanced, closest to original voice)</SelectItem>
                          <SelectItem value="robust">Robust (Highly stable, less responsive to prompts)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium">Features</label>
                      <div className="space-y-2">
                        <label className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            checked={dialogueSettings.use_audio_tags}
                            onChange={(e) => setDialogueSettings(prev => ({ ...prev, use_audio_tags: e.target.checked }))}
                          />
                          <span className="text-sm">Use Audio Tags</span>
                        </label>
                        <label className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            checked={dialogueSettings.enhance_emotion}
                            onChange={(e) => setDialogueSettings(prev => ({ ...prev, enhance_emotion: e.target.checked }))}
                          />
                          <span className="text-sm">Enhance Emotion</span>
                        </label>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Generate Button */}
              <Button
                onClick={handleGenerateDialogue}
                disabled={isGenerating || !text.trim()}
                className="w-full"
                size="lg"
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Generating Dialogue...
                  </>
                ) : (
                  <>
                    <Mic className="mr-2 h-4 w-4" />
                    Generate Dialogue
                  </>
                )}
              </Button>
            </TabsContent>

            <TabsContent value="multi" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="h-5 w-5" />
                    Multi-Speaker Dialogue
                  </CardTitle>
                  <CardDescription>
                    Create conversations between multiple speakers with different voices
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-8">
                    <Users className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                    <p className="text-muted-foreground">
                      Multi-speaker dialogue functionality will be available in a future update.
                      For now, you can create multi-speaker conversations by using the single speaker
                      mode with different voice IDs for each speaker.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="examples" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Volume2 className="h-5 w-5" />
                    Dialogue Examples
                  </CardTitle>
                  <CardDescription>
                    Try these pre-written examples to see Text to Dialogue in action
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {examples.map((example, index) => (
                    <Card key={index} className="p-4">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="font-medium">{example.title}</h3>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleLoadExample(index)}
                        >
                          Load Example
                        </Button>
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">
                        {example.description}
                      </p>
                      <div className="text-xs text-muted-foreground font-mono bg-muted p-2 rounded max-h-20 overflow-y-auto">
                        {example.text.substring(0, 200)}...
                      </div>
                    </Card>
                  ))}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          {/* Error Display */}
          {error && (
            <div className="p-3 bg-destructive/10 border border-destructive/20 rounded-md">
              <p className="text-sm text-destructive">{error}</p>
            </div>
          )}

          {/* Audio Controls */}
          {audioPlayer && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Audio Player</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Progress Bar */}
                <div className="space-y-2">
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>{formatTime(currentTime)}</span>
                    <span>{formatTime(duration)}</span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2">
                    <div 
                      className="bg-primary h-2 rounded-full transition-all duration-100"
                      style={{ width: `${duration > 0 ? (currentTime / duration) * 100 : 0}%` }}
                    />
                  </div>
                </div>

                {/* Control Buttons */}
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handlePlayPause}
                  >
                    {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                  </Button>
                  
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleStop}
                  >
                    <Square className="h-4 w-4" />
                  </Button>

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setError('Download functionality requires storing the audio buffer. Check the examples for implementation.')}
                  >
                    <Download className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Usage Statistics */}
          {usageStats && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Usage Statistics</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div>
                    <div className="text-muted-foreground">Characters Used</div>
                    <div className="font-medium">{usageStats.characters_used.toLocaleString()}</div>
                  </div>
                  <div>
                    <div className="text-muted-foreground">Character Limit</div>
                    <div className="font-medium">{usageStats.characters_limit.toLocaleString()}</div>
                  </div>
                  <div>
                    <div className="text-muted-foreground">Remaining</div>
                    <div className="font-medium">
                      {(usageStats.characters_limit - usageStats.characters_used).toLocaleString()}
                    </div>
                  </div>
                  <div>
                    <div className="text-muted-foreground">Plan</div>
                    <div className="font-medium capitalize">{usageStats.tier}</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
