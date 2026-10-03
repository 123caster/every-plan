import { deleteEveryPlanDb } from '../db';
import { createTaskRepository } from '../repositories/taskRepository';
import { seedDatabase } from './seedDatabase';

describe('demo database seed', () => {
  const names = new Set<string>();
  afterEach(async () => Promise.all([...names].map((name) => deleteEveryPlanDb(name))));

  it('seeds only an empty database and never duplicates', async () => {
    const name = `seed-${crypto.randomUUID()}`;
    names.add(name);
    const now = new Date('2026-10-03T08:00:00+08:00');
    expect(await seedDatabase(name, now)).toBe(true);
    expect(await seedDatabase(name, now)).toBe(false);
    expect(await createTaskRepository(name).list()).toHaveLength(4);
  });

  it('does not seed over user data', async () => {
    const name = `seed-existing-${crypto.randomUUID()}`;
    names.add(name);
    const repository = createTaskRepository(name);
    await repository.create({ title: '用户已有任务' });
    expect(await seedDatabase(name)).toBe(false);
    expect((await repository.list()).map((task) => task.title)).toEqual(['用户已有任务']);
  });
});

