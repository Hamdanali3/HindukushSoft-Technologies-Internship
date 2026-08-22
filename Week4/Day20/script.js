/* ==========================================================================
   LEDGER — a calm, persistent to-do list
   ========================================================================== */

const STORAGE_KEY = "ledger:tasks";
const THEME_KEY = "ledger:theme";
const UNDO_WINDOW_MS = 5000;
const RING_CIRCUMFERENCE = 2 * Math.PI * 27; // matches the SVG circle's r="27"

// ---- DOM references --------------------------------------------------------
const root = document.documentElement;

const taskListEl = document.getElementById("taskList");
const emptyStateEl = document.getElementById("emptyState");
const emptyTitleEl = document.getElementById("emptyTitle");
const emptySubEl = document.getElementById("emptySub");
const listSummaryEl = document.getElementById("listSummary");

const composer = document.getElementById("composer");
const taskInput = document.getElementById("taskInput");
const dueInput = document.getElementById("dueInput");
const composerError = document.getElementById("composerError");
const priorityPicker = document.getElementById("priorityPicker");

const filtersNav = document.getElementById("filters");
const countAllEl = document.getElementById("countAll");
const countActiveEl = document.getElementById("countActive");
const countCompletedEl = document.getElementById("countCompleted");
const countHighEl = document.getElementById("countHigh");
const countMediumEl = document.getElementById("countMedium");
const countLowEl = document.getElementById("countLow");

const clearCompletedBtn = document.getElementById("clearCompletedBtn");
const todayLabel = document.getElementById("todayLabel");
const headline = document.getElementById("headline");

const toast = document.getElementById("undoToast");
const toastMessage = document.getElementById("toastMessage");
const undoBtn = document.getElementById("undoBtn");

const themeToggle = document.getElementById("themeToggle");
const progressRing = document.getElementById("progressRing");
const progressPercent = document.getElementById("progressPercent");
const progressSub = document.getElementById("progressSub");

const searchInput = document.getElementById("searchInput");
const clearSearchBtn = document.getElementById("clearSearchBtn");
const sortSelect = document.getElementById("sortSelect");
const listWrapEl = document.querySelector(".list-wrap");

const confettiLayer = document.getElementById("confettiLayer");

// ---- In-memory state, mirrored to localStorage on every change ------------
let tasks = [];
let activeFilter = "all";
let selectedPriority = "medium";
let searchQuery = "";
let sortMode = "manual";
let pendingDeletion = null; // { task, index, timerId } — lives only while the undo toast is showing
let dragState = null; // { id } of the task currently being dragged

/* ============================================================================
   Persistence
   ============================================================================ */

function loadTasks() {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch (err) {
    console.warn("Saved tasks were unreadable, starting from an empty list.", err);
    localStorage.removeItem(STORAGE_KEY);
    return [];
  }
}

function saveTasks() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
}

function makeId() {
  return `t${Date.now().toString(36)}${Math.random().toString(36).slice(2, 7)}`;
}

/* ============================================================================
   Theme
   ============================================================================ */

function applyTheme(theme) {
  root.setAttribute("data-theme", theme);
  localStorage.setItem(THEME_KEY, theme);
}

themeToggle.addEventListener("click", () => {
  const current = root.getAttribute("data-theme") === "dark" ? "light" : "dark";
  applyTheme(current);
});

/* ============================================================================
   Header — today's date and a headline that reacts to what's actually left
   ============================================================================ */

function renderHeader() {
  const now = new Date();
  todayLabel.textContent = now.toLocaleDateString(undefined, {
    weekday: "long",
    month: "long",
    day: "numeric",
  });

  const remaining = tasks.filter((t) => !t.completed).length;
  if (tasks.length === 0) {
    headline.textContent = "What's on your ledger today?";
  } else if (remaining === 0) {
    headline.textContent = "Everything's cleared. Nicely done.";
  } else {
    headline.textContent = `${remaining} thing${remaining === 1 ? "" : "s"} standing between you and a clean slate.`;
  }
}

/* ============================================================================
   Progress ring
   ============================================================================ */

