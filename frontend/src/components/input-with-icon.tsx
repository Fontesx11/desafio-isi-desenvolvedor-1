import { cn } from 'cn';
import type { LucideIcon } from 'lucide-react';
import type { ComponentProps } from 'react';
import { Input } from '@/components/ui/input';

type InputWithIconProps = ComponentProps<typeof Input> & {
  icon: LucideIcon;
};

export function InputWithIcon({
  icon: Icon,
  className,
  ...props
}: InputWithIconProps) {
  return (
    <div className="relative">
      <Icon className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-zinc-400" />
      <Input className={cn('pl-9', className)} {...props} />
    </div>
  );
}
