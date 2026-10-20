import { Skeleton } from '@/components/ui/skeleton';

export function LoadingState() {
  return (
    <section className="space-y-3 rounded-xl border border-zinc-200 p-6">
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-3/4" />
      <Skeleton className="h-4 w-1/2" />
      <p className="text-sm text-zinc-500">Carregando...</p>
    </section>
  );
}
