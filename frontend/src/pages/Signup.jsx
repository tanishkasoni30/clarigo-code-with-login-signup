import React, { useState } from 'react';
import api from '../services/api';
import { Link, useNavigate } from 'react-router-dom';
import AuthShell from '../components/auth/AuthShell';
import {
  IconEye,
  IconEyeOff,
  IconLock,
  IconMail,
  IconShield,
  IconSpinner,
  IconUser,
} from '../components/auth/AuthIcons';
import { getPasswordStrength } from '../utils/passwordStrength';
import '../styles/auth.css';

const emailRegex = /^\S+@\S+\.\S+$/;

const Signup = () => {
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'User' });
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const navigate = useNavigate();

  const passwordStrength = getPasswordStrength(form.password);

  function handleChange(event) {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: '', general: '', confirmPassword: '' }));
    setSuccessMessage('');
  }

  function handleConfirmPasswordChange(event) {
    setConfirmPassword(event.target.value);
    setErrors((prev) => ({ ...prev, confirmPassword: '', general: '' }));
    setSuccessMessage('');
  }

  function validate() {
    const nextErrors = {};

    if (!form.name.trim()) nextErrors.name = 'Name is required';

    if (!form.email) nextErrors.email = 'Email is required';
    else if (!emailRegex.test(form.email)) nextErrors.email = 'Enter a valid email address';

    if (!form.password) nextErrors.password = 'Password is required';
    else if (form.password.length < 6) nextErrors.password = 'Password must be at least 6 characters';

    if (!confirmPassword) nextErrors.confirmPassword = 'Please confirm your password';
    else if (confirmPassword !== form.password) nextErrors.confirmPassword = 'Passwords do not match';

    if (!form.role) nextErrors.role = 'Please select a role';


    return nextErrors;
  }

  async function handleSubmit(event) {
    event.preventDefault();
    const nextErrors = validate();
    setErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) return;

    setLoading(true);
    setSuccessMessage('');

    try {
      await api.post('/auth/signup', form);
      setSuccessMessage('Account created successfully. Redirecting you to login…');
      setTimeout(() => navigate('/login'), 1200);
    } catch (err) {
      setErrors({ general: err?.response?.data?.message || 'Signup failed. Please try again.' });
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthShell
      variant="signup"
      eyebrow="Get started"
      heroTitle="Create Your Account"
      // heroText="Join us and get started today with a secure ClariGo profile tailored to your role."
    >
      <div className="auth-form-brand">
        <span className="auth-logo-mark">C</span>
        <span>ClariGo</span>
      </div>

      <div className="auth-form-heading">
        <h2>Create Your Account</h2>
     
      </div>

      {errors.general && <div className="auth-alert auth-alert--error">{errors.general}</div>}
      {successMessage && <div className="auth-alert auth-alert--success">{successMessage}</div>}

      <form onSubmit={handleSubmit} className="auth-form" noValidate>
        <div className={`auth-field ${errors.name ? 'has-error' : ''}`}>
          <label htmlFor="name">Full name</label>
          <div className="auth-input-wrap">
            <span className="auth-input-icon">
              <IconUser />
            </span>
            <input
              id="name"
              name="name"
              type="text"
              autoComplete="name"
              value={form.name}
              onChange={handleChange}
              placeholder="John Doe"
            />
          </div>
          {errors.name && <p className="auth-field-message">{errors.name}</p>}
        </div>

        <div className={`auth-field ${errors.email ? 'has-error' : ''}`}>
          <label htmlFor="email">Email</label>
          <div className="auth-input-wrap">
            <span className="auth-input-icon">
              <IconMail />
            </span>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              value={form.email}
              onChange={handleChange}
              placeholder="email@example.com"
            />
          </div>
          {errors.email && <p className="auth-field-message">{errors.email}</p>}
        </div>

        <div className={`auth-field ${errors.password ? 'has-error' : ''}`}>
          <label htmlFor="password">Password</label>
          <div className="auth-input-wrap auth-password-wrap">
            <span className="auth-input-icon">
              <IconLock />
            </span>
            <input
              id="password"
              name="password"
              type={showPassword ? 'text' : 'password'}
              autoComplete="new-password"
              value={form.password}
              onChange={handleChange}
              placeholder="At least 6 characters"
            />
            <button
              type="button"
              className="auth-password-toggle"
              onClick={() => setShowPassword((prev) => !prev)}
              aria-label={showPassword ? 'Hide password' : 'Show password'}
            >
              {showPassword ? <IconEyeOff /> : <IconEye />}
            </button>
          </div>
          {form.password && (
            <div className="auth-strength" aria-live="polite">
              <div className="auth-strength-bar">
                <div
                  className="auth-strength-fill"
                  data-level={passwordStrength.score}
                  style={{ width: `${passwordStrength.percent}%` }}
                />
              </div>
              <span className="auth-strength-label">Strength: {passwordStrength.label}</span>
            </div>
          )}
          {errors.password && <p className="auth-field-message">{errors.password}</p>}
        </div>

        <div className={`auth-field ${errors.confirmPassword ? 'has-error' : ''}`}>
          <label htmlFor="confirmPassword">Confirm password</label>
          <div className="auth-input-wrap auth-password-wrap">
            <span className="auth-input-icon">
              <IconLock />
            </span>
            <input
              id="confirmPassword"
              name="confirmPassword"
              type={showConfirmPassword ? 'text' : 'password'}
              autoComplete="new-password"
              value={confirmPassword}
              onChange={handleConfirmPasswordChange}
              placeholder="Re-enter your password"
            />
            <button
              type="button"
              className="auth-password-toggle"
              onClick={() => setShowConfirmPassword((prev) => !prev)}
              aria-label={showConfirmPassword ? 'Hide confirm password' : 'Show confirm password'}
            >
              {showConfirmPassword ? <IconEyeOff /> : <IconEye />}
            </button>
          </div>
          {errors.confirmPassword && <p className="auth-field-message">{errors.confirmPassword}</p>}
        </div>

        <div className={`auth-field ${errors.role ? 'has-error' : ''}`}>
          <label htmlFor="role">Role</label>
          <div className="auth-input-wrap">
            <span className="auth-input-icon">
              <IconShield />
            </span>
            <select id="role" name="role" value={form.role} onChange={handleChange}>
              <option value="User">User</option>
              <option value="Admin">Admin</option>
            </select>
          </div>
          {errors.role && <p className="auth-field-message">{errors.role}</p>}
        </div>

        <button type="submit" className="auth-submit" disabled={loading}>
          {loading && <IconSpinner />}
          {loading ? 'Creating account…' : 'Create Account'}
        </button>

        <p className="auth-switch">
          Already have an account? <Link to="/login">Login here</Link>
        </p>
      </form>
    </AuthShell>
  );
};

export default Signup;
