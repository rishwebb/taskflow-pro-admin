import { Search } from 'lucide-react';

export const SearchBox = ({
  value,
  onChange,
  placeholder
}: {
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
}) => (
  <label className="relative block w-full max-w-md">
    <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-500" />
    <input
      value={value}
      onChange={(event) => onChange(event.target.value)}
      placeholder={placeholder}
      className="h-11 w-full rounded-lg border border-ink-200 bg-white pl-10 pr-3 text-sm font-medium text-ink-900 outline-none transition focus:border-brand-500 focus:ring-4 focus:ring-brand-100"
    />
  </label>
);
