import { cn } from 'cn';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { FORMATIONS } from '../constants/clubs.constants';
import type { Formation } from '../types/clubs.types';

type FormationPickerProps = {
  value: Formation | null;
  onChange: (value: Formation) => void;
};

export function FormationPicker({ value, onChange }: FormationPickerProps) {
  return (
    <RadioGroup
      value={value ?? ''}
      onValueChange={(next) => onChange(next as Formation)}
      className="grid grid-cols-4 gap-3"
    >
      {FORMATIONS.map((formation) => (
        <Label
          key={formation.value}
          htmlFor={`formation-${formation.value}`}
          className={cn(
            'flex cursor-pointer flex-col items-start gap-1 rounded-xl border border-zinc-200 p-3 font-normal',
            value === formation.value && 'border-primary bg-blue-50',
          )}
        >
          <span className="flex items-center gap-2 font-semibold">
            <RadioGroupItem
              id={`formation-${formation.value}`}
              value={formation.value}
            />
            {formation.value}
          </span>
          <span className="text-xs text-zinc-500">{formation.description}</span>
        </Label>
      ))}
    </RadioGroup>
  );
}
