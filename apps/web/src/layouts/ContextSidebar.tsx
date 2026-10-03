import type { P0View } from './IconRail';

const viewCopy: Record<P0View, { title: string; intro: string }> = {
  overview: { title: '技术基线', intro: '主题、字号、密度和离线能力' },
  state: { title: '任务状态切片', intro: '创建、编辑、撤销、本地保存和实体合并' },
  calendar: { title: '周日历切片', intro: '可读布局、拖动、时长和键盘替代' },
};

export function ContextSidebar({ activeView }: { activeView: P0View }) {
  const copy = viewCopy[activeView];
  return (
    <aside className="context-sidebar">
      <div>
        <span className="eyebrow">Every Plan / Batch A</span>
        <h1>{copy.title}</h1>
        <p>{copy.intro}</p>
      </div>
      <div className="sidebar-section">
        <span>本批次边界</span>
        <ul>
          <li><i className="dot dot--ready" /> 工程、CI 与 PWA</li>
          <li><i className="dot dot--ready" /> 本地数据库和偏好</li>
          <li><i className="dot dot--ready" /> 日历技术验证</li>
          <li><i className="dot" /> 业务页面（下一批）</li>
        </ul>
      </div>
      <div className="sidebar-note">
        <strong>Local-first</strong>
        <span>数据先落在当前设备。服务端同步接口通过适配层后续接入。</span>
      </div>
    </aside>
  );
}

