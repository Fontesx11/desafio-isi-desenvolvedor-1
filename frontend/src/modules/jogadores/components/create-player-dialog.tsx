import { zodResolver } from '@hookform/resolvers/zod';
import { ChartColumn, Info, User } from 'lucide-react';
import { Controller, useForm, useWatch, type Control } from 'react-hook-form';
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
import { Separator } from '@/components/ui/separator';
import { ATTRIBUTES } from '../constants/players.constants';
import { CREATED_PLAYER_MOCK } from '../mocks/players.mock';
import {
  attributesSchema,
  createPlayerSchema,
  type CreatePlayerValues,
} from '../schemas/players.schema';
import type { Player } from '../types/players.types';
import { AttributeBars } from './attribute-bars';
import { LockedValue } from './locked-value';
import { PositionPicker } from './position-picker';

type CreatePlayerDialogProps = {
  onClose: () => void;
  onCreated: (player: Player) => void;
};

export function CreatePlayerDialog({
  onClose,
  onCreated,
}: CreatePlayerDialogProps) {
  const {
    control,
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(createPlayerSchema),
    defaultValues: { name: '' },
  });
  const hasErrors = Object.keys(errors).length > 0;

  // Sem a API, o resultado usa os valores calculados do mockup
  function onSubmit(values: CreatePlayerValues) {
    onCreated({ ...CREATED_PLAYER_MOCK, ...values });
  }

  return (
    <Dialog open onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-h-[calc(100svh-2rem)] gap-6 overflow-y-auto p-8 sm:max-w-[860px]">
        <DialogHeader>
          <DialogTitle className="text-xl">Novo jogador</DialogTitle>
          <DialogDescription>
            {hasErrors
              ? 'Corrija os campos destacados para salvar.'
              : 'Preencha os dados e os indicadores técnicos. O valor base, o overall e o valor de mercado são calculados ao salvar.'}
          </DialogDescription>
        </DialogHeader>

        <form
          id="create-player-form"
          noValidate
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-5"
        >
          <FormField
            label="Nome"
            htmlFor="player-name"
            error={errors.name?.message}
            description="De 3 a 100 caracteres, com pelo menos duas palavras e sem números."
          >
            <InputWithIcon
              id="player-name"
              icon={User}
              aria-invalid={!!errors.name}
              {...register('name')}
            />
          </FormField>

          <FormField label="Posição" error={errors.position?.message}>
            <Controller
              control={control}
              name="position"
              render={({ field }) => (
                <PositionPicker
                  value={field.value}
                  onChange={field.onChange}
                  invalid={!!errors.position}
                />
              )}
            />
          </FormField>

          <div className="grid grid-cols-3 gap-4">
            <FormField
              label="Idade"
              htmlFor="player-age"
              error={errors.age?.message}
              description="De 16 a 45 anos."
            >
              <Input
                id="player-age"
                type="number"
                aria-invalid={!!errors.age}
                {...register('age', { valueAsNumber: true })}
              />
            </FormField>
            <FormField
              label="Agilidade"
              htmlFor="player-agility"
              error={errors.agility?.message}
              description="De 1 a 100 (até 85 com 35 anos ou mais)."
            >
              <Input
                id="player-agility"
                type="number"
                aria-invalid={!!errors.agility}
                {...register('agility', { valueAsNumber: true })}
              />
            </FormField>
            <FormField
              label={<span className="text-zinc-500">Valor base (moedas)</span>}
              description="Calculado no cadastro."
            >
              <LockedValue />
            </FormField>
          </div>

          <Separator />

          <div>
            <h3 className="font-semibold">Indicadores técnicos</h3>
            <p className="text-sm text-zinc-500">
              Seis atributos e o potencial, de 1 a 99. Não mudam depois do
              cadastro; a soma dos seis atributos não pode passar de 480.
            </p>
          </div>

          <div className="grid grid-cols-[1fr_15rem] gap-6">
            <div className="grid grid-cols-4 content-start gap-4">
              {ATTRIBUTES.map(({ key, label }) => (
                <FormField
                  key={key}
                  label={label}
                  htmlFor={`player-${key}`}
                  error={errors[key]?.message}
                >
                  <Input
                    id={`player-${key}`}
                    type="number"
                    aria-invalid={!!errors[key]}
                    {...register(key, { valueAsNumber: true })}
                  />
                </FormField>
              ))}
              <FormField
                label="Potencial"
                htmlFor="player-potential"
                error={errors.potential?.message}
                description="≥ maior atributo; igual a ele com 33+ anos"
              >
                <Input
                  id="player-potential"
                  type="number"
                  aria-invalid={!!errors.potential}
                  {...register('potential', { valueAsNumber: true })}
                />
              </FormField>
              <FormField
                label={<span className="text-zinc-500">Overall</span>}
                description="Calculado automaticamente"
              >
                <LockedValue />
              </FormField>
            </div>
            <AttributesPreview control={control} />
          </div>
        </form>

        <DialogFooter className="mx-0 mb-0 rounded-none bg-transparent px-0 pt-5 pb-0 items-center sm:justify-between">
          <p className="flex items-center gap-2 text-sm text-zinc-500">
            <Info className="size-4" />O jogador começa livre e Apto.
          </p>
          <div className="flex gap-2">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button type="submit" form="create-player-form">
              Salvar jogador
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// Desenha só o que foi digitado; não calcula overall nem valor base
function AttributesPreview({
  control,
}: {
  control: Control<CreatePlayerValues>;
}) {
  const values = useWatch({ control });
  const preview = attributesSchema.safeParse(values);

  return (
    <aside className="space-y-3 rounded-xl border border-zinc-200 bg-zinc-50 p-4">
      <p className="flex items-center gap-2 text-sm font-medium text-zinc-600">
        <ChartColumn className="size-4" />
        Prévia dos atributos
      </p>
      {preview.success ? (
        <>
          <AttributeBars
            attributes={preview.data}
            potential={preview.data.potential}
            compact
          />
          <p className="text-xs text-zinc-500">
            Faixa clara: até o potencial ({preview.data.potential}). A prévia só
            desenha os valores digitados; não calcula overall nem valor base.
          </p>
        </>
      ) : (
        <p className="py-8 text-center text-sm text-zinc-500">
          Preencha os seis atributos e o potencial, de 1 a 99, para ver a
          prévia.
        </p>
      )}
    </aside>
  );
}
