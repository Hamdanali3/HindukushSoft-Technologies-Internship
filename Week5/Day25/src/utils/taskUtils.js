// Shared constants -----------------------------------------------------

export const CATEGORIES = ['Work', 'Personal', 'Learning', 'Errands'];

export const PRIORITIES = [
  { value: 'low', label: 'Low' },
  { value: 'medium', label: 'Medium' },
  { value: 'high', label: 'High' },
  { value: 'urgent', label: 'Urgent' },
];

const PRIORITY_WEIGHT = { urgent: 0, high: 1, medium: 2, low: 3 };

// Id generation ----------------------------------------------------------
// crypto.randomUUID is available in every modern evergreen browser; this
// keeps the app dependency-free instead of pulling in uuid for one call site.
export function createId() {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  return `t-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

// Date helpers -------------------------------------------------------------

export function toDateOnly(date) {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  return d;
}

export function isSameDay(a, b) {
  const da = toDateOnly(a);
  const db = toDateOnly(b);
  return da.getTime() === db.getTime();
}

export function isToday(date) {
  if (!date) return false;
  return isSameDay(date, new Date());
}

export function isOverdue(date, completed) {
  if (!date || completed) return false;
  return toDateOnly(date).getTime() < toDateOnly(new Date()).getTime();
}

export function isUpcoming(date) {
  if (!date) return false;
  const target = toDateOnly(date).getTime();
  const today = toDateOnly(new Date()).getTime();
  const in7Days = today + 7 * 24 * 60 * 60 * 1000;
  return target > today && target <= in7Days;
}

export function formatDueDate(date) {
  if (!date) return 'No due date';
  const target = toDateOnly(date);
  const today = toDateOnly(new Date());
  const diffDays = Math.round((target - today) / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return 'Today';
  if (diffDays === 1) return 'Tomorrow';
  if (diffDays === -1) return 'Yesterday';

  return target.toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
    year: target.getFullYear() !== today.getFullYear() ? 'numeric' : undefined,
  });
}

export function formatAddedOn(isoString) {
  const d = new Date(isoString);
  return d.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
}

// Filtering ------------------------------------------------------------

export function filterTasks(tasks, { view, category, search }) {
  let result = tasks;

  if (view === 'today') {
    result = result.filter((t) => !t.completed && (isToday(t.dueDate) || isOverdue(t.dueDate, t.completed)));
  } else if (view === 'upcoming') {
    result = result.filter((t) => !t.completed && isUpcoming(t.dueDate));
  } else if (view === 'completed') {
    result = result.filter((t) => t.completed);
  }
  // 'all' falls through and keeps every task

  if (category && category !== 'all') {
    result = result.filter((t) => t.category === category);
  }

  const query = search.trim().toLowerCase();
  if (query) {
    result = result.filter(
      (t) =>
        t.title.toLowerCase().includes(query) ||
        (t.notes && t.notes.toLowerCase().includes(query))
    );
  }

  return result;
}

// Sorting ----------------------------------------------------------------

export function sortTasks(tasks, sortBy) {
  const copy = [...tasks];

  switch (sortBy) {
    case 'priority':
      return copy.sort((a, b) => PRIORITY_WEIGHT[a.priority] - PRIORITY_WEIGHT[b.priority]);
    case 'dueDate':
      return copy.sort((a, b) => {
        if (!a.dueDate && !b.dueDate) return 0;
        if (!a.dueDate) return 1;
        if (!b.dueDate) return -1;
        return new Date(a.dueDate) - new Date(b.dueDate);
      });
    case 'recent':
    default:
      return copy.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  }
}

// Stats --------------------------------------------------------------------

export function computeStats(tasks) {
  const total = tasks.length;
  const completed = tasks.filter((t) => t.completed).length;
  const overdue = tasks.filter((t) => isOverdue(t.dueDate, t.completed)).length;
  const dueToday = tasks.filter((t) => !t.completed && isToday(t.dueDate)).length;
  const percentComplete = total === 0 ? 0 : Math.round((completed / total) * 100);

  return { total, completed, overdue, dueToday, percentComplete };
}

// Seed data ------------------------------------------------------------
// Ships with a handful of realistic entries so the catalog never opens empty.

function daysFromNow(n) {
  const d = new Date();
  d.setDate(d.getDate() + n);
  return d.toISOString();
}

export function getSeedTasks() {
  const now = new Date().toISOString();
  return [
    {
      id: createId(),
      title: 'Draft Q3 sprint retrospective notes',
      notes: 'Pull velocity chart from Linear before the meeting.',
      category: 'Work',
      priority: 'high',
      dueDate: daysFromNow(0),
      completed: false,
      createdAt: now,
    },
    {
      id: createId(),
      title: 'Finish React fundamentals module',
      notes: 'Hooks, props, and conditional rendering — then start the quiz.',
      category: 'Learning',
      priority: 'medium',
      dueDate: daysFromNow(2),
      completed: false,
      createdAt: now,
    },
    {
      id: createId(),
      title: 'Renew passport before the trip',
      notes: '',
      category: 'Errands',
      priority: 'urgent',
      dueDate: daysFromNow(-1),
      completed: false,
      createdAt: now,
    },
    {
      id: createId(),
      title: 'Call the internet provider about the outage',
      notes: 'Reference ticket #4471.',
      category: 'Personal',
      priority: 'low',
      dueDate: daysFromNow(5),
      completed: false,
      createdAt: now,
    },
    {
      id: createId(),
      title: 'Review pull request from teammate',
      notes: '',
      category: 'Work',
      priority: 'medium',
      dueDate: daysFromNow(-2),
      completed: true,
      createdAt: now,
    },
  ];
}
