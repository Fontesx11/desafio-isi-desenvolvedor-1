import { cn } from 'cn';
import { ATTRIBUTES } from '../constants/players.constants';
import type { PlayerAttributes } from '../types/players.types';

type AttributeBarsProps = {
  attributes: PlayerAttributes;
  potential: number;
  // Versão estreita, para a prévia do cadastro
  compact?: boolean;
};

// Escala de 1 a 99: a barra escura é o atributo; a clara vai até o potencial
export function AttributeBars({
  attributes,
  potential,
  compact,
}: AttributeBarsProps) {
  return (
    <ul className="space-y-2.5">
      {ATTRIBUTES.map(({ key, label }) => (
        <li
          key={key}
          className={cn(
            'grid items-center gap-3',
            compact
              ? 'grid-cols-[4.5rem_1fr_1.5rem] gap-2 text-xs'
              : 'grid-cols-[6.5rem_1fr_2rem] text-sm',
          )}
        >
          <span className="text-zinc-600">{label}</span>
          <span className="relative h-2 rounded-full bg-zinc-100">
            <span
              className="absolute inset-y-0 left-0 rounded-full bg-blue-200"
              style={{ width: `${(potential / 99) * 100}%` }}
            />
            <span
              className="absolute inset-y-0 left-0 rounded-full bg-primary"
              style={{ width: `${(attributes[key] / 99) * 100}%` }}
            />
          </span>
          <span className="text-right font-medium tabular-nums">
            {attributes[key]}
          </span>
        </li>
      ))}
    </ul>
  );
}
