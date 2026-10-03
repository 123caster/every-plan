import type { Subtask } from '../../domain/task/taskTypes';

export function SubtaskList({ value, onChange }: { value: Subtask[]; onChange: (value: Subtask[]) => void }) {
  const add = () => onChange([...value, { id: crypto.randomUUID(), title: '', completed: false }]);
  return (
    <section className="detail-section">
      <div className="detail-section__heading"><h3>子任务</h3><button type="button" onClick={add}>＋ 添加</button></div>
      <div className="subtask-list">
        {value.map((subtask) => (
          <div className="subtask-row" key={subtask.id}>
            <input type="checkbox" aria-label={`完成子任务：${subtask.title || '未命名'}`} checked={subtask.completed} onChange={(event) => onChange(value.map((item) => item.id === subtask.id ? { ...item, completed: event.target.checked } : item))} />
            <input aria-label="子任务标题" value={subtask.title} placeholder="输入子任务" onChange={(event) => onChange(value.map((item) => item.id === subtask.id ? { ...item, title: event.target.value } : item))} />
            <button type="button" aria-label="删除子任务" onClick={() => onChange(value.filter((item) => item.id !== subtask.id))}>×</button>
          </div>
        ))}
        {!value.length ? <p className="detail-empty">把任务拆成清晰、可完成的小步骤。</p> : null}
      </div>
    </section>
  );
}
