import { cn } from 'cn';
import { Check } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

export function PenaltyBadge({ rate }: { rate: number }) {
  return (
    <Badge
      variant="outline"
      className={cn(
        'gap-1',
        rate === 0 && 'border-green-200 bg-green-50 text-green-700',
        rate > 0 && rate < 20 && 'border-amber-200 bg-amber-50 text-amber-700',
        rate >= 20 && 'border-red-200 bg-red-50 text-red-700',
      )}
    >
      {rate === 0 && <Check />}
      {rate}%
    </Badge>
  );
}
