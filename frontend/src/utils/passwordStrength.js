export function getPasswordStrength(password) {
  if (!password) {
    return { score: 0, label: '', percent: 0 };
  }

  let score = 0;

  if (password.length >= 6) score += 1;
  if (password.length >= 10) score += 1;
  if (/[a-z]/.test(password) && /[A-Z]/.test(password)) score += 1;
  if (/\d/.test(password)) score += 1;
  if (/[^A-Za-z0-9]/.test(password)) score += 1;

  const labels = ['Weak', 'Fair', 'Good', 'Strong', 'Excellent'];
  const label = labels[Math.min(score, labels.length) - 1] || 'Weak';
  const percent = Math.min(100, (score / 5) * 100);

  return { score, label, percent };
}
