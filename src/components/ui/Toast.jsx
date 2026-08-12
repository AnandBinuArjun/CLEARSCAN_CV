import { useEffect, useState } from 'react';
import { X, CheckCircle, AlertTriangle, XCircle, Info } from 'lucide-react';
import { cn } from '../../lib/utils';

const icons = {
  success: CheckCircle,
  warning: AlertTriangle,
  danger: XCircle,
  info: Info
};

export function Toast({ id, type = 'info', title, message, onDismiss }) {
  const [isLeaving, setIsLeaving] = useState(false);
  
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLeaving(true);
      setTimeout(onDismiss, 250); // wait for fade out
    }, 3000);
    return () => clearTimeout(timer);
  }, [onDismiss]);

  const handleDismiss = () => {
    setIsLeaving(true);
    setTimeout(onDismiss, 250);
  };

  const Icon = icons[type] || icons.info;
  
  const typeColors = {
    success: 'var(--color-success)',
    warning: 'var(--color-warning)',
    danger: 'var(--color-danger)',
    info: 'var(--color-accent)'
  };

  return (
    <div 
      className={cn(
        "bento-card relative overflow-hidden pointer-events-auto flex w-80 max-w-[calc(100vw-2rem)]",
        "transition-all duration-250 ease-out"
      )}
      style={{
        opacity: isLeaving ? 0 : 1,
        transform: isLeaving ? 'translateY(-8px) scale(0.95)' : 'translateY(0) scale(1)',
        animation: 'fade-in 250ms ease-out forwards',
        borderRadius: 'var(--radius-md)'
      }}
    >
      {/* Left color bar */}
      <div 
        className="w-[3px] shrink-0" 
        style={{ backgroundColor: typeColors[type] }}
      />
      
      <div className="flex-1 p-3.5 pr-8">
        <div className="flex gap-3">
          <Icon size={16} className="mt-0.5 shrink-0" style={{ color: typeColors[type] }} />
          <div className="space-y-1">
            {title && (
              <h5 className="text-sm font-semibold leading-none" style={{ color: 'var(--color-text-primary)' }}>
                {title}
              </h5>
            )}
            {message && (
              <p className="text-[13px] leading-snug" style={{ color: 'var(--color-text-secondary)' }}>
                {message}
              </p>
            )}
          </div>
        </div>
      </div>

      <button 
        onClick={handleDismiss}
        className="absolute top-3 right-3 text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)] transition-colors"
      >
        <X size={14} />
      </button>

      {/* Progress bar */}
      <div 
        className="absolute bottom-0 left-0 h-[2px] bg-white/20 origin-left"
        style={{ width: '100%' }}
      >
        <div 
          className="h-full origin-left"
          style={{ 
            backgroundColor: typeColors[type],
            animation: 'toast-progress 3s linear forwards' 
          }}
        />
      </div>

      <style>{`
        @keyframes toast-progress {
          from { transform: scaleX(1); }
          to { transform: scaleX(0); }
        }
      `}</style>
    </div>
  );
}
