import { cn } from 'cn';
import type { ReactNode } from 'react';

export type ResultRow = {
  label: string;
  hint?: string;
  value: ReactNode;
  highlight?: boolean;
};

export function ResultList({ rows }: { rows: ResultRow[] }) {
  return (
    <dl className="divide-y divide-zinc-200 overflow-hidden rounded-xl border border-zinc-200">
      {rows.map((row) => (
        <div
          key={row.label}
          className={cn(
            'flex items-center justify-between gap-4 px-4 py-3',
            row.highlight && 'bg-zinc-50',
          )}
        >
          <dt>
            <span className={cn(row.highlight && 'font-semibold')}>
              {row.label}
            </span>
            {row.hint && (
              <span className="block text-sm text-zinc-500">{row.hint}</span>
            )}
          </dt>
          <dd
            className={cn(
              'tabular-nums',
              row.highlight && 'text-lg font-semibold',
            )}
          >
            {row.value}
          </dd>
        </div>
      ))}
    </dl>
  );
}
