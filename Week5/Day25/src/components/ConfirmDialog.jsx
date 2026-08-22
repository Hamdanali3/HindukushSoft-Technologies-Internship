import { useTaskActions, useTaskState } from '../context/TaskContext';
import './ConfirmDialog.css';

export default function ConfirmDialog() {
  const { tasks, ui } = useTaskState();
  const actions = useTaskActions();

  if (!ui.pendingDeleteId) return null;

  const task = tasks.find((t) => t.id === ui.pendingDeleteId);
  if (!task) return null;

  return (
    <div className="confirm-overlay" onMouseDown={(e) => e.target === e.currentTarget && actions.cancelDelete()}>
      <div className="confirm-dialog" role="alertdialog" aria-modal="true" aria-labelledby="confirm-title">
        <h2 id="confirm-title">Remove this card?</h2>
        <p>
          &ldquo;<strong>{task.title}</strong>&rdquo; will be deleted for good. This can&rsquo;t be undone.
        </p>
        <div className="confirm-dialog__actions">
          <button type="button" className="confirm-dialog__cancel" onClick={() => actions.cancelDelete()}>
            Keep it
          </button>
          <button type="button" className="confirm-dialog__delete" onClick={() => actions.deleteTask(task.id)}>
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}
