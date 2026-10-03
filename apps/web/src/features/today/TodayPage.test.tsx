import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { render, screen } from '@testing-library/react';
import type { PropsWithChildren } from 'react';
import { TaskDataProvider } from '../../data/repositories/TaskDataProvider';
import type { TaskRepository } from '../../data/repositories/taskRepository';
import { createTaskEntity } from '../../domain/task/taskCommands';
import { dateKeyInTimezone } from '../../domain/task/todayProjection';
import { TodayPage } from './TodayPage';

describe('TodayPage', () => {
  it('renders a task only once with a clear summary', async () => {
    const today = dateKeyInTimezone(new Date());
    const task = createTaskEntity({ id: 'one', title: '清晰的今日任务', allDayDate: today, dueDate: today, estimateMinutes: 30 });
    const repository = { list: async () => [task] } as TaskRepository;
    function wrapper({ children }: PropsWithChildren) {
      return <QueryClientProvider client={new QueryClient()}><TaskDataProvider repository={repository} seed={false}>{children}</TaskDataProvider></QueryClientProvider>;
    }
    render(<TodayPage onCreate={() => {}} onOpenTask={() => {}} />, { wrapper });
    expect(await screen.findByText('清晰的今日任务')).toBeVisible();
    expect(screen.getAllByText('清晰的今日任务')).toHaveLength(1);
    expect(screen.getByText(/1 项待完成/)).toBeVisible();
  });
});
