import { Badge } from '@/components/ui/badge';
import { useClubsQueries } from '@/modules/clubes/hooks/useClubsQueries';

export function ClubAcronymBadge({ clubId }: { clubId: number }) {
  const { useGetClubs } = useClubsQueries();
  const { data: clubs } = useGetClubs();
  const club = clubs?.find((item) => item.id === clubId);

  return <Badge variant="secondary">{club?.acronym}</Badge>;
}
