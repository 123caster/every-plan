import type { Task } from '../../domain/task/taskTypes';

function formatTime(value: string) {
  return new Intl.DateTimeFormat('zh-CN', { hour: '2-digit', minute: '2-digit', hour12: false }).format(new Date(value));
}

function durationLabel(minutes: number) {
  if (minutes < 60) return `${minutes} 分钟`;
  if (minutes % 60 === 0) return `${minutes / 60} 小时`;
  return `${Math.floor(minutes / 60)} 小时 ${minutes % 60} 分钟`;
}

export function TaskMeta({ task }: { task: Task }) {
  return (
    <div className="task-meta" aria-label="任务信息">
      {task.planStart ? <span className="task-meta__plan">计划 {formatTime(task.planStart)}{task.planEnd ? `–${formatTime(task.planEnd)}` : ''}</span> : null}
      {task.allDayDate ? <span className="task-meta__plan">全天计划</span> : null}
      {task.dueAt ? <span className="task-meta__due">截止 {formatTime(task.dueAt)}</span> : null}
      {task.dueDate && !task.dueAt ? <span className="task-meta__due">今日截止</span> : null}
      {task.estimateMinutes ? <span>预计 {durationLabel(task.estimateMinutes)}</span> : null}
      {task.priority !== 'none' ? <span className={`task-meta__priority task-meta__priority--${task.priority}`}>{({ low: '低', medium: '中', high: '高' })[task.priority]}优先级</span> : null}
      {task.tags.map((tag) => <span className="task-tag" key={tag}>#{tag}</span>)}
    </div>
  );
}
