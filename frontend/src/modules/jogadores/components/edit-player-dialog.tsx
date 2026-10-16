import { zodResolver } from '@hookform/resolvers/zod';
import { Lock, User } from 'lucide-react';
import { Controller, useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { FormField } from '@/components/form-field';
import { InputWithIcon } from '@/components/input-with-icon';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { formatCurrency } from '@/lib/format';
import {
  editPlayerSchema,
  type EditPlayerValues,
} from '../schemas/players.schema';
import type { Player } from '../types/players.types';
import { PositionPicker } from './position-picker';

type EditPlayerDialogProps = {
  player: Player;
  onClose: () => void;
};

export function EditPlayerDialog({ player, onClose }: EditPlayerDialogProps) {
  const hasClub = player.club_id !== null;
  const {
    control,
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(editPlayerSchema(player.age)),
    defaultValues: {
      name: player.name,
      position: player.position,
      age: player.age,
      agility: player.agility,
    },
  });

  // Sem a API por enquanto: só confirma na tela
  function onSubmit(values: EditPlayerValues) {
    toast.success('Jogador atualizado', {
      description: `Os dados de ${values.name} foram salvos.`,
    });
    onClose();
  }

  return (
    <Dialog open onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="gap-6 p-8 sm:max-w-[560px]">
        <DialogHeader>
          <DialogTitle className="text-xl">Editar jogador</DialogTitle>
          <DialogDescription>
            Edite nome, posição, idade e agilidade. Os demais dados não mudam.
          </DialogDescription>
        </DialogHeader>

        <form
          id="edit-player-form"
          noValidate
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-5"
        >
          <FormField
            label="Nome"
            htmlFor="edit-player-name"
            error={errors.name?.message}
            description="De 3 a 100 caracteres, com pelo menos duas palavras e sem números."
          >
            <InputWithIcon
              id="edit-player-name"
              icon={User}
              aria-invalid={!!errors.name}
              {...register('name')}
            />
          </FormField>

          <FormField
            label="Posição"
            error={errors.position?.message}
            description={
              hasClub &&
              'Jogador com clube não muda de posição: as outras posições ficam desabilitadas.'
            }
          >
            <Controller
              control={control}
              name="position"
              render={({ field }) => (
                <PositionPicker
                  value={field.value}
                  onChange={field.onChange}
                  lockedTo={hasClub ? player.position : undefined}
                  invalid={!!errors.position}
                />
              )}
            />
          </FormField>

          <div className="grid grid-cols-2 gap-4">
            <FormField
              label="Idade"
              htmlFor="edit-player-age"
              error={errors.age?.message}
              description={`De 16 a 45, sem diminuir (atual: ${player.age}).`}
            >
              <Input
                id="edit-player-age"
                type="number"
                aria-invalid={!!errors.age}
                {...register('age', { valueAsNumber: true })}
              />
            </FormField>
            <FormField
              label="Agilidade"
              htmlFor="edit-player-agility"
              error={errors.agility?.message}
              description="De 1 a 100 (até 85 com 35 anos ou mais)."
            >
              <Input
                id="edit-player-agility"
                type="number"
                aria-invalid={!!errors.agility}
                {...register('agility', { valueAsNumber: true })}
              />
            </FormField>
          </div>

          <p className="flex items-center gap-2 rounded-lg border border-dashed border-zinc-200 px-3 py-2.5 text-sm text-zinc-500">
            <Lock className="size-3.5 shrink-0" />
            Não mudam depois do cadastro: valor base (
            {formatCurrency(player.base_value)}), indicadores e potencial.
          </p>
        </form>

        <DialogFooter className="mx-0 mb-0 rounded-none bg-transparent px-0 pt-5 pb-0">
          <Button type="button" variant="outline" onClick={onClose}>
            Cancelar
          </Button>
          <Button type="submit" form="edit-player-form">
            Salvar alterações
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
