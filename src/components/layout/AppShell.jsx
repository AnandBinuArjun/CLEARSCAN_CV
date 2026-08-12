import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { Topbar } from './Topbar';

export function AppShell() {
  return (
    <div className="flex h-screen overflow-hidden" style={{ backgroundColor: 'var(--color-bg-primary)' }}>
      {/* Global ambient noise overlay */}
      <div className="noise-overlay fixed inset-0 z-0 pointer-events-none" />

      <Sidebar />
      <div className="flex flex-col flex-1 overflow-hidden relative z-10">
        <Topbar />
        <main className="flex-1 overflow-y-auto p-4 lg:p-6 pb-20 lg:pb-6 custom-scrollbar relative">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
