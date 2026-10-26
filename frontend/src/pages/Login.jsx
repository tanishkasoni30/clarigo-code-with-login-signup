import React, { useState } from 'react';
import api from '../services/api';
import { Link, useNavigate } from 'react-router-dom';
import { setSession } from '../utils/auth';
import AuthShell from '../components/auth/AuthShell';
import { IconEye, IconEyeOff, IconLock, IconMail, IconSpinner } from '../components/auth/AuthIcons';
import '../styles/auth.css';

const emailRegex = /^\S+@\S+\.\S+$/;

const Login = () => {
  const [form, setForm] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const navigate = useNavigate();

  function handleChange(event) {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: '', general: '' }));
  }

  function validate() {
    const nextErrors = {};

    if (!form.email) nextErrors.email = 'Email is required';
    else if (!emailRegex.test(form.email)) nextErrors.email = 'Enter a valid email address';

    if (!form.password) nextErrors.password = 'Password is required';
    else if (form.password.length < 6) nextErrors.password = 'Password must be at least 6 characters';

    return nextErrors;
  }

  async function handleSubmit(event) {
    event.preventDefault();
    const nextErrors = validate();
    setErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) return;

    setLoading(true);

    try {
      const res = await api.post('/auth/login', form);
      setSession({ token: res.data.token, user: res.data.user });
      if (rememberMe) {
        localStorage.setItem('auth_remember', '1');
      } else {
        localStorage.removeItem('auth_remember');
      }
      navigate('/dashboard');
    } catch (err) {
      setErrors({ general: err?.response?.data?.message || 'Login failed. Please try again.' });
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthShell
      variant="login"
      eyebrow="Welcome back"
      heroTitle="Glad to see you again"
      
    >
      <div className="auth-form-brand">
        <span className="auth-logo-mark">C</span>
        <span>ClariGo</span>
      </div>

      <div className="auth-form-heading">
        <h2>Welcome Back!</h2>
        {/* <p>Sign in to continue to your account.</p> */}
      </div>

      {errors.general && <div className="auth-alert auth-alert--error">{errors.general}</div>}

      <form onSubmit={handleSubmit} className="auth-form" noValidate>
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
              placeholder="you@example.com"
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
              autoComplete="current-password"
              value={form.password}
              onChange={handleChange}
              placeholder="Enter your password"
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
          {errors.password && <p className="auth-field-message">{errors.password}</p>}
        </div>

        <div className="auth-form-row">
          <label className="auth-checkbox">
            <input
              type="checkbox"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
            />
            <span>Remember me</span>
          </label>
          <button type="button" className="auth-text-link" title="Password reset is not configured yet">
            Forgot password?
          </button>
        </div>

        <button type="submit" className="auth-submit" disabled={loading}>
          {loading && <IconSpinner />}
          {loading ? 'Signing in…' : 'Login'}
        </button>

        <p className="auth-switch">
          New here? <Link to="/signup">Create an account</Link>
        </p>
      </form>
    </AuthShell>
  );
};

export default Login;
