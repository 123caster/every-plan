import { useEffect, useMemo, useRef, useState } from 'react';
import { useTaskActions } from '../../data/repositories/TaskDataProvider';
import { DurationField } from '../../design-system/form/DurationField';
import { DueTimeField } from '../../design-system/form/DueTimeField';
import { PlanTimeField } from '../../design-system/form/PlanTimeField';
import type { Task, TaskPatch, TaskPriority } from '../../domain/task/taskTypes';
import { PluginTabHost } from './PluginTabHost';
import { SubtaskList } from './SubtaskList';

function toInputDate(value: string | null) {
  if (!value) return '';
  const date = new Date(value);
  const local = new Date(date.getTime() - date.getTimezoneOffset() * 60_000);
  return local.toISOString().slice(0, 16);
}

function toIso(value: string) {
  return value ? new Date(value).toISOString() : null;
}

export function TaskDetail({ task, onDeleted }: { task: Task; onDeleted?: () => void }) {
  const { updateMutation, completeMutation, deleteMutation } = useTaskActions();
  const [draft, setDraft] = useState(() => ({
    title: task.title,
    description: task.description,
    priority: task.priority,
    tags: task.tags.join(', '),
    planStart: toInputDate(task.planStart),
    dueAt: toInputDate(task.dueAt),
    estimate: task.estimateMinutes ? `${task.estimateMinutes}` : '',
    subtasks: task.subtasks,
  }));
  const [saveState, setSaveState] = useState<'saved' | 'saving' | 'error'>('saved');
  const lastSaved = useRef(JSON.stringify({
    title: task.title, description: task.description, priority: task.priority,
    tags: task.tags.join(', '), planStart: toInputDate(task.planStart), dueAt: toInputDate(task.dueAt),
    estimate: task.estimateMinutes ? `${task.estimateMinutes}` : '', subtasks: task.subtasks,
  }));

  const signature = useMemo(() => JSON.stringify(draft), [draft]);
  useEffect(() => {
    if (!draft.title.trim() || signature === lastSaved.current) return;
    setSaveState('saving');
    const timer = window.setTimeout(() => {
      const start = toIso(draft.planStart);
      const estimateMinutes = draft.estimate ? Number(draft.estimate) : null;
      const originalDuration = task.planStart && task.planEnd
        ? Math.max(1, Math.round((new Date(task.planEnd).getTime() - new Date(task.planStart).getTime()) / 60_000))
        : null;
      const plannedMinutes = estimateMinutes ?? originalDuration;
      const patch: TaskPatch = {
        title: draft.title,
        description: draft.description,
        priority: draft.priority,
        tags: draft.tags.split(',').map((tag) => tag.trim()).filter(Boolean),
        planStart: start,
        planEnd: start && plannedMinutes ? new Date(new Date(start).getTime() + plannedMinutes * 60_000).toISOString() : null,
        allDayDate: start ? null : task.allDayDate,
        dueAt: toIso(draft.dueAt),
        dueDate: draft.dueAt ? null : task.dueDate,
        estimateMinutes,
        subtasks: draft.subtasks,
      };
      updateMutation.mutate({ id: task.id, patch, commandId: crypto.randomUUID() }, {
        onSuccess: () => { lastSaved.current = signature; setSaveState('saved'); },
        onError: () => setSaveState('error'),
      });
    }, 450);
    return () => window.clearTimeout(timer);
  }, [draft, signature, task.allDayDate, task.dueDate, task.id, task.planEnd, task.planStart, updateMutation]);

  return (
    <div className="task-detail">
      <div className="task-detail__status">
        <label><input type="checkbox" checked={task.status === 'done'} onChange={(event) => completeMutation.mutate({ id: task.id, completed: event.target.checked, commandId: crypto.randomUUID() })} /> 已完成</label>
        <span aria-live="polite">{saveState === 'saving' ? '正在保存…' : saveState === 'error' ? '保存失败' : '已自动保存'}</span>
      </div>
      <input className="task-detail__title" aria-label="任务标题" value={draft.title} onChange={(event) => setDraft({ ...draft, title: event.target.value })} />
      <div className="task-detail__origin"><span>{task.listName}</span><span>本地数据</span></div>

      <section className="detail-section detail-section--fields">
        <PlanTimeField value={draft.planStart} onChange={(planStart) => setDraft({ ...draft, planStart })} />
        <DueTimeField value={draft.dueAt} onChange={(dueAt) => setDraft({ ...draft, dueAt })} />
        <DurationField value={draft.estimate} onChange={(estimate) => setDraft({ ...draft, estimate })} />
        <label className="field"><span className="field__label">优先级</span><select className="field__control" value={draft.priority} onChange={(event) => setDraft({ ...draft, priority: event.target.value as TaskPriority })}><option value="none">无</option><option value="low">低</option><option value="medium">中</option><option value="high">高</option></select></label>
        <label className="field detail-section__wide"><span className="field__label">标签（逗号分隔）</span><input className="field__control" value={draft.tags} onChange={(event) => setDraft({ ...draft, tags: event.target.value })} /></label>
      </section>

      <SubtaskList value={draft.subtasks} onChange={(subtasks) => setDraft({ ...draft, subtasks })} />
      <section className="detail-section"><h3>备注</h3><textarea aria-label="任务备注" value={draft.description} placeholder="记录背景、链接或下一步…" onChange={(event) => setDraft({ ...draft, description: event.target.value })} /></section>
      <PluginTabHost />
      <button type="button" className="task-detail__delete" onClick={() => deleteMutation.mutate({ id: task.id, commandId: crypto.randomUUID() }, { onSuccess: onDeleted })}>删除任务</button>
    </div>
  );
}