function renderProgress() {
  const total = tasks.length;
  const done = tasks.filter((t) => t.completed).length;
  const fraction = total === 0 ? 0 : done / total;

  const offset = RING_CIRCUMFERENCE * (1 - fraction);
  progressRing.style.strokeDasharray = String(RING_CIRCUMFERENCE);
  progressRing.style.strokeDashoffset = String(offset);
  progressPercent.textContent = `${Math.round(fraction * 100)}%`;

  progressSub.textContent =
    total === 0 ? "No tasks yet" : `${done} of ${total} task${total === 1 ? "" : "s"} done`;
}

/* ============================================================================
   Adding a task
   ============================================================================ */

priorityPicker.querySelectorAll(".priority-choice").forEach((btn) => {
  btn.addEventListener("click", () => {
    selectedPriority = btn.dataset.priority;
    priorityPicker.querySelectorAll(".priority-choice").forEach((b) => {
      const isActive = b === btn;
      b.classList.toggle("is-active", isActive);
      b.setAttribute("aria-checked", String(isActive));
    });
  });
});

composer.addEventListener("submit", (event) => {
  event.preventDefault();

  const text = taskInput.value.trim();
  if (!text) {
    composerError.textContent = "Write something before adding it to the list.";
    composerError.classList.add("is-visible");
    taskInput.focus();
    return;
  }

  composerError.classList.remove("is-visible");
  composerError.textContent = "";

  const task = {
    id: makeId(),
    text,
    priority: selectedPriority,
    dueDate: dueInput.value || null,
    completed: false,
    createdAt: new Date().toISOString(),
  };

  tasks.unshift(task);
  saveTasks();
  render();

  taskInput.value = "";
  dueInput.value = "";
  taskInput.focus();
});

taskInput.addEventListener("input", () => {
  if (composerError.classList.contains("is-visible")) {
    composerError.classList.remove("is-visible");
    composerError.textContent = "";
  }
});

/* ============================================================================
   Search
   ============================================================================ */

searchInput.addEventListener("input", () => {
  searchQuery = searchInput.value.trim();
  clearSearchBtn.hidden = searchQuery.length === 0;
  render();
});

clearSearchBtn.addEventListener("click", () => {
  searchQuery = "";
  searchInput.value = "";
  clearSearchBtn.hidden = true;
  searchInput.focus();
  render();
});

// "/" focuses search from anywhere, unless the person is already typing
document.addEventListener("keydown", (event) => {
  const tag = document.activeElement.tagName;
  const isTyping = tag === "INPUT" || tag === "TEXTAREA" || document.activeElement.isContentEditable;

  if (event.key === "/" && !isTyping) {
    event.preventDefault();
    searchInput.focus();
  }
  if (event.key === "Escape" && document.activeElement === searchInput && searchQuery) {
    clearSearchBtn.click();
  }
});

/* ============================================================================
   Sort
   ============================================================================ */

sortSelect.addEventListener("change", () => {
  sortMode = sortSelect.value;
  listWrapEl.classList.toggle("sort-manual", sortMode === "manual");
  render();
});

const priorityRank = { high: 0, medium: 1, low: 2 };

function applySort(list) {
  const copy = [...list];
  if (sortMode === "priority") {
    copy.sort((a, b) => priorityRank[a.priority] - priorityRank[b.priority]);
  } else if (sortMode === "due") {
    copy.sort((a, b) => {
      if (!a.dueDate && !b.dueDate) return 0;
      if (!a.dueDate) return 1;
      if (!b.dueDate) return -1;
      return a.dueDate.localeCompare(b.dueDate);
    });
  } else if (sortMode === "alpha") {
    copy.sort((a, b) => a.text.localeCompare(b.text));
  }
  // "manual" leaves the array in whatever order it's already in
  return copy;
}

/* ============================================================================
   Rendering the list
   ============================================================================ */

