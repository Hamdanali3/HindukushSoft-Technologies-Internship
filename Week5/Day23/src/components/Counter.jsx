import React, { useEffect, useRef, useState } from "react";
import "./Counter.css";

const COUNT_STORAGE_KEY = "tallylab.count";
const MIN_VALUE = 0;
const MAX_VALUE = 9999;
const STEP_OPTIONS = [1, 5, 10];
const DIGIT_COUNT = 4;

/**
 * Counter
 * -------
 * The instrument's core mechanism. Everything here is driven by useState:
 *  - `count`      the tallied value, restored from localStorage on load
 *  - `step`       how far each press moves the count (×1 / ×5 / ×10)
 *  - `stats`      a running log of increments, decrements and resets
 *  - `limitHit`   which edge ("upper" | "lower" | null) was just bumped,
 *                 used to trigger a brief warning + shake
 *
 * Every control — the two big press buttons, the reset lever, the step
 * selector and the keyboard shortcuts (↑ / ↓ / R) — funnels through the
 * same three handlers, so the counter behaves identically no matter how
 * it's driven.
 */
export default function Counter() {
  const [count, setCount] = useState(() => {
    if (typeof window === "undefined") return 0;
    const saved = Number(window.localStorage.getItem(COUNT_STORAGE_KEY));
    return Number.isFinite(saved) && saved >= MIN_VALUE && saved <= MAX_VALUE
      ? saved
      : 0;
  });
  const [step, setStep] = useState(1);
  const [stats, setStats] = useState({
    increments: 0,
    decrements: 0,
    resets: 0,
    peak: count
  });
  const [limitHit, setLimitHit] = useState(null); // "upper" | "lower" | null
  const limitTimeoutRef = useRef(null);

  useEffect(() => {
    window.localStorage.setItem(COUNT_STORAGE_KEY, String(count));
  }, [count]);

  useEffect(() => {
    return () => clearTimeout(limitTimeoutRef.current);
  }, []);

  function flashLimit(edge) {
    setLimitHit(edge);
    clearTimeout(limitTimeoutRef.current);
    limitTimeoutRef.current = setTimeout(() => setLimitHit(null), 620);
  }

  function increment() {
    const next = Math.min(count + step, MAX_VALUE);
    if (next === count) {
      flashLimit("upper");
      return;
    }
    setCount(next);
    setStats((s) => ({
      ...s,
      increments: s.increments + 1,
      peak: Math.max(s.peak, next)
    }));
  }

  function decrement() {
    const next = Math.max(count - step, MIN_VALUE);
    if (next === count) {
      flashLimit("lower");
      return;
    }
    setCount(next);
    setStats((s) => ({ ...s, decrements: s.decrements + 1 }));
  }

  function reset() {
    setCount(0);
    setStats((s) => ({ ...s, resets: s.resets + 1 }));
  }

  // Keyboard shortcuts: ArrowUp / ArrowDown move the tally, R resets it.
  useEffect(() => {
    function handleKeyDown(event) {
      const target = event.target;
      const isTypingField =
        target instanceof HTMLElement &&
        ["INPUT", "TEXTAREA"].includes(target.tagName);
      if (isTypingField) return;

      if (event.key === "ArrowUp") {
        event.preventDefault();
        increment();
      } else if (event.key === "ArrowDown") {
        event.preventDefault();
        decrement();
      } else if (event.key.toLowerCase() === "r") {
        event.preventDefault();
        reset();
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [count, step]);

  const digits = String(count).padStart(DIGIT_COUNT, "0").split("");

  return (
    <section className="counter" aria-label="Tally counter">
      <div
        className="counter__readout"
        data-limit={limitHit}
        role="status"
        aria-live="polite"
      >
        {digits.map((digit, index) => (
          <DigitReel key={index} digit={digit} position={index} />
        ))}
      </div>

      <p className="counter__hint" data-visible={Boolean(limitHit)}>
        {limitHit === "upper" && `Upper limit reached — ${MAX_VALUE} max`}
        {limitHit === "lower" && `Lower limit reached — ${MIN_VALUE} min`}
        {!limitHit && "Use ↑ / ↓ or the levers below · R resets"}
      </p>

      <div className="counter__controls">
        <button
          type="button"
          className="lever lever--decrement"
          onClick={decrement}
          aria-label={`Decrease tally by ${step}`}
        >
          <span aria-hidden="true">−</span>
        </button>

        <button
          type="button"
          className="lever lever--reset"
          onClick={reset}
          aria-label="Reset tally to zero"
        >
          Reset
        </button>

        <button
          type="button"
          className="lever lever--increment"
          onClick={increment}
          aria-label={`Increase tally by ${step}`}
        >
          <span aria-hidden="true">+</span>
        </button>
      </div>

      <div className="counter__step">
        <span className="counter__step-label">Step</span>
        <div className="counter__step-options" role="group" aria-label="Step size">
          {STEP_OPTIONS.map((value) => (
            <button
              key={value}
              type="button"
              className="counter__step-option"
              data-active={step === value}
              onClick={() => setStep(value)}
              aria-pressed={step === value}
            >
              ×{value}
            </button>
          ))}
        </div>
      </div>

      <dl className="counter__stats">
        <div className="counter__stat">
          <dt>Increments</dt>
          <dd>{stats.increments}</dd>
        </div>
        <div className="counter__stat">
          <dt>Decrements</dt>
          <dd>{stats.decrements}</dd>
        </div>
        <div className="counter__stat">
          <dt>Peak</dt>
          <dd>{stats.peak}</dd>
        </div>
        <div className="counter__stat">
          <dt>Resets</dt>
          <dd>{stats.resets}</dd>
        </div>
      </dl>
    </section>
  );
}

/**
 * DigitReel
 * ---------
 * Renders one mechanical digit wheel. Using the digit's value as the
 * React `key` forces a remount whenever it changes, which replays the
 * CSS entrance animation — a lightweight way to get an odometer-style
 * flip without hand-rolled animation timers.
 */
function DigitReel({ digit, position }) {
  return (
    <span className="reel" data-position={position}>
      <span key={digit} className="reel__digit">
        {digit}
      </span>
    </span>
  );
}
