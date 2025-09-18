/**
 * Text to Speech Demo Component
 * 
 * A React component demonstrating ElevenLabs Text to Speech integration.
 * This component provides a user interface for generating and playing speech.
 */

'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Loader2, Play, Pause, Square, Download, Volume2 } from 'lucide-react';
import { elevenLabs, voiceManager, AudioUtils } from '@/lib/elevenlabs';
import type { Voice, VoiceSettings, AudioOutputFormat } from '@/lib/elevenlabs';

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

export function TextToSpeechDemo() {
  // State management
  const [text, setText] = useState('Hello! This is a demonstration of ElevenLabs Text to Speech integration. You can type any text here and convert it to speech.');
  const [voices, setVoices] = useState<Voice[]>([]);
  const [selectedVoiceId, setSelectedVoiceId] = useState<string>('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [audioPlayer, setAudioPlayer] = useState<AudioPlayer | null>(null);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [playbackRate, setPlaybackRate] = useState(1);
  const [error, setError] = useState<string | null>(null);
  const [usageStats, setUsageStats] = useState<any>(null);

  // Voice settings
  const [voiceSettings, setVoiceSettings] = useState<VoiceSettings>({
    stability: 0.5,
    similarity_boost: 0.75,
    style: 0.0,
    use_speaker_boost: true,
    speed: 1.0
  });

  // Audio format
  const [outputFormat, setOutputFormat] = useState<AudioOutputFormat>('mp3_44100_128');

  // Load voices on component mount
  useEffect(() => {
    loadVoices();
    loadUsageStats();
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

  const loadVoices = async () => {
    try {
      const voiceList = await voiceManager.getVoices();
      setVoices(voiceList.slice(0, 20)); // Limit to first 20 voices for performance
    } catch (error) {
      console.error('Failed to load voices:', error);
      setError('Failed to load voices. Please check your API key.');
    }
  };

  const loadUsageStats = async () => {
    try {
      const stats = await elevenLabs.getUsageStats();
      setUsageStats(stats);
    } catch (error) {
      console.error('Failed to load usage stats:', error);
    }
  };

  const handleGenerateSpeech = useCallback(async () => {
    if (!text.trim()) {
      setError('Please enter some text to convert to speech.');
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

      const result = await elevenLabs.speak(text, {
        voiceId: selectedVoiceId || undefined,
        modelId: 'eleven_multilingual_v2',
        outputFormat,
        voiceSettings
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

      // Auto-play the generated audio
      await player.play();
      setIsPlaying(true);

      // Update usage stats
      await loadUsageStats();

    } catch (error) {
      console.error('Speech generation failed:', error);
      setError(`Speech generation failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsGenerating(false);
    }
  }, [text, selectedVoiceId, outputFormat, voiceSettings, audioPlayer]);

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

  const handleVolumeChange = (newVolume: number[]) => {
    const vol = newVolume[0];
    setVolume(vol);
    if (audioPlayer) {
      audioPlayer.setVolume(vol);
    }
  };

  const handlePlaybackRateChange = (newRate: number[]) => {
    const rate = newRate[0];
    setPlaybackRate(rate);
    if (audioPlayer) {
      audioPlayer.setPlaybackRate(rate);
    }
  };

  const handleSeek = (newTime: number[]) => {
    const time = newTime[0];
    setCurrentTime(time);
    if (audioPlayer) {
      audioPlayer.setCurrentTime(time);
    }
  };

  const handleDownload = () => {
    if (!audioPlayer) return;

    // This would require storing the audio buffer, which we'll implement in a real app
    setError('Download functionality requires storing the audio buffer. Check the examples for implementation.');
  };

  const formatTime = (seconds: number) => {
    return AudioUtils.formatDuration(seconds);
  };

  const selectedVoice = voices.find(voice => voice.voice_id === selectedVoiceId);

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Volume2 className="h-5 w-5" />
            ElevenLabs Text to Speech Demo
          </CardTitle>
          <CardDescription>
            Convert text to high-quality speech using ElevenLabs AI voices
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Text Input */}
          <div className="space-y-2">
            <label htmlFor="text-input" className="text-sm font-medium">
              Text to Convert
            </label>
            <Textarea
              id="text-input"
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Enter the text you want to convert to speech..."
              rows={4}
              className="resize-none"
            />
            <div className="text-xs text-muted-foreground">
              {text.length} characters • Estimated duration: {formatTime(AudioUtils.estimateDuration(text))}
            </div>
          </div>

          {/* Voice Selection */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Voice</label>
            <Select value={selectedVoiceId} onValueChange={setSelectedVoiceId}>
              <SelectTrigger>
                <SelectValue placeholder="Select a voice (optional)" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">Default Voice</SelectItem>
                {voices.map((voice) => (
                  <SelectItem key={voice.voice_id} value={voice.voice_id}>
                    <div className="flex items-center gap-2">
                      <span>{voice.name}</span>
                      <Badge variant="secondary" className="text-xs">
                        {voice.category}
                      </Badge>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {selectedVoice && (
              <div className="text-xs text-muted-foreground">
                Selected: {selectedVoice.name} ({selectedVoice.category})
              </div>
            )}
          </div>

          {/* Voice Settings */}
          <div className="space-y-4">
            <h3 className="text-sm font-medium">Voice Settings</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-xs text-muted-foreground">
                  Stability: {voiceSettings.stability}
                </label>
                <Slider
                  value={[voiceSettings.stability]}
                  onValueChange={(value) => setVoiceSettings(prev => ({ ...prev, stability: value[0] }))}
                  min={0}
                  max={1}
                  step={0.1}
                  className="w-full"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs text-muted-foreground">
                  Similarity Boost: {voiceSettings.similarity_boost}
                </label>
                <Slider
                  value={[voiceSettings.similarity_boost]}
                  onValueChange={(value) => setVoiceSettings(prev => ({ ...prev, similarity_boost: value[0] }))}
                  min={0}
                  max={1}
                  step={0.1}
                  className="w-full"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs text-muted-foreground">
                  Style: {voiceSettings.style}
                </label>
                <Slider
                  value={[voiceSettings.style || 0]}
                  onValueChange={(value) => setVoiceSettings(prev => ({ ...prev, style: value[0] }))}
                  min={0}
                  max={1}
                  step={0.1}
                  className="w-full"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs text-muted-foreground">
                  Speed: {voiceSettings.speed}
                </label>
                <Slider
                  value={[voiceSettings.speed]}
                  onValueChange={(value) => setVoiceSettings(prev => ({ ...prev, speed: value[0] }))}
                  min={0.25}
                  max={4}
                  step={0.1}
                  className="w-full"
                />
              </div>
            </div>
          </div>

          {/* Output Format */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Output Format</label>
            <Select value={outputFormat} onValueChange={(value) => setOutputFormat(value as AudioOutputFormat)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="mp3_44100_128">MP3 44.1kHz 128kbps (Recommended)</SelectItem>
                <SelectItem value="mp3_44100_64">MP3 44.1kHz 64kbps (Mobile)</SelectItem>
                <SelectItem value="mp3_44100_192">MP3 44.1kHz 192kbps (High Quality)</SelectItem>
                <SelectItem value="mp3_22050_32">MP3 22.05kHz 32kbps (Low Latency)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Generate Button */}
          <Button
            onClick={handleGenerateSpeech}
            disabled={isGenerating || !text.trim()}
            className="w-full"
            size="lg"
          >
            {isGenerating ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Generating Speech...
              </>
            ) : (
              'Generate Speech'
            )}
          </Button>

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
                  <Slider
                    value={[currentTime]}
                    onValueChange={handleSeek}
                    max={duration}
                    step={0.1}
                    className="w-full"
                  />
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
                    onClick={handleDownload}
                  >
                    <Download className="h-4 w-4" />
                  </Button>
                </div>

                {/* Volume and Speed Controls */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-xs text-muted-foreground">
                      Volume: {Math.round(volume * 100)}%
                    </label>
                    <Slider
                      value={[volume]}
                      onValueChange={handleVolumeChange}
                      min={0}
                      max={1}
                      step={0.1}
                      className="w-full"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs text-muted-foreground">
                      Speed: {playbackRate}x
                    </label>
                    <Slider
                      value={[playbackRate]}
                      onValueChange={handlePlaybackRateChange}
                      min={0.5}
                      max={2}
                      step={0.1}
                      className="w-full"
                    />
                  </div>
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