function visibleTasks() {
  let filtered = tasks.filter((task) => {
    if (activeFilter === "active") return !task.completed;
    if (activeFilter === "completed") return task.completed;
    return true;
  });

  if (searchQuery) {
    const q = searchQuery.toLowerCase();
    filtered = filtered.filter((t) => t.text.toLowerCase().includes(q));
  }

  const sorted = applySort(filtered);

  // Open tasks first, completed ones after — regardless of sort mode, so
  // finishing something always visibly moves it out of the way.
  const open = sorted.filter((t) => !t.completed);
  const done = sorted.filter((t) => t.completed);
  return [...open, ...done];
}

function formatDueDate(dateStr) {
  const [year, month, day] = dateStr.split("-").map(Number);
  const date = new Date(year, month - 1, day);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const isOverdue = date < today;

  const label = date.toLocaleDateString(undefined, { month: "short", day: "numeric" });
  return { label, isOverdue };
}

function highlightMatch(text, query) {
  if (!query) return document.createTextNode(text);
  const lower = text.toLowerCase();
  const q = query.toLowerCase();
  const idx = lower.indexOf(q);
  if (idx === -1) return document.createTextNode(text);

  const frag = document.createDocumentFragment();
  frag.appendChild(document.createTextNode(text.slice(0, idx)));
  const mark = document.createElement("mark");
  mark.textContent = text.slice(idx, idx + query.length);
  frag.appendChild(mark);
  frag.appendChild(document.createTextNode(text.slice(idx + query.length)));
  return frag;
}

function buildTaskRow(task) {
  const li = document.createElement("li");
  li.className = "task" + (task.completed ? " is-done" : "");
  li.dataset.id = task.id;
  li.draggable = sortMode === "manual";

  // Drag handle (only meaningful, and only shown, in manual sort mode)
  const handle = document.createElement("button");
  handle.type = "button";
  handle.className = "task__handle";
  handle.setAttribute("aria-label", "Drag to reorder");
  handle.innerHTML = '<svg width="10" height="16" viewBox="0 0 10 16" fill="currentColor"><circle cx="2.5" cy="2.5" r="1.4"/><circle cx="7.5" cy="2.5" r="1.4"/><circle cx="2.5" cy="8" r="1.4"/><circle cx="7.5" cy="8" r="1.4"/><circle cx="2.5" cy="13.5" r="1.4"/><circle cx="7.5" cy="13.5" r="1.4"/></svg>';

  // Checkbox
  const check = document.createElement("button");
  check.type = "button";
  check.className = "task__check";
  check.setAttribute("aria-label", task.completed ? "Mark as not done" : "Mark as done");
  check.innerHTML = '<svg width="11" height="9" viewBox="0 0 11 9" fill="none"><path d="M1 4.5L4 7.5L10 1.5" stroke="white" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>';
  check.addEventListener("click", () => toggleComplete(task.id));

  // Body: text + meta row
  const body = document.createElement("div");
  body.className = "task__body";

  const text = document.createElement("p");
  text.className = "task__text";
  text.appendChild(highlightMatch(task.text, searchQuery));
  text.title = "Double-click to edit";
  text.addEventListener("dblclick", () => beginEdit(task.id, text));

  const meta = document.createElement("div");
  meta.className = "task__meta";

  const priority = document.createElement("span");
  priority.className = "task__priority";
  priority.innerHTML = `<span class="priority-dot priority-dot--${task.priority}"></span>${capitalize(task.priority)}`;
  meta.appendChild(priority);

  if (task.dueDate) {
    const { label, isOverdue } = formatDueDate(task.dueDate);
    const due = document.createElement("span");
    due.className = "task__due" + (isOverdue && !task.completed ? " is-overdue" : "");
    due.textContent = (isOverdue && !task.completed ? "Overdue · " : "Due ") + label;
    meta.appendChild(due);
  }

  body.appendChild(text);
  body.appendChild(meta);

  // Delete
  const del = document.createElement("button");
  del.type = "button";
  del.className = "task__delete";
  del.setAttribute("aria-label", "Delete task");
  del.innerHTML = '<svg width="15" height="15" viewBox="0 0 16 16" fill="none"><path d="M3 4.5H13M6.5 4.5V3C6.5 2.4 7 2 7.5 2H8.5C9 2 9.5 2.4 9.5 3V4.5M12 4.5L11.5 13C11.45 13.6 11 14 10.4 14H5.6C5 14 4.55 13.6 4.5 13L4 4.5" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"/></svg>';
  del.addEventListener("click", () => deleteTask(task.id));

  li.appendChild(handle);
  li.appendChild(check);
  li.appendChild(body);
  li.appendChild(del);

  attachDragHandlers(li, task.id);
  return li;
}

