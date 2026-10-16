import { useMatches } from '@tanstack/react-router';
import { RefreshCw } from 'lucide-react';
import { Fragment } from 'react';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { SidebarTrigger } from '@/components/ui/sidebar';

export function AppHeader() {
  const matches = useMatches();
  const currentPage = matches.at(-1);
  // A trilha vem da rota: fixa no staticData ou montada no loader
  const breadcrumb =
    currentPage?.loaderData?.breadcrumb ??
    currentPage?.staticData.breadcrumb ??
    [];

  return (
    <header className="flex h-14 shrink-0 items-center gap-3 border-b border-zinc-200 px-4">
      <SidebarTrigger className="-ml-1" />
      <Separator
        orientation="vertical"
        className="data-vertical:h-4 data-vertical:self-center"
      />
      <Breadcrumb>
        <BreadcrumbList>
          {breadcrumb.map((label, index) => (
            <Fragment key={label}>
              {index > 0 && <BreadcrumbSeparator />}
              <BreadcrumbItem>
                {index === breadcrumb.length - 1 ? (
                  <BreadcrumbPage>{label}</BreadcrumbPage>
                ) : (
                  label
                )}
              </BreadcrumbItem>
            </Fragment>
          ))}
        </BreadcrumbList>
      </Breadcrumb>
      <Button
        type="button"
        variant="ghost"
        size="icon"
        className="ml-auto"
        aria-label="Atualizar"
      >
        <RefreshCw />
      </Button>
    </header>
  );
}
