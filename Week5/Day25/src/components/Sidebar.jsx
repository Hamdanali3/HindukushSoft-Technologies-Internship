import { useTaskActions, useTaskState } from '../context/TaskContext';
import { CATEGORIES, isOverdue, isToday, isUpcoming } from '../utils/taskUtils';
import './Sidebar.css';

const VIEWS = [
  { key: 'all', label: 'All Tasks', icon: DrawerIcon },
  { key: 'today', label: 'Today', icon: TodayIcon },
  { key: 'upcoming', label: 'Upcoming', icon: UpcomingIcon },
  { key: 'completed', label: 'Completed', icon: CompletedIcon },
];

export default function Sidebar({ isOpen, onClose }) {
  const { tasks, ui } = useTaskState();
  const actions = useTaskActions();

  const counts = {
    all: tasks.length,
    today: tasks.filter((t) => !t.completed && (isToday(t.dueDate) || isOverdue(t.dueDate, t.completed))).length,
    upcoming: tasks.filter((t) => !t.completed && isUpcoming(t.dueDate)).length,
    completed: tasks.filter((t) => t.completed).length,
  };

  const categoryCounts = CATEGORIES.reduce((acc, cat) => {
    acc[cat] = tasks.filter((t) => t.category === cat && !t.completed).length;
    return acc;
  }, {});

  return (
    <>
      <div className={`sidebar-scrim ${isOpen ? 'is-visible' : ''}`} onClick={onClose} aria-hidden="true" />
      <aside className={`sidebar ${isOpen ? 'is-open' : ''}`} aria-label="Task navigation">
        <div className="sidebar__brand">
          <div className="sidebar__mark" aria-hidden="true">
            <BrandIcon />
          </div>
          <div>
            <p className="sidebar__brand-name">TaskIndex</p>
            <p className="sidebar__brand-tag">your working catalog</p>
          </div>
        </div>

        <nav className="sidebar__section">
          <p className="sidebar__label">Drawers</p>
          <ul>
            {VIEWS.map(({ key, label, icon: Icon }) => (
              <li key={key}>
                <button
                  type="button"
                  className={`sidebar__item ${ui.view === key ? 'is-active' : ''}`}
                  onClick={() => {
                    actions.setView(key);
                    onClose?.();
                  }}
                >
                  <Icon />
                  <span>{label}</span>
                  <span className="sidebar__count">{counts[key]}</span>
                </button>
              </li>
            ))}
          </ul>
        </nav>

        <nav className="sidebar__section">
          <p className="sidebar__label">Categories</p>
          <ul>
            {CATEGORIES.map((cat) => (
              <li key={cat}>
                <button
                  type="button"
                  className={`sidebar__item ${ui.category === cat ? 'is-active' : ''}`}
                  onClick={() => {
                    actions.setCategory(cat);
                    onClose?.();
                  }}
                >
                  <span className={`sidebar__dot sidebar__dot--${cat.toLowerCase()}`} />
                  <span>{cat}</span>
                  <span className="sidebar__count">{categoryCounts[cat]}</span>
                </button>
              </li>
            ))}
          </ul>
        </nav>

        <div className="sidebar__footer">
          <p>Built for Week 5 · Day 25</p>
          <p className="sidebar__footer-sub">React Fundamentals Project</p>
        </div>
      </aside>
    </>
  );
}

function BrandIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
      <rect x="3" y="3" width="18" height="18" rx="3" fill="currentColor" />
      <circle cx="8" cy="8.5" r="1.2" fill="var(--color-primary)" />
      <rect x="11" y="7.6" width="8" height="1.8" rx="0.9" fill="var(--color-primary)" />
      <circle cx="8" cy="12.5" r="1.2" fill="var(--color-primary)" />
      <rect x="11" y="11.6" width="8" height="1.8" rx="0.9" fill="var(--color-primary)" />
      <circle cx="8" cy="16.5" r="1.2" fill="var(--color-primary)" />
      <rect x="11" y="15.6" width="6" height="1.8" rx="0.9" fill="var(--color-primary)" />
    </svg>
  );
}

function DrawerIcon() {
  return (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <rect x="3" y="4" width="18" height="7" rx="1.5" />
      <rect x="3" y="13" width="18" height="7" rx="1.5" />
      <circle cx="12" cy="7.5" r="0.9" fill="currentColor" stroke="none" />
      <circle cx="12" cy="16.5" r="0.9" fill="currentColor" stroke="none" />
    </svg>
  );
}

function TodayIcon() {
  return (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <circle cx="12" cy="12" r="8.5" />
      <path d="M12 7.5V12l3 2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function UpcomingIcon() {
  return (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <rect x="3.5" y="5" width="17" height="15" rx="2" />
      <path d="M3.5 9.5h17" strokeLinecap="round" />
      <path d="M8 3v3.2M16 3v3.2" strokeLinecap="round" />
    </svg>
  );
}

function CompletedIcon() {
  return (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M4 12.5l5 5L20 6.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
