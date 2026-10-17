import { ChevronDown, type LucideIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

const ALL = 'all';

type FilterMenuProps<T extends string> = {
  icon: LucideIcon;
  label: string;
  options: { value: T; label: string }[];
  value: T | undefined;
  onChange: (value: T | undefined) => void;
};

export function FilterMenu<T extends string>({
  icon: Icon,
  label,
  options,
  value,
  onChange,
}: FilterMenuProps<T>) {
  const selected = options.find((option) => option.value === value);

  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger asChild>
        <Button
          type="button"
          variant="outline"
          className="h-9 gap-2 font-normal"
        >
          <Icon className="text-zinc-500" />
          {selected ? `${label}: ${selected.label}` : label}
          <ChevronDown className="text-zinc-400" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-48">
        <DropdownMenuRadioGroup
          value={value ?? ALL}
          onValueChange={(next) =>
            onChange(next === ALL ? undefined : (next as T))
          }
        >
          <DropdownMenuRadioItem value={ALL}>Todas</DropdownMenuRadioItem>
          {options.map((option) => (
            <DropdownMenuRadioItem key={option.value} value={option.value}>
              {option.label}
            </DropdownMenuRadioItem>
          ))}
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
