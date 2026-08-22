import { useTaskState } from '../context/TaskContext';
import { computeStats } from '../utils/taskUtils';
import './StatsPanel.css';

const RADIUS = 30;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

export default function StatsPanel() {
  const { tasks } = useTaskState();
  const stats = computeStats(tasks);
  const offset = CIRCUMFERENCE - (stats.percentComplete / 100) * CIRCUMFERENCE;

  return (
    <section className="stats" aria-label="Task progress summary">
      <div className="stats__ring">
        <svg width="72" height="72" viewBox="0 0 72 72">
          <circle cx="36" cy="36" r={RADIUS} fill="none" stroke="var(--color-border)" strokeWidth="7" />
          <circle
            cx="36"
            cy="36"
            r={RADIUS}
            fill="none"
            stroke="var(--color-primary)"
            strokeWidth="7"
            strokeLinecap="round"
            strokeDasharray={CIRCUMFERENCE}
            strokeDashoffset={offset}
            transform="rotate(-90 36 36)"
          />
        </svg>
        <span className="stats__ring-label">{stats.percentComplete}%</span>
      </div>

      <dl className="stats__grid">
        <div className="stats__item">
          <dt>Open</dt>
          <dd>{stats.total - stats.completed}</dd>
        </div>
        <div className="stats__item">
          <dt>Due today</dt>
          <dd className={stats.dueToday > 0 ? 'is-warning' : ''}>{stats.dueToday}</dd>
        </div>
        <div className="stats__item">
          <dt>Overdue</dt>
          <dd className={stats.overdue > 0 ? 'is-danger' : ''}>{stats.overdue}</dd>
        </div>
        <div className="stats__item">
          <dt>Completed</dt>
          <dd>{stats.completed}</dd>
        </div>
      </dl>
    </section>
  );
}
