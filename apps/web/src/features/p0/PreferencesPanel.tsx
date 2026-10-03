import { Button } from '../../design-system/primitives/Button';
import { SegmentedControl } from '../../design-system/primitives/SegmentedControl';
import { usePreferences } from '../../platform/preferences/preferenceStore';
import type {
  DensityPreference,
  FontScalePreference,
  MotionPreference,
  ResolvedTheme,
} from '../../platform/preferences/preferenceTypes';

const themes: Array<{ value: ResolvedTheme; name: string; note: string }> = [
  { value: 'obsidian-mint', name: 'Obsidian Mint', note: '沉静黑绿，适合长期专注' },
  { value: 'ivory-editorial', name: 'Ivory Editorial', note: '暖白编辑感，信息清晰' },
  { value: 'midnight-aura', name: 'Midnight Aura', note: '深夜紫蓝，层次更强' },
];

export function PreferencesPanel() {
  const { preferences, update, hydrated } = usePreferences();

  return (
    <section className="preference-panel" aria-labelledby="appearance-title">
      <header className="section-heading">
        <div>
          <span className="eyebrow">设计令牌实时验证</span>
          <h2 id="appearance-title">让界面适应你，而不是反过来</h2>
        </div>
        <span className="local-badge">{hydrated ? '偏好已从本地恢复' : '正在读取本地偏好'}</span>
      </header>

      <div className="theme-grid" aria-label="主题选择">
        {themes.map((theme) => (
          <button
            type="button"
            className="theme-card"
            data-theme-preview={theme.value}
            aria-pressed={preferences.theme === theme.value}
            onClick={() => void update('theme', theme.value)}
            key={theme.value}
          >
            <span className="theme-card__preview">
              <i /><i /><i />
            </span>
            <strong>{theme.name}</strong>
            <small>{theme.note}</small>
          </button>
        ))}
      </div>

      <div className="preference-panel__controls">
        <SegmentedControl<FontScalePreference>
          label="字体大小"
          value={preferences.fontScale}
          onChange={(value) => void update('fontScale', value)}
          options={[
            { value: '90', label: '紧凑 90%' },
            { value: '100', label: '标准 100%' },
            { value: '115', label: '舒适 115%' },
            { value: '130', label: '大字 130%' },
          ]}
        />
        <SegmentedControl<DensityPreference>
          label="界面密度"
          value={preferences.density}
          onChange={(value) => void update('density', value)}
          options={[
            { value: 'comfortable', label: '舒适' },
            { value: 'compact', label: '紧凑' },
            { value: 'focus', label: '专注' },
          ]}
        />
        <SegmentedControl<MotionPreference>
          label="动态效果"
          value={preferences.motion}
          onChange={(value) => void update('motion', value)}
          options={[
            { value: 'system', label: '跟随系统' },
            { value: 'full', label: '完整' },
            { value: 'reduced', label: '减少' },
          ]}
        />
      </div>

      <div className="preference-panel__footer">
        <Button variant="ghost" onClick={() => void update('theme', 'system')}>主题跟随系统</Button>
        <span>字号和密度相互独立；130% 不会被“紧凑”模式缩小。</span>
      </div>
    </section>
  );
}

