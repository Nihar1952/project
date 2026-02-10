export function formatDate(date) {
  if (!date) return '—';
  const d = typeof date === 'number' ? new Date(date * 1000) : new Date(date);
  return d.toLocaleString();
}
