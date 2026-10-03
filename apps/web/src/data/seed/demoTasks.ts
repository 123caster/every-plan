import type { TaskDraft } from '../../domain/task/taskTypes';
import { dateKeyInTimezone } from '../../domain/task/todayProjection';

function localIso(dateKey: string, time: string) {
  return `${dateKey}T${time}:00+08:00`;
}

export function createDemoTaskDrafts(now = new Date()): TaskDraft[] {
  const today = dateKeyInTimezone(now);
  return [
    {
      id: 'demo-plan-review', title: '梳理今日最重要的三件事',
      planStart: localIso(today, '09:00'), planEnd: localIso(today, '09:30'),
      dueAt: localIso(today, '18:00'), estimateMinutes: 30, priority: 'high', tags: ['规划'], order: 10,
    },
    {
      id: 'demo-plugin-api', title: '评审插件 API 边界',
      planStart: localIso(today, '11:00'), planEnd: localIso(today, '12:00'),
      estimateMinutes: 60, priority: 'medium', tags: ['开发'], order: 20,
    },
    {
      id: 'demo-interface', title: '整理下一版界面反馈',
      planStart: localIso(today, '15:00'), planEnd: localIso(today, '16:00'),
      dueAt: localIso(today, '20:00'), estimateMinutes: 45, tags: ['设计'], order: 30,
    },
    {
      id: 'demo-reading', title: '阅读 30 分钟', dueDate: today,
      estimateMinutes: 30, priority: 'low', tags: ['个人'], order: 40,
    },
  ];
}

