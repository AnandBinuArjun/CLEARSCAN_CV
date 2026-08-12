import { forwardRef } from 'react';
import { cn } from '../../lib/utils';
import { X } from 'lucide-react';

const Badge = forwardRef(({ className, variant = 'default', onRemove, children, ...props }, ref) => {
  const variants = {
    default: [
      'bg-[var(--color-bg-surface-2)]',
      'text-[var(--color-text-secondary)]',
      'border border-[var(--color-border)]',
      'hover:border-[var(--color-border-focus)]',
      'hover:text-[var(--color-text-primary)]',
    ].join(' '),

    primary: [
      'text-[var(--color-accent)]',
      'border border-[var(--color-border-accent)]',
    ].join(' '),
  };

  const primaryStyle = variant === 'primary' ? {
    background: 'var(--color-bg-surface-2)',
  } : {};

  return (
    <div
      ref={ref}
      className={cn(
        'inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium',
        'transition-all duration-200',
        variants[variant],
        className
      )}
      style={primaryStyle}
      {...props}
    >
      {children}
      {onRemove && (
        <button
          type="button"
          onClick={onRemove}
          className="ml-0.5 -mr-1 inline-flex h-4 w-4 items-center justify-center rounded-full transition-colors duration-150"
          style={{ color: 'var(--color-text-muted)' }}
          onMouseEnter={e => { e.currentTarget.style.color = 'var(--color-danger)'; e.currentTarget.style.backgroundColor = 'rgba(239,68,68,0.1)'; }}
          onMouseLeave={e => { e.currentTarget.style.color = 'var(--color-text-muted)'; e.currentTarget.style.backgroundColor = 'transparent'; }}
        >
          <X size={11} />
        </button>
      )}
    </div>
  );
});

Badge.displayName = 'Badge';
export { Badge };
