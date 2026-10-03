import { deleteEveryPlanDb } from '../db';
import { createTaskRepository } from './taskRepository';

describe('task repository', () => {
  const names = new Set<string>();
  afterEach(async () => {
    await Promise.all([...names].map((name) => deleteEveryPlanDb(name)));
    names.clear();
  });

  it('supports create, update, complete, move and delete', async () => {
    const name = `task-repository-${crypto.randomUUID()}`;
    names.add(name);
    const repository = createTaskRepository(name);
    const created = await repository.create({ title: '实现本地仓库', dueAt: '2026-10-03T18:00:00+08:00' });
    const updated = await repository.update(created.id, { estimateMinutes: 45, tags: ['开发'] });
    const moved = await repository.move(updated.id, '2026-10-03T10:00:00+08:00', '2026-10-03T11:00:00+08:00');
    const completed = await repository.complete(moved.id, true);
    expect(completed.status).toBe('done');
    expect(completed.dueAt).toBe('2026-10-03T18:00:00+08:00');
    expect((await repository.list())[0]?.estimateMinutes).toBe(45);
    await repository.delete(created.id);
    expect(await repository.list()).toEqual([]);
  });

  it('deduplicates retried create commands', async () => {
    const name = `task-command-${crypto.randomUUID()}`;
    names.add(name);
    const repository = createTaskRepository(name);
    const first = await repository.create({ title: '不会重复' }, { commandId: 'create-1' });
    const second = await repository.create({ title: '重试标题不生效' }, { commandId: 'create-1' });
    expect(second.id).toBe(first.id);
    expect(await repository.list()).toHaveLength(1);
  });

  it('normalizes records written by the P0 schema', async () => {
    const name = `task-legacy-${crypto.randomUUID()}`;
    names.add(name);
    const repository = createTaskRepository(name);
    await repository.save({
      id: 'legacy', title: '旧任务', status: 'todo', planStart: null, planEnd: null,
      dueAt: null, updatedAt: '2026-10-03T00:00:00.000Z',
    });
    expect((await repository.get('legacy'))?.listName).toBe('收件箱');
  });
});

