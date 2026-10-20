import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate } from '@tanstack/react-router';
import { Info, Shield, Swords } from 'lucide-react';
import { Controller, useForm, useWatch } from 'react-hook-form';
import { toast } from 'sonner';
import { FormField } from '@/components/form-field';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useClubsQueries } from '@/modules/clubes/hooks/useClubsQueries';
import type { Club } from '@/modules/clubes/types/clubs.types';
import { useMatchesQueries } from '../hooks/useMatchesQueries';
import { newMatchSchema, type NewMatchValues } from '../schemas/matches.schema';

export function NewMatchDialog({ onClose }: { onClose: () => void }) {
  const navigate = useNavigate();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(newMatchSchema),
    defaultValues: { homeClubId: '', awayClubId: '' },
  });

  const { useGetClubs } = useClubsQueries();
  const { data: clubs = [] } = useGetClubs();

  const homeClubId = useWatch({ control, name: 'homeClubId' });
  const awayClubId = useWatch({ control, name: 'awayClubId' });
  const homeOptions = clubs.filter((club) => String(club.id) !== awayClubId);
  const awayOptions = clubs.filter((club) => String(club.id) !== homeClubId);

  const { useCreateMatch } = useMatchesQueries();
  const { mutate, isPending } = useCreateMatch();

  function onSubmit(values: NewMatchValues) {
    mutate(
      {
        home_club_id: Number(values.homeClubId),
        away_club_id: Number(values.awayClubId),
      },
      {
        onSuccess: (match) => {
          const { home, away } = match;
          toast.success('Partida jogada', {
            description: `${home.club_name} ${home.goals} × ${away.goals} ${away.club_name}.`,
          });
          onClose();
          navigate({
            to: '/matches/$matchId',
            params: { matchId: String(match.id) },
          });
        },
      },
    );
  }

  return (
    <Dialog open onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="gap-6 p-8 sm:max-w-[520px]">
        <DialogHeader>
          <DialogTitle className="text-xl">Nova partida</DialogTitle>
          <DialogDescription>
            Escolha o mandante e o visitante. O placar sai dos atributos dos
            titulares, sem sorteio.
          </DialogDescription>
        </DialogHeader>

        <form
          id="new-match-form"
          noValidate
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-6"
        >
          <FormField
            label="Mandante"
            htmlFor="match-home"
            error={errors.homeClubId?.message}
            description="Faz os 3 primeiros ataques."
          >
            <Controller
              control={control}
              name="homeClubId"
              render={({ field }) => (
                <ClubSelect
                  id="match-home"
                  clubs={homeOptions}
                  value={field.value}
                  invalid={!!errors.homeClubId}
                  onChange={field.onChange}
                />
              )}
            />
          </FormField>

          <FormField
            label="Visitante"
            htmlFor="match-away"
            error={errors.awayClubId?.message}
            description="Precisa ser um clube diferente do mandante."
          >
            <Controller
              control={control}
              name="awayClubId"
              render={({ field }) => (
                <ClubSelect
                  id="match-away"
                  clubs={awayOptions}
                  value={field.value}
                  invalid={!!errors.awayClubId}
                  onChange={field.onChange}
                />
              )}
            />
          </FormField>
        </form>

        <div className="space-y-2 rounded-lg border border-zinc-200 bg-zinc-50 p-4 text-sm text-zinc-600">
          <p className="flex items-center gap-2 font-medium text-zinc-900">
            <Info className="size-4 text-zinc-500" />
            Como sai o placar
          </p>
          <p>
            Cada time faz 3 ataques. Pela ordem do elenco, os jogadores de linha
            vão do 1º (o mais recuado) ao 4º (o mais avançado): o 4º enfrenta o
            goleiro, o 3º enfrenta o 1º e o 2º enfrenta o 2º do adversário. O
            atacante usa finalização (ATA), passe (MEI) ou drible (ZAG e LAT), e
            quem defende usa defesa. É gol só quando o ataque é maior; mal
            condicionado joga com 15% a menos.
          </p>
          <p>
            Os dois clubes precisam ter os 5 titulares escalados. A partida não
            mexe no caixa.
          </p>
        </div>

        <DialogFooter className="mx-0 mb-0 rounded-none border-t border-zinc-200 bg-transparent px-0 pt-5 pb-0">
          <Button type="button" variant="outline" onClick={onClose}>
            Cancelar
          </Button>
          <Button type="submit" form="new-match-form" disabled={isPending}>
            <Swords />
            Jogar partida
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function ClubSelect({
  id,
  clubs,
  value,
  invalid,
  onChange,
}: {
  id: string;
  clubs: Club[];
  value: string;
  invalid: boolean;
  onChange: (value: string) => void;
}) {
  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger
        id={id}
        aria-invalid={invalid}
        className="w-full justify-start [&>svg:last-child]:ml-auto"
      >
        <Shield className="text-zinc-400" />
        <SelectValue placeholder="Escolha o clube" />
      </SelectTrigger>
      <SelectContent position="popper">
        {clubs.map((club) => (
          <SelectItem key={club.id} value={String(club.id)}>
            {club.name} ({club.acronym})
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
