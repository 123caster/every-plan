export type P0View = 'overview' | 'state' | 'calendar';

interface IconRailProps {
  activeView: P0View;
  onViewChange: (view: P0View) => void;
}

const navItems: Array<{ id: P0View; label: string; icon: string }> = [
  { id: 'overview', label: '总览', icon: '◇' },
  { id: 'state', label: '状态验证', icon: '✓' },
  { id: 'calendar', label: '日历验证', icon: '▦' },
];

export function IconRail({ activeView, onViewChange }: IconRailProps) {
  return (
    <nav className="icon-rail" aria-label="主导航">
      <div className="brand-mark" aria-label="Every Plan">E</div>
      <div className="icon-rail__items">
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

