import { Badge } from '@/components/ui/badge';
import { useClubsQueries } from '@/modules/clubes/hooks/useClubsQueries';

export function ClubCell({ clubId }: { clubId: number | null }) {
  const { useGetClubs } = useClubsQueries();
  const { data: clubs } = useGetClubs();
  const club = clubs?.find((item) => item.id === clubId);

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
