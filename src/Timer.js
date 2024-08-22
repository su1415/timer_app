import React, { useState, useEffect } from "react";

const workTime = 25 * 60;

const Timer = () => {
  const [timeLeft, setTimeLeft] = useState(workTime);
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    if (timeLeft <= 0) {
      setIsActive(false);
      return;
    }

    let interval = null;
    if (isActive) {
      interval = setInterval(() => {
        setTimeLeft((timeLeft) => timeLeft - 1);
      } , 1000);
    }

    return () => clearInterval(interval);
  }, [isActive, timeLeft]);

  const formatTime = (second) => {
    const minutes = Math.floor(second / 60);
    const remainingSeconds = second % 60;
    return `${minutes}:${remainingSeconds < 10 ? "0" : ""}${remainingSeconds}`
  };

  const onResetClick = () => {
    setTimeLeft(workTime);
    setIsActive(false);
  };

  return (
    <div>
      <h2>{ formatTime(timeLeft) }</h2>
      <button onClick={ () => setIsActive(true) }>Start</button>
      <button onClick={ () => setIsActive(false) }>Stop</button>
      <button onClick={ onResetClick }>Reset</button>
    </div>
  );
};

export default Timer;
