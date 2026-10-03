import { useMemo, useRef, useState, type KeyboardEvent } from 'react';
import { Button } from '../../design-system/primitives/Button';

const days = [
  { short: '周一', date: '10/5' },
  { short: '周二', date: '10/6' },
  { short: '周三', date: '10/7' },
  { short: '周四', date: '10/8' },
  { short: '周五', date: '10/9' },
  { short: '周六', date: '10/10' },
  { short: '周日', date: '10/11' },
];

interface CalendarTask {
  id: string;
  title: string;
  dayIndex: number;
  startHour: number;
  durationMinutes: number;
}

const initialTask: CalendarTask = {
  id: 'calendar-spike-task',
  title: '插件 API 评审',
  dayIndex: 1,
  startHour: 10,
  durationMinutes: 60,
};

export function CalendarSpike() {
  const [task, setTask] = useState(initialTask);
  const [fullWeek, setFullWeek] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const dragActiveRef = useRef(false);
  const visibleDays = useMemo(() => (fullWeek ? days : days.slice(0, 5)), [fullWeek]);

  const moveToDay = (dayIndex: number) => {
    setTask((current) => ({ ...current, dayIndex: Math.max(0, Math.min(visibleDays.length - 1, dayIndex)) }));
  };

  const handleKeyboardMove = (event: KeyboardEvent<HTMLButtonElement>) => {
    if (event.key === 'ArrowLeft') {
      event.preventDefault();
      moveToDay(task.dayIndex - 1);
    }
    if (event.key === 'ArrowRight') {
      event.preventDefault();
      moveToDay(task.dayIndex + 1);
    }
    if (event.key === 'ArrowUp') {
      event.preventDefault();
      setTask((current) => ({ ...current, startHour: Math.max(8, current.startHour - 1) }));
    }
    if (event.key === 'ArrowDown') {
      event.preventDefault();
      setTask((current) => ({ ...current, startHour: Math.min(17, current.startHour + 1) }));
    }
  };

  const finishDrag = (dayIndex: number) => {
    if (!dragActiveRef.current) return;
    moveToDay(dayIndex);
    dragActiveRef.current = false;
    setDragActive(false);
  };

  const endHour = task.startHour + task.durationMinutes / 60;

  return (
    <section className="spike-card calendar-spike" aria-labelledby="calendar-spike-title">
      <header className="spike-card__header">
        <div>
          <span className="eyebrow">P0 · 日历布局与操作</span>
          <h2 id="calendar-spike-title">任务优先的周时间轴</h2>
        </div>
        <div className="calendar-spike__toolbar">
          <Button
            variant={!fullWeek ? 'primary' : 'secondary'}
            aria-pressed={!fullWeek}
            onClick={() => setFullWeek(false)}
          >工作周</Button>
          <Button
            variant={fullWeek ? 'primary' : 'secondary'}
            aria-pressed={fullWeek}
            onClick={() => setFullWeek(true)}
          >完整周</Button>
        </div>
      </header>

      <p className="calendar-spike__hint">拖动任务到其他日期；聚焦任务后可用方向键移动。任务文字始终保持可读。</p>

      <div className="week-scroll" tabIndex={0} aria-label="周日历横向滚动区域">
        <div className="week-grid" style={{ '--day-count': visibleDays.length } as React.CSSProperties}>
          <div className="week-grid__corner">GMT+8</div>
          {visibleDays.map((day) => (
            <div className="week-grid__day-heading" key={day.short}>
              <strong>{day.short}</strong><span>{day.date}</span>
            </div>
          ))}
          <div className="week-grid__label">全天</div>
          {visibleDays.map((day) => <div className="week-grid__all-day" key={`${day.short}-all-day`} />)}
          <div className="week-grid__label">08:00<br />12:00<br />16:00</div>
          {visibleDays.map((day, dayIndex) => (
            <section
              className={`week-grid__column ${task.dayIndex === dayIndex ? 'week-grid__column--active' : ''}`}
              aria-label={`${day.short} ${day.date}`}
              data-testid={`calendar-day-${dayIndex}`}
              data-calendar-day-index={dayIndex}
              onPointerUp={() => finishDrag(dayIndex)}
              onMouseUp={() => finishDrag(dayIndex)}
              key={`${day.short}-column`}
            >
              {task.dayIndex === dayIndex ? (
                <button
                  type="button"
                  className={`calendar-task ${dragActive ? 'calendar-task--dragging' : ''}`}
                  aria-label={`${task.title}，${day.short} ${task.startHour}:00 至 ${endHour}:00。使用方向键移动。`}
                  style={{ top: `${(task.startHour - 8) * 44 + 12}px`, height: `${Math.max(72, task.durationMinutes * 0.85)}px` }}
                  onPointerDown={(event) => {
                    if (event.button === 0) {
                      dragActiveRef.current = true;
                      setDragActive(true);
                    }
                  }}
                  onKeyDown={handleKeyboardMove}
                >
                  <strong>{task.title}</strong>
                  <span>{task.startHour}:00 — {endHour}:00</span>
                  <small>方向键可移动</small>
                </button>
              ) : null}
            </section>
          ))}
        </div>
      </div>

      <div className="calendar-spike__footer">
        <span>当前：{visibleDays[task.dayIndex]?.short}，{task.startHour}:00，{task.durationMinutes} 分钟</span>
        <div>
          <Button onClick={() => setTask((current) => ({ ...current, durationMinutes: Math.max(30, current.durationMinutes - 30) }))}>缩短 30 分钟</Button>
          <Button onClick={() => setTask((current) => ({ ...current, durationMinutes: current.durationMinutes + 30 }))}>延长 30 分钟</Button>
        </div>
      </div>
    </section>
  );
}
