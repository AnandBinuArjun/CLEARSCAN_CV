import { forwardRef } from 'react';
import { cn } from '../../lib/utils';

const Button = forwardRef(({ className, variant = 'primary', size = 'default', loading = false, loadingText, children, disabled, ...props }, ref) => {
  const base = [
    'inline-flex items-center justify-center gap-2',
    'font-semibold rounded-xl cursor-pointer',
    'transition-all duration-200',
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-bg-primary)]',
    'disabled:pointer-events-none disabled:opacity-40',
    'select-none relative overflow-hidden',
  ].join(' ');

  const variants = {
    primary: [
      'text-white btn-gradient',
      'active:scale-[0.97]',
    ].join(' '),

    secondary: [
      'text-[var(--color-text-primary)]',
      'bg-[var(--color-bg-surface-2)]',
      'border border-[var(--color-border)]',
      'hover:bg-[var(--color-bg-hover)]',
      'hover:border-[var(--color-border-focus)]',
      'active:scale-[0.97]',
    ].join(' '),

    ghost: [
      'text-[var(--color-text-secondary)]',
      'bg-transparent',
      'hover:bg-[var(--color-bg-surface-2)]',
      'hover:text-[var(--color-text-primary)]',
    ].join(' '),

    danger: [
      'text-white',
      'bg-[var(--color-danger)]',
      'hover:opacity-90',
      'active:scale-[0.97]',
    ].join(' '),

    outline: [
      'text-[var(--color-text-primary)]',
      'bg-transparent',
      'border border-[var(--color-border)]',
      'hover:border-[var(--color-accent)]',
      'hover:text-[var(--color-accent-hover)]',
      'hover:bg-[var(--color-accent-dim)]',
    ].join(' '),

    gradient_outline: [
      'bg-transparent',
      'border border-[var(--color-border)]',
      'text-[var(--color-text-secondary)]',
      'hover:border-[rgba(124,58,237,0.5)]',
      'hover:text-[var(--color-accent-hover)]',
      'hover:bg-[var(--color-accent-dim)]',
    ].join(' '),
  };

  const sizes = {
    xs:      'h-7 px-3 py-1 text-xs rounded-lg',
    sm:      'h-8 px-3.5 py-1.5 text-xs',
    default: 'h-9 px-4 py-2 text-sm',
    lg:      'h-11 px-6 py-2.5 text-sm',
    xl:      'h-13 px-8 py-3 text-base',
    icon:    'h-9 w-9 p-0',
  };

  return (
    <button
      ref={ref}
      disabled={disabled || loading}
      className={cn(
        base, 
        variants[variant] ?? variants.primary, 
        sizes[size] ?? sizes.default, 
        loading && 'opacity-70 cursor-not-allowed',
        className
      )}
      {...props}
    >
      {loading && (
        <svg 
          className="animate-[spin_0.6s_linear_infinite]" 
          width="16" height="16" viewBox="0 0 24 24" 
          fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
        >
          <path d="M21 12a9 9 0 1 1-6.219-8.56" />
        </svg>
      )}
      {loading && loadingText ? loadingText : children}
    </button>
  );
});

Button.displayName = 'Button';
export { Button };