function capitalize(word) {
  return word.charAt(0).toUpperCase() + word.slice(1);
}

function render() {
  const visible = visibleTasks();

  taskListEl.innerHTML = "";
  visible.forEach((task) => taskListEl.appendChild(buildTaskRow(task)));

  const isEmpty = visible.length === 0;
  emptyStateEl.hidden = !isEmpty;
  taskListEl.hidden = isEmpty;

  if (isEmpty) {
    if (searchQuery) {
      emptyTitleEl.textContent = "No matches.";
      emptySubEl.textContent = `Nothing in this view matches "${searchQuery}".`;
    } else {
      const messages = {
        all: ["Nothing on your ledger yet.", "Add your first task above."],
        active: ["Nothing left to do — nice work.", "Everything you've added is checked off."],
        completed: ["Nothing completed yet.", "Finished tasks will collect here."],
      };
      const [title, sub] = messages[activeFilter];
      emptyTitleEl.textContent = title;
      emptySubEl.textContent = sub;
    }
  }

  renderCounts();
  renderHeader();
  renderSummary();
  renderProgress();
}

function renderCounts() {
  const active = tasks.filter((t) => !t.completed).length;
  const completed = tasks.filter((t) => t.completed).length;

  countAllEl.textContent = tasks.length;
  countActiveEl.textContent = active;
  countCompletedEl.textContent = completed;

  countHighEl.textContent = tasks.filter((t) => t.priority === "high" && !t.completed).length;
  countMediumEl.textContent = tasks.filter((t) => t.priority === "medium" && !t.completed).length;
  countLowEl.textContent = tasks.filter((t) => t.priority === "low" && !t.completed).length;

  clearCompletedBtn.disabled = completed === 0;
}

function renderSummary() {
  const active = tasks.filter((t) => !t.completed).length;
  if (tasks.length === 0) {
    listSummaryEl.textContent = "";
    return;
  }
  listSummaryEl.textContent = `${active} open · ${tasks.length - active} completed · ${tasks.length} total`;
}

/* ============================================================================
   Toggling completion — and celebrating when the last open task is cleared
   ============================================================================ */

function toggleComplete(id) {
  const task = tasks.find((t) => t.id === id);
  if (!task) return;

  const remainingBefore = tasks.filter((t) => !t.completed).length;
  task.completed = !task.completed;
  const remainingAfter = tasks.filter((t) => !t.completed).length;

  saveTasks();
  render();

  if (remainingBefore > 0 && remainingAfter === 0) {
    celebrate();
  }
}

function celebrate() {
  const colors = ["#4B4ACF", "#D64545", "#C98A2C", "#4E7BA6", "#6E6CE0"];
  const pieceCount = 26;

  for (let i = 0; i < pieceCount; i++) {
    const piece = document.createElement("span");
    piece.className = "confetti-piece";
    piece.style.left = `${Math.random() * 100}vw`;
    piece.style.background = colors[i % colors.length];
    piece.style.animationDuration = `${1.6 + Math.random() * 1}s`;
    piece.style.animationDelay = `${Math.random() * 0.3}s`;
    confettiLayer.appendChild(piece);
    piece.addEventListener("animationend", () => piece.remove());
  }
}

/* ============================================================================
   Inline editing
   ============================================================================ */

function beginEdit(id, textEl) {
  const task = tasks.find((t) => t.id === id);
  if (!task) return;

  textEl.textContent = task.text; // strip any search highlight markup first
  textEl.contentEditable = "true";
  textEl.focus();

  const range = document.createRange();
  range.selectNodeContents(textEl);
  const selection = window.getSelection();
  selection.removeAllRanges();
  selection.addRange(range);

  const commit = () => {
    const newText = textEl.textContent.trim();
    textEl.contentEditable = "false";
    if (newText && newText !== task.text) {
      task.text = newText;
      saveTasks();
    }
    render();
  };

  const onKeydown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      textEl.blur();
    }
    if (e.key === "Escape") {
      textEl.textContent = task.text;
      textEl.blur();
    }
  };

  textEl.addEventListener("blur", commit, { once: true });
  textEl.addEventListener("keydown", onKeydown);
}

