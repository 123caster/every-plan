import type { AppRoute } from '../app/router';

const viewCopy: Record<AppRoute, { title: string; intro: string }> = {
  today: { title: '今天', intro: '把下一步行动放在最清晰的位置' },
  calendar: { title: '周日历', intro: '用足够的空间看清时间与任务' },
  plugins: { title: '插件中心', intro: '扩展能力，但不侵入任务核心' },
  'plugin-import': { title: '导入插件', intro: '从本地包增加新能力' },
  appearance: { title: '外观设置', intro: '主题、字号、密度和详情布局' },
  foundation: { title: '技术基线', intro: '工程、PWA、本地数据与设计令牌' },
  state: { title: '状态实验室', intro: '本地保存与实体合并验证' },
};

export function ContextSidebar({ activeView }: { activeView: AppRoute }) {
  const copy = viewCopy[activeView];
  return (
    <aside className="context-sidebar">
      <div>
        <span className="eyebrow">Every Plan / Personal</span>
        <h1>{copy.title}</h1>
        <p>{copy.intro}</p>
      </div>
      <div className="sidebar-section">
        <span>个人工作台</span>
        <ul>
          <li><i className="dot dot--ready" /> 今日任务与进度</li>
          <li><i className="dot dot--ready" /> 计划和截止时间分离</li>
          <li><i className="dot dot--ready" /> 本地自动保存</li>
          <li><i className="dot" /> 可安装插件扩展区</li>
        </ul>
      </div>
      <div className="sidebar-note">
        <strong>Local-first</strong>
        <span>数据先落在当前设备。服务端同步接口通过适配层后续接入。</span>
      </div>
    </aside>
  );
}
