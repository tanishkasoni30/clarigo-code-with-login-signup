import { useEffect } from 'react';
import { getUser } from '../utils/auth';
import AdminLayout from '../components/admin/AdminLayout';

export default function AdminProfile() {
  const user = getUser();

  useEffect(() => {
    document.body.classList.add('admin-route');
    return () => document.body.classList.remove('admin-route');
  }, []);

  const breadcrumbs = [
    { label: 'Home', to: '/dashboard' },
    { label: 'Profile' },
  ];

  return (
    <AdminLayout breadcrumbs={breadcrumbs}>
      <div className="admin-page-head">
        <h1>Profile</h1>
        <p>Your account details and role in ClariGo.</p>
      </div>

      <div className="admin-info-card">
        <ul className="admin-info-list">
          <li>
            <span>Name</span>
            <strong>{user?.name || '—'}</strong>
          </li>
          <li>
            <span>Email</span>
            <strong>{user?.email || '—'}</strong>
          </li>
          <li>
            <span>Role</span>
            <span className={`admin-role-pill admin-role-pill--${(user?.role || 'user').toLowerCase()}`}>
              {user?.role || '—'}
            </span>
          </li>
        </ul>
      </div>
    </AdminLayout>
  );
}
