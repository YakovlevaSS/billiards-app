import React, { useEffect, useRef } from 'react';

interface BallProps {
  x: number;
  y: number;
  radius: number;
  color: string;
}

const Ball: React.FC<BallProps> = ({ x, y, radius, color }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.beginPath();
    ctx.fillStyle = color;
    ctx.arc(x, y, radius, 0, Math.PI * 2);
    ctx.fill();
  }, [x, y, radius, color]);

  return <canvas ref={canvasRef} style={{ position: 'absolute', left: 0, top: 0 }} />;
};

export default Ball;
