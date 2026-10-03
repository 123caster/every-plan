import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import type { PropsWithChildren } from 'react';
import type { TaskRecord } from '../../data/db';
import type { TaskRepository } from '../../data/repositories/taskRepository';
import { StateSpike } from './StateSpike';
import { createStateSpikeStore } from './stateSpikeStore';

function wrapper({ children }: PropsWithChildren) {
  return <QueryClientProvider client={new QueryClient()}>{children}</QueryClientProvider>;
}

describe('StateSpike', () => {
  it('saves a task, restores the form baseline and merges a server snapshot', async () => {
    const user = userEvent.setup();
    const saved: TaskRecord[] = [];
    const repository: TaskRepository = {
      list: async () => saved,
      save: async (task) => { saved.push(task); },
      get: async (id) => saved.find((task) => task.id === id),
    };
    render(<StateSpike store={createStateSpikeStore()} repository={repository} />, { wrapper });

    const title = screen.getByRole('textbox', { name: '任务标题' });
    await user.clear(title);
    await user.type(title, '完成状态方案验证');
    expect(screen.getByText('有未保存修改')).toBeVisible();
    await user.click(screen.getByRole('button', { name: '保存到本地仓库' }));
    expect(saved[0]?.title).toBe('完成状态方案验证');
    expect(await screen.findByText('已同步到表单基线')).toBeVisible();

    await user.click(screen.getByRole('button', { name: '模拟服务端实体合并' }));
    expect(screen.getByText('完成状态方案验证 · 已合并')).toBeVisible();
  });

  it('undoes an unsaved edit', async () => {
    const user = userEvent.setup();
    const repository: TaskRepository = { list: async () => [], save: async () => {}, get: async () => undefined };
    render(<StateSpike store={createStateSpikeStore()} repository={repository} />, { wrapper });
    const title = screen.getByRole('textbox', { name: '任务标题' });
    await user.clear(title);
    await user.type(title, '临时修改');
    await user.click(screen.getByRole('button', { name: '撤销未提交修改' }));
    expect(title).toHaveValue('梳理插件权限设计');
  });
});
