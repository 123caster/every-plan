import { useMemo } from 'react';
import { useTaskActions, useTasks } from '../../data/repositories/TaskDataProvider';
import { Button } from '../../design-system/primitives/Button';
import { projectToday } from '../../domain/task/todayProjection';
import type { Task } from '../../domain/task/taskTypes';
import { TodayHeader } from './TodayHeader';
import { TodaySection } from './TodaySection';

export function TodayPage({ onCreate, onOpenTask }: { onCreate: () => void; onOpenTask: (id: string) => void }) {
  const { data: tasks = [], isLoading, isError, refetch } = useTasks();
  const { completeMutation, updateMutation } = useTaskActions();
  const projection = useMemo(() => projectToday(tasks), [tasks]);
  const open = (task: Task) => onOpenTask(task.id);
  const complete = (task: Task, completed: boolean) => completeMutation.mutate({ id: task.id, completed, commandId: crypto.randomUUID() });
  const move = (task: Task, direction: -1 | 1) => updateMutation.mutate({ id: task.id, patch: { order: task.order + direction * 15 }, commandId: crypto.randomUUID() });

  if (isLoading) return <div className="today-loading" aria-label="正在载入今日任务"><i /><i /><i /></div>;
  if (isError) return <div className="today-empty"><strong>暂时无法读取本地任务</strong><p>数据仍保留在当前设备中。</p><Button onClick={() => void refetch()}>重新读取</Button></div>;

  return (
    <div className="today-page">
      <TodayHeader summary={projection.summary} onCreate={onCreate} />
      {projection.summary.total === 0 ? (
        <div className="today-empty"><span>✓</span><strong>今天还没有任务</strong><p>为今天安排一件真正重要的事。</p><Button variant="primary" onClick={onCreate}>创建第一项任务</Button></div>
      ) : (
        <div className="today-sections">
          <TodaySection title="接下来" hint="现在到未来四小时，保持焦点。" tasks={projection.next} onOpen={open} onComplete={complete} onMove={move} />
          <TodaySection title="稍后" hint="今天仍需要处理，但不必立刻开始。" tasks={projection.later} onOpen={open} onComplete={complete} onMove={move} />
          <TodaySection title="已完成" hint="今天已经推进的事情。" tasks={projection.completed} onOpen={open} onComplete={complete} />
        </div>
      )}
    </div>
  );
}
