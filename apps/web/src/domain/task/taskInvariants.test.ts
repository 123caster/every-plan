import { completeTaskEntity, createTaskEntity, moveTaskPlan, updateTaskEntity } from './taskCommands';
import { TaskInvariantError } from './taskInvariants';

describe('task invariants and commands', () => {
  const now = new Date('2026-10-03T08:00:00+08:00');

  it('keeps plan and due values independent when moving a task', () => {
    const task = createTaskEntity({
      id: 'task-1', title: '评审任务模型',
      planStart: '2026-10-03T09:00:00+08:00', planEnd: '2026-10-03T10:00:00+08:00',
      dueAt: '2026-10-03T18:00:00+08:00',
    }, now);
    const moved = moveTaskPlan(task, '2026-10-03T14:00:00+08:00', '2026-10-03T15:00:00+08:00');
    expect(moved.planStart).toContain('14:00');
    expect(moved.dueAt).toBe(task.dueAt);
  });

  it('rejects invalid task values', () => {
    expect(() => createTaskEntity({ title: ' ', estimateMinutes: 30 }, now)).toThrow(TaskInvariantError);
    expect(() => createTaskEntity({ title: '错误时间', planStart: '2026-10-03T11:00:00+08:00', planEnd: '2026-10-03T10:00:00+08:00' }, now)).toThrow('计划结束必须晚于计划开始');
  });

  it('increments versions and can reopen a completed task', () => {
    const task = createTaskEntity({ title: '完成验证' }, now);
    const completed = completeTaskEntity(task, true);
    const reopened = completeTaskEntity(completed, false);
    expect(completed.status).toBe('done');
    expect(reopened.status).toBe('todo');
    expect(reopened.completedAt).toBeNull();
    expect(reopened.version).toBe(3);
  });

  it('deduplicates tags on updates', () => {
    const task = createTaskEntity({ title: '标签验证' }, now);
    expect(updateTaskEntity(task, { tags: ['产品', '产品', '个人'] }, now).tags).toEqual(['产品', '个人']);
  });
});

