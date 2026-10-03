import { act, renderHook, waitFor } from '@testing-library/react';
import { createElement, type PropsWithChildren } from 'react';
import { deleteEveryPlanDb } from '../../data/db';
import { createPreferenceRepository } from './preferenceRepository';
import {
  applyPreferencesToDocument,
  createPreferenceStore,
  PreferenceProvider,
  usePreferences,
} from './preferenceStore';
import { defaultPreferences, resolvePreferences } from './preferenceTypes';

describe('preference store', () => {
  it('lets device overrides win without overwriting unrelated settings', () => {
    expect(
      resolvePreferences(
        { theme: 'ivory-editorial', density: 'compact', fontScale: '115' },
        { theme: 'midnight-aura', detailMode: 'modal' },
      ),
    ).toEqual({
      ...defaultPreferences,
      theme: 'midnight-aura',
      density: 'compact',
      fontScale: '115',
      detailMode: 'modal',
    });
  });

  it('persists independent density and font scale values', async () => {
    const name = `preference-store-${crypto.randomUUID()}`;
    const repository = createPreferenceRepository(name);
    const store = createPreferenceStore(repository);
    await store.getState().hydrate();
    await store.getState().update('density', 'compact');
    await store.getState().update('fontScale', '130');

    const restored = createPreferenceStore(repository);
    await restored.getState().hydrate();
    expect(restored.getState().preferences.density).toBe('compact');
    expect(restored.getState().preferences.fontScale).toBe('130');
    await deleteEveryPlanDb(name);
  });

  it('applies 130% font scale independently from compact density', () => {
    applyPreferencesToDocument({ ...defaultPreferences, density: 'compact', fontScale: '130' });
    expect(document.documentElement.dataset.density).toBe('compact');
    expect(document.documentElement.dataset.fontScale).toBe('130');
  });

  it('hydrates the React preference provider', async () => {
    const wrapper = ({ children }: PropsWithChildren) =>
      createElement(PreferenceProvider, null, children);
    const { result } = renderHook(() => usePreferences(), { wrapper });
    await waitFor(() => expect(result.current.hydrated).toBe(true));
    await act(() => result.current.update('theme', 'obsidian-mint'));
    expect(result.current.preferences.theme).toBe('obsidian-mint');
  });
});
