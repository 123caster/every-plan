import { assertTaskValues } from './taskInvariants';
import type { Task, TaskDraft, TaskPatch } from './taskTypes';

const fallbackTimezone = 'Asia/Shanghai';

export function createTaskEntity(draft: TaskDraft, now = new Date()): Task {
  assertTaskValues(draft);
  const timestamp = now.toISOString();
  return {
    id: draft.id ?? crypto.randomUUID(),
    title: draft.title.trim(),
    description: draft.description ?? '',
    status: 'todo',
    priority: draft.priority ?? 'none',
    listId: draft.listId ?? 'inbox',
    listName: draft.listName ?? '收件箱',
    tags: [...new Set(draft.tags ?? [])],
    planStart: draft.planStart ?? null,
    planEnd: draft.planEnd ?? null,
    allDayDate: draft.allDayDate ?? null,
    dueAt: draft.dueAt ?? null,
    dueDate: draft.dueDate ?? null,
    timezone: draft.timezone ?? fallbackTimezone,
    estimateMinutes: draft.estimateMinutes ?? null,
    subtasks: draft.subtasks ?? [],
    order: draft.order ?? now.getTime(),
    version: 1,
    createdAt: timestamp,
    updatedAt: timestamp,
    completedAt: null,
  };
}

export function updateTaskEntity(task: Task, patch: TaskPatch, now = new Date()): Task {
  const next = {
    ...task,
    ...patch,
    title: patch.title === undefined ? task.title : patch.title.trim(),
    tags: patch.tags === undefined ? task.tags : [...new Set(patch.tags)],
    version: task.version + 1,
    updatedAt: now.toISOString(),
  };
  assertTaskValues(next);
  return next;
}

export function completeTaskEntity(task: Task, completed: boolean, now = new Date()): Task {
  return updateTaskEntity(task, {
    status: completed ? 'done' : 'todo',
    completedAt: completed ? now.toISOString() : null,
  }, now);
}

export function moveTaskPlan(task: Task, planStart: string | null, planEnd: string | null, now = new Date()): Task {
  return updateTaskEntity(task, { planStart, planEnd, allDayDate: null }, now);
}

