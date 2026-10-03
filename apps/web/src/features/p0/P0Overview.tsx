import { StatusBanner } from '../../design-system/feedback/StatusBanner';
import { PreferencesPanel } from './PreferencesPanel';

const gates = [
  { label: 'React / Vite / TypeScript', detail: '正式工程骨架', state: '完成' },
  { label: 'IndexedDB v2', detail: '事务迁移与失败回滚', state: '已验证' },
  { label: '三主题 × 四字号', detail: '设备偏好持久化', state: '可运行' },
  { label: 'PWA 应用壳', detail: '离线重载与更新确认', state: '已接入' },
];

export function P0Overview() {
  return (
    <div className="overview-stack">
      <StatusBanner tone="success" title="批次 A 正在形成可持续演进的正式前端">
        技术基线已通过，并已承载批次 B 的个人任务闭环；插件运行时和正式周日历仍属于后续批次。
      </StatusBanner>

      <section className="gate-grid" aria-label="P0 技术门禁">
        {gates.map((gate, index) => (
          <article className="gate-card" key={gate.label}>
            <span className="gate-card__number">0{index + 1}</span>
            <div>
              <strong>{gate.label}</strong>
              <p>{gate.detail}</p>
            </div>
            <span className="gate-card__state">{gate.state}</span>
          </article>
        ))}
      </section>

      <PreferencesPanel />
    </div>
  );
}
