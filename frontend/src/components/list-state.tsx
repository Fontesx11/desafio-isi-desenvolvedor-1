import type { LucideIcon } from 'lucide-react';
import type { ReactNode } from 'react';

type ListStateProps = {
  icon: LucideIcon;
  title: string;
  description: string;
  action?: ReactNode;
};

export function ListState({
  icon: Icon,
  title,
  description,
  action,
}: ListStateProps) {
  return (
    <section className="flex flex-col items-center gap-3 rounded-xl border border-zinc-200 px-6 py-12 text-center">
      <span className="flex size-12 items-center justify-center rounded-lg bg-zinc-100 text-zinc-600">
        <Icon className="size-5" />
      </span>
      <div className="space-y-1">
        <h2 className="font-semibold">{title}</h2>
        <p className="max-w-md text-sm text-zinc-500">{description}</p>
      </div>
      {action}
    </section>
  );
}
