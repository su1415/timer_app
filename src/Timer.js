import React, { useState, useEffect } from "react";
import "./Timer.css";

const Timer = () => {
  const [workTime, setWorkTime] = useState(25 * 60);
  const [breakTime, setBreakTime] = useState(5 * 60);
  const [timeLeft, setTimeLeft] = useState(workTime);
  const [isWork, setIsWork] = useState(true);
  const [isActive, setIsActive] = useState(false);
  const [history, setHistory] = useState([]);

  useEffect(() => {
    if (Notification.permission !== "granted") {
      Notification.requestPermission();
    }

    if (timeLeft <= 0) {
      const sessionType = isWork ? "Work" : "Break";
      const sessionTime = (isWork ? workTime : breakTime) / 60;
      const timestamp = new Date().toLocaleTimeString();
      addToHistory(sessionType, sessionTime, timestamp);

      if (isWork) {
        setTimeLeft(breakTime);
        setIsWork(false);
        sendNotification("Work session complete! Time for a break.");
      } else {
        setTimeLeft(workTime);
        setIsWork(true);
        sendNotification("Break is over! Time to work.");
      }
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
    setIsWork(true);
    setIsActive(false);
  };

  const handleWorkTimeChange = (event) => {
    const newWorkTime = Number(event.target.value) * 60;
    setWorkTime(newWorkTime);
    if (isWork) { setTimeLeft(newWorkTime); }
  };

  const handleBreakTimeChange = (event) => {
    const newBreakTime = Number(event.target.value) * 60;
    setBreakTime(newBreakTime);
    if (!isWork) { setTimeLeft(newBreakTime); }
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

      <button className="control-button start" onClick={ () => setIsActive(true) }>Start</button>
      <button className="control-button stop" onClick={ () => setIsActive(false) }>Stop</button>
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
