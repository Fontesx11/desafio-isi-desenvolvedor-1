import { CircleAlert } from 'lucide-react';
import type { ReactNode } from 'react';
import {
  Field,
  FieldDescription,
  FieldError,
  FieldLabel,
} from '@/components/ui/field';

type FormFieldProps = {
  // Sem rótulo quando as opções já se explicam (ex.: escolha da condição)
  label?: ReactNode;
  htmlFor?: string;
  error?: string;
  // Texto de ajuda, trocado pela mensagem de erro quando houver
  description?: ReactNode;
  className?: string;
  children: ReactNode;
};

export function FormField({
  label,
  htmlFor,
  error,
  description,
  className,
  children,
}: FormFieldProps) {
  return (
    <Field data-invalid={!!error} className={className}>
      {label && <FieldLabel htmlFor={htmlFor}>{label}</FieldLabel>}
      {children}
      {error ? (
        <FieldError className="flex items-start gap-1.5">
          <CircleAlert className="mt-0.5 size-3.5 shrink-0" />
          {error}
        </FieldError>
      ) : (
        description && <FieldDescription>{description}</FieldDescription>
      )}
    </Field>
  );
}
