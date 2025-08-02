import React from 'react';
import { TextField } from '@mui/material';
import type { TextFieldProps } from '@mui/material/TextField';
import { useFieldValidation, validators } from '../../utils/validators';

// Definir la interfaz localmente para evitar problemas de importación
interface ValidationResult {
  isValid: boolean;
  message: string;
}

interface ValidatedTextFieldProps extends Omit<TextFieldProps, 'error' | 'helperText'> {
  value: string;
  onChange: (value: string) => void;
  validator: (value: string) => ValidationResult;
  validateOnChange?: boolean;
  showError?: boolean;
}

const ValidatedTextField: React.FC<ValidatedTextFieldProps> = ({
  value,
  onChange,
  validator,
  validateOnChange = false, // Cambiado a false por defecto
  showError = true,
  ...textFieldProps
}) => {
  const { error, isValid, handleBlur } = useFieldValidation(value, validator, validateOnChange);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value);
  };

  return (
    <div style={{ width: '100%' }}>
      <TextField
        {...textFieldProps}
        value={value}
        onChange={handleChange}
        onBlur={handleBlur}
        error={showError && !isValid && error !== ""}
        sx={{
          '& .MuiOutlinedInput-root.Mui-error .MuiOutlinedInput-notchedOutline': {
            borderColor: '#d32f2f',
          },
          '& .MuiOutlinedInput-root.Mui-error:hover .MuiOutlinedInput-notchedOutline': {
            borderColor: '#d32f2f',
          },
          '& .MuiOutlinedInput-root.Mui-error.Mui-focused .MuiOutlinedInput-notchedOutline': {
            borderColor: '#d32f2f',
          },
        }}
      />
      {showError && !isValid && error !== "" && (
        <div style={{
          color: '#d32f2f',
          fontSize: '0.75rem',
          marginTop: '4px',
          marginLeft: '14px'
        }}>
          {error}
        </div>
      )}
    </div>
  );
};

export default ValidatedTextField; 