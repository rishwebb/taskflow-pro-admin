import type { ReactNode } from 'react';

export interface Column<T> {
  key: string;
  header: string;
  render: (item: T) => ReactNode;
  align?: 'left' | 'right';
}

export const DataTable = <T,>({
  columns,
  data,
  getKey,
  emptyLabel
}: {
  columns: Array<Column<T>>;
  data: T[];
  getKey: (item: T) => string;
  emptyLabel: string;
}) => (
  <div className="overflow-hidden rounded-lg border border-ink-200 bg-white shadow-panel">
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-ink-200">
        <thead className="bg-ink-50">
          <tr>
            {columns.map((column) => (
              <th
                key={column.key}
                scope="col"
                className={`px-5 py-3 text-xs font-bold uppercase tracking-wide text-ink-500 ${
                  column.align === 'right' ? 'text-right' : 'text-left'
                }`}
              >
                {column.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-ink-100 bg-white">
          {data.length === 0 ? (
            <tr>
              <td colSpan={columns.length} className="px-5 py-10 text-center text-sm font-medium text-ink-500">
                {emptyLabel}
              </td>
            </tr>
          ) : (
            data.map((item) => (
              <tr key={getKey(item)} className="hover:bg-ink-50/70">
                {columns.map((column) => (
                  <td
                    key={column.key}
                    className={`whitespace-nowrap px-5 py-4 text-sm text-ink-700 ${
                      column.align === 'right' ? 'text-right' : 'text-left'
                    }`}
                  >
                    {column.render(item)}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  </div>
);
