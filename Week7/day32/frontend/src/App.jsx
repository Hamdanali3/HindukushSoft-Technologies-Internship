import React from "react";
import TaskList from "./components/TaskList";
import "./styles/app.css";

/**
 * App
 *
 * Day 32's entry point. Its only job is to compose the page layout
 * around <TaskList />, which does the real work of talking to the
 * Laravel API built in Day 31.
 */
export default function App() {
  return (
    <div className="app">
      <header className="app__header">
        <h1>TaskFlow</h1>
        <p>Fetching live data from the Laravel REST API</p>
      </header>

      <main className="app__main">
        <TaskList />
      </main>
    </div>
  );
}
