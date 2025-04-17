import React from 'react';
import { cn } from '@/lib/utils';

interface AccessibleTextFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: boolean;
  errorMessage?: string;
  'aria-label'?: string;
  'aria-describedby'?: string;
  'aria-invalid'?: boolean;
  'aria-required'?: boolean;
}

export const AccessibleTextField = React.forwardRef<HTMLInputElement, AccessibleTextFieldProps>(
  (
    {
      className,
      label,
      error,
      errorMessage,
      'aria-label': ariaLabel,
      'aria-describedby': ariaDescribedby,
      'aria-invalid': ariaInvalid,
      'aria-required': ariaRequired,
      required,
      ...props
    },
    ref
  ) => {
    const id = React.useId();
    const errorId = `${id}-error`;

    return (
      <div className="space-y-1">
        {label && (
          <label htmlFor={id} className="block text-sm font-medium text-gray-700">
            {label}
            {required && <span className="text-red-500 ml-1">*</span>}
          </label>
        )}
        <input
          ref={ref}
          id={id}
          className={cn(
            'block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm',
            error && 'border-red-500 focus:border-red-500 focus:ring-red-500',
            className
          )}
          aria-label={ariaLabel}
          aria-describedby={error ? errorId : ariaDescribedby}
          aria-invalid={ariaInvalid ?? error}
          aria-required={ariaRequired ?? required}
          {...props}
        />
        {error && errorMessage && (
          <p id={errorId} className="text-sm text-red-500">
            {errorMessage}
          </p>
        )}
      </div>
    );
  }
);

AccessibleTextField.displayName = 'AccessibleTextField'; 