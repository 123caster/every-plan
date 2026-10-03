import type { IDBPDatabase, IDBPObjectStore } from 'idb';
import { openEveryPlanDb, type EveryPlanDb, type TaskRecord } from '../db';
import { completeTaskEntity, createTaskEntity, moveTaskPlan, updateTaskEntity } from '../../domain/task/taskCommands';
import type { Task, TaskDraft, TaskPatch } from '../../domain/task/taskTypes';

type TasksStore = IDBPObjectStore<EveryPlanDb, Array<'tasks' | 'meta'>, 'tasks', 'readwrite'>;
type MetaStore = IDBPObjectStore<EveryPlanDb, Array<'tasks' | 'meta'>, 'meta', 'readwrite'>;

export interface CommandOptions {
  commandId?: string;
}

export interface TaskRepository {
  list(): Promise<Task[]>;
  get(id: string): Promise<Task | undefined>;
  create(draft: TaskDraft, options?: CommandOptions): Promise<Task>;
  update(id: string, patch: TaskPatch, options?: CommandOptions): Promise<Task>;
  complete(id: string, completed: boolean, options?: CommandOptions): Promise<Task>;
  move(id: string, planStart: string | null, planEnd: string | null, options?: CommandOptions): Promise<Task>;
  delete(id: string, options?: CommandOptions): Promise<void>;
  save(task: TaskRecord | Task): Promise<void>;
}

export function normalizeTaskRecord(record: TaskRecord): Task {
  const fallbackTimestamp = record.updatedAt;
  return {
    id: record.id,
    title: record.title,
    description: record.description ?? '',
    status: record.status,
    priority: record.priority ?? 'none',
    listId: record.listId ?? 'inbox',
    listName: record.listName ?? '收件箱',
    tags: record.tags ?? [],
    planStart: record.planStart,
    planEnd: record.planEnd,
    allDayDate: record.allDayDate ?? null,
    dueAt: record.dueAt,
    dueDate: record.dueDate ?? null,
    timezone: record.timezone ?? 'Asia/Shanghai',
    estimateMinutes: record.estimateMinutes ?? null,
    subtasks: record.subtasks ?? [],
    order: record.order ?? new Date(fallbackTimestamp).getTime(),
    version: record.version ?? 1,
    createdAt: record.createdAt ?? fallbackTimestamp,
    updatedAt: record.updatedAt,
    completedAt: record.completedAt ?? null,
  };
}

function toRecord(task: Task): TaskRecord {
  return { ...task };
}

async function findIdempotentTask(database: IDBPDatabase<EveryPlanDb>, commandId?: string) {
  if (!commandId) return undefined;
  const command = await database.get('meta', `command:${commandId}`);
  if (!command) return undefined;
  const record = await database.get('tasks', command.value);
  return record ? normalizeTaskRecord(record) : undefined;
}

async function rememberCommand(store: MetaStore, commandId: string | undefined, taskId: string) {
  if (commandId) await store.put({ key: `command:${commandId}`, value: taskId });
}

async function requireTask(store: TasksStore, id: string): Promise<Task> {
  const record = await store.get(id);
  if (!record) throw new Error(`Task not found: ${id}`);
  return normalizeTaskRecord(record);
}

export function createTaskRepository(databaseName?: string): TaskRepository {
  return {
    async list() {
      const database = await openEveryPlanDb({ name: databaseName });
      try {
        const records = await database.getAll('tasks');
        return records.map(normalizeTaskRecord).sort((left, right) => left.order - right.order);
      } finally {
        database.close();
      }
    },
    async get(id) {
      const database = await openEveryPlanDb({ name: databaseName });
      try {
        const record = await database.get('tasks', id);
        return record ? normalizeTaskRecord(record) : undefined;
      } finally {
        database.close();
      }
    },
    async create(draft, { commandId } = {}) {
      const database = await openEveryPlanDb({ name: databaseName });
      try {
        const existing = await findIdempotentTask(database, commandId);
        if (existing) return existing;
        const task = createTaskEntity(draft);
        const transaction = database.transaction(['tasks', 'meta'], 'readwrite');
        await transaction.objectStore('tasks').put(toRecord(task));
        await rememberCommand(transaction.objectStore('meta'), commandId, task.id);
        await transaction.done;
        return task;
      } finally {
        database.close();
      }
    },
    async update(id, patch, { commandId } = {}) {
      const database = await openEveryPlanDb({ name: databaseName });
      try {
        const existing = await findIdempotentTask(database, commandId);
        if (existing) return existing;
        const transaction = database.transaction(['tasks', 'meta'], 'readwrite');
        const task = updateTaskEntity(await requireTask(transaction.objectStore('tasks'), id), patch);
        await transaction.objectStore('tasks').put(toRecord(task));
        await rememberCommand(transaction.objectStore('meta'), commandId, task.id);
        await transaction.done;
        return task;
      } finally {
        database.close();
      }
    },
    async complete(id, completed, { commandId } = {}) {
      const database = await openEveryPlanDb({ name: databaseName });
      try {
        const existing = await findIdempotentTask(database, commandId);
        if (existing) return existing;
        const transaction = database.transaction(['tasks', 'meta'], 'readwrite');
        const task = completeTaskEntity(await requireTask(transaction.objectStore('tasks'), id), completed);
        await transaction.objectStore('tasks').put(toRecord(task));
        await rememberCommand(transaction.objectStore('meta'), commandId, task.id);
        await transaction.done;
        return task;
      } finally {
        database.close();
      }
    },
    async move(id, planStart, planEnd, { commandId } = {}) {
      const database = await openEveryPlanDb({ name: databaseName });
      try {
        const existing = await findIdempotentTask(database, commandId);
        if (existing) return existing;
        const transaction = database.transaction(['tasks', 'meta'], 'readwrite');
        const task = moveTaskPlan(await requireTask(transaction.objectStore('tasks'), id), planStart, planEnd);
        await transaction.objectStore('tasks').put(toRecord(task));
        await rememberCommand(transaction.objectStore('meta'), commandId, task.id);
        await transaction.done;
        return task;
      } finally {
        database.close();
      }
    },
    async delete(id, { commandId } = {}) {
      const database = await openEveryPlanDb({ name: databaseName });
      try {
        if (commandId && await database.get('meta', `command:${commandId}`)) return;
        const transaction = database.transaction(['tasks', 'meta'], 'readwrite');
        await transaction.objectStore('tasks').delete(id);
        await rememberCommand(transaction.objectStore('meta'), commandId, id);
        await transaction.done;
      } finally {
        database.close();
      }
    },
    async save(task) {
      const database = await openEveryPlanDb({ name: databaseName });
      try {
        await database.put('tasks', toRecord(normalizeTaskRecord(task)));
      } finally {
        database.close();
      }
    },
  };
}

