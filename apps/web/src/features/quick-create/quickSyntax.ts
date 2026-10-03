import type { TaskPriority } from '../../domain/task/taskTypes';
import { dateKeyInTimezone } from '../../domain/task/todayProjection';

export interface ParsedQuickTask {
  title: string;
  tags: string[];
  priority: TaskPriority;
  estimateMinutes: number | null;
  planStart: string | null;
  recognized: string[];
}

function shiftDateKey(dateKey: string, days: number) {
  const [year, month, day] = dateKey.split('-').map(Number);
  return new Date(Date.UTC(year, month - 1, day + days)).toISOString().slice(0, 10);
}

function timezoneOffsetMs(value: Date, timezone: string) {
  const parts = new Intl.DateTimeFormat('en', {
    timeZone: timezone,
    year: 'numeric', month: '2-digit', day: '2-digit',
    hour: '2-digit', minute: '2-digit', second: '2-digit', hourCycle: 'h23',
  }).formatToParts(value);
  const part = (type: Intl.DateTimeFormatPartTypes) => Number(parts.find((item) => item.type === type)?.value);
  return Date.UTC(part('year'), part('month') - 1, part('day'), part('hour'), part('minute'), part('second')) - value.getTime();
}

function toZonedIso(date: string, time: string, timezone: string) {
  const [year, month, day] = date.split('-').map(Number);
  const [hour, minute] = time.split(':').map(Number);
  if (![year, month, day, hour, minute].every(Number.isFinite)
    || month < 1 || month > 12 || day < 1 || day > 31
    || hour < 0 || hour > 23 || minute < 0 || minute > 59) return null;
  const wallClockUtc = Date.UTC(year, month - 1, day, hour, minute);
  const firstPass = new Date(wallClockUtc);
  if (firstPass.getUTCFullYear() !== year || firstPass.getUTCMonth() !== month - 1 || firstPass.getUTCDate() !== day) return null;
  const firstOffset = timezoneOffsetMs(firstPass, timezone);
  const candidate = new Date(wallClockUtc - firstOffset);
  const correctedOffset = timezoneOffsetMs(candidate, timezone);
  return new Date(wallClockUtc - correctedOffset).toISOString();
}

export function parseQuickSyntax(input: string, now = new Date(), timezone = 'Asia/Shanghai'): ParsedQuickTask {
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
    const isRelative = dateMatch === relativeDateTime;
    const today = dateKeyInTimezone(now, timezone);
    const date = isRelative
      ? shiftDateKey(today, dateMatch[2] === '明天' ? 1 : 0)
      : dateMatch[2];
    const iso = toZonedIso(date, dateMatch[3], timezone);
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