/* ============================================================================
   Deleting — with a genuine, working undo
   ============================================================================ */

function deleteTask(id) {
  const index = tasks.findIndex((t) => t.id === id);
  if (index === -1) return;

  const [removed] = tasks.splice(index, 1);
  saveTasks();
  render();

  showUndoToast(removed, index);
}

function showUndoToast(task, index) {
  if (pendingDeletion) {
    clearTimeout(pendingDeletion.timerId);
  }

  const timerId = setTimeout(() => {
    pendingDeletion = null;
    hideToast();
  }, UNDO_WINDOW_MS);

  pendingDeletion = { task, index, timerId };

  toastMessage.textContent = `"${truncate(task.text, 40)}" deleted.`;
  toast.hidden = false;
}

function hideToast() {
  toast.hidden = true;
}

function truncate(str, max) {
  return str.length > max ? str.slice(0, max - 1) + "…" : str;
}

undoBtn.addEventListener("click", () => {
  if (!pendingDeletion) return;
  clearTimeout(pendingDeletion.timerId);

  const { task, index } = pendingDeletion;
  const insertAt = Math.min(index, tasks.length);
  tasks.splice(insertAt, 0, task);
  saveTasks();
  render();

  pendingDeletion = null;
  hideToast();
});

/* ============================================================================
   Clearing completed tasks in one go
   ============================================================================ */

clearCompletedBtn.addEventListener("click", () => {
  const completedCount = tasks.filter((t) => t.completed).length;
  if (completedCount === 0) return;
  tasks = tasks.filter((t) => !t.completed);
  saveTasks();
  render();
});

/* ============================================================================
   Filters
   ============================================================================ */

filtersNav.querySelectorAll(".filter").forEach((btn) => {
  btn.addEventListener("click", () => {
    activeFilter = btn.dataset.filter;
    filtersNav.querySelectorAll(".filter").forEach((b) => b.classList.toggle("is-active", b === btn));
    render();
  });
});

/* ============================================================================
   Drag-to-reorder — native HTML5 drag and drop, active only in manual sort
   ----------------------------------------------------------------------------
   Dragging a row over another one reorders the underlying tasks array live,
   so the drop itself doesn't need special-case logic — by the time it
   fires, the array is already in the right order and just needs saving.
   ============================================================================ */

function attachDragHandlers(li, id) {
  li.addEventListener("dragstart", (event) => {
    if (sortMode !== "manual") return;
    dragState = { id };
    li.classList.add("is-dragging");
    event.dataTransfer.effectAllowed = "move";
  });

  li.addEventListener("dragend", () => {
    li.classList.remove("is-dragging");
    taskListEl.querySelectorAll(".task").forEach((el) => el.classList.remove("is-drop-target"));
    dragState = null;
    saveTasks();
  });

  li.addEventListener("dragover", (event) => {
    if (sortMode !== "manual" || !dragState || dragState.id === id) return;
    event.preventDefault();
    li.classList.add("is-drop-target");
  });

  li.addEventListener("dragleave", () => li.classList.remove("is-drop-target"));

  li.addEventListener("drop", (event) => {
    if (sortMode !== "manual" || !dragState || dragState.id === id) return;
    event.preventDefault();
    li.classList.remove("is-drop-target");

    const fromIndex = tasks.findIndex((t) => t.id === dragState.id);
    const toIndex = tasks.findIndex((t) => t.id === id);
    if (fromIndex === -1 || toIndex === -1) return;

    const [moved] = tasks.splice(fromIndex, 1);
    tasks.splice(toIndex, 0, moved);
    render();
  });
}

/* ============================================================================
   Boot
   ============================================================================ */

tasks = loadTasks();
listWrapEl.classList.toggle("sort-manual", sortMode === "manual");
render();
