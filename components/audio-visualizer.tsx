"use client";

import { useRef, useEffect } from 'react';

interface AudioVisualizerProps {
  data: Uint8Array | null;
}

export function AudioVisualizer({ data }: AudioVisualizerProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!canvasRef.current || !data) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const draw = () => {
      const width = canvas.width;
      const height = canvas.height;
      const barWidth = width / data.length;

      ctx.clearRect(0, 0, width, height);
      ctx.fillStyle = 'rgb(var(--primary))';

      for (let i = 0; i < data.length; i++) {
        const barHeight = (data[i] / 255) * height;
        const x = i * barWidth;
        const y = height - barHeight;

        ctx.fillRect(x, y, barWidth - 1, barHeight);
      }

      requestAnimationFrame(draw);
    };

    draw();
  }, [data]);

  return (
    <canvas
      ref={canvasRef}
      className="w-full h-full"
      width={window.innerWidth}
      height={40}
    />
  );
}