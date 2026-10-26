import React, { useCallback, useEffect, useState } from 'react';
import api from './services/api';
import { Link, useParams, useNavigate } from 'react-router-dom';
import AdminLayout from './components/admin/AdminLayout';
import { IconSpinner } from './components/auth/AuthIcons';

const emailRegex = /^\S+@\S+\.\S+$/;

const UpdateUser = () => {
  const { id } = useParams();
  const [form, setForm] = useState({ name: '', email: '', role: 'User' });
  const [fieldErrors, setFieldErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  const fetchUser = useCallback(async () => {
    setFetching(true);
    setError('');
    try {
      const res = await api.get('/users');
      const u = res.data.find((x) => x._id === id);
      if (u) setForm({ name: u.name, email: u.email, role: u.role });
      else setError('User not found');
    } catch (err) {
      setError(err?.response?.data?.message || 'Failed to load user');
    } finally {
      setFetching(false);
    }
  }, [id]);

  useEffect(() => {
    document.body.classList.add('admin-route');
    return () => document.body.classList.remove('admin-route');
  }, []);

  useEffect(() => {
    if (id) fetchUser();
  }, [id, fetchUser]);

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setFieldErrors((prev) => ({ ...prev, [name]: '' }));
    setError('');
    setSuccess('');
  }

  function validate() {
    const next = {};
    if (!form.name.trim()) next.name = 'Name is required';
    if (!form.email) next.email = 'Email is required';
    else if (!emailRegex.test(form.email)) next.email = 'Enter a valid email address';
    if (!form.role) next.role = 'Role is required';
    return next;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const next = validate();
    setFieldErrors(next);
    if (Object.keys(next).length > 0) return;

    setLoading(true);
    try {
      await api.put(`/users/${id}`, form);
      setSuccess('User updated successfully.');
      setTimeout(() => navigate('/dashboard'), 800);
    } catch (err) {
      setError(err?.response?.data?.message || 'Update failed');
    } finally {
      setLoading(false);
    }
  }

  const breadcrumbs = [
    { label: 'Home', to: '/dashboard' },
    { label: 'User Management', to: '/dashboard#user-management' },
    { label: 'Edit User' },
  ];

  return (
    <AdminLayout breadcrumbs={breadcrumbs}>
      <div className="admin-form-card">
        <h2>Update User</h2>
        <p className="admin-form-sub">Edit account details and role. Passwords are not shown here.</p>

        {error && <div className="admin-alert admin-alert--error">{error}</div>}
        {success && <div className="admin-alert admin-alert--success">{success}</div>}

        {fetching ? (
          <div className="admin-state admin-state--loading">
            <div className="admin-spinner" aria-hidden="true" />
            <p>Loading user…</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="admin-form" noValidate>
            <div className="admin-field">
              <label htmlFor="name">Name</label>
              <input name="name" id="name" value={form.name} onChange={handleChange} />
              {fieldErrors.name && <p className="admin-field-error">{fieldErrors.name}</p>}
            </div>

            <div className="admin-field">
              <label htmlFor="email">Email</label>
              <input name="email" id="email" type="email" value={form.email} onChange={handleChange} />
              {fieldErrors.email && <p className="admin-field-error">{fieldErrors.email}</p>}
            </div>

            <div className="admin-field">
              <label htmlFor="role">Role</label>
              <select id="role" name="role" value={form.role} onChange={handleChange}>
                <option value="User">User</option>
                <option value="Admin">Admin</option>
              </select>
              {fieldErrors.role && <p className="admin-field-error">{fieldErrors.role}</p>}
            </div>

            <div className="admin-form-actions">
              <button type="submit" className="admin-btn admin-btn--primary" disabled={loading}>
                {loading && <IconSpinner />}
                {loading ? 'Updating…' : 'Update User'}
              </button>
              <Link to="/dashboard#user-management" className="admin-btn admin-btn--ghost">
                Cancel
              </Link>
            </div>
          </form>
        )}
      </div>
    </AdminLayout>
  );
};

export default UpdateUser;
