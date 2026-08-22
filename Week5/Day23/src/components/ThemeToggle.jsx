import React, { useState } from "react";
import "./ThemeToggle.css";

/**
 * ThemeToggle
 * -----------
 * A physical-feeling rocker switch that flips the instrument between
 * "Day Lab" and "Night Lab" lighting. `theme` / `onToggle` are lifted to
 * the parent so the whole panel can react to it, but the switch keeps a
 * small piece of local UI state (`isPressed`) purely for its own tactile
 * press animation — a deliberate, contained use of useState.
 */
export default function ThemeToggle({ theme, onToggle }) {
  const [isPressed, setIsPressed] = useState(false);
  const isNight = theme === "night";

  function handleKeyDown(event) {
    if (event.key === " " || event.key === "Enter") {
      event.preventDefault();
      onToggle();
    }
  }

  return (
    <div className="toggle">
      <span className="toggle__label" data-active={!isNight}>
        Day
      </span>

      <button
        type="button"
        role="switch"
        aria-checked={isNight}
        aria-label="Toggle instrument lighting between day and night mode"
        className="toggle__switch"
        data-state={isNight ? "night" : "day"}
        data-pressed={isPressed}
        onClick={onToggle}
        onKeyDown={handleKeyDown}
        onMouseDown={() => setIsPressed(true)}
        onMouseUp={() => setIsPressed(false)}
        onMouseLeave={() => setIsPressed(false)}
        onTouchStart={() => setIsPressed(true)}
        onTouchEnd={() => setIsPressed(false)}
      >
        <span className="toggle__track">
          <span className="toggle__led" aria-hidden="true" />
          <span className="toggle__thumb" aria-hidden="true" />
        </span>
      </button>

      <span className="toggle__label" data-active={isNight}>
        Night
      </span>
    </div>
  );
}
