import type { IDBPDatabase, IDBPTransaction } from 'idb';
import type { EveryPlanDb } from './db';

export const DATABASE_VERSION = 2;

export function migrateDatabase(
  database: IDBPDatabase<EveryPlanDb>,
  oldVersion: number,
  newVersion: number,
  transaction: IDBPTransaction<EveryPlanDb, Array<'tasks' | 'preferences' | 'meta'>, 'versionchange'>,
) {
  if (oldVersion < 1 && newVersion >= 1) {
    const tasks = database.createObjectStore('tasks', { keyPath: 'id' });
    tasks.createIndex('by-updatedAt', 'updatedAt');
  }

  if (oldVersion < 2 && newVersion >= 2) {
    database.createObjectStore('preferences', { keyPath: 'scope' });
    database.createObjectStore('meta', { keyPath: 'key' });
    transaction.objectStore('meta').put({ key: 'schema', value: '2' });
  }
}
