import { useEffect } from 'react';
import AdminLayout from '../components/admin/AdminLayout';

export default function AdminSettings() {
  useEffect(() => {
    document.body.classList.add('admin-route');
    return () => document.body.classList.remove('admin-route');
  }, []);

  const breadcrumbs = [
    { label: 'Home', to: '/dashboard' },
    { label: 'Settings' },
  ];

  return (
    <AdminLayout breadcrumbs={breadcrumbs}>
      <div className="admin-page-head">
        <h1>Settings</h1>
        <p>Manage preferences for your admin workspace.</p>
      </div>

      <div className="admin-info-card">
        <p style={{ margin: 0, color: '#64748b', lineHeight: 1.6 }}>
          Application settings are not configured yet. User management, authentication, and dashboard
          preferences continue to use your existing ClariGo backend settings.
        </p>
      </div>
    </AdminLayout>
  );
}
