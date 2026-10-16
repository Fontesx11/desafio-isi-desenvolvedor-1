import { Lock } from 'lucide-react';

// Campo que a API calcula ao salvar (valor base, overall)
export function LockedValue() {
  return (
    <div className="flex h-9 items-center gap-2 rounded-lg border border-dashed whitespace-nowrap border-zinc-200 bg-zinc-50 px-3 text-sm text-zinc-500">
      <Lock className="size-3.5" />
      Após salvar
    </div>
  );
}
