// Экспортируемые функции для расчетов
export const calculateImpulseFactor = (
  initialSpeedX: number,
  initialSpeedY: number
): number => {
  const totalInitialSpeed = Math.sqrt(initialSpeedX ** 2 + initialSpeedY ** 2);
  return 1 - totalInitialSpeed / 10;
};

export const calculateSpeedX = (
  currentSpeedX: number,
  impulseX: number,
  impulseFactor: number
): number => {
  return currentSpeedX + impulseX * impulseFactor;
};

export const calculateSpeedY = (
  currentSpeedY: number,
  impulseY: number,
  impulseFactor: number
): number => {
  return currentSpeedY + impulseY * impulseFactor;
};
