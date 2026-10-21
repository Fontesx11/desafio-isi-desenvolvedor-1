import { zodResolver } from '@hookform/resolvers/zod';
import { Shield, Wallet } from 'lucide-react';
import { useForm } from 'react-hook-form';
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
import { useClubsQueries } from '../hooks/useClubsQueries';
import {
  createClubSchema,
  type CreateClubValues,
} from '../schemas/clubs.schema';
import type { Club } from '../types/clubs.types';

type CreateClubDialogProps = {
  onClose: () => void;
  onCreated: (club: Club) => void;
};

export function CreateClubDialog({
  onClose,
  onCreated,
}: CreateClubDialogProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(createClubSchema),
    defaultValues: { name: '', acronym: '' },
  });

  const { useCreateClub } = useClubsQueries();
  const { mutate, isPending } = useCreateClub();

  function onSubmit(values: CreateClubValues) {
    mutate(values, { onSuccess: onCreated });
  }

  return (
    <Dialog open onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="gap-6 p-8 sm:max-w-[480px]">
        <DialogHeader>
          <DialogTitle className="text-xl">Novo clube</DialogTitle>
          <DialogDescription>
            Informe o nome e a sigla do clube.
          </DialogDescription>
        </DialogHeader>

        <form
          id="create-club-form"
          noValidate
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-5"
        >
          <FormField
            label="Nome"
            htmlFor="club-name"
            error={errors.name?.message}
            description="De 3 a 60 caracteres e de 2 a 5 palavras; só letras, espaços, hífen e ponto. Não pode repetir outro clube."
          >
            <InputWithIcon
              id="club-name"
              icon={Shield}
              aria-invalid={!!errors.name}
              {...register('name')}
            />
          </FormField>

          <FormField
            label="Sigla"
            htmlFor="club-acronym"
            error={errors.acronym?.message}
            description="3 letras de A a Z, maiúsculas, que aparecem no nome nessa ordem; a primeira é a primeira letra do nome, e as três não podem ser todas iguais."
          >
            <Input
              id="club-acronym"
              aria-invalid={!!errors.acronym}
              {...register('acronym')}
            />
          </FormField>

          <p className="flex items-center gap-2 rounded-lg border border-zinc-200 bg-zinc-50 px-3 py-2.5 text-sm text-zinc-600">
            <Wallet className="size-4 shrink-0 text-zinc-500" />O clube começa
            com 300,00 em caixa e sem jogadores.
          </p>
        </form>

        <DialogFooter className="mx-0 mb-0 rounded-none border-t border-zinc-200 bg-transparent px-0 pt-5 pb-0">
          <Button type="button" variant="outline" onClick={onClose}>
            Cancelar
          </Button>
          <Button type="submit" form="create-club-form" disabled={isPending}>
            Criar clube
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
