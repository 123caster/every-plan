import type { Task } from '../../domain/task/taskTypes';
import { TaskCheckbox } from './TaskCheckbox';
import { TaskMeta } from './TaskMeta';

interface TaskCardProps {
  task: Task;
  onOpen: (task: Task) => void;
  onComplete: (task: Task, completed: boolean) => void;
  onMove?: (task: Task, direction: -1 | 1) => void;
}

export function TaskCard({ task, onOpen, onComplete, onMove }: TaskCardProps) {
  return (
    <article className={`task-card ${task.status === 'done' ? 'task-card--done' : ''}`} onClick={() => onOpen(task)}>
      <TaskCheckbox checked={task.status === 'done'} label={task.title} onChange={(checked) => onComplete(task, checked)} />
      <button type="button" className="task-card__body" onClick={() => onOpen(task)}>
        <strong>{task.title}</strong>
        <TaskMeta task={task} />
      </button>
      <span className="task-card__list">{task.listName}</span>
      {onMove ? (
        <div className="task-card__order" aria-label="调整顺序">
          <button type="button" aria-label={`上移：${task.title}`} onClick={(event) => { event.stopPropagation(); onMove(task, -1); }}>↑</button>
          <button type="button" aria-label={`下移：${task.title}`} onClick={(event) => { event.stopPropagation(); onMove(task, 1); }}>↓</button>
        </div>
      ) : null}
    </article>
  );
}
