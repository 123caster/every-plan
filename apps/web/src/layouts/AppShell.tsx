import type { PropsWithChildren } from 'react';
import { ContextSidebar } from './ContextSidebar';
import { IconRail, type P0View } from './IconRail';
import { MobileNav } from './MobileNav';

interface AppShellProps extends PropsWithChildren {
  activeView: P0View;
  onViewChange: (view: P0View) => void;
}

export function AppShell({ activeView, onViewChange, children }: AppShellProps) {
  return (
    <div className="app-shell">
      <IconRail activeView={activeView} onViewChange={onViewChange} />
      <ContextSidebar activeView={activeView} />
      <main className="workspace">
        <header className="workspace__topbar">
          <div>
            <span className="runtime-pill"><i /> 本地演示</span>
            <span className="version-label">v0.1.0 · P0</span>
          </div>
          <div className="workspace__actions">
            <kbd>⌘</kbd><kbd>K</kbd>
            <span>Chrome / Edge 优先</span>
          </div>
        </header>
        <div className="workspace__content">{children}</div>
      </main>
      <MobileNav activeView={activeView} onViewChange={onViewChange} />
    </div>
  );
}

