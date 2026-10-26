import React, { useEffect, useState } from 'react';
import api from './services/api';
import { Link, useNavigate } from 'react-router-dom';
import AdminLayout from './components/admin/AdminLayout';
import { IconSpinner } from './components/auth/AuthIcons';

const emailRegex = /^\S+@\S+\.\S+$/;

const CreateUser = () => {
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'User' });
  const [fieldErrors, setFieldErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    document.body.classList.add('admin-route');
    return () => document.body.classList.remove('admin-route');
  }, []);

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
    if (!form.password) next.password = 'Password is required';
    else if (form.password.length < 6) next.password = 'Password must be at least 6 characters';
    if (!form.role) next.role = 'Role is required';
    return next;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const next = validate();
    setFieldErrors(next);
    if (Object.keys(next).length > 0) return;

    setLoading(true);
    setError('');
    try {
      await api.post('/users', form);
      setSuccess('User created successfully.');
      setTimeout(() => navigate('/dashboard'), 800);
    } catch (err) {
      setError(err?.response?.data?.message || 'Failed to create user');
    } finally {
      setLoading(false);
    }
  }

  const breadcrumbs = [
    { label: 'Home', to: '/dashboard' },
    { label: 'User Management', to: '/dashboard#user-management' },
    { label: 'Add User' },
  ];

  return (
    <AdminLayout breadcrumbs={breadcrumbs}>
      <div className="admin-form-card">
        <h2>Add User</h2>
        <p className="admin-form-sub">Create a new account with name, email, password, and role.</p>

        {error && <div className="admin-alert admin-alert--error">{error}</div>}
        {success && <div className="admin-alert admin-alert--success">{success}</div>}

        <form onSubmit={handleSubmit} className="admin-form" noValidate>
          <div className="admin-field">
            <label htmlFor="name">Name</label>
            <input name="name" id="name" value={form.name} onChange={handleChange} placeholder="Full name" />
            {fieldErrors.name && <p className="admin-field-error">{fieldErrors.name}</p>}
          </div>

          <div className="admin-field">
            <label htmlFor="email">Email</label>
            <input
              name="email"
              id="email"
              type="email"
              className="form-control"
              value={form.email}
              onChange={handleChange}
              placeholder="email@example.com"
            />
            {fieldErrors.email && <p className="admin-field-error">{fieldErrors.email}</p>}
          </div>

          <div className="admin-field">
            <label htmlFor="password">Password</label>
            <input
              name="password"
              id="password"
              type="password"
              value={form.password}
              onChange={handleChange}
              placeholder="At least 6 characters"
              autoComplete="new-password"
            />
            {fieldErrors.password && <p className="admin-field-error">{fieldErrors.password}</p>}
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
              {loading ? 'Creating…' : 'Add User'}
            </button>
            <Link to="/dashboard#user-management" className="admin-btn admin-btn--ghost">
              Cancel
            </Link>
          </div>
        </form>
      </div>
    </AdminLayout>
  );
};

export default CreateUser;
