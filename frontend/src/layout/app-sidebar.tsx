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
import { useClubsQueries } from '@/modules/clubes/hooks/useClubsQueries';
import { usePlayersQueries } from '@/modules/jogadores/hooks/usePlayersQueries';
import { MENU_GROUPS } from './constants/menu.constants';

export function AppSidebar() {
  const matchRoute = useMatchRoute();
  const { useGetPlayersTotal } = usePlayersQueries();
  const playersTotal = useGetPlayersTotal();
  const { useGetClubs } = useClubsQueries();
  const { data: clubs = [] } = useGetClubs();

  const counts: Partial<Record<string, number>> = {
    '/players': playersTotal,
    '/clubs': clubs.length,
    '/matches': LEAGUE_MOCK.matchesCount,
  };

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
                      variant="nav"
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
                  {item.to && counts[item.to] !== undefined && (
                    <SidebarMenuBadge className="text-zinc-500">
                      {counts[item.to]}
                    </SidebarMenuBadge>
                  )}
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroup>
        ))}

        <SidebarGroup>
          <SidebarGroupLabel>Clubes</SidebarGroupLabel>
        
          <SidebarMenu>
            {clubs.map((club) => {
              const params = { clubId: String(club.id) };
              const isActive = !!matchRoute({ to: '/clubs/$clubId', params });

              return (
                <SidebarMenuItem key={club.id}>
                  <SidebarMenuButton asChild isActive={isActive} variant="nav">
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
            description={`${clubs.length} clubes · ${playersTotal} jogadores`}
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
