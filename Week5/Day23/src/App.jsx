import React, { useEffect, useState } from "react";
import ThemeToggle from "./components/ThemeToggle.jsx";
import Counter from "./components/Counter.jsx";
import "./App.css";

const THEME_STORAGE_KEY = "tallylab.theme";

/**
 * App
 * ---
 * Top-level shell. Owns the single piece of state that both major
 * features of this assignment share a pattern with — useState —
 * this time driving the "Day Lab / Night Lab" instrument theme.
 *
 * The theme is read once from localStorage on mount (falling back to the
 * visitor's OS preference) and written back on every change, so the panel
 * remembers how you left it.
 */
export default function App() {
  const [theme, setTheme] = useState(() => {
    if (typeof window === "undefined") return "day";
    const saved = window.localStorage.getItem(THEME_STORAGE_KEY);
    if (saved === "day" || saved === "night") return saved;
    const prefersNight = window.matchMedia?.(
      "(prefers-color-scheme: dark)"
    ).matches;
    return prefersNight ? "night" : "day";
  });

  useEffect(() => {
    document.documentElement.setAttribute(
      "data-theme",
      theme === "night" ? "night" : "day"
    );
    window.localStorage.setItem(THEME_STORAGE_KEY, theme);
  }, [theme]);

  function toggleTheme() {
    setTheme((current) => (current === "day" ? "night" : "day"));
  }

  return (
    <div className="stage">
      <div className="stage__vignette" aria-hidden="true" />

      <main className="plate" data-theme-live={theme}>
        <div className="plate__rivet plate__rivet--tl" aria-hidden="true" />
        <div className="plate__rivet plate__rivet--tr" aria-hidden="true" />
        <div className="plate__rivet plate__rivet--bl" aria-hidden="true" />
        <div className="plate__rivet plate__rivet--br" aria-hidden="true" />

        <header className="plate__header">
          <div className="plate__heading">
            <p className="plate__eyebrow">Model&nbsp;TC-9&nbsp;·&nbsp;Manual Tally Instrument</p>
            <h1 className="plate__title">TallyLab</h1>
            <p className="plate__subtitle">
              A precision counter for anything worth counting by hand.
            </p>
          </div>

          <ThemeToggle theme={theme} onToggle={toggleTheme} />
        </header>

        <Counter />

        <footer className="plate__footer">
          <span>SN · 2026-D23</span>
          <span className="plate__footer-divider" aria-hidden="true">
            •
          </span>
          <span>Calibrated for React 18</span>
        </footer>
      </main>
    </div>
  );
}
