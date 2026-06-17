import { percent } from '../lib/format';
import type { TaskStats } from '../types/api';

export const CompletionDonut = ({ stats }: { stats: TaskStats }) => {
  const radius = 48;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (stats.completionRate / 100) * circumference;

  return (
    <div className="rounded-lg border border-ink-200 bg-white p-5 shadow-panel">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="text-base font-bold text-ink-900">Completion</h2>
          <p className="mt-1 text-sm text-ink-500">Task closure rate</p>
        </div>
        <span className="rounded-full bg-mint-500/10 px-3 py-1 text-sm font-bold text-mint-600">
          {stats.completionRate}%
        </span>
      </div>
      <div className="mt-6 flex items-center justify-center">
        <svg viewBox="0 0 120 120" className="h-40 w-40">
          <circle cx="60" cy="60" r={radius} fill="none" stroke="#e2e8f0" strokeWidth="12" />
          <circle
            cx="60"
            cy="60"
            r={radius}
            fill="none"
            stroke="#14b8a6"
            strokeLinecap="round"
            strokeWidth="12"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            transform="rotate(-90 60 60)"
          />
          <text x="60" y="56" textAnchor="middle" className="fill-slate-900 text-2xl font-bold">
            {stats.completed}
          </text>
          <text x="60" y="76" textAnchor="middle" className="fill-slate-500 text-xs font-semibold">
            completed
          </text>
        </svg>
      </div>
    </div>
  );
};

export const PriorityBars = ({ stats }: { stats: TaskStats }) => {
  const total = stats.byPriority.low + stats.byPriority.medium + stats.byPriority.high;
  const rows = [
    { label: 'High', value: stats.byPriority.high, bar: 'bg-rosebar-500' },
    { label: 'Medium', value: stats.byPriority.medium, bar: 'bg-amberline-500' },
    { label: 'Low', value: stats.byPriority.low, bar: 'bg-brand-500' }
  ];

  return (
    <div className="rounded-lg border border-ink-200 bg-white p-5 shadow-panel">
      <h2 className="text-base font-bold text-ink-900">Priority Mix</h2>
      <div className="mt-6 space-y-5">
        {rows.map((row) => (
          <div key={row.label}>
            <div className="mb-2 flex items-center justify-between text-sm">
              <span className="font-semibold text-ink-700">{row.label}</span>
              <span className="text-ink-500">{row.value}</span>
            </div>
            <div className="h-2.5 overflow-hidden rounded-full bg-ink-100">
              <div className={`h-full rounded-full ${row.bar}`} style={{ width: `${percent(row.value, total)}%` }} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
