import { createTaskEntity } from '../task/taskCommands';
import { projectWeek } from './weekProjection';

describe('week projection', () => {
  it('places planned tasks by the selected timezone and ignores due-only dates', () => {
    const task = createTaskEntity({
      title: '跨午夜任务', planStart: '2026-10-02T16:30:00.000Z', planEnd: '2026-10-02T17:30:00.000Z',
      dueAt: '2026-10-05T10:00:00+08:00',
    });
    const result = projectWeek([task], ['2026-10-02', '2026-10-03'], 'Asia/Shanghai');
    expect(result.get('2026-10-03')?.[0]?.id).toBe(task.id);
    expect(result.get('2026-10-02')).toHaveLength(0);
  });
});

