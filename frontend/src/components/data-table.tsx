import { cn } from 'cn';
import { Fragment, type ReactNode } from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

const LOADING_ROWS = 5;

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
  groupHeader?: (row: T, index: number) => ReactNode;
  isLoading?: boolean;
};

export function DataTable<T>({
  columns,
  rows,
  getRowKey,
  emptyMessage,
  groupHeader,
  isLoading = false,
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
        {isLoading &&
          Array.from({ length: LOADING_ROWS }, (_, rowIndex) => (
            <TableRow key={rowIndex}>
              {columns.map((column) => (
                <TableCell
                  key={column.id}
                  className="h-14 px-2.5 first:pl-4 last:pr-4"
                >
                  <Skeleton className="h-4 w-full" />
                </TableCell>
              ))}
            </TableRow>
          ))}

        {!isLoading && rows.length === 0 && (
          <TableRow>
            <TableCell
              colSpan={columns.length}
              className="h-24 text-center text-zinc-500"
            >
              {emptyMessage}
            </TableCell>
          </TableRow>
        )}

        {!isLoading &&
          rows.map((row, index) => {
            const header = groupHeader?.(row, index);
            return (
              <Fragment key={getRowKey(row)}>
                {header && (
                  <TableRow className="bg-zinc-50 hover:bg-zinc-50">
                    <TableCell colSpan={columns.length} className="px-4 py-2.5">
                      {header}
                    </TableCell>
                  </TableRow>
                )}
                <TableRow>
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
              </Fragment>
            );
          })}
      </TableBody>
    </Table>
  );
}
