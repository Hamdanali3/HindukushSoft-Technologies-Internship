import { useMemo } from 'react';
import { useTaskState } from '../context/TaskContext';
import { filterTasks, sortTasks } from '../utils/taskUtils';
import TaskCard from './TaskCard';
import EmptyState from './EmptyState';
import './TaskList.css';

export default function TaskList() {
  const { tasks, ui } = useTaskState();

  const visibleTasks = useMemo(() => {
    const filtered = filterTasks(tasks, ui);
    return sortTasks(filtered, ui.sortBy);
  }, [tasks, ui]);

  if (tasks.length === 0) {
    return <EmptyState variant="no-tasks" />;
  }

  if (visibleTasks.length === 0) {
    return <EmptyState variant="no-matches" />;
  }

  return (
    <ul className="task-list" aria-live="polite">
      {visibleTasks.map((task) => (
        <TaskCard key={task.id} task={task} />
      ))}
    </ul>
  );
}
