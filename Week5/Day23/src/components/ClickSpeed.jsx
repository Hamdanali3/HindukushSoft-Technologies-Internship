import React, { useState, useEffect, useRef } from 'react';

export default function ClickSpeed() {
  const [clicks, setClicks] = useState(0);
  const [cps, setCps] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [timeLeft, setTimeLeft] = useState(10); // 10 seconds test

  useEffect(() => {
    let intervalId;
    if (isActive && timeLeft > 0) {
      intervalId = setInterval(() => {
        setTimeLeft(t => t - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      setIsActive(false);
      setCps(clicks / 10);
    }
    return () => clearInterval(intervalId);
  }, [isActive, timeLeft, clicks]);

  const handleClick = () => {
    if (timeLeft === 0) return;
    
    if (!isActive) {
      setIsActive(true);
    }
    
    setClicks(c => c + 1);
    // Rough real-time CPS estimation
    if (10 - timeLeft > 0) {
      setCps(clicks / (10 - timeLeft));
    }
  };

  const handleReset = () => {
    setIsActive(false);
    setClicks(0);
    setCps(0);
    setTimeLeft(10);
  };

  // Speedometer rotation (max out at 15 CPS for visualization)
  const rotation = Math.min((cps / 15) * 180, 180) - 90;

  return (
    <div className="glass-panel clickspeed-widget">
      <h2>Click Speed Tracker</h2>
      
      <div className="speedometer">
        <div className="speed-gauge" style={{ transform: `rotate(${rotation}deg)` }}></div>
        <div className="speed-value">
          <span className="num">{cps.toFixed(1)}</span>
          <span className="unit">CPS</span>
        </div>
      </div>

      <div className="stats-row">
        <div className="stat-box">
          <span className="label">Time</span>
          <span className="value">{timeLeft}s</span>
        </div>
        <div className="stat-box">
          <span className="label">Clicks</span>
          <span className="value">{clicks}</span>
        </div>
      </div>

      <button 
        className="click-area" 
        onClick={handleClick}
        disabled={timeLeft === 0}
      >
        {timeLeft === 0 ? 'Time Up!' : (isActive ? 'CLICK ME!' : 'Click to Start')}
      </button>

      <button className="btn-secondary reset-btn" onClick={handleReset}>
        Reset Test
      </button>

      <style>{`
        .clickspeed-widget h2 { margin-bottom: 20px; }
        
        .speedometer {
          position: relative;
          width: 200px;
          height: 100px;
          margin: 0 auto 30px;
          border-top-left-radius: 100px;
          border-top-right-radius: 100px;
          background: linear-gradient(90deg, var(--success-color) 0%, var(--warning-color) 50%, var(--danger-color) 100%);
          overflow: hidden;
          box-shadow: inset 0 5px 10px rgba(0,0,0,0.1);
        }
        
        .speedometer::after {
          content: '';
          position: absolute;
          bottom: 0;
          left: 50%;
          transform: translateX(-50%);
          width: 160px;
          height: 80px;
          background: var(--card-bg);
          border-top-left-radius: 80px;
          border-top-right-radius: 80px;
        }

        .speed-gauge {
          position: absolute;
          bottom: -5px;
          left: 50%;
          width: 4px;
          height: 90px;
          background: var(--text-color);
          transform-origin: bottom center;
          border-radius: 2px;
          z-index: 2;
          transition: transform 0.2s ease-out;
        }

        .speed-value {
          position: absolute;
          bottom: 10px;
          left: 50%;
          transform: translateX(-50%);
          z-index: 3;
          text-align: center;
        }

        .speed-value .num {
          display: block;
          font-size: 1.8rem;
          font-weight: 700;
          font-family: 'Space Grotesk', sans-serif;
          line-height: 1;
        }

        .speed-value .unit {
          font-size: 0.8rem;
          opacity: 0.7;
        }

        .stats-row {
          display: flex;
          justify-content: center;
          gap: 20px;
          margin-bottom: 20px;
        }

        .stat-box {
          background: rgba(128, 128, 128, 0.1);
          padding: 10px 20px;
          border-radius: 8px;
          text-align: center;
          min-width: 80px;
        }

        .stat-box .label {
          display: block;
          font-size: 0.8rem;
          opacity: 0.7;
          margin-bottom: 4px;
        }

        .stat-box .value {
          font-size: 1.2rem;
          font-weight: 600;
          font-family: 'Space Grotesk', sans-serif;
        }

        .click-area {
          display: block;
          width: 100%;
          padding: 20px;
          font-size: 1.5rem;
          font-weight: 700;
          font-family: 'Space Grotesk', sans-serif;
          background: var(--accent-color);
          color: white;
          border-radius: 12px;
          border: none;
          cursor: pointer;
          transition: transform 0.1s, background 0.2s;
          margin-bottom: 16px;
          box-shadow: 0 4px 15px rgba(99, 102, 241, 0.4);
        }

        .click-area:active:not(:disabled) {
          transform: scale(0.95);
        }

        .click-area:disabled {
          background: rgba(128, 128, 128, 0.2);
          color: var(--text-color);
          box-shadow: none;
          cursor: not-allowed;
          opacity: 0.7;
        }

        .reset-btn {
          width: 100%;
        }
      `}</style>
    </div>
  );
}
