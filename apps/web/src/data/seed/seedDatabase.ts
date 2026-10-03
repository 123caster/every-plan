import { openEveryPlanDb } from '../db';
import { createTaskEntity } from '../../domain/task/taskCommands';
import { createDemoTaskDrafts } from './demoTasks';

export async function seedDatabase(databaseName?: string, now = new Date()) {
  const database = await openEveryPlanDb({ name: databaseName });
  try {
    if (await database.get('meta', 'seed:demo-v1')) return false;
    if ((await database.count('tasks')) > 0) {
      await database.put('meta', { key: 'seed:demo-v1', value: 'skipped-existing-data' });
      return false;
    }
    const transaction = database.transaction(['tasks', 'meta'], 'readwrite');
    for (const draft of createDemoTaskDrafts(now)) {
      await transaction.objectStore('tasks').put(createTaskEntity(draft, now));
    }
    await transaction.objectStore('meta').put({ key: 'seed:demo-v1', value: now.toISOString() });
    await transaction.done;
    return true;
  } finally {
    database.close();
  }
}

