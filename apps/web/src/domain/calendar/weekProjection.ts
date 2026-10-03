import type { Task } from '../task/taskTypes';
import { dateKeyInTimezone } from '../task/todayProjection';

export function projectWeek(tasks: Task[], dateKeys: string[], timezone = 'Asia/Shanghai') {
  const columns = new Map(dateKeys.map((key) => [key, [] as Task[]]));
  for (const task of tasks) {
    const key = task.allDayDate ?? (task.planStart ? dateKeyInTimezone(task.planStart, timezone) : null);
    if (key && columns.has(key)) columns.get(key)!.push(task);
  }
  for (const tasksInDay of columns.values()) {
    tasksInDay.sort((left, right) => (left.planStart ?? '').localeCompare(right.planStart ?? ''));
  }
  return columns;
}

