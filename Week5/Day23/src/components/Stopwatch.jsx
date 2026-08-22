import React, { useState, useEffect } from 'react';

export default function Stopwatch() {
  const [time, setTime] = useState(0); // in centiseconds
  const [isRunning, setIsRunning] = useState(false);
  const [laps, setLaps] = useState([]);

  useEffect(() => {
    let intervalId;
    if (isRunning) {
      intervalId = setInterval(() => setTime(t => t + 1), 10);
    }
    return () => clearInterval(intervalId);
  }, [isRunning]);

  const handleStartStop = () => {
    setIsRunning(!isRunning);
  };

  const handleReset = () => {
    setIsRunning(false);
    setTime(0);
    setLaps([]);
  };

  const handleLap = () => {
    setLaps(prev => [time, ...prev]);
  };

  const formatTime = (timeInCs) => {
    const mins = Math.floor(timeInCs / 6000);
    const secs = Math.floor((timeInCs % 6000) / 100);
    const cs = timeInCs % 100;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}.${cs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="glass-panel stopwatch-widget">
      <h2>Stopwatch</h2>
      
      <div className="clock-display">
        {formatTime(time)}
      </div>

      <div className="controls">
        <button 
          className={isRunning ? "btn-warning" : "btn-primary"} 
          onClick={handleStartStop}
        >
          {isRunning ? 'Stop' : 'Start'}
        </button>
        <button 
          className="btn-secondary" 
          onClick={handleLap} 
          disabled={!isRunning}
        >
          Lap
        </button>
        <button 
          className="btn-danger" 
          onClick={handleReset}
        >
          Reset
        </button>
      </div>

      <div className="laps-container">
        <h3>Laps</h3>
        {laps.length === 0 ? (
          <p className="no-laps">No laps recorded</p>
        ) : (
          <ul className="laps-list">
            {laps.map((lapTime, idx) => (
              <li key={idx}>
                <span>Lap {laps.length - idx}</span>
                <span className="lap-time">{formatTime(lapTime)}</span>
              </li>
            ))}
          </ul>
        )}
      </div>

      <style>{`
        .stopwatch-widget h2 { margin-bottom: 20px; }
        .clock-display {
          font-family: 'JetBrains Mono', monospace;
          font-size: 3.5rem;
          font-weight: 700;
          text-align: center;
          margin: 20px 0;
          color: var(--accent-color);
          text-shadow: 0 0 10px rgba(99, 102, 241, 0.2);
        }
        .btn-warning {
          background-color: transparent;
          border: 1px solid var(--warning-color);
          color: var(--warning-color);
        }
        .btn-warning:hover {
          background-color: var(--warning-color);
          color: white;
        }
        .controls {
          display: flex;
          justify-content: center;
          gap: 12px;
          margin-bottom: 24px;
        }
        .laps-container h3 {
          font-size: 1rem;
          margin-bottom: 12px;
          opacity: 0.8;
        }
        .no-laps {
          opacity: 0.5;
          font-size: 0.9rem;
          text-align: center;
        }
        .laps-list {
          list-style: none;
          max-height: 150px;
          overflow-y: auto;
          padding-right: 8px;
        }
        .laps-list::-webkit-scrollbar {
          width: 6px;
        }
        .laps-list::-webkit-scrollbar-thumb {
          background: rgba(128, 128, 128, 0.3);
          border-radius: 4px;
        }
        .laps-list li {
          display: flex;
          justify-content: space-between;
          padding: 8px 12px;
          background: rgba(128, 128, 128, 0.05);
          margin-bottom: 8px;
          border-radius: 6px;
          font-size: 0.9rem;
        }
        .lap-time {
          font-family: 'JetBrains Mono', monospace;
          font-weight: 700;
        }
      `}</style>
    </div>
  );
}
