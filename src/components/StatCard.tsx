import type { LucideIcon } from 'lucide-react';
import { formatNumber } from '../lib/format';

export const StatCard = ({
  label,
  value,
  Icon,
  accent,
  helper
}: {
  label: string;
  value: number;
  Icon: LucideIcon;
  accent: string;
  helper?: string;
}) => (
  <div className="rounded-lg border border-ink-200 bg-white p-5 shadow-panel">
    <div className="flex items-start justify-between gap-4">
      <div>
        <p className="text-sm font-medium text-ink-500">{label}</p>
        <p className="mt-2 text-3xl font-bold tracking-normal text-ink-900">{formatNumber(value)}</p>
      </div>
      <div className={`grid h-11 w-11 shrink-0 place-items-center rounded-lg ${accent}`}>
        <Icon className="h-5 w-5" />
      </div>
    </div>
    {helper && <p className="mt-4 text-sm text-ink-500">{helper}</p>}
  </div>
);
