import React, { useState } from 'react';
import { Box, Button, Paper, Typography, Alert } from '@mui/material';
import ValidatedTextField from './ValidatedTextField';
import { validators } from '../../utils/validators';

const UserFormExample: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    last_name: '',
    email: '',
    curp: '',
    password: '',
    // biometric se maneja automáticamente
  });

  const [showSuccess, setShowSuccess] = useState(false);

  const handleFieldChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = () => {
    // Validar todo el formulario
    const formValidators = {
      name: validators.validateName,
      last_name: validators.validateName,
      email: validators.validateEmail,
      curp: validators.validateCURP,
      password: validators.validatePassword,
      biometric: validators.validateOptional, // Campo opcional
    };

    const { isValid, errors } = validators.validateForm(formData, formValidators);

    if (isValid) {
      setShowSuccess(true);
      console.log('Formulario válido:', formData);
    } else {
      console.log('Errores de validación:', errors);
      alert('Por favor corrige los errores en el formulario');
    }
  };

  return (
    <Paper sx={{ p: 3, maxWidth: 600, mx: 'auto', mt: 3 }}>
      <Typography variant="h5" gutterBottom>
        Formulario de Usuario con Validaciones
      </Typography>
      
      {showSuccess && (
        <Alert severity="success" sx={{ mb: 2 }}>
          ¡Usuario creado correctamente!
        </Alert>
      )}

      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        <ValidatedTextField
          label="Nombre"
          value={formData.name}
          onChange={(value) => handleFieldChange('name', value)}
          validator={validators.validateName}
          fullWidth
          required
        />

        <ValidatedTextField
          label="Apellido"
          value={formData.last_name}
          onChange={(value) => handleFieldChange('last_name', value)}
          validator={validators.validateName}
          fullWidth
          required
        />

        <ValidatedTextField
          label="Email"
          type="email"
          value={formData.email}
          onChange={(value) => handleFieldChange('email', value)}
          validator={validators.validateEmail}
          fullWidth
          required
        />

        <ValidatedTextField
          label="CURP"
          value={formData.curp}
          onChange={(value) => handleFieldChange('curp', value)}
          validator={validators.validateCURP}
          fullWidth
          required
          placeholder="GODE560427MDFLML09"
        />

        <ValidatedTextField
          label="Contraseña"
          type="password"
          value={formData.password}
          onChange={(value) => handleFieldChange('password', value)}
          validator={validators.validatePassword}
          fullWidth
          required
          placeholder="Mínimo 12 caracteres, mayúscula, minúscula, número y símbolo"
        />

        <ValidatedTextField
          label="Datos Biométricos (Opcional)"
          value={formData.biometric}
          onChange={(value) => handleFieldChange('biometric', value)}
          validator={validators.validateOptional}
          fullWidth
          multiline
          rows={2}
          placeholder="Datos biométricos del usuario (opcional)"
        />

        <Button
          variant="contained"
          onClick={handleSubmit}
          sx={{ mt: 2 }}
          fullWidth
        >
          Crear Usuario
        </Button>
      </Box>

      <Box sx={{ mt: 3, p: 2, bgcolor: 'grey.100', borderRadius: 1 }}>
        <Typography variant="h6" gutterBottom>
          Datos del Formulario:
        </Typography>
        <pre style={{ fontSize: '12px', overflow: 'auto' }}>
          {JSON.stringify(formData, null, 2)}
        </pre>
      </Box>

      <Box sx={{ mt: 2, p: 2, bgcolor: 'info.50', borderRadius: 1 }}>
        <Typography variant="body2" color="text.secondary">
          <strong>Nota:</strong> El campo "Datos Biométricos" es completamente opcional. 
          Puede dejarse vacío sin generar errores de validación.
        </Typography>
      </Box>
    </Paper>
  );
};

export default UserFormExample; 