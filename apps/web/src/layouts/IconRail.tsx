import type { AppRoute } from '../app/router';

interface IconRailProps {
  activeView: AppRoute;
  onViewChange: (view: AppRoute) => void;
  onQuickCreate: () => void;
}

const navItems: Array<{ id: AppRoute; label: string; icon: string }> = [
  { id: 'today', label: '今天', icon: '✓' },
  { id: 'calendar', label: '周日历', icon: '▦' },
  { id: 'plugins', label: '插件', icon: '⬡' },
  { id: 'appearance', label: '设置', icon: '⚙' },
];

export function IconRail({ activeView, onViewChange, onQuickCreate }: IconRailProps) {
  return (
    <nav className="icon-rail" aria-label="主导航">
      <div className="brand-mark" aria-label="Every Plan">E</div>
      <div className="icon-rail__items">
        <button type="button" className="icon-rail__button icon-rail__button--create" aria-label="快速创建任务" onClick={onQuickCreate}>
          <span aria-hidden="true">＋</span>
        </button>
        {navItems.map((item) => (
          <button
            type="button"
            className="icon-rail__button"
            aria-label={item.label}
            aria-current={activeView === item.id ? 'page' : undefined}
            onClick={() => onViewChange(item.id)}
            key={item.id}
          >
            <span aria-hidden="true">{item.icon}</span>
          </button>
        ))}
      </div>
      <button type="button" className="avatar-button" aria-label="本地个人空间">欧</button>
    </nav>
  );
}
