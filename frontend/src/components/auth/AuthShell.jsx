import { Link } from 'react-router-dom';

export default function AuthShell({ variant = 'login', eyebrow, heroTitle, heroText, children }) {
  return (
    <div className="auth-page">
      <div className={`auth-card auth-card--${variant}`}>
        <div className="auth-visual">
          <Link to="/" className="auth-visual-brand">
            <span className="auth-logo-mark">C</span>
            <span>ClariGo</span>
          </Link>
          <span className="auth-eyebrow">{eyebrow}</span>
          <h1 className="auth-hero-title">{heroTitle}</h1>
          <p className="auth-hero-text">{heroText}</p>
          <ul className="auth-feature-list">
            {variant === 'login' ? (
              <>
                <li>Secure access to your dashboard</li>
                <li>Role-based permissions</li>
                <li>Fast, reliable sign-in</li>
              </>
            ) : (
              <>
                <li>Set up your profile in minutes</li>
                <li>Choose the role that fits you</li>
                <li>Start managing your workspace</li>
              </>
            )}
          </ul>
        </div>
        <div className="auth-form-panel">{children}</div>
      </div>
    </div>
  );
}
