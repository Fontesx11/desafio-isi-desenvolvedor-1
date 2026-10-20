import { zodResolver } from '@hookform/resolvers/zod';
import { Check, CircleCheck, TriangleAlert } from 'lucide-react';
import { useForm, useWatch } from 'react-hook-form';
import { FormField } from '@/components/form-field';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import type { Lineup, SaveLineup } from '@/modules/liga/types/league.types';
import { lineupSchema, type LineupValues } from '../schemas/clubs.schema';
import type { ClubDetails, Formation } from '../types/clubs.types';
import { getFormationSlots, toLineupFormValues } from '../utils/lineup.utils';
import { FormationPicker } from './formation-picker';
import { LineupSlotsTable } from './lineup-slots-table';

type LineupFormProps = {
  club: ClubDetails;
  lineup: Lineup;
  isSaving: boolean;
  onSave: (data: SaveLineup) => void;
};

export function LineupForm({
  club,
  lineup,
  isSaving,
  onSave,
}: LineupFormProps) {
  const {
    control,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useForm<LineupValues>({
    resolver: zodResolver(lineupSchema),
    defaultValues: toLineupFormValues(lineup),
  });
  const formation = useWatch({ control, name: 'formation' });
  const selectedIds = useWatch({ control, name: 'player_ids' });

  function changeFormation(next: Formation) {
    setValue('formation', next, { shouldValidate: true });
    setValue('player_ids', [selectedIds[0], '', '', '', '']);
  }

  function onSubmit(values: LineupValues) {
    onSave({
      formation: values.formation,
      player_ids: values.player_ids.map(Number),
    });
  }

  return (
    <form
      noValidate
      onSubmit={handleSubmit(onSubmit)}
      className="overflow-hidden rounded-xl border border-zinc-200"
    >
      <div className="flex items-start justify-between gap-4 p-4">
        <div>
          <h2 className="font-semibold">Titulares</h2>
          <p className="text-sm text-zinc-500">
            1 goleiro e 4 jogadores de linha, na formação escolhida. Salvar
            troca os 5 de uma vez.
          </p>
        </div>
        {lineup.complete ? (
          <Badge
            variant="outline"
            className="border-green-200 bg-green-50 text-green-700"
          >
            <CircleCheck />
            Completa
          </Badge>
        ) : (
          <Badge
            variant="outline"
            className="border-amber-200 bg-amber-50 text-amber-700"
          >
            <TriangleAlert />
            Incompleta
          </Badge>
        )}
      </div>

      <div className="space-y-4 border-t border-zinc-200 p-4">
        {!lineup.complete && (
          <p className="flex items-start gap-2 rounded-lg border border-amber-200 bg-amber-50 px-3 py-2.5 text-sm text-amber-800">
            <TriangleAlert className="mt-0.5 size-4 shrink-0" />
            Escalação incompleta: o {club.name} não pode jogar partidas até
            salvar os 5 titulares.
          </p>
        )}
        <div>
          <h3 className="font-medium">Formação</h3>
          <p className="text-sm text-zinc-500">
            Os números contam os jogadores de linha de trás para frente. O
            goleiro fica fora da conta.
          </p>
        </div>
        <FormField error={errors.formation?.message}>
          <FormationPicker
            value={formation ?? null}
            onChange={changeFormation}
          />
        </FormField>
      </div>

      <LineupSlotsTable
        slots={getFormationSlots(formation)}
        squad={club.players}
        selectedIds={selectedIds}
        control={control}
        errors={errors}
      />

      <div className="flex items-center gap-4 border-t border-zinc-200 p-4">
        <p className="flex-1 text-xs text-zinc-500">
          A escalação vale até ser trocada. Titular vendido ou que fica doente
          sai dela, e o clube só volta a jogar depois de escalar de novo.
        </p>
        <Button type="button" variant="outline" onClick={() => reset()}>
          Cancelar
        </Button>
        <Button type="submit" disabled={isSaving}>
          <Check />
          Salvar escalação
        </Button>
      </div>
    </form>
  );
}
