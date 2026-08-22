import { createContext, useContext, useMemo, useReducer } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { createId, getSeedTasks } from '../utils/taskUtils';

const TaskStateContext = createContext(null);
const TaskDispatchContext = createContext(null);

const initialUIState = {
  view: 'all', // 'all' | 'today' | 'upcoming' | 'completed'
  category: 'all',
  search: '',
  sortBy: 'dueDate', // 'dueDate' | 'priority' | 'recent'
  isFormOpen: false,
  editingTaskId: null,
  pendingDeleteId: null,
};

function uiReducer(state, action) {
  switch (action.type) {
    case 'SET_VIEW':
      return { ...state, view: action.payload, category: 'all' };
    case 'SET_CATEGORY':
      return { ...state, category: action.payload, view: 'all' };
    case 'SET_SEARCH':
      return { ...state, search: action.payload };
    case 'SET_SORT':
      return { ...state, sortBy: action.payload };
    case 'OPEN_CREATE_FORM':
      return { ...state, isFormOpen: true, editingTaskId: null };
    case 'OPEN_EDIT_FORM':
      return { ...state, isFormOpen: true, editingTaskId: action.payload };
    case 'CLOSE_FORM':
      return { ...state, isFormOpen: false, editingTaskId: null };
    case 'REQUEST_DELETE':
      return { ...state, pendingDeleteId: action.payload };
    case 'CANCEL_DELETE':
      return { ...state, pendingDeleteId: null };
    default:
      return state;
  }
}

/**
 * TaskProvider owns two independent pieces of state:
 *  - tasks: the persisted domain data (localStorage-backed)
 *  - ui: transient view/filter/modal state (in-memory only, via useReducer)
 * Splitting them keeps "what the user is looking at" from ever leaking
 * into the saved data, and keeps re-renders scoped sensibly.
 */
export function TaskProvider({ children }) {
  const [tasks, setTasks] = useLocalStorage('taskindex.tasks', getSeedTasks);
  const [ui, dispatch] = useReducer(uiReducer, initialUIState);

  const actions = useMemo(
    () => ({
      addTask(taskInput) {
        const newTask = {
          id: createId(),
          completed: false,
          createdAt: new Date().toISOString(),
          ...taskInput,
        };
        setTasks((prev) => [newTask, ...prev]);
        dispatch({ type: 'CLOSE_FORM' });
      },
      updateTask(id, updates) {
        setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, ...updates } : t)));
        dispatch({ type: 'CLOSE_FORM' });
      },
      toggleComplete(id) {
        setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t)));
      },
      deleteTask(id) {
        setTasks((prev) => prev.filter((t) => t.id !== id));
        dispatch({ type: 'CANCEL_DELETE' });
      },
      setView(view) {
        dispatch({ type: 'SET_VIEW', payload: view });
      },
      setCategory(category) {
        dispatch({ type: 'SET_CATEGORY', payload: category });
      },
      setSearch(search) {
        dispatch({ type: 'SET_SEARCH', payload: search });
      },
      setSortBy(sortBy) {
        dispatch({ type: 'SET_SORT', payload: sortBy });
      },
      openCreateForm() {
        dispatch({ type: 'OPEN_CREATE_FORM' });
      },
      openEditForm(id) {
        dispatch({ type: 'OPEN_EDIT_FORM', payload: id });
      },
      closeForm() {
        dispatch({ type: 'CLOSE_FORM' });
      },
      requestDelete(id) {
        dispatch({ type: 'REQUEST_DELETE', payload: id });
      },
      cancelDelete() {
        dispatch({ type: 'CANCEL_DELETE' });
      },
    }),
    [setTasks]
  );

  const stateValue = useMemo(() => ({ tasks, ui }), [tasks, ui]);

  return (
    <TaskStateContext.Provider value={stateValue}>
      <TaskDispatchContext.Provider value={actions}>{children}</TaskDispatchContext.Provider>
    </TaskStateContext.Provider>
  );
}

export function useTaskState() {
  const context = useContext(TaskStateContext);
  if (!context) throw new Error('useTaskState must be used within a TaskProvider');
  return context;
}

export function useTaskActions() {
  const context = useContext(TaskDispatchContext);
  if (!context) throw new Error('useTaskActions must be used within a TaskProvider');
  return context;
}
