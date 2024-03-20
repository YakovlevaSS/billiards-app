import React, { useRef, useEffect, useState } from 'react';
import Ball from '../../components/ball';
import Menu from '../../components/menu';

const Game: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [balls, setBalls] = useState<{ x: number, y: number, radius: number, color: string }[]>([]);
  const [currentColor, setCurrentColor] = useState<string>('red');
  const [mouseDown, setMouseDown] = useState<boolean>(false);
  const [mouseStart, setMouseStart] = useState<{ x: number, y: number } | null>(null);
  const [mouseMove, setMouseMove] = useState<{ x: number, y: number } | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationId: number;

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw balls
      balls.forEach(ball => {
        drawBall(ctx, ball);
      });

      if (mouseDown && mouseStart && mouseMove) {
        ctx.beginPath();
        ctx.moveTo(mouseStart.x, mouseStart.y);
        ctx.lineTo(mouseMove.x, mouseMove.y);
        ctx.stroke();
      }

      animationId = requestAnimationFrame(animate);
    };

    animate();

    return () => cancelAnimationFrame(animationId);
  }, [balls, mouseDown, mouseStart, mouseMove]);

  const drawBall = (ctx: CanvasRenderingContext2D, ball: { x: number, y: number, radius: number, color: string }) => {
    ctx.beginPath();
    ctx.fillStyle = ball.color;
    ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
    ctx.fill();
  };

  const handleCanvasClick = (event: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    // Check if click is on any ball
    balls.forEach(ball => {
      const dx = x - ball.x;
      const dy = y - ball.y;
      const distance = Math.sqrt(dx * dx + dy * dy);

      if (distance <= ball.radius) {
        // Change color of the clicked ball
        setCurrentColor(ball.color);
      }
    });
  };

  const handleColorChange = (color: string) => {
    setCurrentColor(color);
  };

  const handleMouseDown = (event: React.MouseEvent<HTMLCanvasElement>) => {
    setMouseDown(true);
    setMouseStart({ x: event.clientX, y: event.clientY });
  };

  const handleMouseMove = (event: React.MouseEvent<HTMLCanvasElement>) => {
    if (!mouseDown || !mouseStart) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    setMouseMove({ x, y });
  };

  const handleMouseUp = () => {
    setMouseStart(null);
    setMouseDown(false);
    setMouseMove(null);
  };

  return (
    <div>
      <Menu onChangeColor={handleColorChange} />
      <canvas
        ref={canvasRef}
        width={800}
        height={600}
        onClick={handleCanvasClick}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        style={{ border: '1px solid black' }}
      />
      {balls.map((ball, index) => (
        <Ball
          key={index}
          x={ball.x}
          y={ball.y}
          radius={ball.radius}
          color={ball.color}
      
        />
      ))}
    </div>
  );
};

export default Game;


