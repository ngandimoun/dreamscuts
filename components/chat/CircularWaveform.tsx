"use client"

import { useEffect, useRef, useState } from "react";
import { Volume2 } from "lucide-react";

interface CircularWaveformProps {
  audioUrl: string;
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  onPlayPause: () => void;
  className?: string;
}

export default function CircularWaveform({ 
  audioUrl, 
  isPlaying, 
  currentTime, 
  duration, 
  onPlayPause,
  className = "" 
}: CircularWaveformProps) {
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

  // Dessiner la forme d'onde circulaire
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const draw = () => {
      const width = canvas.width;
      const height = canvas.height;
      const centerX = width / 2;
      const centerY = height / 2;
      const radius = Math.min(width, height) / 2 - 20;
      
      ctx.clearRect(0, 0, width, height);
      
      if (analyser && dataArray && isPlaying) {
        // Forme d'onde circulaire en temps réel
        analyser.getByteFrequencyData(dataArray);
        
        const barCount = dataArray.length;
        const angleStep = (Math.PI * 2) / barCount;
        
        for (let i = 0; i < barCount; i++) {
          const value = dataArray[i] / 255;
          const angle = i * angleStep;
          
          // Couleur basée sur la valeur (vert vers jaune)
          const hue = 60 + (value * 60); // De 60 (vert) à 120 (jaune)
          const saturation = 70 + (value * 30);
          const lightness = 50 + (value * 20);
          
          ctx.strokeStyle = `hsl(${hue}, ${saturation}%, ${lightness}%)`;
          ctx.lineWidth = 2;
          
          const x1 = centerX + Math.cos(angle) * radius;
          const y1 = centerY + Math.sin(angle) * radius;
          const x2 = centerX + Math.cos(angle) * (radius + value * 30);
          const y2 = centerY + Math.sin(angle) * (radius + value * 30);
          
          ctx.beginPath();
          ctx.moveTo(x1, y1);
          ctx.lineTo(x2, y2);
          ctx.stroke();
        }
      } else {
        // Forme d'onde statique simulée
        const barCount = 64;
        const angleStep = (Math.PI * 2) / barCount;
        
        for (let i = 0; i < barCount; i++) {
          const value = Math.random() * 0.5 + 0.2; // Valeurs entre 0.2 et 0.7
          const angle = i * angleStep;
          
          // Couleur violette pour la forme d'onde statique
          const hue = 270 + (value * 30); // Violet vers bleu
          const saturation = 60 + (value * 20);
          const lightness = 50 + (value * 20);
          
          ctx.strokeStyle = `hsl(${hue}, ${saturation}%, ${lightness}%)`;
          ctx.lineWidth = 2;
          
          const x1 = centerX + Math.cos(angle) * radius;
          const y1 = centerY + Math.sin(angle) * radius;
          const x2 = centerX + Math.cos(angle) * (radius + value * 30);
          const y2 = centerY + Math.sin(angle) * (radius + value * 30);
          
          ctx.beginPath();
          ctx.moveTo(x1, y1);
          ctx.lineTo(x2, y2);
          ctx.stroke();
        }
      }
      
      if (isPlaying) {
        requestAnimationFrame(draw);
      }
    };

    draw();
  }, [analyser, dataArray, isPlaying, isLoaded]);

  return (
    <div className={`relative ${className}`}>
      <canvas
        ref={canvasRef}
        width={300}
        height={300}
        className="w-full h-full rounded-full cursor-pointer"
        onClick={onPlayPause}
      />
      
      {/* Icône centrale */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="w-16 h-16 bg-purple-100 dark:bg-purple-900 rounded-full flex items-center justify-center">
          <Volume2 className="w-8 h-8 text-purple-600" />
        </div>
      </div>
    </div>
  );
}
