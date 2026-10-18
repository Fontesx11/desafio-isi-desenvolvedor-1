import { Link } from '@tanstack/react-router';
import { ChevronRight } from 'lucide-react';
import { DataTable, type DataTableColumn } from '@/components/data-table';
import { SortMenu } from '@/components/sort-menu';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { formatCurrency } from '@/lib/format';
import { SORT_OPTIONS } from '../constants/clubs.constants';
import type { Club, ClubSort } from '../types/clubs.types';
import { ClubAcronym } from './club-acronym';

const columns: DataTableColumn<Club>[] = [
  {
    id: 'club',
    header: 'Clube',
    cell: (club) => (
      <span className="flex items-center gap-3">
        <ClubAcronym acronym={club.acronym} />
        <span className="font-medium">{club.name}</span>
      </span>
    ),
  },
  {
    id: 'acronym',
    header: 'Sigla',
    cell: (club) => <Badge variant="outline">{club.acronym}</Badge>,
  },
  {
    id: 'cash',
    header: 'Caixa',
    className: 'text-right',
    cell: (club) => formatCurrency(club.cash),
  },
  {
    id: 'squad-value',
    header: 'Valor do elenco',
    className: 'text-right',
    cell: (club) => formatCurrency(club.squad_value),
  },
  {
    id: 'net-worth',
    header: 'Patrimônio',
    className: 'text-right',
    cell: (club) => (
      <span className="font-semibold">{formatCurrency(club.net_worth)}</span>
    ),
  },
  {
    id: 'actions',
    header: <span className="sr-only">Ações</span>,
    className: 'w-0',
    cell: (club) => (
      <Button asChild variant="ghost" size="sm">
        <Link to="/clubs/$clubId" params={{ clubId: String(club.id) }}>
          Ver clube
          <ChevronRight />
        </Link>
      </Button>
    ),
  },
];

type ClubsTableProps = {
  clubs: Club[];
  sort: ClubSort;
  onSortChange: (sort: ClubSort) => void;
  isLoading: boolean;
};

export function ClubsTable({
  clubs,
  sort,
  onSortChange,
  isLoading,
}: ClubsTableProps) {
  return (
    <section className="overflow-hidden rounded-xl border border-zinc-200">
      <div className="flex justify-end p-3">
        <SortMenu options={SORT_OPTIONS} value={sort} onChange={onSortChange} />
      </div>

      <DataTable
        columns={columns}
        rows={clubs}
        getRowKey={(club) => club.id}
        emptyMessage="Nenhum clube encontrado."
        isLoading={isLoading}
      />
    </section>
  );
}
