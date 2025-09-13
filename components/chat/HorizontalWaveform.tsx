"use client"

import { useEffect, useRef, useState } from "react";
import { Play, Pause } from "lucide-react";

interface HorizontalWaveformProps {
  audioUrl: string;
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  onPlayPause: () => void;
  className?: string;
}

export default function HorizontalWaveform({ 
  audioUrl, 
  isPlaying, 
  currentTime, 
  duration, 
  onPlayPause,
  className = "" 
}: HorizontalWaveformProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const audioRef = useRef<HTMLAudioElement>(null);
  const [audioContext, setAudioContext] = useState<AudioContext | null>(null);
  const [analyser, setAnalyser] = useState<AnalyserNode | null>(null);
  const [dataArray, setDataArray] = useState<Uint8Array | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  // Initialiser l'audio context et analyser
  useEffect(() => {
    if (!audioUrl) return;

    const initAudio = async () => {
      try {
        const audio = new Audio(audioUrl);
        audio.crossOrigin = "anonymous";
        
        const context = new (window.AudioContext || (window as any).webkitAudioContext)();
        const source = context.createMediaElementSource(audio);
        const analyserNode = context.createAnalyser();
        
        analyserNode.fftSize = 256;
        const bufferLength = analyserNode.frequencyBinCount;
        const data = new Uint8Array(bufferLength);
        
        source.connect(analyserNode);
        analyserNode.connect(context.destination);
        
        setAudioContext(context);
        setAnalyser(analyserNode);
        setDataArray(data);
        setIsLoaded(true);
        
        audioRef.current = audio;
      } catch (error) {
        console.warn('Could not initialize audio context:', error);
        setIsLoaded(true); // Utiliser la forme d'onde simulée
      }
    };

    initAudio();
  }, [audioUrl]);

  // Dessiner la forme d'onde horizontale
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const draw = () => {
      const width = canvas.width;
      const height = canvas.height;
      
      ctx.clearRect(0, 0, width, height);
      
      if (analyser && dataArray && isPlaying) {
        // Forme d'onde horizontale en temps réel
        analyser.getByteFrequencyData(dataArray);
        
        const barCount = Math.min(dataArray.length, 100);
        const barWidth = width / barCount;
        
        for (let i = 0; i < barCount; i++) {
          const value = dataArray[i] / 255;
          const barHeight = value * (height - 8) + 4;
          const x = i * barWidth;
          const y = (height - barHeight) / 2;
          
          // Couleur basée sur la valeur (vert vers jaune)
          const hue = 60 + (value * 60); // De 60 (vert) à 120 (jaune)
          const saturation = 70 + (value * 30);
          const lightness = 50 + (value * 20);
          
          ctx.fillStyle = `hsl(${hue}, ${saturation}%, ${lightness}%)`;
          ctx.fillRect(x, y, barWidth - 1, barHeight);
        }
      } else {
        // Forme d'onde statique simulée
        const barCount = 100;
        const barWidth = width / barCount;
        
        for (let i = 0; i < barCount; i++) {
          const value = Math.random() * 0.5 + 0.2; // Valeurs entre 0.2 et 0.7
          const barHeight = value * (height - 8) + 4;
          const x = i * barWidth;
          const y = (height - barHeight) / 2;
          
          // Couleur vert/jaune pour la forme d'onde statique
          const hue = 60 + (value * 60);
          const saturation = 70 + (value * 30);
          const lightness = 50 + (value * 20);
          
          ctx.fillStyle = `hsl(${hue}, ${saturation}%, ${lightness}%)`;
          ctx.fillRect(x, y, barWidth - 1, barHeight);
        }
      }
      
      if (isPlaying) {
        requestAnimationFrame(draw);
      }
    };

    draw();
  }, [analyser, dataArray, isPlaying, isLoaded]);

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className={`relative ${className}`}>
      <canvas
        ref={canvasRef}
        width={400}
        height={64}
        className="w-full h-full rounded"
      />
      
      {/* Bouton de lecture */}
      <button
        onClick={onPlayPause}
        className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-white/90 hover:bg-white rounded-full p-1.5 shadow-sm transition-colors"
        title={isPlaying ? "Pause" : "Play"}
      >
        {isPlaying ? (
          <Pause className="w-3 h-3 text-gray-700" />
        ) : (
          <Play className="w-3 h-3 text-gray-700 ml-0.5" />
        )}
      </button>
      
      {/* Durée */}
      {duration > 0 && (
        <div className="absolute bottom-1 right-2 text-xs text-gray-600 bg-white/80 px-1 rounded">
          {formatDuration(duration)}
        </div>
      )}
    </div>
  );
}
