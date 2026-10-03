import { openEveryPlanDb } from '../../data/db';
import type { Preferences } from './preferenceTypes';

export interface PreferenceRepository {
  load(): Promise<Partial<Preferences>>;
  save(preferences: Preferences): Promise<void>;
}

export function createPreferenceRepository(databaseName?: string): PreferenceRepository {
  return {
    async load() {
      const database = await openEveryPlanDb({ name: databaseName });
      try {
        const record = await database.get('preferences', 'device');
        return (record?.value ?? {}) as Partial<Preferences>;
      } finally {
        database.close();
      }
    },
    async save(preferences) {
      const database = await openEveryPlanDb({ name: databaseName });
      try {
        await database.put('preferences', {
          scope: 'device',
          value: { ...preferences },
          updatedAt: new Date().toISOString(),
        });
      } finally {
        database.close();
      }
    },
  };
}

