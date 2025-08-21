import { useEffect, useState } from "react";

export const useCountdown = (minutes, seconds, refetch) => {
  const [timeLeft, setTimeLeft] = useState({ minutes, seconds });

  useEffect(() => {
    if (timeLeft.minutes === 0 && timeLeft.seconds === 0) {
      refetch(); // Automatically refetch when countdown reaches zero
      return;
    }

    const interval = setInterval(() => {
      setTimeLeft((prevTime) => {
        if (prevTime.seconds === 0) {
          if (prevTime.minutes === 0) {
            clearInterval(interval);
            return { minutes: 0, seconds: 0 };
          }
          return { minutes: prevTime.minutes - 1, seconds: 59 };
        }
        return { ...prevTime, seconds: prevTime.seconds - 1 };
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [timeLeft, refetch]);

  return `${timeLeft.minutes}:${String(timeLeft.seconds).padStart(2, "0")}`;
};
