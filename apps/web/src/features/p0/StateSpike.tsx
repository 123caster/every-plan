import { useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { useQueryClient } from '@tanstack/react-query';
import { useStore } from 'zustand';
import { createTaskRepository, type TaskRepository } from '../../data/repositories/taskRepository';
import type { TaskRecord } from '../../data/db';
import { Button } from '../../design-system/primitives/Button';
import { Field } from '../../design-system/primitives/Field';
import { createStateSpikeStore, type StateSpikeStore } from './stateSpikeStore';

interface TaskFormValues {
  title: string;
  planStart: string;
  planEnd: string;
  dueAt: string;
}

const initialValues: TaskFormValues = {
  title: '梳理插件权限设计',
  planStart: '2026-10-03T09:00',
  planEnd: '2026-10-03T10:00',
  dueAt: '2026-10-03T18:00',
};

interface StateSpikeProps {
  store?: StateSpikeStore;
  repository?: TaskRepository;
}

const defaultStore = createStateSpikeStore();
const defaultRepository = createTaskRepository();

export function StateSpike({ store = defaultStore, repository = defaultRepository }: StateSpikeProps) {
  const queryClient = useQueryClient();
  const tasks = useStore(store, (state) => state.tasks);
  const lastMerge = useStore(store, (state) => state.lastMerge);
  const currentTask = tasks[0];
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isDirty, isSubmitting },
  } = useForm<TaskFormValues>({ defaultValues: initialValues });

  const displayedTask = useMemo(() => currentTask ?? null, [currentTask]);

  const save = handleSubmit(async (values) => {
    const task: TaskRecord = {
      id: currentTask?.id ?? 'p0-state-task',
      title: values.title,
      status: currentTask?.status ?? 'todo',
      planStart: values.planStart,
      planEnd: values.planEnd,
      dueAt: values.dueAt,
      updatedAt: new Date().toISOString(),
    };
    await repository.save(task);
    store.getState().upsert(task);
    queryClient.setQueryData(['tasks', 'p0'], [task]);
    reset(values);
  });

  const undo = () => {
    reset(
      displayedTask
        ? {
            title: displayedTask.title,
            planStart: displayedTask.planStart ?? '',
            planEnd: displayedTask.planEnd ?? '',
            dueAt: displayedTask.dueAt ?? '',
          }
        : initialValues,
    );
  };

  const simulateServerMerge = () => {
    const base: TaskRecord = currentTask ?? {
      id: 'p0-state-task',
      title: initialValues.title,
      status: 'todo',
      planStart: initialValues.planStart,
      planEnd: initialValues.planEnd,
      dueAt: initialValues.dueAt,
      updatedAt: new Date().toISOString(),
    };
    const incoming = { ...base, title: `${base.title} · 已合并`, updatedAt: new Date().toISOString() };
    store.getState().mergeServerSnapshot([incoming]);
    queryClient.setQueryData(['tasks', 'p0'], [incoming]);
  };

  return (
    <section className="spike-card" aria-labelledby="state-spike-title">
      <header className="spike-card__header">
        <div>
          <span className="eyebrow">P0 · 状态 / 表单 / 缓存</span>
          <h2 id="state-spike-title">任务编辑最小闭环</h2>
        </div>
        <span className={`save-indicator ${isDirty ? 'save-indicator--dirty' : ''}`}>
          {isDirty ? '有未保存修改' : '已同步到表单基线'}
        </span>
      </header>

      <form className="state-form" onSubmit={save}>
        <Field
          label="任务标题"
          error={errors.title?.message}
          {...register('title', { required: '请输入任务标题' })}
        />
        <div className="state-form__times">
          <Field label="计划开始" type="datetime-local" {...register('planStart')} />
          <Field label="计划结束" type="datetime-local" {...register('planEnd')} />
          <Field label="截止时间" type="datetime-local" {...register('dueAt')} />
        </div>
        <div className="state-form__actions">
          <Button variant="primary" type="submit" disabled={isSubmitting}>保存到本地仓库</Button>
          <Button onClick={undo} disabled={!isDirty}>撤销未提交修改</Button>
          <Button variant="ghost" onClick={simulateServerMerge}>模拟服务端实体合并</Button>
        </div>
      </form>

      <div className="entity-preview" aria-live="polite">
        <span>实体快照</span>
        <strong>{displayedTask?.title ?? '尚未保存'}</strong>
        <small>{lastMerge ? '服务端模拟数据已合并；主题与布局偏好不受影响。' : '保存后可刷新恢复。'}</small>
      </div>
    </section>
  );
}
