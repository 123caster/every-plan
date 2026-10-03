import { useEffect, useState } from 'react';
import { AmbientGlow } from '../design-system/effects/AmbientGlow';
import { PageTransition } from '../design-system/effects/PageTransition';
import { CalendarSpike } from '../features/p0/CalendarSpike';
import { P0Overview } from '../features/p0/P0Overview';
import { StateSpike } from '../features/p0/StateSpike';
import { QuickCreateDialog } from '../features/quick-create/QuickCreateDialog';
import { DetailHost } from '../features/task-detail/DetailHost';
import { TodayPage } from '../features/today/TodayPage';
import { AppShell } from '../layouts/AppShell';
import { usePreferences } from '../platform/preferences/preferenceStore';
import { PwaUpdatePrompt } from './pwa/PwaUpdatePrompt';
import { useAppRouter } from './router';

function CalendarPage() {
  return (
    <>
      <header className="page-hero page-hero--compact"><span className="eyebrow">Calendar / Week</span><h1>周日历</h1><p>压低日期装饰，让任务标题、时间和操作空间成为主体。</p></header>
      <CalendarSpike />
    </>
  );
}

function PluginPage({ importing = false }: { importing?: boolean }) {
  return (
    <div className="placeholder-page">
      <span className="placeholder-page__icon">⬡</span>
      <span className="eyebrow">Extension zone</span>
      <h1>{importing ? '导入插件' : '插件中心'}</h1>
      <p>{importing ? '后续可从本地安装经过权限确认的插件包。' : '任务核心保持轻量，日历同步、文档导入等能力以插件形式增加。'}</p>
      <span className="local-badge">批次 B 保留扩展入口，插件运行时将在后续批次实现</span>
    </div>
  );
}

function FoundationPage({ state = false }: { state?: boolean }) {
  return (
    <>
      <header className="page-hero page-hero--compact"><span className="eyebrow">Foundation / Lab</span><h1>{state ? '状态实验室' : '外观与技术基线'}</h1><p>{state ? '验证本地实体保存和未来服务端合并。' : '主题、字号、密度、详情布局与 PWA 基线。'}</p></header>
      {state ? <StateSpike /> : <P0Overview />}
    </>
  );
}

export function App() {
  const { route, taskId, navigate, setTaskRoute } = useAppRouter();
  const [quickCreateOpen, setQuickCreateOpen] = useState(false);
  const { preferences } = usePreferences();
  const effectsEnabled = preferences.motion !== 'reduced';

  useEffect(() => {
    const handleShortcut = (event: KeyboardEvent) => {
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault();
        setQuickCreateOpen(true);
      }
    };
    window.addEventListener('keydown', handleShortcut);
    return () => window.removeEventListener('keydown', handleShortcut);
  }, []);

  let content;
  if (route === 'today') content = <TodayPage onCreate={() => setQuickCreateOpen(true)} onOpenTask={(id) => setTaskRoute(id)} />;
  else if (route === 'calendar') content = <CalendarPage />;
  else if (route === 'plugins') content = <PluginPage />;
  else if (route === 'plugin-import') content = <PluginPage importing />;
  else if (route === 'state') content = <FoundationPage state />;
  else content = <FoundationPage />;

  return (
    <>
      <AmbientGlow enabled={effectsEnabled} />
      <AppShell activeView={route} onViewChange={navigate} onQuickCreate={() => setQuickCreateOpen(true)}>
        <PageTransition activeKey={route} enabled={effectsEnabled}>{content}</PageTransition>
      </AppShell>
      <QuickCreateDialog open={quickCreateOpen} onClose={() => setQuickCreateOpen(false)} onOpenTask={(id) => { setQuickCreateOpen(false); setTaskRoute(id); }} />
      <DetailHost taskId={taskId} onClose={() => setTaskRoute(null)} />
      <PwaUpdatePrompt />
    </>
  );
}
