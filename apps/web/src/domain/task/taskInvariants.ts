import type { Task, TaskDraft, TaskPatch } from './taskTypes';

export class TaskInvariantError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'TaskInvariantError';
  }
}

export function assertTaskValues(task: Task | TaskDraft | TaskPatch) {
  if ('title' in task && task.title !== undefined && task.title.trim().length === 0) {
    throw new TaskInvariantError('任务标题不能为空');
  }
  if (task.planStart && task.planEnd && new Date(task.planEnd).getTime() <= new Date(task.planStart).getTime()) {
    throw new TaskInvariantError('计划结束必须晚于计划开始');
  }
  if ('estimateMinutes' in task && task.estimateMinutes !== undefined && task.estimateMinutes !== null) {
    if (!Number.isInteger(task.estimateMinutes) || task.estimateMinutes <= 0) {
      throw new TaskInvariantError('预计时长必须是正整数分钟');
    }
  }
  if ('allDayDate' in task && task.allDayDate && task.planStart) {
    throw new TaskInvariantError('全天计划日期与定时计划不能同时存在');
  }
  if ('dueDate' in task && task.dueDate && task.dueAt) {
    throw new TaskInvariantError('全天截止日期与定时截止时刻不能同时存在');
  }
}

