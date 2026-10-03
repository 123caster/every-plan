import { render, screen } from '@testing-library/react';
import { AmbientGlow } from './AmbientGlow';
import { PageTransition } from './PageTransition';

describe('optional visual effects', () => {
  it('keeps content usable when transitions are disabled', () => {
    render(<PageTransition activeKey="overview" enabled={false}><button>核心操作</button></PageTransition>);
    expect(screen.getByRole('button', { name: '核心操作' })).toBeVisible();
  });

  it('removes ambient decoration without changing content', () => {
    const { rerender } = render(<AmbientGlow />);
    expect(screen.getByTestId('ambient-glow')).toBeInTheDocument();
    rerender(<AmbientGlow enabled={false} />);
    expect(screen.queryByTestId('ambient-glow')).not.toBeInTheDocument();
  });
});

