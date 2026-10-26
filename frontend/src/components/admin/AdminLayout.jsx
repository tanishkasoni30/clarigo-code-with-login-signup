import { useState } from 'react';
import { Link, NavLink, useNavigate, useLocation } from 'react-router-dom';
import { getUser, clearSession } from '../../utils/auth';
import {
  IconBell,
  IconDashboard,
  IconLogout,
  IconMenu,
  IconProfile,
  IconSettings,
  IconUsers,
  IconChevronLeft,
} from './DashboardIcons';
import '../../styles/admin.css';

const NAV_ITEMS = [
  { to: '/dashboard', label: 'Dashboard', icon: IconDashboard, end: true },
  { to: '/dashboard#user-management', label: 'User Management', icon: IconUsers, hash: 'user-management' },
  { to: '/profile', label: 'Profile', icon: IconProfile },
  { to: '/settings', label: 'Settings', icon: IconSettings },
];

function isNavActive(item, pathname, hash) {
  if (item.hash) {
    return pathname === '/dashboard' && hash === `#${item.hash}`;
  }
  if (item.to === '/dashboard') {
    return pathname === '/dashboard' && !hash;
  }
  return pathname === item.to || pathname.startsWith(`${item.to}/`);
}

export default function AdminLayout({ children, breadcrumbs }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const user = getUser();
  const navigate = useNavigate();
  const location = useLocation();

  function handleLogout() {
    clearSession();
    navigate('/login');
  }

  function closeMobileSidebar() {
    setSidebarOpen(false);
  }

  function handleNavClick(item) {
    closeMobileSidebar();
    if (item.hash) {
      navigate('/dashboard');
      requestAnimationFrame(() => {
        document.getElementById(item.hash)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      });
    }
  }

  return (
    <div className={`admin-shell ${sidebarCollapsed ? 'admin-shell--collapsed' : ''}`}>
      <div
        className={`admin-sidebar-backdrop ${sidebarOpen ? 'is-visible' : ''}`}
        onClick={closeMobileSidebar}
        aria-hidden="true"
      />

      <aside className={`admin-sidebar ${sidebarOpen ? 'is-open' : ''}`}>
        <div className="admin-sidebar-brand">
          <Link to="/dashboard" className="admin-brand" onClick={closeMobileSidebar}>
            <span className="admin-brand-mark">C</span>
            {!sidebarCollapsed && <span>ClariGo</span>}
          </Link>
          <button
            type="button"
            className="admin-icon-btn admin-sidebar-collapse"
            onClick={() => setSidebarCollapsed((v) => !v)}
            aria-label={sidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            <IconChevronLeft className={sidebarCollapsed ? 'is-flipped' : ''} />
          </button>
        </div>

        <nav className="admin-nav" aria-label="Admin navigation">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const active = isNavActive(item, location.pathname, location.hash);

            if (item.hash) {
              return (
                <button
                  key={item.label}
                  type="button"
                  className={`admin-nav-link ${active ? 'is-active' : ''}`}
                  onClick={() => handleNavClick(item)}
                >
                  <Icon />
                  {!sidebarCollapsed && <span>{item.label}</span>}
                </button>
              );
            }

            const dashboardActive =
              item.to === '/dashboard' &&
              location.pathname === '/dashboard' &&
              !location.hash;

            return (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                className={() =>
                  `admin-nav-link ${dashboardActive || (item.to !== '/dashboard' && location.pathname === item.to) ? 'is-active' : ''}`
                }
                onClick={closeMobileSidebar}
              >
                <Icon />
                {!sidebarCollapsed && <span>{item.label}</span>}
              </NavLink>
            );
          })}

          <button type="button" className="admin-nav-link admin-nav-link--logout" onClick={handleLogout}>
            <IconLogout />
            {!sidebarCollapsed && <span>Logout</span>}
          </button>
        </nav>
      </aside>

      <div className="admin-main">
        <header className="admin-topbar">
          <button
            type="button"
            className="admin-icon-btn admin-menu-btn"
            onClick={() => setSidebarOpen(true)}
            aria-label="Open menu"
          >
            <IconMenu />
          </button>

          {breadcrumbs && (
            <nav className="admin-breadcrumb" aria-label="Breadcrumb">
              {breadcrumbs.map((crumb, index) => (
                <span key={crumb.label} className="admin-breadcrumb-item">
                  {index > 0 && <span className="admin-breadcrumb-sep">/</span>}
                  {crumb.to ? (
                    <Link to={crumb.to}>{crumb.label}</Link>
                  ) : (
                    <span aria-current="page">{crumb.label}</span>
                  )}
                </span>
              ))}
            </nav>
          )}

          <div className="admin-topbar-actions">
            <button type="button" className="admin-icon-btn admin-notify-btn" aria-label="Notifications" title="Notifications">
              <IconBell />
              <span className="admin-notify-dot" aria-hidden="true" />
            </button>

            <div className="admin-profile-chip">
              <span className="admin-profile-avatar">{user?.name ? user.name.slice(0, 1).toUpperCase() : 'A'}</span>
              <div className="admin-profile-meta">
                <span className="admin-profile-name">{user?.name || 'Admin'}</span>
                <span className={`admin-role-pill admin-role-pill--${(user?.role || 'Admin').toLowerCase()}`}>
                  {user?.role || 'Admin'}
                </span>
              </div>
            </div>

            <button type="button" className="admin-btn admin-btn--ghost admin-topbar-logout" onClick={handleLogout}>
              Logout
            </button>
          </div>
        </header>

        <main className="admin-content">{children}</main>
      </div>
    </div>
  );
}
