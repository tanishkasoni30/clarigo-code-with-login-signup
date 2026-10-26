import React, { useCallback, useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import api from '../services/api';
import { getUser } from '../utils/auth';
import { computeUserStats, formatStatValue } from '../utils/userHelpers';
import AdminLayout from '../components/admin/AdminLayout';
import UserManagementSection from '../components/admin/UserManagementSection';
import {
  IconStatAdmin,
  IconStatRecent,
  IconStatUser,
  IconStatUsers,
} from '../components/admin/DashboardIcons';

const AdminDashboard = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const location = useLocation();
  const currentUser = getUser();

  const fetchUsers = useCallback(async () => {
    setError('');
    try {
      const res = await api.get('/users');
      setUsers(res.data);
    } catch (err) {
      setError(err?.response?.data?.message || 'Failed to load users.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  useEffect(() => {
    if (location.hash === '#user-management') {
      requestAnimationFrame(() => {
        document.getElementById('user-management')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      });
    }
  }, [location.hash, loading]);

  useEffect(() => {
    document.body.classList.add('admin-route');
    return () => document.body.classList.remove('admin-route');
  }, []);

  async function handleDeleteUser(id) {
    await api.delete(`/users/${id}`);
    await fetchUsers();
  }

  const stats = computeUserStats(users);

  const breadcrumbs = [{ label: 'Home', to: '/dashboard' }, { label: 'Dashboard' }];

  return (
    <AdminLayout breadcrumbs={breadcrumbs}>
      <div className="admin-page-head">
        <h1>Welcome back, {currentUser?.name || 'Admin'}!</h1>
        <p>Here&apos;s an overview of your ClariGo administration panel.</p>
      </div>

      <div className="admin-stats-grid">
        <article className="admin-stat-card">
          <div className="admin-stat-icon admin-stat-icon--indigo">
            <IconStatUsers />
          </div>
          <div className="admin-stat-body">
            <span>Total Users</span>
            <strong>{loading && !users.length ? '…' : formatStatValue(stats.total)}</strong>
          </div>
        </article>

        <article className="admin-stat-card">
          <div className="admin-stat-icon admin-stat-icon--teal">
            <IconStatAdmin />
          </div>
          <div className="admin-stat-body">
            <span>Total Admins</span>
            <strong>{loading && !users.length ? '…' : formatStatValue(stats.admins)}</strong>
          </div>
        </article>

        <article className="admin-stat-card">
          <div className="admin-stat-icon admin-stat-icon--blue">
            <IconStatUser />
          </div>
          <div className="admin-stat-body">
            <span>Regular Users</span>
            <strong>{loading && !users.length ? '…' : formatStatValue(stats.regular)}</strong>
          </div>
        </article>

        <article className="admin-stat-card">
          <div className="admin-stat-icon admin-stat-icon--violet">
            <IconStatRecent />
          </div>
          <div className="admin-stat-body">
            <span>Recently Added Users</span>
            <strong>
              {loading && !users.length
                ? '…'
                : stats.recentAvailable
                  ? formatStatValue(stats.recent)
                  : '—'}
            </strong>
            {stats.recentAvailable && (
              <span className="admin-stat-note">Last {stats.recentDays} days</span>
            )}
            {!loading && !stats.recentAvailable && (
              <span className="admin-stat-note">Creation dates unavailable</span>
            )}
          </div>
        </article>
      </div>

      <UserManagementSection
        users={users}
        loading={loading}
        error={error}
        onDeleteUser={handleDeleteUser}
      />
    </AdminLayout>
  );
};

export default AdminDashboard;
