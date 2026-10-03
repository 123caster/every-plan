import type { TodayProjection } from '../../domain/task/todayProjection';
import { Button } from '../../design-system/primitives/Button';

function formatEstimate(minutes: number) {
  if (!minutes) return '未估时';
  const hours = Math.floor(minutes / 60);
  const rest = minutes % 60;
  return [hours ? `${hours} 小时` : '', rest ? `${rest} 分钟` : ''].filter(Boolean).join(' ');
}

export function TodayHeader({ summary, onCreate }: { summary: TodayProjection['summary']; onCreate: () => void }) {
  const date = new Intl.DateTimeFormat('zh-CN', { month: 'long', day: 'numeric', weekday: 'long' }).format(new Date());
  return (
    <header className="today-header">
      <div>
        <span className="eyebrow">Today / Personal focus</span>
        <h1>今天</h1>
        <p>{date} · {summary.incomplete} 项待完成 · {formatEstimate(summary.estimateMinutes)}</p>
      </div>
      <div className="today-header__actions">
        <div className="progress-ring" style={{ '--progress': `${summary.progressPercent}%` } as React.CSSProperties} aria-label={`完成进度 ${summary.progressPercent}%`}><span>{summary.progressPercent}%</span></div>
        <Button variant="primary" onClick={onCreate}>＋ 新建任务</Button>
      </div>
    </header>
  );
}
