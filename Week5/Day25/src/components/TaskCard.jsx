import { useTaskActions } from '../context/TaskContext';
import { formatDueDate, isOverdue, isToday } from '../utils/taskUtils';
import './TaskCard.css';

const PRIORITY_META = {
  urgent: { label: 'Urgent', className: 'urgent' },
  high: { label: 'High', className: 'high' },
  medium: { label: 'Medium', className: 'medium' },
  low: { label: 'Low', className: 'low' },
};

export default function TaskCard({ task }) {
  const actions = useTaskActions();
  const overdue = isOverdue(task.dueDate, task.completed);
  const dueToday = isToday(task.dueDate) && !task.completed;
  const priority = PRIORITY_META[task.priority] ?? PRIORITY_META.medium;

  return (
    <li className={`task-card ${task.completed ? 'is-completed' : ''}`}>
      <div className="task-card__holes" aria-hidden="true">
        <span />
        <span />
        <span />
      </div>

      <button
        type="button"
        className="task-card__check"
        onClick={() => actions.toggleComplete(task.id)}
        aria-pressed={task.completed}
        aria-label={task.completed ? 'Mark task as not done' : 'Mark task as done'}
      >
        {task.completed && (
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
            <path d="M4 12.5l5 5L20 6.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        )}
      </button>

      <div className="task-card__body">
        <div className="task-card__row">
          <p className="task-card__title">{task.title}</p>
          <span className={`task-card__priority task-card__priority--${priority.className}`}>{priority.label}</span>
        </div>

        {task.notes && <p className="task-card__notes">{task.notes}</p>}

        <div className="task-card__meta">
          <span className={`task-card__due ${overdue ? 'is-overdue' : ''} ${dueToday ? 'is-today' : ''}`}>
            <CalendarIcon />
            {formatDueDate(task.dueDate)}
          </span>
          <span className="task-card__category">{task.category}</span>
        </div>
      </div>

      {overdue && (
        <span className="task-card__stamp" aria-hidden="true">
          Past Due
        </span>
      )}

      <div className="task-card__actions">
        <button type="button" onClick={() => actions.openEditForm(task.id)} aria-label="Edit task" title="Edit">
          <EditIcon />
        </button>
        <button
          type="button"
          className="task-card__delete"
          onClick={() => actions.requestDelete(task.id)}
          aria-label="Delete task"
          title="Delete"
        >
          <TrashIcon />
        </button>
      </div>
    </li>
  );
}

function CalendarIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="3.5" y="5" width="17" height="15" rx="2" />
      <path d="M3.5 9.5h17" strokeLinecap="round" />
      <path d="M8 3v3.2M16 3v3.2" strokeLinecap="round" />
    </svg>
  );
}

function EditIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M4 20l.9-4L16.5 4.4a1.5 1.5 0 0 1 2.1 0l1 1a1.5 1.5 0 0 1 0 2.1L8 19.1 4 20z" strokeLinejoin="round" />
    </svg>
  );
}

function TrashIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M4.5 6.5h15M9 6.5V4.8a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1V6.5M18 6.5l-.7 12.3a1.6 1.6 0 0 1-1.6 1.5H8.3a1.6 1.6 0 0 1-1.6-1.5L6 6.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
