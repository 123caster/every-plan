import { deleteDB, openDB, type DBSchema, type IDBPDatabase } from 'idb';
import { DATABASE_VERSION, migrateDatabase } from './migrations';

export const DEFAULT_DATABASE_NAME = 'every-plan';

export interface TaskRecord {
  id: string;
  title: string;
  status: 'todo' | 'done';
  planStart: string | null;
  planEnd: string | null;
  dueAt: string | null;
  updatedAt: string;
}

export interface PreferenceRecord {
  scope: 'device';
  value: Record<string, string>;
  updatedAt: string;
}

interface MetaRecord {
  key: string;
  value: string;
}

export interface EveryPlanDb extends DBSchema {
  tasks: {
    key: string;
    value: TaskRecord;
    indexes: { 'by-updatedAt': string };
  };
  preferences: {
    key: 'device';
    value: PreferenceRecord;
  };
  meta: {
    key: string;
    value: MetaRecord;
  };
}

interface OpenDatabaseOptions {
  name?: string;
  version?: number;
  failUpgradeForTest?: boolean;
}

export async function openEveryPlanDb({
  name = DEFAULT_DATABASE_NAME,
  version = DATABASE_VERSION,
  failUpgradeForTest = false,
}: OpenDatabaseOptions = {}): Promise<IDBPDatabase<EveryPlanDb>> {
  if (failUpgradeForTest) {
    throw new Error('Simulated migration preflight failure');
  }
  return openDB<EveryPlanDb>(name, version, {
    upgrade(database, oldVersion, newVersion, transaction) {
      migrateDatabase(database, oldVersion, newVersion ?? version, transaction);
    },
  });
}

export async function deleteEveryPlanDb(name = DEFAULT_DATABASE_NAME) {
  await deleteDB(name);
}
