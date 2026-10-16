import { cn } from 'cn';
import { formatSignedCurrency } from '@/lib/format';

type SignedValueProps = {
  value: number;
  className?: string;
};

export function SignedValue({ value, className }: SignedValueProps) {
  return (
    <span
      className={cn(
        value > 0 && 'text-green-700',
        value < 0 && 'text-red-600',
        className,
      )}
    >
      {formatSignedCurrency(value)}
    </span>
  );
}
