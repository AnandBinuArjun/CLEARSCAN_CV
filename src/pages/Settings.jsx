import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCVStore } from '../store/cvStore';
import { RotateCcw, Trash2, Info, Shield, FileText } from 'lucide-react';

const APP_VERSION = '2.0.0';

export function Settings() {
  const { resetCV } = useCVStore();
  const navigate = useNavigate();
  const [confirmReset, setConfirmReset] = useState(false);
  const [resetDone, setResetDone] = useState(false);

  useEffect(() => { document.title = 'Settings — Clearscan'; return () => { document.title = 'Clearscan'; }; }, []);

  const handleReset = () => {
    if (!confirmReset) {
      setConfirmReset(true);
      return;
    }
    resetCV();
    setConfirmReset(false);
    setResetDone(true);
    setTimeout(() => {
      setResetDone(false);
      navigate('/builder');
    }, 1500);
  };

  const handleClearStorage = () => {
    localStorage.removeItem('cv-builder-storage');
    window.location.reload();
  };

  return (
    <div className="max-w-2xl animate-fade-in">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-xl font-bold mb-1" style={{ color: 'var(--color-text-primary)' }}>
          Settings
        </h1>
        <p className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>
          Manage your CV data and application preferences.
        </p>
      </div>

      <div className="space-y-4">

        {/* Data Management */}
        <section
          className="rounded-xl p-5"
          style={{ backgroundColor: 'var(--color-bg-surface)', border: '1px solid var(--color-border)' }}
        >
          <p className="section-heading">Data Management</p>

          <div className="space-y-3">
            {/* Reset CV */}
            <div
              className="flex items-center justify-between p-4 rounded-lg"
              style={{ backgroundColor: 'var(--color-bg-surface-2)', border: '1px solid var(--color-border)' }}
            >
              <div className="flex items-start gap-3">
                <div
                  className="w-8 h-8 rounded-md flex items-center justify-center flex-shrink-0 mt-0.5"
                  style={{ backgroundColor: 'var(--color-bg-hover)' }}
                >
                  <RotateCcw size={14} style={{ color: 'var(--color-text-secondary)' }} />
                </div>
                <div>
                  <p className="text-sm font-medium" style={{ color: 'var(--color-text-primary)' }}>
                    Reset Current CV
                  </p>
                  <p className="text-xs mt-0.5" style={{ color: 'var(--color-text-muted)' }}>
                    Clears all form fields and returns to an empty CV. Cannot be undone.
                  </p>
                </div>
              </div>
              <button
                onClick={handleReset}
                className="ml-4 flex-shrink-0 px-4 py-1.5 text-xs font-semibold rounded-lg transition-all duration-150 cursor-pointer"
                style={{
                  backgroundColor: confirmReset ? 'var(--color-danger)' : 'var(--color-bg-hover)',
                  color: confirmReset ? '#ffffff' : 'var(--color-text-primary)',
                  border: confirmReset ? 'none' : '1px solid var(--color-border)',
                }}
              >
                {resetDone ? '✓ Done' : confirmReset ? 'Confirm Reset' : 'Reset CV'}
              </button>
            </div>

            {/* Clear localStorage */}
            <div
              className="flex items-center justify-between p-4 rounded-lg"
              style={{ backgroundColor: 'var(--color-bg-surface-2)', border: '1px solid var(--color-border)' }}
            >
              <div className="flex items-start gap-3">
                <div
                  className="w-8 h-8 rounded-md flex items-center justify-center flex-shrink-0 mt-0.5"
                  style={{ backgroundColor: 'rgba(239,68,68,0.08)' }}
                >
                  <Trash2 size={14} style={{ color: 'var(--color-danger)' }} />
                </div>
                <div>
                  <p className="text-sm font-medium" style={{ color: 'var(--color-text-primary)' }}>
                    Clear All Saved Data
                  </p>
                  <p className="text-xs mt-0.5" style={{ color: 'var(--color-text-muted)' }}>
                    Removes everything from browser storage and reloads the app. All CVs will be lost.
                  </p>
                </div>
              </div>
              <button
                onClick={handleClearStorage}
                className="ml-4 flex-shrink-0 px-4 py-1.5 text-xs font-semibold rounded-lg transition-all duration-150 cursor-pointer"
                style={{
                  backgroundColor: 'var(--color-danger-dim)',
                  color: 'var(--color-danger)',
                  border: '1px solid rgba(239,68,68,0.3)',
                }}
                onMouseEnter={e => { e.currentTarget.style.backgroundColor = 'var(--color-danger)'; e.currentTarget.style.color = '#fff'; }}
                onMouseLeave={e => { e.currentTarget.style.backgroundColor = 'var(--color-danger-dim)'; e.currentTarget.style.color = 'var(--color-danger)'; }}
              >
                Clear Data
              </button>
            </div>
          </div>
        </section>

        {/* Privacy & Data */}
        <section
          className="rounded-xl p-5"
          style={{ backgroundColor: 'var(--color-bg-surface)', border: '1px solid var(--color-border)' }}
        >
          <p className="section-heading">Privacy & Data</p>
          <div
            className="flex items-start gap-3 p-4 rounded-lg"
            style={{ backgroundColor: 'var(--color-accent-dim)', border: '1px solid var(--color-border-accent)' }}
          >
            <Shield size={15} className="flex-shrink-0 mt-0.5" style={{ color: 'var(--color-accent)' }} />
            <p className="text-xs leading-relaxed" style={{ color: 'var(--color-text-secondary)' }}>
              <span className="font-semibold" style={{ color: 'var(--color-accent)' }}>100% local. </span>
              Your CV data is stored exclusively in your browser's localStorage. Nothing is sent to any server.
              Clearing your browser data will erase your CV.
            </p>
          </div>
        </section>

        {/* About */}
        <section
          className="rounded-xl p-5"
          style={{ backgroundColor: 'var(--color-bg-surface)', border: '1px solid var(--color-border)' }}
        >
          <p className="section-heading">About</p>
          <div className="space-y-3">
            {[
              { icon: FileText, label: 'App Name', value: 'Clearscan' },
              { icon: Info,     label: 'Version',  value: APP_VERSION },
              { icon: Shield,   label: 'Storage',  value: 'Browser localStorage (no server)' },
            ].map(({ icon: Icon, label, value }) => (
              <div key={label} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Icon size={13} style={{ color: 'var(--color-text-muted)' }} />
                  <span className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>{label}</span>
                </div>
                <span className="text-sm font-medium" style={{ color: 'var(--color-text-primary)' }}>{value}</span>
              </div>
            ))}
          </div>
        </section>

      </div>
    </div>
  );
}
