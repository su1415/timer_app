import React, { useState, useEffect } from "react";
import "./Timer.css";

const Timer = () => {
  const [workTime, setWorkTime] = useState(25 * 60);
  const [breakTime, setBreakTime] = useState(5 * 60);
  const [timeLeft, setTimeLeft] = useState(workTime);
  const [isWork, setIsWork] = useState(true);
  const [isActive, setIsActive] = useState(false);
  const [history, setHistory] = useState([]);
  const [startTime, setStartTime] = useState(null);

  useEffect(() => {
    if (Notification.permission !== "granted") {
      Notification.requestPermission();
    }


    if (isActive && startTime) {
      const interval = setInterval(() => {
        const currentTime = new Date().getTime();
        const elapsedTime = Math.floor((currentTime - startTime) / 1000);
        const remainingTime = (isWork ? workTime : breakTime) - elapsedTime;

        if (remainingTime > 0) {
          setTimeLeft(remainingTime);
        } else {
          const sessionType = isWork ? "Work" : "Break";
          const sessionTime = (isWork ? workTime : breakTime) / 60;
          const timestamp = new Date().toLocaleTimeString();
          addToHistory(sessionType, sessionTime, timestamp);

          if (isWork) {
            setStartTime(currentTime);
            setTimeLeft(breakTime);
            setIsWork(false);
            sendNotification("Work session complete! Time for a break.");
          } else {
            setStartTime(currentTime);
            setTimeLeft(workTime);
            setIsWork(true);
            sendNotification("Break is over! Time to work.");
          }
        }
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [isActive, startTime, isWork, workTime, breakTime]);

  const formatTime = (second) => {
    const minutes = Math.floor(second / 60);
    const remainingSeconds = second % 60;
    return `${minutes}:${remainingSeconds < 10 ? "0" : ""}${remainingSeconds}`
  };

  const onStartClick = () => {
    setStartTime(new Date().getTime());
    setIsActive(true);
  };

  const onStopClick = () => {
    setIsActive(false);
  };

  const onResetClick = () => {
    setTimeLeft(workTime);
    setIsWork(true);
    setIsActive(false);
    setStartTime(null);
  };

  const handleWorkTimeChange = (event) => {
    const newWorkTime = Number(event.target.value) * 60;
    setWorkTime(newWorkTime);
    if (isWork) {
      setTimeLeft(newWorkTime);
      setStartTime(new Date().getTime());
    }
  };

  const handleBreakTimeChange = (event) => {
    const newBreakTime = Number(event.target.value) * 60;
    setBreakTime(newBreakTime);
    if (!isWork) {
      setTimeLeft(newBreakTime);
      setStartTime(new Date().getTime());
    }
  };

  const calculateProgress = () => {
    const totalTime = isWork ? workTime : breakTime;
    return ((totalTime - timeLeft) / totalTime) * 100;
  };

  const sendNotification = (message) => {
    if (Notification.permission === "granted") {
      new Notification(message);
    }
  };

  const addToHistory = (sessionType, sessionTime, timestamp) => {
    setHistory([...history, { sessionType, sessionTime, timestamp }]);
  };

  return (
    <div className="timer-container">
      <h2 className="session-title">{ isWork ? "Work Time" : "Break Time" }</h2>
      <h3 className="time-display">{ formatTime(timeLeft) }</h3>

      <div className="settings">
        <label>Work Time: </label>
        <input
          type="number"
          value={ workTime / 60 }
          onChange={ handleWorkTimeChange }
          className="time-input"
        /> [min]
      </div>

      <div>
        <label>Break Time: </label>
        <input
          type="number"
          value={ breakTime / 60 }
          onChange={ handleBreakTimeChange }
          className="time-input"
        /> [min]
      </div>

      <div className="progress-bar">
        <div className="progress-fill" style={{ width: `${calculateProgress()}%` }}></div>
      </div>

      <button className="control-button start" onClick={ onStartClick }>Start</button>
      <button className="control-button stop" onClick={ onStopClick }>Stop</button>
      <button className="control-button reset" onClick={ onResetClick }>Reset</button>

      <h3>History</h3>
      <ul className="history-list">
        { history.map((entry, index) => (
          <li key={ index } className="history-item">
            { entry.timestamp } - { entry.sessionType } Session ( { entry.sessionTime } minutes )
          </li>
        )) }
      </ul>
    </div>
  );
};

export default Timer;
