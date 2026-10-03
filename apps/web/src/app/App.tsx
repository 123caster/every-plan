import { useState } from 'react';
import { AmbientGlow } from '../design-system/effects/AmbientGlow';
import { PageTransition } from '../design-system/effects/PageTransition';
import { CalendarSpike } from '../features/p0/CalendarSpike';
import { P0Overview } from '../features/p0/P0Overview';
import { StateSpike } from '../features/p0/StateSpike';
import { AppShell } from '../layouts/AppShell';
import type { P0View } from '../layouts/IconRail';
import { usePreferences } from '../platform/preferences/preferenceStore';
import { PwaUpdatePrompt } from './pwa/PwaUpdatePrompt';

const titles: Record<P0View, { eyebrow: string; title: string; description: string }> = {
  overview: {
    eyebrow: 'Foundation / 01',
    title: '一个安静、清晰、可扩展的个人计划空间',
    description: '先把技术地基做稳：令牌、偏好、本地数据、PWA 与跨浏览器验证。',
  },
  state: {
    eyebrow: 'Foundation / 02',
    title: '任务状态不应绑死在某个页面里',
    description: '同一个实体模型支撑编辑、撤销、离线保存和未来的服务端合并。',
  },
  calendar: {
    eyebrow: 'Foundation / 03',
    title: '日历首先要让任务看得清',
    description: '日期只提供结构，任务标题、时间和操作空间才是视觉主角。',
  },
};

export function App() {
  const [activeView, setActiveView] = useState<P0View>('overview');
  const { preferences } = usePreferences();
  const copy = titles[activeView];
  const effectsEnabled = preferences.motion !== 'reduced';

  return (
    <>
      <AmbientGlow enabled={effectsEnabled} />
      <AppShell activeView={activeView} onViewChange={setActiveView}>
        <PageTransition activeKey={activeView} enabled={effectsEnabled}>
          <header className="page-hero">
            <span className="eyebrow">{copy.eyebrow}</span>
            <h1>{copy.title}</h1>
            <p>{copy.description}</p>
          </header>
          {activeView === 'overview' ? <P0Overview /> : null}
          {activeView === 'state' ? <StateSpike /> : null}
          {activeView === 'calendar' ? <CalendarSpike /> : null}
        </PageTransition>
      </AppShell>
      <PwaUpdatePrompt />
    </>
  );
}

