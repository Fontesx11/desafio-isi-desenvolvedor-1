import { RefreshCw, ServerOff } from 'lucide-react';
import { ListState } from '@/components/list-state';
import { Button } from '@/components/ui/button';

type ErrorStateProps = {
  title: string;
  error: Error;
  onRetry: () => void;
  className?: string;
};

export function ErrorState({
  title,
  error,
  onRetry,
  className,
}: ErrorStateProps) {
  return (
    <ListState
      icon={ServerOff}
      title={title}
      description={error.message}
      className={className}
      action={
        <Button
          type="button"
          variant="outline"
          className="gap-2"
          onClick={onRetry}
        >
          <RefreshCw />
          Tentar de novo
        </Button>
      }
    />
  );
}
