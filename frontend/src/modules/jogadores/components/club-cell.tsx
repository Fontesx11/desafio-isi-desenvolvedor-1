import { Badge } from '@/components/ui/badge';
import { findClub } from '../utils/players.utils';

export function ClubCell({ clubId }: { clubId: number | null }) {
  const club = findClub(clubId);

  if (!club) {
    return <Badge variant="secondary">Livre</Badge>;
  }

  return (
    <span className="flex items-center gap-2">
      <Badge variant="secondary" className="font-medium">
        {club.acronym}
      </Badge>
      <span className="underline underline-offset-2">{club.name}</span>
    </span>
  );
}
