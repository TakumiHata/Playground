import React from 'react';
import { TextField, TextFieldProps } from '@mui/material';

type AccessibleTextFieldProps = TextFieldProps & {
  'aria-label'?: string;
  'aria-describedby'?: string;
  'aria-invalid'?: boolean;
  'aria-required'?: boolean;
};

export const AccessibleTextField: React.FC<AccessibleTextFieldProps> = ({
  'aria-label': ariaLabel,
  'aria-describedby': ariaDescribedby,
  'aria-invalid': ariaInvalid,
  'aria-required': ariaRequired,
  error,
  required,
  ...props
}) => {
  return (
    <TextField
      {...props}
      aria-label={ariaLabel}
      aria-describedby={ariaDescribedby}
      aria-invalid={ariaInvalid ?? error}
      aria-required={ariaRequired ?? required}
      error={error}
      required={required}
    />
  );
}; 