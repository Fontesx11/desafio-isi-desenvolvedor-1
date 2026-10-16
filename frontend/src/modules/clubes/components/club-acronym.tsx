import { cn } from 'cn';

type ClubAcronymProps = {
  acronym: string;
  className?: string;
};

// Quadro com a sigla, na lista de clubes e no cabeçalho da página do clube
export function ClubAcronym({ acronym, className }: ClubAcronymProps) {
  return (
    <span
      aria-hidden
      className={cn(
        'flex h-9 w-10 shrink-0 items-center justify-center rounded-lg border border-zinc-200 bg-zinc-50 text-xs font-medium',
        className,
      )}
    >
      {acronym}
    </span>
  );
}
