import { deleteEveryPlanDb, openEveryPlanDb, type TaskRecord } from './db';

function createTask(id = 'task-1'): TaskRecord {
  return {
    id,
    title: '验证本地数据',
    status: 'todo',
    planStart: '2026-10-03T09:00:00+08:00',
    planEnd: '2026-10-03T10:00:00+08:00',
    dueAt: '2026-10-03T18:00:00+08:00',
    updatedAt: '2026-10-03T08:00:00+08:00',
  };
}

describe('Every Plan IndexedDB', () => {
  const names = new Set<string>();

  afterEach(async () => {
    await Promise.all([...names].map((name) => deleteEveryPlanDb(name)));
    names.clear();
  });

  it('creates schema and keeps tasks and preferences after reopen', async () => {
    const name = `every-plan-persist-${crypto.randomUUID()}`;
    names.add(name);
    const first = await openEveryPlanDb({ name });
    await first.put('tasks', createTask());
    await first.put('preferences', {
      scope: 'device',
      value: { theme: 'midnight-aura' },
      updatedAt: new Date().toISOString(),
    });
    first.close();

    const reopened = await openEveryPlanDb({ name });
    expect((await reopened.get('tasks', 'task-1'))?.title).toBe('验证本地数据');
    expect((await reopened.get('preferences', 'device'))?.value.theme).toBe('midnight-aura');
    reopened.close();
  });

  it('migrates v1 tasks to v2 without data loss', async () => {
    const name = `every-plan-migrate-${crypto.randomUUID()}`;
    names.add(name);
    const legacy = await openEveryPlanDb({ name, version: 1 });
    await legacy.put('tasks', createTask('legacy-task'));
    legacy.close();

    const migrated = await openEveryPlanDb({ name, version: 2 });
    expect((await migrated.get('tasks', 'legacy-task'))?.title).toBe('验证本地数据');
    expect(migrated.objectStoreNames.contains('preferences')).toBe(true);
    migrated.close();
  });

  it('aborts a failed migration and leaves the v1 database readable', async () => {
    const name = `every-plan-failed-migration-${crypto.randomUUID()}`;
    names.add(name);
    const legacy = await openEveryPlanDb({ name, version: 1 });
    await legacy.put('tasks', createTask('safe-task'));
    legacy.close();

    await expect(openEveryPlanDb({ name, version: 2, failUpgradeForTest: true })).rejects.toThrow(
      'Simulated migration preflight failure',
    );

    const preserved = await openEveryPlanDb({ name, version: 1 });
    expect((await preserved.get('tasks', 'safe-task'))?.id).toBe('safe-task');
    preserved.close();
  });
});
