import React, { useState } from "react";

const Timer = () => {
  const [timeLeft, setTimeLeft] = useState(25 * 60);

  const formatTime = (second) => {
    const minutes = Math.floor(second / 60);
    const remainingSeconds = second % 60;
    return `${minutes}:${remainingSeconds < 10 ? "0" : ""}${remainingSeconds}`
  };

  return (
    <div>
      { formatTime(timeLeft) }
    </div>
  );
};

export default Timer;
