export const themeOptions = ['system', 'obsidian-mint', 'ivory-editorial', 'midnight-aura'] as const;
export const densityOptions = ['comfortable', 'compact', 'focus'] as const;
export const fontScaleOptions = ['90', '100', '115', '130'] as const;
export const detailModeOptions = ['drawer', 'modal'] as const;
export const motionOptions = ['system', 'full', 'reduced'] as const;

export type ThemePreference = (typeof themeOptions)[number];
export type ResolvedTheme = Exclude<ThemePreference, 'system'>;
export type DensityPreference = (typeof densityOptions)[number];
export type FontScalePreference = (typeof fontScaleOptions)[number];
export type DetailModePreference = (typeof detailModeOptions)[number];
export type MotionPreference = (typeof motionOptions)[number];

export interface Preferences {
  theme: ThemePreference;
  density: DensityPreference;
  fontScale: FontScalePreference;
  detailMode: DetailModePreference;
  motion: MotionPreference;
}

export const defaultPreferences: Preferences = {
  theme: 'system',
  density: 'comfortable',
  fontScale: '100',
  detailMode: 'drawer',
  motion: 'system',
};

export function resolvePreferences(
  accountDefaults: Partial<Preferences> = {},
  deviceOverrides: Partial<Preferences> = {},
): Preferences {
  return { ...defaultPreferences, ...accountDefaults, ...deviceOverrides };
}

export function resolveTheme(preference: ThemePreference, prefersDark = false): ResolvedTheme {
  if (preference !== 'system') return preference;
  return prefersDark ? 'midnight-aura' : 'ivory-editorial';
}

