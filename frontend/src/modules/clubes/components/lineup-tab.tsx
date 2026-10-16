import { Check } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { findLineupMock } from '../mocks/clubs.mock';
import type { ClubDetails } from '../types/clubs.types';
import { FormationPicker } from './formation-picker';
import { LineupBench } from './lineup-bench';
import { LineupSlotsTable } from './lineup-slots-table';

export function LineupTab({ club }: { club: ClubDetails }) {
  // simulacao
  // Escalação, vagas e reservas vêm prontos dos dados fixos
  const [lineup] = useState(() => findLineupMock(club.id));
  const [formation, setFormation] = useState(lineup.formation);
  const [selectedIds, setSelectedIds] = useState(
    lineup.slots.map((slot) => slot.playerId),
  );

  function selectPlayer(index: number, playerId: number) {
    setSelectedIds((current) =>
      current.map((id, slot) => (slot === index ? playerId : id)),
    );
  }

  // simulacao
  // Só mostra o aviso; não envia nada
  function handleSave() {
    toast.success('Escalação salva', {
      description: `${club.name} na ${formation}, com os 5 titulares devolvidos pela API.`,
    });
  }

  return (
    <div className="grid grid-cols-[1fr_20rem] items-start gap-4">
      <section className="overflow-hidden rounded-xl border border-zinc-200">
        <div className="p-4">
          <h2 className="font-semibold">Titulares</h2>
          <p className="text-sm text-zinc-500">
            1 goleiro e 4 jogadores de linha, na formação escolhida. Salvar
            troca os 5 de uma vez.
          </p>
        </div>

        <div className="space-y-4 border-t border-zinc-200 p-4">
          <div>
            <h3 className="font-medium">Formação</h3>
            <p className="text-sm text-zinc-500">
              Os números contam os jogadores de linha de trás para frente. O
              goleiro fica fora da conta.
            </p>
          </div>
          <FormationPicker value={formation} onChange={setFormation} />
        </div>

        <LineupSlotsTable
          slots={lineup.slots}
          squad={club.players}
          selectedIds={selectedIds}
          onSelect={selectPlayer}
        />

        <div className="flex items-center gap-4 border-t border-zinc-200 p-4">
          <p className="flex-1 text-xs text-zinc-500">
            A escalação vale até ser trocada. Titular vendido ou que fica doente
            sai dela, e o clube só volta a jogar depois de escalar de novo.
          </p>
          {/* simulacao: Cancelar sem ação */}
          <Button type="button" variant="outline">
            Cancelar
          </Button>
          <Button type="button" onClick={handleSave}>
            <Check />
            Salvar escalação
          </Button>
        </div>
      </section>

      <LineupBench players={lineup.bench} />
    </div>
  );
}
