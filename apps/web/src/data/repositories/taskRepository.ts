import { openEveryPlanDb, type TaskRecord } from '../db';

export interface TaskRepository {
  list(): Promise<TaskRecord[]>;
  save(task: TaskRecord): Promise<void>;
  get(id: string): Promise<TaskRecord | undefined>;
}

export function createTaskRepository(databaseName?: string): TaskRepository {
  return {
    async list() {
      const database = await openEveryPlanDb({ name: databaseName });
      try {
        return await database.getAll('tasks');
      } finally {
        database.close();
      }
    },
    async save(task) {
      const database = await openEveryPlanDb({ name: databaseName });
      try {
        await database.put('tasks', task);
      } finally {
        database.close();
      }
    },
    async get(id) {
      const database = await openEveryPlanDb({ name: databaseName });
      try {
        return await database.get('tasks', id);
      } finally {
        database.close();
      }
    },
  };
}

