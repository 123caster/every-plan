import type { AppRoute } from '../app/router';

const items: Array<{ id: AppRoute; label: string }> = [
  { id: 'today', label: '今天' },
  { id: 'calendar', label: '日历' },
  { id: 'plugins', label: '插件' },
  { id: 'appearance', label: '设置' },
];

export function MobileNav({
  activeView,
  onViewChange,
  onQuickCreate,
}: {
  activeView: AppRoute;
  onViewChange: (view: AppRoute) => void;
  onQuickCreate: () => void;
}) {
  return (
    <nav className="mobile-nav" aria-label="移动端主导航">
      <button type="button" className="mobile-nav__create" aria-label="快速创建任务" onClick={onQuickCreate}>＋</button>
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
