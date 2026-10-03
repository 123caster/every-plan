import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useState } from 'react';
import { Button } from './Button';
import { Modal } from './Modal';
import { SegmentedControl } from './SegmentedControl';

describe('design system primitives', () => {
  it('exposes pressed state for segmented controls', async () => {
    const user = userEvent.setup();
    function Example() {
      const [value, setValue] = useState<'a' | 'b'>('a');
      return (
        <SegmentedControl
          label="布局"
          value={value}
          onChange={setValue}
          options={[{ value: 'a', label: 'A' }, { value: 'b', label: 'B' }]}
        />
      );
    }
    render(<Example />);
    await user.click(screen.getByRole('button', { name: 'B' }));
    expect(screen.getByRole('button', { name: 'B' })).toHaveAttribute('aria-pressed', 'true');
  });

  it('restores focus after a modal closes', async () => {
    const user = userEvent.setup();
    function Example() {
      const [open, setOpen] = useState(false);
      return (
        <>
          <Button onClick={() => setOpen(true)}>打开</Button>
          <Modal open={open} title="详情" onClose={() => setOpen(false)}>
            <Button onClick={() => setOpen(false)}>完成</Button>
          </Modal>
        </>
      );
    }
    render(<Example />);
    const trigger = screen.getByRole('button', { name: '打开' });
    await user.click(trigger);
    await user.click(screen.getByRole('button', { name: '完成' }));
    expect(trigger).toHaveFocus();
  });
});

