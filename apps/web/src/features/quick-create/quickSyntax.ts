import type { TaskPriority } from '../../domain/task/taskTypes';

export interface ParsedQuickTask {
  title: string;
  tags: string[];
  priority: TaskPriority;
  estimateMinutes: number | null;
  planStart: string | null;
  recognized: string[];
}

function dateKey(date: Date) {
  const year = date.getFullYear();
  const month = `${date.getMonth() + 1}`.padStart(2, '0');
  const day = `${date.getDate()}`.padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function toLocalIso(date: string, time: string) {
  const value = new Date(`${date}T${time}:00`);
  return Number.isNaN(value.getTime()) ? null : value.toISOString();
}

export function parseQuickSyntax(input: string, now = new Date()): ParsedQuickTask {
  let remainder = input.trim();
  const recognized: string[] = [];
  const tags: string[] = [];
  let priority: TaskPriority = 'none';
  let estimateMinutes: number | null = null;
  let planStart: string | null = null;

  remainder = remainder.replace(/(^|\s)#([^\s#]+)/g, (match, prefix: string, tag: string) => {
    tags.push(tag);
    recognized.push(`#${tag}`);
    return prefix;
  });

  remainder = remainder.replace(/(^|\s)!(高|中|低)(?=\s|$)/g, (match, prefix: string, value: string) => {
    priority = ({ 高: 'high', 中: 'medium', 低: 'low' } as const)[value as '高' | '中' | '低'];
    recognized.push(`!${value}`);
    return prefix;
  });

  remainder = remainder.replace(/(^|\s)\/(\d+)(m|h)(?=\s|$)/gi, (match, prefix: string, amount: string, unit: string) => {
    const parsed = Number(amount) * (unit.toLowerCase() === 'h' ? 60 : 1);
    if (parsed > 0) {
      estimateMinutes = parsed;
      recognized.push(`/${amount}${unit.toLowerCase()}`);
      return prefix;
    }
    return match;
  });

  const relativeDateTime = remainder.match(/(^|\s)(今天|明天)\s+(\d{1,2}:\d{2})(?=\s|$)/);
  const explicitDateTime = remainder.match(/(^|\s)(\d{4}-\d{2}-\d{2})\s+(\d{1,2}:\d{2})(?=\s|$)/);
  const dateMatch = relativeDateTime ?? explicitDateTime;
  if (dateMatch) {
    const target = new Date(now);
    const isRelative = dateMatch === relativeDateTime;
    if (isRelative && dateMatch[2] === '明天') target.setDate(target.getDate() + 1);
    const date = isRelative ? dateKey(target) : dateMatch[2];
    const iso = toLocalIso(date, dateMatch[3]);
    if (iso) {
      planStart = iso;
      recognized.push(`${dateMatch[2]} ${dateMatch[3]}`);
      remainder = remainder.replace(dateMatch[0], dateMatch[1]);
    }
  }

  return {
    title: remainder.replace(/\s+/g, ' ').trim(),
    tags: [...new Set(tags)],
    priority,
    estimateMinutes,
    planStart,
    recognized,
  };
}
