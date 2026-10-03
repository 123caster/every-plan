import { createStore, type StoreApi } from 'zustand/vanilla';
import type { TaskRecord } from '../../data/db';

interface StateSpikeState {
  tasks: TaskRecord[];
  lastMerge: string | null;
  upsert: (task: TaskRecord) => void;
  mergeServerSnapshot: (incoming: TaskRecord[]) => void;
}

export type StateSpikeStore = StoreApi<StateSpikeState>;

export function createStateSpikeStore(): StateSpikeStore {
  return createStore<StateSpikeState>((set) => ({
    tasks: [],
    lastMerge: null,
    upsert(task) {
      set((state) => ({
        tasks: state.tasks.some((item) => item.id === task.id)
          ? state.tasks.map((item) => (item.id === task.id ? task : item))
          : [...state.tasks, task],
      }));
    },
    mergeServerSnapshot(incoming) {
      set((state) => {
        const entities = new Map(state.tasks.map((task) => [task.id, task]));
        incoming.forEach((task) => entities.set(task.id, task));
        return { tasks: [...entities.values()], lastMerge: new Date().toISOString() };
      });
    },
  }));
}

