import { useTaskActions } from '../context/TaskContext';
import './EmptyState.css';

const COPY = {
  'no-tasks': {
    title: 'The catalog is empty',
    body: 'Add your first task and it will show up here, filed and ready to track.',
    cta: 'Add a task',
  },
  'no-matches': {
    title: 'No cards match this drawer',
    body: 'Try a different filter, clear the search, or add a task to this view.',
    cta: 'Add a task',
  },
};

export default function EmptyState({ variant }) {
  const actions = useTaskActions();
  const copy = COPY[variant] ?? COPY['no-tasks'];

  return (
    <div className="empty-state">
      <div className="empty-state__icon" aria-hidden="true">
        <svg width="46" height="46" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4">
          <rect x="3.5" y="4.5" width="17" height="15" rx="2" />
          <path d="M8 9.5h8M8 13.5h5" strokeLinecap="round" />
        </svg>
      </div>
      <h3>{copy.title}</h3>
      <p>{copy.body}</p>
      <button type="button" onClick={() => actions.openCreateForm()}>
        {copy.cta}
      </button>
    </div>
  );
}
