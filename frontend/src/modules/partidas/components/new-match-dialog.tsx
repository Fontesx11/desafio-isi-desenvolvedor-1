import { useNavigate } from '@tanstack/react-router';
import { Info, Shield, Swords } from 'lucide-react';
import { useState } from 'react';
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
import { CLUBS_MOCK } from '@/modules/clubes/mocks/clubs.mock';
import { PLAYED_MATCH_MOCK } from '../mocks/matches.mock';

export function NewMatchDialog({ onClose }: { onClose: () => void }) {
  const navigate = useNavigate();
  const [homeClubId, setHomeClubId] = useState('');
  const [awayClubId, setAwayClubId] = useState('');

  // simulacao
  function handlePlay() {
    const { home, away } = PLAYED_MATCH_MOCK;
    toast.success('Partida jogada', {
      description: `${home.club_name} ${home.goals} × ${away.goals} ${away.club_name}. Placar e duelos devolvidos pela API.`,
    });
    onClose();
    navigate({
      to: '/matches/$matchId',
      params: { matchId: String(PLAYED_MATCH_MOCK.id) },
    });
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

        <FormField
          label="Mandante"
          htmlFor="match-home"
          description="Faz os 3 primeiros ataques."
        >
          <ClubSelect
            id="match-home"
            value={homeClubId}
            onChange={setHomeClubId}
          />
        </FormField>

        <FormField
          label="Visitante"
          htmlFor="match-away"
          description="Precisa ser um clube diferente do mandante."
        >
          <ClubSelect
            id="match-away"
            value={awayClubId}
            onChange={setAwayClubId}
          />
        </FormField>

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
          <Button type="button" onClick={handlePlay}>
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
  value,
  onChange,
}: {
  id: string;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger
        id={id}
        className="w-full justify-start [&>svg:last-child]:ml-auto"
      >
        <Shield className="text-zinc-400" />
        <SelectValue placeholder="Escolha o clube" />
      </SelectTrigger>
      <SelectContent>
        {CLUBS_MOCK.map((club) => (
          <SelectItem key={club.id} value={String(club.id)}>
            {club.name} ({club.acronym})
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
