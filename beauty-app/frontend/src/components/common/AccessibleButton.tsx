import React from 'react';
import { Button, ButtonProps } from '@mui/material';

interface AccessibleButtonProps extends ButtonProps {
  'aria-label'?: string;
  'aria-describedby'?: string;
  'aria-expanded'?: boolean;
  'aria-haspopup'?: boolean;
}

export const AccessibleButton: React.FC<AccessibleButtonProps> = ({
  children,
  'aria-label': ariaLabel,
  'aria-describedby': ariaDescribedby,
  'aria-expanded': ariaExpanded,
  'aria-haspopup': ariaHaspopup,
  ...props
}) => {
  return (
    <Button
      {...props}
      aria-label={ariaLabel}
      aria-describedby={ariaDescribedby}
      aria-expanded={ariaExpanded}
      aria-haspopup={ariaHaspopup}
    >
      {children}
    </Button>
  );
}; 