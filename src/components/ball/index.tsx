interface BallProps {
    x: number;
    y: number;
    radius: number;
    color: string;

  }
  
  const Ball: React.FC<BallProps> = () => {
    return null; // компонент Ball теперь не нуждается в рендеринге JSX
  };
  
  export default Ball;