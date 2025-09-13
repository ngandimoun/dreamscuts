"use client"

import { useEffect, useRef, useState } from "react";
import { Play, Pause } from "lucide-react";

interface WaveformProps {
  audioUrl: string;
  duration?: number;
  className?: string;
  onPlay?: () => void;
  onPause?: () => void;
  isPlaying?: boolean;
}

export default function Waveform({ 
  audioUrl, 
  duration = 0, 
  className = "", 
  onPlay, 
  onPause, 
  isPlaying = false 
}: WaveformProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const audioRef = useRef<HTMLAudioElement>(null);
  const [audioContext, setAudioContext] = useState<AudioContext | null>(null);
  const [analyser, setAnalyser] = useState<AnalyserNode | null>(null);
  const [dataArray, setDataArray] = useState<Uint8Array | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  // Générer une forme d'onde simulée si l'audio n'est pas encore chargé
  const generateMockWaveform = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;
    
    ctx.clearRect(0, 0, width, height);
    
    // Couleurs de la forme d'onde
    const gradient = ctx.createLinearGradient(0, 0, width, 0);
    gradient.addColorStop(0, '#10b981'); // vert
    gradient.addColorStop(0.5, '#f59e0b'); // jaune
    gradient.addColorStop(1, '#10b981'); // vert
    
    ctx.fillStyle = gradient;
    
    // Générer des barres aléatoires pour simuler une forme d'onde
    const barCount = 100;
    const barWidth = width / barCount;
    
    for (let i = 0; i < barCount; i++) {
      const barHeight = Math.random() * (height * 0.8) + (height * 0.1);
      const x = i * barWidth;
      const y = (height - barHeight) / 2;
      
      ctx.fillRect(x, y, barWidth - 1, barHeight);
    }
  };

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

  // Dessiner la forme d'onde
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
        // Forme d'onde en temps réel
        analyser.getByteFrequencyData(dataArray);
        
        const gradient = ctx.createLinearGradient(0, 0, width, 0);
        gradient.addColorStop(0, '#10b981');
        gradient.addColorStop(0.5, '#f59e0b');
        gradient.addColorStop(1, '#10b981');
        
        ctx.fillStyle = gradient;
        
        const barWidth = width / dataArray.length;
        
        for (let i = 0; i < dataArray.length; i++) {
          const barHeight = (dataArray[i] / 255) * height;
          const x = i * barWidth;
          const y = (height - barHeight) / 2;
          
          ctx.fillRect(x, y, barWidth - 1, barHeight);
        }
      } else {
        // Forme d'onde statique simulée
        generateMockWaveform();
      }
      
      if (isPlaying) {
        requestAnimationFrame(draw);
      }
    };

    draw();
  }, [analyser, dataArray, isPlaying, isLoaded]);

  const handlePlayPause = () => {
    if (!audioRef.current) return;
    
    if (isPlaying) {
      audioRef.current.pause();
      onPause?.();
    } else {
      audioRef.current.play();
      onPlay?.();
    }
  };

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className={`relative ${className}`}>
      <canvas
        ref={canvasRef}
        width={200}
        height={60}
        className="w-full h-full rounded"
      />
      
      {/* Bouton de lecture */}
      <button
        onClick={handlePlayPause}
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
