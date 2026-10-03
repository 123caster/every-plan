import { createContext, createElement, useContext, useEffect, useMemo, type PropsWithChildren } from 'react';
import { createStore, type StoreApi } from 'zustand/vanilla';
import { useStore } from 'zustand';
import { createPreferenceRepository, type PreferenceRepository } from './preferenceRepository';
import {
  defaultPreferences,
  resolvePreferences,
  resolveTheme,
  type Preferences,
} from './preferenceTypes';

interface PreferenceState {
  preferences: Preferences;
  hydrated: boolean;
  hydrate: (accountDefaults?: Partial<Preferences>) => Promise<void>;
  update: <Key extends keyof Preferences>(key: Key, value: Preferences[Key]) => Promise<void>;
  reset: () => Promise<void>;
}

export type PreferenceStore = StoreApi<PreferenceState>;

export function applyPreferencesToDocument(preferences: Preferences, target = document.documentElement) {
  const prefersDark = window.matchMedia?.('(prefers-color-scheme: dark)').matches ?? false;
  const reducedBySystem = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false;
  target.dataset.theme = resolveTheme(preferences.theme, prefersDark);
  target.dataset.density = preferences.density;
  target.dataset.fontScale = preferences.fontScale;
  target.dataset.motion =
    preferences.motion === 'system' ? (reducedBySystem ? 'reduced' : 'full') : preferences.motion;
}

export function createPreferenceStore(
  repository: PreferenceRepository = createPreferenceRepository(),
): PreferenceStore {
  return createStore<PreferenceState>((set, get) => ({
    preferences: defaultPreferences,
    hydrated: false,
    async hydrate(accountDefaults = {}) {
      const deviceOverrides = await repository.load();
      const preferences = resolvePreferences(accountDefaults, deviceOverrides);
      set({ preferences, hydrated: true });
    },
    async update(key, value) {
      const preferences = { ...get().preferences, [key]: value };
      set({ preferences });
      await repository.save(preferences);
    },
    async reset() {
      set({ preferences: defaultPreferences });
      await repository.save(defaultPreferences);
    },
  }));
}

const PreferenceStoreContext = createContext<PreferenceStore | null>(null);

export function PreferenceProvider({ children }: PropsWithChildren) {
  const store = useMemo(() => createPreferenceStore(), []);

  useEffect(() => {
    void store.getState().hydrate();
    const unsubscribe = store.subscribe((state) => applyPreferencesToDocument(state.preferences));
    applyPreferencesToDocument(store.getState().preferences);
    return unsubscribe;
  }, [store]);

  return createElement(PreferenceStoreContext.Provider, { value: store }, children);
}

export function usePreferences() {
  const store = useContext(PreferenceStoreContext);
  if (!store) throw new Error('usePreferences must be used inside PreferenceProvider');
  return useStore(store);
}
