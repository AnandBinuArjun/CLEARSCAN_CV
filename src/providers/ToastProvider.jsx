import { createContext, useContext, useState, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { Toast } from '../components/ui/Toast';

const ToastContext = createContext(null);

let idCounter = 0;

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback(({ type = 'success', message, title }) => {
    setToasts(prev => {
      // Keep only up to 2 previous toasts + 1 new = 3 max visible
      const newToasts = [...prev, { id: ++idCounter, type, message, title }];
      if (newToasts.length > 3) return newToasts.slice(-3);
      return newToasts;
    });
  }, []);

  const removeToast = useCallback((id) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ addToast, removeToast }}>
      {children}
      {typeof document !== 'undefined' && createPortal(
        <div 
          className="fixed bottom-6 right-6 flex flex-col gap-3 pointer-events-none" 
          style={{ zIndex: 'var(--z-toast)', alignItems: 'flex-end' }}
        >
          {toasts.map((toast) => (
            <Toast
              key={toast.id}
              {...toast}
              onDismiss={() => removeToast(toast.id)}
            />
          ))}
        </div>,
        document.body
      )}
    </ToastContext.Provider>
  );
}

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) throw new Error('useToast must be used within a ToastProvider');
  return context;
};
