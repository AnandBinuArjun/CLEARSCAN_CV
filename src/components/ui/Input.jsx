import { forwardRef } from 'react';
import { cn } from '../../lib/utils';
import { AlertCircle } from 'lucide-react';

const Input = forwardRef(({ className, label, id, type, hint, icon, error, ...props }, ref) => {
  const isError = Boolean(error);
  
  return (
    <div className="w-full space-y-1.5">
    {label && (
      <label
        htmlFor={id}
        className="block text-xs font-semibold tracking-wide"
        style={{ color: 'var(--color-text-secondary)' }}
      >
        {label}
      </label>
    )}
    <div className="relative">
      {icon && (
        <div className="absolute left-3 top-1/2 -translate-y-1/2 flex items-center justify-center pointer-events-none" style={{ color: 'var(--color-text-muted)' }}>
          {icon}
        </div>
      )}
      <input
        id={id}
        type={type}
        ref={ref}
        className={cn(
          'flex h-9 w-full rounded-xl py-2 text-sm',
          icon ? 'pl-9 pr-3.5' : 'px-3.5',
          'transition-all duration-200',
          'shadow-[inset_0_2px_6px_rgba(0,0,0,0.4)]',
          'placeholder:text-[var(--color-text-muted)]',
          'disabled:cursor-not-allowed disabled:opacity-40',
          'focus-visible:outline-none',
          className
        )}
        style={{
          backgroundColor: 'rgba(5, 5, 10, 0.6)',
          color: 'var(--color-text-primary)',
          border: `1px solid ${isError ? 'var(--color-danger)' : 'var(--color-border)'}`,
        }}
        onFocus={e => {
          e.currentTarget.style.borderColor = isError ? 'var(--color-danger)' : 'var(--color-accent)';
          e.currentTarget.style.boxShadow = isError 
            ? 'inset 0 2px 6px rgba(0,0,0,0.4), 0 0 0 3px rgba(239, 68, 68, 0.2)' 
            : 'inset 0 2px 6px rgba(0,0,0,0.4), 0 0 0 3px var(--color-accent-dim)';
        }}
        onBlur={e => {
          e.currentTarget.style.borderColor = isError ? 'var(--color-danger)' : 'var(--color-border)';
          e.currentTarget.style.boxShadow = 'inset 0 2px 6px rgba(0,0,0,0.4)';
        }}
        {...props}
      />
    </div>
    {hint && !isError && (
      <p className="text-xs" style={{ color: 'var(--color-text-muted)' }}>{hint}</p>
    )}
    {isError && (
      <div className="flex items-start gap-1.5 mt-1 animate-fade-in">
        <AlertCircle size={14} className="mt-[1px] shrink-0" style={{ color: 'var(--color-danger)' }} />
        <p className="text-xs" style={{ color: 'var(--color-danger)' }}>{error}</p>
      </div>
    )}
  </div>
  );
});

Input.displayName = 'Input';
export { Input };
