import { forwardRef, type ButtonHTMLAttributes } from 'react';

export const IconButton = forwardRef<HTMLButtonElement, ButtonHTMLAttributes<HTMLButtonElement>>(
  function IconButton({ className = '', type = 'button', ...props }, ref) {
    return (
      <button
        ref={ref}
        type={type}
        className={`icon-button ${className}`.trim()}
        {...props}
      />
    );
  },
);

