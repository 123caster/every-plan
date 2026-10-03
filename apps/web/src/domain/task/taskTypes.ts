export type TaskStatus = 'todo' | 'done';
export type TaskPriority = 'none' | 'low' | 'medium' | 'high';

export interface Subtask {
  id: string;
  title: string;
  completed: boolean;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  status: TaskStatus;
  priority: TaskPriority;
  listId: string;
  listName: string;
  tags: string[];
  planStart: string | null;
  planEnd: string | null;
  allDayDate: string | null;
  dueAt: string | null;
  dueDate: string | null;
  timezone: string;
  estimateMinutes: number | null;
  subtasks: Subtask[];
  order: number;
  version: number;
  createdAt: string;
  updatedAt: string;
  completedAt: string | null;
}

export interface TaskDraft {
  id?: string;
  title: string;
  description?: string;
  priority?: TaskPriority;
  listId?: string;
  listName?: string;
  tags?: string[];
  planStart?: string | null;
  planEnd?: string | null;
  allDayDate?: string | null;
  dueAt?: string | null;
  dueDate?: string | null;
  timezone?: string;
  estimateMinutes?: number | null;
  subtasks?: Subtask[];
  order?: number;
}

export type TaskPatch = Partial<Omit<Task, 'id' | 'createdAt' | 'version' | 'updatedAt'>>;

