import { cn } from 'cn';
import { Badge } from '@/components/ui/badge';
import { CONDITION_LABELS } from '../constants/players.constants';
import type { PlayerCondition } from '../types/players.types';

const STYLES: Record<PlayerCondition, string> = {
  APTO: 'border-green-200 bg-green-50 text-green-700',
  MAL_CONDICIONADO: 'border-amber-200 bg-amber-50 text-amber-700',
  DOENTE: 'border-red-200 bg-red-50 text-red-700',
};

export function ConditionBadge({ condition }: { condition: PlayerCondition }) {
  return (
    <Badge variant="outline" className={cn('gap-1.5', STYLES[condition])}>
      <span className="size-1.5 rounded-full bg-current" />
      {CONDITION_LABELS[condition]}
    </Badge>
  );
}
