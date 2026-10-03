import type { Task } from './taskTypes';

export interface TodayProjection {
  next: Task[];
  later: Task[];
  completed: Task[];
  summary: {
    total: number;
    incomplete: number;
    completed: number;
    estimateMinutes: number;
    progressPercent: number;
  };
}

export function dateKeyInTimezone(value: string | Date, timezone = 'Asia/Shanghai') {
  const date = typeof value === 'string' ? new Date(value) : value;
  const parts = new Intl.DateTimeFormat('en', {
    timeZone: timezone,
    year: 'numeric', month: '2-digit', day: '2-digit',
  }).formatToParts(date);
  const get = (type: Intl.DateTimeFormatPartTypes) => parts.find((part) => part.type === type)?.value ?? '';
  return `${get('year')}-${get('month')}-${get('day')}`;
}

function belongsToDate(task: Task, dateKey: string, timezone: string) {
  const keys = new Set<string>();
  if (task.allDayDate) keys.add(task.allDayDate);
  if (task.dueDate) keys.add(task.dueDate);
  if (task.planStart) keys.add(dateKeyInTimezone(task.planStart, timezone));
  if (task.dueAt) keys.add(dateKeyInTimezone(task.dueAt, timezone));
  return keys.has(dateKey);
}

function timeValue(task: Task) {
  return task.planStart ? new Date(task.planStart).getTime() : Number.POSITIVE_INFINITY;
}

export function projectToday(tasks: Task[], now = new Date(), timezone = 'Asia/Shanghai'): TodayProjection {
  const today = dateKeyInTimezone(now, timezone);
  const horizon = now.getTime() + 4 * 60 * 60 * 1000;
  const unique = [...new Map(
    tasks.filter((task) => belongsToDate(task, today, timezone)).map((task) => [task.id, task]),
  ).values()];
  const completed = unique.filter((task) => task.status === 'done').sort((a, b) => timeValue(a) - timeValue(b));
  const incomplete = unique.filter((task) => task.status === 'todo').sort((a, b) => timeValue(a) - timeValue(b));
  const next = incomplete.filter((task) => task.planStart && new Date(task.planStart).getTime() <= horizon);
  const nextIds = new Set(next.map((task) => task.id));
  const later = incomplete.filter((task) => !nextIds.has(task.id));
  const estimateMinutes = incomplete.reduce((sum, task) => sum + (task.estimateMinutes ?? 0), 0);
  return {
    next,
    later,
    completed,
    summary: {
      total: unique.length,
      incomplete: incomplete.length,
      completed: completed.length,
      estimateMinutes,
      progressPercent: unique.length === 0 ? 0 : Math.round((completed.length / unique.length) * 100),
    },
  };
}

