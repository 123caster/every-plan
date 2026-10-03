import type { ParsedQuickTask } from './quickSyntax';

export function TaskPreview({ parsed }: { parsed: ParsedQuickTask }) {
  return (
    <div className="quick-preview" aria-live="polite">
      <span className="eyebrow">解析预览</span>
      <strong>{parsed.title || '输入任务标题…'}</strong>
      <div className="quick-preview__tokens">
        {parsed.recognized.length ? parsed.recognized.map((token) => <span key={token}>{token}</span>) : <small>未识别到语法片段，全文会保留为标题。</small>}
      </div>
    </div>
  );
}
