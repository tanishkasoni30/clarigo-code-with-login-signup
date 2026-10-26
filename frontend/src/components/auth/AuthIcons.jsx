export function IconMail({ className = '' }) {
  return (
    <svg className={className} width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M4 6h16a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2z"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinejoin="round"
      />
      <path d="m4 8 8 5 8-5" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function IconLock({ className = '' }) {
  return (
    <svg className={className} width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <rect x="5" y="11" width="14" height="10" rx="2" stroke="currentColor" strokeWidth="1.75" />
      <path
        d="M8 11V8a4 4 0 1 1 8 0v3"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function IconUser({ className = '' }) {
  return (
    <svg className={className} width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="12" cy="8" r="4" stroke="currentColor" strokeWidth="1.75" />
      <path
        d="M5 20c1.5-3.5 5-5 7-5s5.5 1.5 7 5"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function IconShield({ className = '' }) {
  return (
    <svg className={className} width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M12 3 20 7v6c0 5-3.5 8.5-8 9-4.5-.5-8-4-8-9V7l8-4z"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function IconEye({ className = '' }) {
  return (
    <svg className={className} width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7z"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinejoin="round"
      />
      <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="1.75" />
    </svg>
  );
}

export function IconEyeOff({ className = '' }) {
  return (
    <svg className={className} width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M3 3l18 18" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
      <path
        d="M10.6 10.6A3 3 0 0 0 12 15a3 3 0 0 0 2.4-4.4M6.7 6.7C4.6 8.1 3 10 2 12s3.5 7 10 7c1.8 0 3.4-.4 4.8-1.1M17.3 17.3C19.4 15.9 21 14 22 12s-3.5-7-10-7c-1.8 0-3.4.4-4.8 1.1"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function IconSpinner({ className = '' }) {
  return (
    <svg className={`auth-spinner ${className}`} width="20" height="20" viewBox="0 0 24 24" aria-hidden="true">
      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" strokeOpacity="0.25" fill="none" />
      <path
        d="M12 2a10 10 0 0 1 10 10"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
        fill="none"
      />
    </svg>
  );
}
