import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { createContext, useContext, useMemo, type PropsWithChildren } from 'react';
import type { TaskDraft, TaskPatch } from '../../domain/task/taskTypes';
import { seedDatabase } from '../seed/seedDatabase';
import { createTaskRepository, type TaskRepository } from './taskRepository';

interface TaskDataProviderProps extends PropsWithChildren {
  repository?: TaskRepository;
  seed?: boolean;
}

interface TaskDataContextValue {
  repository: TaskRepository;
  seed: boolean;
}

const TaskRepositoryContext = createContext<TaskDataContextValue | null>(null);

export function TaskDataProvider({ children, repository, seed = true }: TaskDataProviderProps) {
  const value = useMemo(() => ({ repository: repository ?? createTaskRepository(), seed }), [repository, seed]);
  return <TaskRepositoryContext.Provider value={value}>{children}</TaskRepositoryContext.Provider>;
}

function useTaskData() {
  const value = useContext(TaskRepositoryContext);
  if (!value) throw new Error('Task data hooks must be used inside TaskDataProvider');
  return value;
}

export function useTasks(seedOverride?: boolean) {
  const { repository, seed } = useTaskData();
  return useQuery({
    queryKey: ['tasks'],
    queryFn: async () => {
      if (seedOverride ?? seed) await seedDatabase();
      return repository.list();
    },
  });
}

export function useTaskActions() {
  const { repository } = useTaskData();
  const queryClient = useQueryClient();
  const refresh = () => queryClient.invalidateQueries({ queryKey: ['tasks'] });
  const createMutation = useMutation({
    mutationFn: ({ draft, commandId }: { draft: TaskDraft; commandId?: string }) => repository.create(draft, { commandId }),
    onSuccess: refresh,
  });
  const updateMutation = useMutation({
    mutationFn: ({ id, patch, commandId }: { id: string; patch: TaskPatch; commandId?: string }) => repository.update(id, patch, { commandId }),
    onSuccess: refresh,
  });
  const completeMutation = useMutation({
    mutationFn: ({ id, completed, commandId }: { id: string; completed: boolean; commandId?: string }) => repository.complete(id, completed, { commandId }),
    onSuccess: refresh,
  });
  const moveMutation = useMutation({
    mutationFn: ({ id, planStart, planEnd, commandId }: { id: string; planStart: string | null; planEnd: string | null; commandId?: string }) => repository.move(id, planStart, planEnd, { commandId }),
    onSuccess: refresh,
  });
  const deleteMutation = useMutation({
    mutationFn: ({ id, commandId }: { id: string; commandId?: string }) => repository.delete(id, { commandId }),
    onSuccess: refresh,
  });
  return { createMutation, updateMutation, completeMutation, moveMutation, deleteMutation };
}
