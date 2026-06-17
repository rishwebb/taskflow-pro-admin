export const BrandMark = ({ compact = false, inverse = false }: { compact?: boolean; inverse?: boolean }) => (
  <div className="flex items-center gap-3">
    <div className="grid h-10 w-10 place-items-center rounded-lg bg-brand-600 text-sm font-black text-white shadow-panel">
      TF
    </div>
    {!compact && (
      <div>
        <p className={`text-base font-bold leading-tight ${inverse ? 'text-white' : 'text-ink-900'}`}>TaskFlow Pro</p>
        <p className={`text-xs font-medium uppercase tracking-[0.18em] ${inverse ? 'text-slate-300' : 'text-ink-500'}`}>Admin</p>
      </div>
    )}
  </div>
);
