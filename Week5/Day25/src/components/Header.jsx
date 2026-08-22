import { useTaskActions, useTaskState } from '../context/TaskContext';
import './Header.css';

const VIEW_TITLES = {
  all: 'All Tasks',
  today: 'Today',
  upcoming: 'Upcoming',
  completed: 'Completed',
};

export default function Header({ theme, onToggleTheme, onOpenMenu }) {
  const { ui } = useTaskState();
  const actions = useTaskActions();

  const title = ui.category !== 'all' ? ui.category : VIEW_TITLES[ui.view];

  return (
    <header className="header">
      <div className="header__top">
        <button type="button" className="header__menu-btn" onClick={onOpenMenu} aria-label="Open navigation">
          <MenuIcon />
        </button>

        <h1 className="header__title">{title}</h1>

        <div className="header__actions">
          <button
            type="button"
            className="header__icon-btn"
            onClick={onToggleTheme}
            aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
            title={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
          >
            {theme === 'dark' ? <SunIcon /> : <MoonIcon />}
          </button>
          <button type="button" className="header__add-btn" onClick={() => actions.openCreateForm()}>
            <PlusIcon />
            <span>New Task</span>
          </button>
        </div>
      </div>

      <div className="header__toolbar">
        <div className="header__search">
          <SearchIcon />
          <input
            type="search"
            placeholder="Search the catalog…"
            value={ui.search}
            onChange={(e) => actions.setSearch(e.target.value)}
            aria-label="Search tasks"
          />
        </div>

        <label className="header__sort">
          <span>Sort</span>
          <select value={ui.sortBy} onChange={(e) => actions.setSortBy(e.target.value)}>
            <option value="dueDate">Due date</option>
            <option value="priority">Priority</option>
            <option value="recent">Recently added</option>
          </select>
        </label>
      </div>
    </header>
  );
}

function MenuIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M4 6h16M4 12h16M4 18h16" strokeLinecap="round" />
    </svg>
  );
}

function PlusIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
      <path d="M12 5v14M5 12h14" strokeLinecap="round" />
    </svg>
  );
}

function SearchIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <circle cx="11" cy="11" r="6.5" />
      <path d="M20 20l-4.3-4.3" strokeLinecap="round" />
    </svg>
  );
}

function SunIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <circle cx="12" cy="12" r="4.2" />
      <path
        d="M12 3v2.2M12 18.8V21M4.9 4.9l1.55 1.55M17.55 17.55L19.1 19.1M3 12h2.2M18.8 12H21M4.9 19.1l1.55-1.55M17.55 6.45L19.1 4.9"
        strokeLinecap="round"
      />
    </svg>
  );
}

function MoonIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M20 14.5A8.5 8.5 0 1 1 9.5 4a6.8 6.8 0 0 0 10.5 10.5z" strokeLinejoin="round" />
    </svg>
  );
}
