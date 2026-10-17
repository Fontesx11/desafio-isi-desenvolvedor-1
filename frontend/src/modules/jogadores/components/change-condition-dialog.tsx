import { zodResolver } from '@hookform/resolvers/zod';
import { cn } from 'cn';
import { Lock } from 'lucide-react';
import { Controller, useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { FormField } from '@/components/form-field';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import {
  CONDITION_DESCRIPTIONS,
  CONDITION_LABELS,
  CONDITIONS,
} from '../constants/players.constants';
import {
  changeConditionSchema,
  type ChangeConditionValues,
} from '../schemas/players.schema';
import type { Player } from '../types/players.types';
import { usePlayersQueries } from '../hooks/usePlayersQueries';
import { ConditionBadge } from './condition-badge';
import { PlayerSummaryCard } from './player-summary-card';

type ChangeConditionDialogProps = {
  player: Player;
  onClose: () => void;
};

export function ChangeConditionDialog({
  player,
  onClose,
}: ChangeConditionDialogProps) {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: zodResolver(changeConditionSchema) });

  const { useUpdatePlayerCondition } = usePlayersQueries();

  const { mutate, isPending } = useUpdatePlayerCondition();

  function onSubmit(values: ChangeConditionValues) {
    mutate(
      { id: player.id, data: values },
      {
        onSuccess: () => {
          toast.success('Condição alterada', {
            description: `${player.name} agora está ${CONDITION_LABELS[values.condition]}.`,
          });
          onClose();
        },
      },
    );
  }

  return (
    <Dialog open onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="gap-5 p-8 sm:max-w-[520px]">
        <DialogHeader>
          <DialogTitle className="text-xl">Alterar condição física</DialogTitle>
          <DialogDescription>
            A condição muda o desconto do valor de mercado, recalculado ao
            salvar.
          </DialogDescription>
        </DialogHeader>

        <PlayerSummaryCard
          player={player}
          aside={<ConditionBadge condition={player.condition} />}
        />

        <form
          id="change-condition-form"
          noValidate
          onSubmit={handleSubmit(onSubmit)}
        >
          <FormField error={errors.condition?.message}>
            <Controller
              control={control}
              name="condition"
              render={({ field }) => (
                <RadioGroup
                  value={field.value ?? ''}
                  onValueChange={field.onChange}
                  aria-label="Nova condição"
                  className="gap-3"
                >
                  {CONDITIONS.map((condition) => {
                    const isBlocked =
                      condition === 'APTO' && player.condition === 'DOENTE';

                    return (
                      <Label
                        key={condition}
                        htmlFor={`condition-${condition}`}
                        className={cn(
                          'flex items-start gap-3 rounded-xl border border-zinc-200 p-4 font-normal has-data-[state=checked]:border-primary has-data-[state=checked]:bg-blue-50',
                          isBlocked && 'text-zinc-400',
                        )}
                      >
                        <RadioGroupItem
                          id={`condition-${condition}`}
                          value={condition}
                          disabled={isBlocked}
                          className="mt-0.5"
                        />
                        <span className="grid gap-1">
                          <span className="flex items-center gap-2 font-medium">
                            {CONDITION_LABELS[condition]}
                            {condition === player.condition && (
                              <Badge variant="secondary">Atual</Badge>
                            )}
                          </span>
                          <span className="text-sm leading-snug text-zinc-500">
                            {CONDITION_DESCRIPTIONS[condition]}
                          </span>
                          {isBlocked && (
                            <span className="flex items-center gap-1.5 text-sm text-zinc-500">
                              <Lock className="size-3.5" />
                              De Doente não passa direto para Apto.
                            </span>
                          )}
                        </span>
                      </Label>
                    );
                  })}
                </RadioGroup>
              )}
            />
          </FormField>
        </form>

        <DialogFooter className="mx-0 mb-0 rounded-none bg-transparent px-0 pt-5 pb-0">
          <Button type="button" variant="outline" onClick={onClose}>
            Cancelar
          </Button>
          <Button
            type="submit"
            form="change-condition-form"
            disabled={isPending}
          >
            Salvar condição
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
