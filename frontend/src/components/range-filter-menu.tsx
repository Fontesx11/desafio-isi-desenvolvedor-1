import { ChevronDown, type LucideIcon } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export type Range = { min: number; max: number };

type RangeFilterMenuProps = {
  icon: LucideIcon;
  label: string;
  bounds: Range;
  step?: number;
  value: Range | undefined;
  onChange: (value: Range | undefined) => void;
  formatValue?: (value: number) => string;
};

export function RangeFilterMenu({
  icon: Icon,
  label,
  bounds,
  step = 1,
  value,
  onChange,
  formatValue = String,
}: RangeFilterMenuProps) {
  const [open, setOpen] = useState(false);
  const [min, setMin] = useState('');
  const [max, setMax] = useState('');

  function handleOpenChange(next: boolean) {
    if (next) {
      setMin(String(value?.min ?? bounds.min));
      setMax(String(value?.max ?? bounds.max));
    }
    setOpen(next);
  }

  const minNumber = Number(min);
  const maxNumber = Number(max);
  const error =
    min === '' || max === ''
      ? 'Informe o mínimo e o máximo.'
      : minNumber < bounds.min || maxNumber > bounds.max
        ? `Use valores de ${formatValue(bounds.min)} a ${formatValue(bounds.max)}.`
        : minNumber > maxNumber
          ? 'O mínimo não pode ser maior que o máximo.'
          : null;

  function apply() {
    onChange({ min: minNumber, max: maxNumber });
    setOpen(false);
  }

  function clear() {
    onChange(undefined);
    setOpen(false);
  }

  return (
    <DropdownMenu modal={false} open={open} onOpenChange={handleOpenChange}>
      <DropdownMenuTrigger asChild>
        <Button
          type="button"
          variant="outline"
          className="h-9 gap-2 font-normal"
        >
          <Icon className="text-zinc-500" />
          {value
            ? `${label}: ${formatValue(value.min)} a ${formatValue(value.max)}`
            : label}
          <ChevronDown className="text-zinc-400" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="start"
        className="w-64 space-y-3 p-3"
        onKeyDown={(event) => event.stopPropagation()}
      >
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1.5">
            <Label htmlFor={`${label}-min`}>Mínimo</Label>
            <Input
              id={`${label}-min`}
              type="number"
              step={step}
              value={min}
              onChange={(event) => setMin(event.target.value)}
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor={`${label}-max`}>Máximo</Label>
            <Input
              id={`${label}-max`}
              type="number"
              step={step}
              value={max}
              onChange={(event) => setMax(event.target.value)}
            />
          </div>
        </div>
        {error && <p className="text-sm text-red-600">{error}</p>}
        <div className="flex justify-between gap-2">
          <Button type="button" variant="ghost" size="sm" onClick={clear}>
            Limpar
          </Button>
          <Button type="button" size="sm" disabled={!!error} onClick={apply}>
            Aplicar
          </Button>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
