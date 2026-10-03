import { createTaskEntity } from './taskCommands';
import { projectToday } from './todayProjection';

describe('today projection', () => {
  const now = new Date('2026-10-03T10:00:00+08:00');

  it('includes the same task only once when plan and due are both today', () => {
    const task = createTaskEntity({
      title: '只出现一次', planStart: '2026-10-03T11:00:00+08:00',
      planEnd: '2026-10-03T12:00:00+08:00', dueAt: '2026-10-03T18:00:00+08:00', estimateMinutes: 60,
    }, now);
    const projection = projectToday([task, task], now);
    expect(projection.summary.total).toBe(1);
    expect(projection.next).toHaveLength(1);
  });

  it('keeps all-day dates as literal local dates', () => {
    const task = createTaskEntity({ title: '全天计划', allDayDate: '2026-10-03' }, now);
    expect(projectToday([task], now, 'Asia/Shanghai').later[0]?.id).toBe(task.id);
  });

  it('groups completed items and calculates progress', () => {
    const todo = createTaskEntity({ title: '未完成', dueDate: '2026-10-03', estimateMinutes: 30 }, now);
    const done = { ...createTaskEntity({ title: '已完成', dueDate: '2026-10-03' }, now), status: 'done' as const };
    const projection = projectToday([todo, done], now);
    expect(projection.completed).toHaveLength(1);
    expect(projection.summary.progressPercent).toBe(50);
    expect(projection.summary.estimateMinutes).toBe(30);
  });
});

