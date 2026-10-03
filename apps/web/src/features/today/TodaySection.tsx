import { TaskCard } from '../../design-system/task/TaskCard';
import type { Task } from '../../domain/task/taskTypes';

interface TodaySectionProps {
  title: string;
  hint: string;
  tasks: Task[];
  onOpen: (task: Task) => void;
  onComplete: (task: Task, completed: boolean) => void;
  onMove?: (task: Task, direction: -1 | 1) => void;
}

export function TodaySection({ title, hint, tasks, onOpen, onComplete, onMove }: TodaySectionProps) {
  if (!tasks.length) return null;
  return (
    <section className="today-section" aria-labelledby={`section-${title}`}>
      <header><div><h2 id={`section-${title}`}>{title}</h2><p>{hint}</p></div><span>{tasks.length}</span></header>
      <div className="task-list">
        {tasks.map((task) => <TaskCard key={task.id} task={task} onOpen={onOpen} onComplete={onComplete} onMove={onMove} />)}
      </div>
    </section>
  );
}
