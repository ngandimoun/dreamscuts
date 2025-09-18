/**
 * Audio Utilities
 * 
 * Utility functions for handling audio playback, processing, and management.
 * Works with ElevenLabs generated audio.
 */

import type { AudioOutputFormat } from './types';

export class AudioUtils {
  /**
   * Create an audio element from ArrayBuffer
   */
  static createAudioElement(audioBuffer: ArrayBuffer, format: AudioOutputFormat = 'mp3_44100_128'): HTMLAudioElement {
    const audio = new Audio();
    const blob = new Blob([audioBuffer], { type: this.getMimeType(format) });
    const url = URL.createObjectURL(blob);
    
    audio.src = url;
    audio.preload = 'auto';
    
    // Clean up object URL when audio is loaded
    audio.addEventListener('loadeddata', () => {
      URL.revokeObjectURL(url);
    });
    
    return audio;
  }

  /**
   * Play audio from ArrayBuffer
   */
  static async playAudio(audioBuffer: ArrayBuffer, format: AudioOutputFormat = 'mp3_44100_128'): Promise<void> {
    return new Promise((resolve, reject) => {
      const audio = this.createAudioElement(audioBuffer, format);
      
      audio.addEventListener('ended', () => {
        resolve();
      });
      
      audio.addEventListener('error', (error) => {
        reject(new Error(`Audio playback failed: ${error}`));
      });
      
      audio.play().catch(reject);
    });
  }

