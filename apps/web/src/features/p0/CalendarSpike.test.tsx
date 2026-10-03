import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { CalendarSpike } from './CalendarSpike';

describe('CalendarSpike', () => {
  it('moves a task with the keyboard and changes its duration', async () => {
    const user = userEvent.setup();
    render(<CalendarSpike />);
    const task = screen.getByRole('button', { name: /插件 API 评审/ });
    task.focus();
    await user.keyboard('{ArrowRight}');
    screen.getByRole('button', { name: /插件 API 评审/ }).focus();
    await user.keyboard('{ArrowDown}');
    expect(screen.getByText('当前：周三，11:00，60 分钟')).toBeVisible();
    await user.click(screen.getByRole('button', { name: '延长 30 分钟' }));
    expect(screen.getByText('当前：周三，11:00，90 分钟')).toBeVisible();
  });

  it('switches between work week and full week', async () => {
    const user = userEvent.setup();
    render(<CalendarSpike />);
    expect(screen.queryByText('周日')).not.toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: '完整周' }));
    expect(screen.getByText('周日')).toBeVisible();
  });
});
