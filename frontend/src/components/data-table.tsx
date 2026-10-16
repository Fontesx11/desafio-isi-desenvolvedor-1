import { cn } from 'cn';
import type { ReactNode } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

export type DataTableColumn<T> = {
  id: string;
  header: ReactNode;
  cell: (row: T) => ReactNode;
  className?: string;
};

type DataTableProps<T> = {
  columns: DataTableColumn<T>[];
  rows: T[];
  getRowKey: (row: T) => string | number;
  emptyMessage: string;
};

export function DataTable<T>({
  columns,
  rows,
  getRowKey,
  emptyMessage,
}: DataTableProps<T>) {
  return (
    <Table>
      <TableHeader>
        <TableRow className="bg-zinc-50 hover:bg-zinc-50">
          {columns.map((column) => (
            <TableHead
              key={column.id}
              className={cn(
                'px-2.5 font-normal text-zinc-500 first:pl-4 last:pr-4',
                column.className,
              )}
            >
              {column.header}
            </TableHead>
          ))}
        </TableRow>
      </TableHeader>
      <TableBody>
        {rows.length === 0 ? (
          <TableRow>
            <TableCell
              colSpan={columns.length}
              className="h-24 text-center text-zinc-500"
            >
              {emptyMessage}
            </TableCell>
          </TableRow>
        ) : (
          rows.map((row) => (
            <TableRow key={getRowKey(row)}>
              {columns.map((column) => (
                <TableCell
                  key={column.id}
                  className={cn(
                    'h-14 px-2.5 first:pl-4 last:pr-4',
                    column.className,
                  )}
                >
                  {column.cell(row)}
                </TableCell>
              ))}
            </TableRow>
          ))
        )}
      </TableBody>
    </Table>
  );
}
