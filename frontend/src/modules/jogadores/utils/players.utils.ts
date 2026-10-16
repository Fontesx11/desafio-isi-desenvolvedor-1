import { LEAGUE_MOCK } from '@/lib/mocks/league.mock';
import type { Player } from '../types/players.types';

// Livre = sem clube; só o livre pode ser comprado ou excluído
export function isFreePlayer(player: Pick<Player, 'club_id'>) {
  return player.club_id === null;
}

// GET /players traz só o club_id; o nome e a sigla vêm da lista de clubes
export function findClub(clubId: number | null) {
  return LEAGUE_MOCK.clubs.find((club) => club.id === clubId);
}

// Primeira letra do primeiro e do último nome: "Ênio Carvalho" → "ÊC"
export function getInitials(name: string) {
  const words = name.trim().split(/\s+/);
  return `${words[0][0]}${words.length > 1 ? words[words.length - 1][0] : ''}`.toUpperCase();
}
