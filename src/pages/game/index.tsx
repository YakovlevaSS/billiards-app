import { useRef, useEffect, useState } from "react";
import Menu from "../../components/menu";

// Экспортируемые функции для расчетов
const calculateImpulseFactor = (initialSpeedX: number, initialSpeedY: number): number => {
  const totalInitialSpeed = Math.sqrt(initialSpeedX ** 2 + initialSpeedY ** 2);
  return 1 - totalInitialSpeed / 10;
};

const calculateSpeedX = (currentSpeedX: number, impulseX: number, impulseFactor: number): number => {
  return currentSpeedX + impulseX * impulseFactor;
};

const calculateSpeedY = (currentSpeedY: number, impulseY: number, impulseFactor: number): number => {
  return currentSpeedY + impulseY * impulseFactor;
};

const Game: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [currentColor, setCurrentColor] = useState<string>("red");
  const [menuVisible, setMenuVisible] = useState(false);
  const [balls, setBalls] = useState([
    { id: 0, x: 100, y: 100, radius: 20, color: "red", speedX: 0, speedY: 0 },
    { id: 1, x: 200, y: 200, radius: 30, color: "red", speedX: 0, speedY: 0 },
    { id: 2, x: 300, y: 300, radius: 40, color: "red", speedX: 0, speedY: 0 },
    { id: 3, x: 400, y: 400, radius: 50, color: "red", speedX: 0, speedY: 0 },
  ]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationId: number;

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      balls.forEach((ball) => {
        drawBall(ctx, ball);
        ball.x += ball.speedX;
        ball.y += ball.speedY;
        handleWallCollision(ball);
        handleBallCollisions(ball);
      });

      animationId = requestAnimationFrame(animate);
    };

    animate();

    return () => cancelAnimationFrame(animationId);
  }, [balls]);

  const drawBall = (
    ctx: CanvasRenderingContext2D,
    ball: { id: number; x: number; y: number; radius: number; color: string }
  ) => {
    ctx.beginPath();
    ctx.fillStyle = ball.color;
    ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
    ctx.fill();
  };

  const handleWallCollision = (ball: { x: number; y: number; radius: number; speedX: number; speedY: number }) => {
    if (ball.x - ball.radius < 0 || ball.x + ball.radius > canvasRef.current!.width) {
      ball.speedX *= -1;
    }
    if (ball.y - ball.radius < 0 || ball.y + ball.radius > canvasRef.current!.height) {
      ball.speedY *= -1;
    }
  };

  const handleBallCollisions = (ball: { id: number; x: number; y: number; radius: number; speedX: number; speedY: number }) => {
    balls.forEach((otherBall) => {
      if (ball.id !== otherBall.id) {
        const dx = otherBall.x - ball.x;
        const dy = otherBall.y - ball.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < ball.radius + otherBall.radius) {
          const angle = Math.atan2(dy, dx);
          const sin = Math.sin(angle);
          const cos = Math.cos(angle);

          const x1 = 0;
          const y1 = 0;
          const x2 = dx * cos + dy * sin;
          const y2 = dy * cos - dx * sin;

          const vx1 = ball.speedX * cos + ball.speedY * sin;
          const vy1 = ball.speedY * cos - ball.speedX * sin;
          const vx2 = otherBall.speedX * cos + otherBall.speedY * sin;
          const vy2 = otherBall.speedY * cos - otherBall.speedX * sin;

          const vx1Final = (vx1 * (ball.radius - otherBall.radius) + 2 * otherBall.radius * vx2) / (ball.radius + otherBall.radius);
          const vx2Final = (vx2 * (ball.radius - otherBall.radius) + 2 * otherBall.radius * vx1) / (ball.radius + otherBall.radius);
          const vy1Final = (vy1 * (ball.radius - otherBall.radius) + 2 * otherBall.radius * vy2) / (ball.radius + otherBall.radius);
          const vy2Final = (vy2 * (ball.radius - otherBall.radius) + 2 * otherBall.radius * vy1) / (ball.radius + otherBall.radius);

          ball.speedX = cos * vx1Final + sin * vy1;
          ball.speedY = cos * vy1Final - sin * vx1Final;
          otherBall.speedX = cos * vx2Final + sin * vy2;
          otherBall.speedY = cos * vy2Final - sin * vx2Final;

          const newX1 = ball.x + (x2 - x1) * cos - (y2 - y1) * sin;
          const newY1 = ball.y + (y2 - y1) * cos + (x2 - x1) * sin;
          const newX2 = otherBall.x + (x2 - x1) * cos - (y2 - y1) * sin;
          const newY2 = otherBall.y + (y2 - y1) * cos + (x2 - x1) * sin;

          ball.x = newX1;
          ball.y = newY1;
          otherBall.x = newX2;
          otherBall.y = newY2;
        }
      }
    });
  };

  const handleCanvasClick = (event: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const mouseX = event.clientX - rect.left;
    const mouseY = event.clientY - rect.top;

    balls.forEach((ball) => {
      const dx = mouseX - ball.x;
      const dy = mouseY - ball.y;
      const distance = Math.sqrt(dx * dx + dy * dy);

      if (distance <= ball.radius) {
        handleBallClick(ball.id, dx, dy, balls);
        setMenuVisible(true);
      }
    });
  };

  const handleColorChange = (color: string) => {
    setCurrentColor(color);
    if (menuBallId !== null) {
      setBalls((prevBalls) =>
        prevBalls.map((ball) => {
          if (ball.id === menuBallId) {
            return { ...ball, color };
          }
          return ball;
        })
      );
    }
    setMenuVisible(false);
  };

  const handleBallClick = (ballId: number, impulseX: number, impulseY: number, balls: any[]) => {
    const impulseFactor = calculateImpulseFactor(balls[ballId].speedX, balls[ballId].speedY);
    const newSpeedX = calculateSpeedX(balls[ballId].speedX, impulseX, impulseFactor);
    const newSpeedY = calculateSpeedY(balls[ballId].speedY, impulseY, impulseFactor);
    setBalls((prevBalls) =>
      prevBalls.map((ball) => {
        if (ball.id === ballId) {
          return { ...ball, speedX: newSpeedX, speedY: newSpeedY };
        }
        return ball;
      })
    );
  };

  return (
    <div>
      {menuVisible && (
        <Menu onChangeColor={handleColorChange} setMenuVisible={setMenuVisible} />
      )}
      <canvas
        ref={canvasRef}
        width={800}
        height={600}
        onClick={handleCanvasClick}
        style={{ border: "1px solid black" }}
      />
    </div>
  );
};

export default Game;
