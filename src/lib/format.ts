export const formatNumber = (value: number | undefined) => new Intl.NumberFormat('en').format(value || 0);

export const formatDate = (timestamp?: number | null) => {
  if (!timestamp) return 'Never';
  return new Intl.DateTimeFormat('en', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  }).format(new Date(timestamp));
};

export const formatDateTime = (timestamp?: number | null) => {
  if (!timestamp) return 'Never';
  return new Intl.DateTimeFormat('en', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(new Date(timestamp));
};

export const initials = (name: string) =>
  name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join('') || 'TF';

export const percent = (value: number, total: number) => {
  if (!total) return 0;
  return Math.round((value / total) * 100);
};
