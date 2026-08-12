import { NavLink, Link } from 'react-router-dom';
import { LayoutDashboard, FileText, LayoutTemplate, ShieldCheck, Settings, BookOpen, Zap } from 'lucide-react';
import { cn } from '../../lib/utils';
import { useRef } from 'react';

const navItems = [
  { icon: LayoutDashboard, label: 'Dashboard',  path: '/dashboard' },
  { icon: FileText,        label: 'Builder',     path: '/builder' },
  { icon: LayoutTemplate,  label: 'Templates',   path: '/templates' },
  { icon: ShieldCheck,     label: 'ATS Score',   path: '/ats-score' },
  { icon: BookOpen,        label: 'ATS Guide',   path: '/ats-guide' },
  { icon: Settings,        label: 'Settings',    path: '/settings' },
];

export function Sidebar() {
  const mobileNavItems = navItems.filter(item => ['Dashboard', 'Builder', 'ATS Score', 'Settings'].includes(item.label));

  const collapseTimer = useRef(null);
  const sidebarRef = useRef(null);

  const expand = () => {
    clearTimeout(collapseTimer.current);
    if (sidebarRef.current) sidebarRef.current.style.width = '220px';
  };

  const collapse = () => {
    collapseTimer.current = setTimeout(() => {
      if (sidebarRef.current) sidebarRef.current.style.width = '64px';
    }, 160); // 160ms delay before collapsing
  };

  return (
    <>
      {/* Desktop Sidebar */}
      <aside
        ref={sidebarRef}
        className="hidden lg:flex flex-col h-screen shrink-0 border-r transition-all duration-300 ease-in-out overflow-hidden"
        style={{
          width: '64px',
          backgroundColor: 'var(--color-bg-surface)',
          borderColor: 'var(--color-border)',
          zIndex: 'var(--z-base)',
        }}
        onMouseEnter={expand}
        onMouseLeave={collapse}
      >
        {/* Logo */}
        <div className="h-14 flex items-center px-4 border-b flex-shrink-0 overflow-hidden"
          style={{ borderColor: 'var(--color-border)' }}>
          <img src="/LOGO.png" alt="Clearscan Logo" className="h-8 w-auto max-w-none object-contain object-left flex-shrink-0" />
        </div>

        {/* Navigation */}
        <nav className="flex-1 py-4 px-2 space-y-0.5 overflow-hidden">
          <p className="section-heading px-2 mb-3 whitespace-nowrap overflow-hidden text-ellipsis">Menu</p>
          {navItems.map(({ icon: Icon, label, path }) => (
            <NavLink
              key={path}
              to={path}
              title={label}
              className={({ isActive }) => cn(
                'flex items-center gap-3 px-2 py-2.5 rounded-lg text-sm font-medium cursor-pointer transition-all duration-200 overflow-hidden whitespace-nowrap',
                isActive ? '' : 'hover:bg-[var(--color-bg-hover)]'
              )}
              style={({ isActive }) => ({
                backgroundColor: isActive ? 'var(--color-accent-dim)' : 'transparent',
                color: isActive ? 'var(--color-accent-hover)' : 'var(--color-text-secondary)',
                borderLeft: isActive ? '2px solid var(--color-accent)' : '2px solid transparent',
              })}
            >
              {({ isActive }) => (
                <>
                  <Icon size={18} strokeWidth={1.75} className="flex-shrink-0"
                    style={{
                      color: isActive ? 'var(--color-accent)' : 'var(--color-text-muted)',
                    }} />
                  <span className="overflow-hidden">{label}</span>
                </>
              )}
            </NavLink>
          ))}
        </nav>

        {/* Bottom Boost Score CTA */}
        <div className="p-2 border-t overflow-hidden" style={{ borderColor: 'var(--color-border)' }}>
          <Link to="/ats-guide"
            className="flex items-center gap-3 p-2.5 rounded-xl overflow-hidden transition-all duration-200 hover:bg-[var(--color-bg-hover)] whitespace-nowrap"
            title="Boost Score">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
              style={{ background: 'var(--color-bg-surface-2)', border: '1px solid var(--color-border)' }}>
              <Zap size={14} style={{ color: 'var(--color-text-secondary)' }} />
            </div>
            <div className="overflow-hidden">
              <p className="text-xs font-semibold" style={{ color: 'var(--color-text-primary)' }}>Boost Score</p>
              <p className="text-xs" style={{ color: 'var(--color-text-muted)' }}>Read ATS Guide →</p>
            </div>
          </Link>
        </div>
      </aside>

      {/* Mobile Bottom Bar */}
      <nav 
        className="lg:hidden fixed bottom-0 left-0 right-0 h-16 flex items-center justify-around px-2 border-t"
        style={{
          backgroundColor: 'var(--color-bg-surface)',
          borderColor: 'var(--color-border)',
          zIndex: 'var(--z-mobile-nav)',
        }}
      >
        {mobileNavItems.map(({ icon: Icon, label, path }) => (
          <NavLink
            key={path}
            to={path}
            className="flex flex-col items-center justify-center w-full h-full pt-1 transition-colors"
            style={({ isActive }) => ({
              color: isActive ? 'var(--color-accent)' : 'var(--color-text-muted)',
              borderTop: isActive ? '2px solid var(--color-accent)' : '2px solid transparent',
            })}
          >
            {({ isActive }) => (
              <>
                <Icon size={20} strokeWidth={isActive ? 2 : 1.75} />
                <span className="text-[10px] mt-1 font-medium">{label}</span>
              </>
            )}
          </NavLink>
        ))}
      </nav>
    </>
  );
}
