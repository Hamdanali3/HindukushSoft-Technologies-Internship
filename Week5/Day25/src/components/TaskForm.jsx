import { useEffect, useRef, useState } from 'react';
import { useTaskActions, useTaskState } from '../context/TaskContext';
import { CATEGORIES, PRIORITIES } from '../utils/taskUtils';
import './TaskForm.css';

const EMPTY_FORM = {
  title: '',
  notes: '',
  category: CATEGORIES[0],
  priority: 'medium',
  dueDate: '',
};

function toDateInputValue(iso) {
  if (!iso) return '';
  return new Date(iso).toISOString().slice(0, 10);
}

export default function TaskForm() {
  const { tasks, ui } = useTaskState();
  const actions = useTaskActions();
  const titleRef = useRef(null);

  const editingTask = ui.editingTaskId ? tasks.find((t) => t.id === ui.editingTaskId) : null;
  const isEditing = Boolean(editingTask);

  const [form, setForm] = useState(EMPTY_FORM);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!ui.isFormOpen) return;
    if (editingTask) {
      setForm({
        title: editingTask.title,
        notes: editingTask.notes ?? '',
        category: editingTask.category,
        priority: editingTask.priority,
        dueDate: toDateInputValue(editingTask.dueDate),
      });
    } else {
      setForm(EMPTY_FORM);
    }
    setError('');
    // Autofocus the title field when the dialog opens
    const id = requestAnimationFrame(() => titleRef.current?.focus());
    return () => cancelAnimationFrame(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ui.isFormOpen, ui.editingTaskId]);

  useEffect(() => {
    function handleKeyDown(e) {
      if (e.key === 'Escape') actions.closeForm();
    }
    if (ui.isFormOpen) document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [ui.isFormOpen, actions]);

  if (!ui.isFormOpen) return null;

  function handleChange(field, value) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  function handleSubmit(e) {
    e.preventDefault();
    const trimmedTitle = form.title.trim();
    if (!trimmedTitle) {
      setError('Give the task a title before filing it.');
      titleRef.current?.focus();
      return;
    }

    const payload = {
      title: trimmedTitle,
      notes: form.notes.trim(),
      category: form.category,
      priority: form.priority,
      dueDate: form.dueDate ? new Date(form.dueDate).toISOString() : null,
    };

    if (isEditing) {
      actions.updateTask(editingTask.id, payload);
    } else {
      actions.addTask(payload);
    }
  }

  return (
    <div className="task-form-overlay" onMouseDown={(e) => e.target === e.currentTarget && actions.closeForm()}>
      <div className="task-form" role="dialog" aria-modal="true" aria-labelledby="task-form-title">
        <div className="task-form__header">
          <h2 id="task-form-title">{isEditing ? 'Edit task' : 'New task card'}</h2>
          <button type="button" className="task-form__close" onClick={() => actions.closeForm()} aria-label="Close">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M6 6l12 12M18 6L6 18" strokeLinecap="round" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} noValidate>
          <div className="task-form__field">
            <label htmlFor="task-title">Title</label>
            <input
              id="task-title"
              ref={titleRef}
              type="text"
              value={form.title}
              onChange={(e) => handleChange('title', e.target.value)}
              placeholder="e.g. Review the onboarding doc"
              maxLength={120}
            />
            {error && <p className="task-form__error">{error}</p>}
          </div>

          <div className="task-form__field">
            <label htmlFor="task-notes">Notes (optional)</label>
            <textarea
              id="task-notes"
              value={form.notes}
              onChange={(e) => handleChange('notes', e.target.value)}
              placeholder="Any detail future-you will want"
              rows={3}
              maxLength={280}
            />
          </div>

          <div className="task-form__row">
            <div className="task-form__field">
              <label htmlFor="task-category">Category</label>
              <select id="task-category" value={form.category} onChange={(e) => handleChange('category', e.target.value)}>
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            <div className="task-form__field">
              <label htmlFor="task-priority">Priority</label>
              <select id="task-priority" value={form.priority} onChange={(e) => handleChange('priority', e.target.value)}>
                {PRIORITIES.map((p) => (
                  <option key={p.value} value={p.value}>
                    {p.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="task-form__field">
            <label htmlFor="task-due">Due date (optional)</label>
            <input id="task-due" type="date" value={form.dueDate} onChange={(e) => handleChange('dueDate', e.target.value)} />
          </div>

          <div className="task-form__actions">
            <button type="button" className="task-form__cancel" onClick={() => actions.closeForm()}>
              Cancel
            </button>
            <button type="submit" className="task-form__submit">
              {isEditing ? 'Save changes' : 'Add to catalog'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
