import type { P0View } from './IconRail';

const items: Array<{ id: P0View; label: string }> = [
  { id: 'overview', label: '总览' },
  { id: 'state', label: '任务验证' },
  { id: 'calendar', label: '日历验证' },
];

export function MobileNav({
  activeView,
  onViewChange,
}: {
  activeView: P0View;
  onViewChange: (view: P0View) => void;
}) {
  return (
    <nav className="mobile-nav" aria-label="移动端主导航">
      {items.map((item) => (
        <button
          type="button"
          aria-current={activeView === item.id ? 'page' : undefined}
          onClick={() => onViewChange(item.id)}
          key={item.id}
        >{item.label}</button>
      ))}
    </nav>
  );
}

