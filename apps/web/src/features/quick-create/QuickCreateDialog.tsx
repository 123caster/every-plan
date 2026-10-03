import { useMemo, useState } from 'react';
import { useTaskActions } from '../../data/repositories/TaskDataProvider';
import { DurationField } from '../../design-system/form/DurationField';
import { DueTimeField } from '../../design-system/form/DueTimeField';
import { PlanTimeField } from '../../design-system/form/PlanTimeField';
import { Button } from '../../design-system/primitives/Button';
import { Field } from '../../design-system/primitives/Field';
import { Modal } from '../../design-system/primitives/Modal';
import type { TaskDraft, TaskPriority } from '../../domain/task/taskTypes';
import { parseQuickSyntax } from './quickSyntax';
import { TaskPreview } from './TaskPreview';

interface QuickCreateDialogProps {
  open: boolean;
  onClose: () => void;
  onOpenTask: (id: string) => void;
}

function toIso(value: string) {
  if (!value) return null;
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date.toISOString();
}

function toInputDate(value: string | null) {
  if (!value) return '';
  const date = new Date(value);
  const local = new Date(date.getTime() - date.getTimezoneOffset() * 60_000);
  return local.toISOString().slice(0, 16);
}

export function QuickCreateDialog({ open, onClose, onOpenTask }: QuickCreateDialogProps) {
  const { createMutation } = useTaskActions();
  const [syntaxEnabled, setSyntaxEnabled] = useState(true);
  const [input, setInput] = useState('');
  const [planStart, setPlanStart] = useState('');
  const [dueAt, setDueAt] = useState('');
  const [estimate, setEstimate] = useState('');
  const [priority, setPriority] = useState<TaskPriority>('none');
  const parsed = useMemo(() => syntaxEnabled ? parseQuickSyntax(input) : {
    title: input.trim(), tags: [], priority: 'none' as const, estimateMinutes: null, planStart: null, recognized: [],
  }, [input, syntaxEnabled]);

  const updateInput = (value: string) => {
    setInput(value);
    if (!syntaxEnabled) return;
    const next = parseQuickSyntax(value);
    if (next.planStart) setPlanStart(toInputDate(next.planStart));
    if (next.estimateMinutes) setEstimate(`${next.estimateMinutes}`);
    if (next.priority !== 'none') setPriority(next.priority);
  };

  const reset = () => {
    setInput('');
    setPlanStart('');
    setDueAt('');
    setEstimate('');
    setPriority('none');
  };

  const create = async (mode: 'close' | 'open' | 'continue') => {
    if (!parsed.title) return;
    const minutes = estimate ? Number(estimate) : null;
    const start = toIso(planStart);
    const draft: TaskDraft = {
      title: parsed.title,
      tags: parsed.tags,
      priority,
      planStart: start,
      planEnd: start && minutes ? new Date(new Date(start).getTime() + minutes * 60_000).toISOString() : null,
      dueAt: toIso(dueAt),
      estimateMinutes: minutes,
    };
    const task = await createMutation.mutateAsync({ draft, commandId: crypto.randomUUID() });
    reset();
    if (mode === 'open') onOpenTask(task.id);
    else if (mode === 'close') onClose();
  };

  return (
    <Modal open={open} title="快速创建任务" onClose={onClose}>
      <div className="quick-create">
        <label className="quick-create__syntax-toggle">
          <input type="checkbox" checked={syntaxEnabled} onChange={(event) => setSyntaxEnabled(event.target.checked)} />
          <span>启用确定性快速语法</span>
        </label>
        <Field
          label="任务"
          value={input}
          autoFocus
          placeholder="例如：写周报 今天 14:30 #工作 !高 /45m"
          onChange={(event) => updateInput(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === 'Enter' && !event.shiftKey && parsed.title) {
              event.preventDefault();
              void create('close');
            }
          }}
        />
        <TaskPreview parsed={parsed} />
        <div className="quick-create__fields">
          <PlanTimeField value={planStart} onChange={setPlanStart} />
          <DueTimeField value={dueAt} onChange={setDueAt} />
          <DurationField value={estimate} onChange={setEstimate} />
          <label className="field">
            <span className="field__label">优先级</span>
            <select className="field__control" value={priority} onChange={(event) => setPriority(event.target.value as TaskPriority)}>
              <option value="none">无</option><option value="low">低</option><option value="medium">中</option><option value="high">高</option>
            </select>
          </label>
        </div>
        <p className="quick-create__hint">计划时间决定何时做，截止时间决定最晚何时完成；两者互不覆盖。</p>
        <div className="quick-create__actions">
          <Button variant="ghost" disabled={!parsed.title || createMutation.isPending} onClick={() => void create('continue')}>创建并继续</Button>
          <Button disabled={!parsed.title || createMutation.isPending} onClick={() => void create('open')}>创建并打开</Button>
          <Button variant="primary" disabled={!parsed.title || createMutation.isPending} onClick={() => void create('close')}>创建任务</Button>
        </div>
      </div>
    </Modal>
  );
}