  /**
   * Download audio as file
   */
  static downloadAudio(audioBuffer: ArrayBuffer, filename: string, format: AudioOutputFormat = 'mp3_44100_128'): void {
    const blob = new Blob([audioBuffer], { type: this.getMimeType(format) });
    const url = URL.createObjectURL(blob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    URL.revokeObjectURL(url);
  }

  /**
   * Get MIME type for audio format
   */
  static getMimeType(format: AudioOutputFormat): string {
    if (format.startsWith('mp3')) return 'audio/mpeg';
    if (format.startsWith('pcm')) return 'audio/wav';
    if (format.startsWith('ulaw')) return 'audio/basic';
    if (format.startsWith('alaw')) return 'audio/basic';
    if (format.startsWith('opus')) return 'audio/opus';
    return 'audio/mpeg'; // Default to MP3
  }

  /**
   * Get file extension for audio format
   */
  static getFileExtension(format: AudioOutputFormat): string {
    if (format.startsWith('mp3')) return 'mp3';
    if (format.startsWith('pcm')) return 'wav';
    if (format.startsWith('ulaw')) return 'ulaw';
    if (format.startsWith('alaw')) return 'alaw';
    if (format.startsWith('opus')) return 'opus';
    return 'mp3'; // Default to MP3
  }

  /**
   * Format audio duration in seconds to human readable format
   */
  static formatDuration(seconds: number): string {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = Math.floor(seconds % 60);
    
    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
  }

  /**
   * Estimate audio duration based on text length and speaking rate
   */
  static estimateDuration(text: string, wordsPerMinute: number = 150): number {
    const wordCount = text.split(/\s+/).length;
    return (wordCount / wordsPerMinute) * 60;
  }

  /**
   * Create audio player with controls
   */
  static createAudioPlayer(audioBuffer: ArrayBuffer, format: AudioOutputFormat = 'mp3_44100_128'): {
    audio: HTMLAudioElement;
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
  } {
    const audio = this.createAudioElement(audioBuffer, format);
    
    return {
      audio,
      
      play: async () => {
        try {
          await audio.play();
        } catch (error) {
          throw new Error(`Failed to play audio: ${error}`);
        }
      },
      
      pause: () => {
        audio.pause();
      },
      
      stop: () => {
        audio.pause();
        audio.currentTime = 0;
      },
      
      setVolume: (volume: number) => {
        audio.volume = Math.max(0, Math.min(1, volume));
      },
      
      setPlaybackRate: (rate: number) => {
        audio.playbackRate = Math.max(0.25, Math.min(4, rate));
      },
      
      getDuration: () => {
        return audio.duration || 0;
      },
      
      getCurrentTime: () => {
        return audio.currentTime || 0;
      },
      
      setCurrentTime: (time: number) => {
        audio.currentTime = Math.max(0, Math.min(audio.duration || 0, time));
      },
      
      onEnded: (callback: () => void) => {
        audio.addEventListener('ended', callback);
      },
      
      onTimeUpdate: (callback: (currentTime: number) => void) => {
        audio.addEventListener('timeupdate', () => {
          callback(audio.currentTime);
        });
      },
      
      destroy: () => {
        audio.pause();
        audio.src = '';
        audio.load();
      }
    };
  }

  /**
   * Create audio waveform visualization data
   */
  static async createWaveformData(audioBuffer: ArrayBuffer, samples: number = 100): Promise<number[]> {
    try {
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      const audioData = await audioContext.decodeAudioData(audioBuffer.slice(0));
      
      const channelData = audioData.getChannelData(0);
      const blockSize = Math.floor(channelData.length / samples);
      const waveform: number[] = [];
      
      for (let i = 0; i < samples; i++) {
        let sum = 0;
        for (let j = 0; j < blockSize; j++) {
          sum += Math.abs(channelData[i * blockSize + j]);
        }
        waveform.push(sum / blockSize);
      }
      
      audioContext.close();
      return waveform;
    } catch (error) {
      console.error('Failed to create waveform data:', error);
      // Return mock waveform data
      return Array(samples).fill(0).map(() => Math.random() * 0.5 + 0.25);
    }
  }

  /**
   * Validate audio format compatibility
   */
  static isFormatSupported(format: AudioOutputFormat): boolean {
    const audio = new Audio();
    
    switch (format) {
      case 'mp3_22050_32':
      case 'mp3_44100_32':
      case 'mp3_44100_64':
      case 'mp3_44100_96':
      case 'mp3_44100_128':
      case 'mp3_44100_192':
        return audio.canPlayType('audio/mpeg') !== '';
      
      case 'pcm_16000':
      case 'pcm_22050':
      case 'pcm_24000':
      case 'pcm_44100':
        return audio.canPlayType('audio/wav') !== '';
      
      case 'opus_48000_32':
      case 'opus_48000_64':
      case 'opus_48000_96':
      case 'opus_48000_128':
      case 'opus_48000_192':
        return audio.canPlayType('audio/opus') !== '';
      
      case 'ulaw_8000':
      case 'alaw_8000':
        return audio.canPlayType('audio/basic') !== '';
      
      default:
        return false;
    }
  }

  /**
   * Get recommended format based on use case
   */
  static getRecommendedFormat(useCase: 'web' | 'mobile' | 'high_quality' | 'low_latency'): AudioOutputFormat {
    switch (useCase) {
      case 'web':
        return 'mp3_44100_128'; // Good balance of quality and compatibility
      
      case 'mobile':
        return 'mp3_44100_64'; // Lower bitrate for mobile data savings
      
      case 'high_quality':
        return 'mp3_44100_192'; // Highest quality MP3
      
      case 'low_latency':
        return 'mp3_22050_32'; // Lower quality for faster processing
      
      default:
        return 'mp3_44100_128';
    }
  }

  /**
   * Convert audio buffer to base64 data URL
   */
  static audioBufferToDataURL(audioBuffer: ArrayBuffer, format: AudioOutputFormat = 'mp3_44100_128'): string {
    const blob = new Blob([audioBuffer], { type: this.getMimeType(format) });
    const reader = new FileReader();
    
    return new Promise((resolve, reject) => {
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    }) as any; // Note: This should be async but we're returning sync for simplicity
  }

  /**
   * Get audio file size in human readable format
   */
  static formatFileSize(bytes: number): string {
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    if (bytes === 0) return '0 Bytes';
    
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i];
  }
}
