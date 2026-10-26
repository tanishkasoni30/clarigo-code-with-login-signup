export function getInitials(name) {
  if (!name || typeof name !== 'string') return '?';
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return '?';
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
}

const RECENT_DAYS = 7;

export function computeUserStats(users) {
  if (!Array.isArray(users)) {
    return {
      total: null,
      admins: null,
      regular: null,
      recent: null,
      recentAvailable: false,
    };
  }

  const total = users.length;
  const admins = users.filter((u) => u.role === 'Admin').length;
  const regular = users.filter((u) => u.role === 'User').length;

  const hasCreatedAt = users.some((u) => u.createdAt);
  let recent = null;
  if (hasCreatedAt) {
    const cutoff = Date.now() - RECENT_DAYS * 24 * 60 * 60 * 1000;
    recent = users.filter((u) => u.createdAt && new Date(u.createdAt).getTime() >= cutoff).length;
  }

  return {
    total,
    admins,
    regular,
    recent,
    recentAvailable: hasCreatedAt,
    recentDays: RECENT_DAYS,
  };
}

export function formatStatValue(value) {
  if (value === null || value === undefined) return '—';
  return String(value);
}
