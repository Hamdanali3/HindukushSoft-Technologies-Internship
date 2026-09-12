import React from "react";
import TaskList from "./components/TaskList";
import "./styles/app.css";

export default function App() {
  return (
    <div className="app">
      <header className="app__header">
        <h1>TaskFlow</h1>
        <p>Full-stack CRUD — React talking to the Laravel API</p>
      </header>
      <main className="app__main">
        <TaskList />
      </main>
    </div>
  );
}
