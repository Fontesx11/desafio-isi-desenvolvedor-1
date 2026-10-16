import { useState } from 'react';
import { DataTable, type DataTableColumn } from '@/components/data-table';
import { SortMenu } from '@/components/sort-menu';
import { Badge } from '@/components/ui/badge';
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
];

export function ClubsTable({ clubs }: { clubs: Club[] }) {
  // simulacao
  // A ordenação só troca a opção marcada; a lista não muda
  const [sort, setSort] = useState<ClubSort>('name');

  return (
    <section className="overflow-hidden rounded-xl border border-zinc-200">
      <div className="flex justify-end p-3">
        <SortMenu options={SORT_OPTIONS} value={sort} onChange={setSort} />
      </div>

      <DataTable
        columns={columns}
        rows={clubs}
        getRowKey={(club) => club.id}
        emptyMessage="Nenhum clube encontrado."
      />
    </section>
  );
}
