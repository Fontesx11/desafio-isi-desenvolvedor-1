import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

type TablePaginationProps = {
  page: number;
  pageSize: number;
  total: number;
  itemLabel: [string, string];
  onPageChange: (page: number) => void;
};

export function TablePagination({
  page,
  pageSize,
  total,
  itemLabel,
  onPageChange,
}: TablePaginationProps) {
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const first = total === 0 ? 0 : (page - 1) * pageSize + 1;
  const last = Math.min(page * pageSize, total);
  const pages = Array.from({ length: totalPages }, (_, index) => index + 1);

  return (
    <div className="flex items-center justify-between gap-4 border-t border-zinc-200 px-4 py-3 text-sm text-zinc-500">
      <p>
        Mostrando {first}–{last} de {total}{' '}
        {total === 1 ? itemLabel[0] : itemLabel[1]}
      </p>
      <nav aria-label="Paginação" className="flex items-center gap-1">
        <Button
          type="button"
          variant="ghost"
          disabled={page === 1}
          onClick={() => onPageChange(page - 1)}
        >
          <ChevronLeft />
          Anterior
        </Button>
        {pages.map((number) => (
          <Button
            key={number}
            type="button"
            variant={number === page ? 'outline' : 'ghost'}
            size="icon"
            aria-current={number === page ? 'page' : undefined}
            onClick={() => onPageChange(number)}
          >
            {number}
          </Button>
        ))}
        <Button
          type="button"
          variant="ghost"
          disabled={page === totalPages}
          onClick={() => onPageChange(page + 1)}
          className="text-foreground"
        >
          Próxima
          <ChevronRight />
        </Button>
      </nav>
    </div>
  );
}
