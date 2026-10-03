import { describe, expect, it } from 'vitest';
import { parseQuickSyntax } from './quickSyntax';

describe('parseQuickSyntax', () => {
  const now = new Date('2026-10-03T02:00:00.000Z');

  it('extracts supported deterministic tokens', () => {
    const result = parseQuickSyntax('写周报 今天 14:30 #工作 !高 /45m', now);
    const expectedPlanStart = new Date(now);
    expectedPlanStart.setHours(14, 30, 0, 0);
    expect(result.title).toBe('写周报');
    expect(result.tags).toEqual(['工作']);
    expect(result.priority).toBe('high');
    expect(result.estimateMinutes).toBe(45);
    expect(result.planStart).toBe(expectedPlanStart.toISOString());
  });

  it('keeps ambiguous natural language in the title', () => {
    expect(parseQuickSyntax('下午找时间看看方案', now).title).toBe('下午找时间看看方案');
  });

  it('supports explicit dates and hour duration', () => {
    const result = parseQuickSyntax('复盘 2026-10-07 09:00 /2h', now);
    expect(result.title).toBe('复盘');
    expect(result.estimateMinutes).toBe(120);
    expect(result.planStart).not.toBeNull();
  });
});
