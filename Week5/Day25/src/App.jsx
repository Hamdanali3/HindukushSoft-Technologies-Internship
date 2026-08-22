import { useEffect, useState } from 'react';
import { TaskProvider } from './context/TaskContext';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import StatsPanel from './components/StatsPanel';
import TaskList from './components/TaskList';
import TaskForm from './components/TaskForm';
import ConfirmDialog from './components/ConfirmDialog';
import './App.css';

export default function App() {
  const [theme, setTheme] = useState(() => {
    const stored = window.localStorage.getItem('taskindex.theme');
    if (stored) return stored;
    return window.matchMedia?.('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  });
  const [isMenuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    window.localStorage.setItem('taskindex.theme', theme);
  }, [theme]);

  return (
    <TaskProvider>
      <div className="app-shell">
        <Sidebar isOpen={isMenuOpen} onClose={() => setMenuOpen(false)} />

        <div className="app-main">
          <Header
            theme={theme}
            onToggleTheme={() => setTheme((t) => (t === 'dark' ? 'light' : 'dark'))}
            onOpenMenu={() => setMenuOpen(true)}
          />
          <StatsPanel />
          <TaskList />
        </div>

        <TaskForm />
        <ConfirmDialog />
      </div>
    </TaskProvider>
  );
}
