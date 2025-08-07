import { useState, useEffect } from "react";

export const useCountDown = (initialSeconds) => {
  const [secondsLeft, setSecondsLeft] = useState(initialSeconds);

  const startCountdown = () => {
    setSecondsLeft(initialSeconds);
  };

  useEffect(() => {
    if (secondsLeft <= 0) return;

    const timer = setTimeout(() => {
      setSecondsLeft(secondsLeft - 1);
    }, 1000);

    return () => clearTimeout(timer);
  }, [secondsLeft]);

  return { secondsLeft, startCountdown };
};
