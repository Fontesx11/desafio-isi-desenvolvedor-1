import { Link, useMatchRoute } from '@tanstack/react-router';
import { cn } from 'cn';
import { Clock, Plus, Swords, Trophy } from 'lucide-react';
import type { ReactNode } from 'react';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupAction,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuBadge,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar';
import { LEAGUE_MOCK } from '@/lib/mocks/league.mock';
import { CLUBS_MOCK } from '@/modules/clubes/mocks/clubs.mock';
import { MENU_GROUPS } from './constants/menu.constants';

const activeItem =
  'data-[active=true]:bg-background data-[active=true]:shadow-[0_0_0_1px_var(--sidebar-border)] data-[active=true]:[&>svg]:text-primary';

export function AppSidebar() {
  const matchRoute = useMatchRoute();

  return (
    <Sidebar variant="inset">
      <SidebarHeader>
        <div className="flex items-center gap-3 px-2 py-1.5">
          <span className="flex size-9 items-center justify-center rounded-lg bg-primary text-lg font-bold text-primary-foreground">
            P
          </span>
          <div className="leading-tight">
            <p className="font-semibold">Passe</p>
            <p className="text-xs text-zinc-500">Gestão da liga</p>
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent>
        {MENU_GROUPS.map((group) => (
          <SidebarGroup key={group.label}>
            <SidebarGroupLabel>{group.label}</SidebarGroupLabel>
            <SidebarMenu>
              {group.items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  {item.to ? (
                    <SidebarMenuButton
                      asChild
                      isActive={!!matchRoute({ to: item.to, fuzzy: true })}
                      className={activeItem}
                    >
                      <Link to={item.to}>
                        <item.icon />
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  ) : (
                    <SidebarMenuButton>
                      <item.icon />
                      <span>{item.title}</span>
                    </SidebarMenuButton>
                  )}
                  {item.count !== undefined && (
                    <SidebarMenuBadge className="text-zinc-500">
                      {item.count}
                    </SidebarMenuBadge>
                  )}
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroup>
        ))}

        <SidebarGroup>
          <SidebarGroupLabel>Clubes</SidebarGroupLabel>
          <SidebarGroupAction title="Novo clube">
            <Plus />
          </SidebarGroupAction>
          <SidebarMenu>
            {CLUBS_MOCK.map((club) => {
              const params = { clubId: String(club.id) };
              const isActive = !!matchRoute({ to: '/clubs/$clubId', params });

              return (
                <SidebarMenuItem key={club.id}>
                  <SidebarMenuButton
                    asChild
                    isActive={isActive}
                    className={activeItem}
                  >
                    <Link to="/clubs/$clubId" params={params}>
                      <span
                        className={cn(
                          'flex size-5 shrink-0 items-center justify-center rounded border border-zinc-200 bg-background text-[11px] font-medium',
                          isActive &&
                            'border-primary bg-primary text-primary-foreground',
                        )}
                      >
                        {club.acronym[0]}
                      </span>
                      <span>{club.name}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              );
            })}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        <div className="space-y-3 rounded-xl border border-zinc-200 bg-background p-3 text-sm">
          <FooterInfo
            icon={<Trophy />}
            title={LEAGUE_MOCK.name}
            description={`${LEAGUE_MOCK.clubsCount} clubes · ${LEAGUE_MOCK.playersCount} jogadores`}
          />
          <FooterInfo
            icon={<Swords />}
            title="Última partida"
            description={LEAGUE_MOCK.lastMatch}
          />
          <p className="flex items-center gap-2 border-t border-zinc-200 pt-3 text-xs text-zinc-500">
            <Clock className="size-3.5" />
            Horário de Brasília (UTC−3)
          </p>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}

function FooterInfo({
  icon,
  title,
  description,
}: {
  icon: ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="flex items-center gap-3">
      <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-zinc-100 text-zinc-400 [&_svg]:size-4">
        {icon}
      </span>
      <div className="min-w-0 leading-tight">
        <p className="font-medium">{title}</p>
        <p className="truncate text-xs text-zinc-500">{description}</p>
      </div>
    </div>
  );
}
