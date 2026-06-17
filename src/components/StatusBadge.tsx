import { CheckCircle2, CircleAlert, CircleDashed, ShieldCheck } from 'lucide-react';

const variants = {
  success: 'border-emerald-200 bg-emerald-50 text-emerald-700',
  warning: 'border-amber-200 bg-amber-50 text-amber-700',
  danger: 'border-rose-200 bg-rose-50 text-rose-700',
  neutral: 'border-ink-200 bg-white text-ink-700'
};

const icons = {
  success: CheckCircle2,
  warning: CircleAlert,
  danger: CircleAlert,
  neutral: CircleDashed,
  admin: ShieldCheck
};

export const StatusBadge = ({
  label,
  tone = 'neutral'
}: {
  label: string;
  tone?: keyof typeof variants | 'admin';
}) => {
  const Icon = icons[tone];
  const className = tone === 'admin' ? 'border-brand-100 bg-brand-50 text-brand-700' : variants[tone];

  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-semibold ${className}`}>
      <Icon className="h-3.5 w-3.5" />
      {label}
    </span>
  );
};
