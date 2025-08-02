import React, { useState } from 'react';
import { Box, Button, Paper, Typography, Alert } from '@mui/material';
import ValidatedTextField from './ValidatedTextField';
import { validators } from '../../utils/validators';

const ValidatedFormExample: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
  });

  const [showSuccess, setShowSuccess] = useState(false);

  const handleFieldChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = () => {
    // Validar todo el formulario
    const formValidators = {
      name: validators.validateName,
      email: validators.validateEmail,
      phone: validators.validatePhone,
      address: validators.validateAddress,
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
        Ejemplo de Formulario Validado
      </Typography>
      
      {showSuccess && (
        <Alert severity="success" sx={{ mb: 2 }}>
          ¡Formulario enviado correctamente!
        </Alert>
      )}

      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        <ValidatedTextField
          label="Nombre de la Empresa"
          value={formData.name}
          onChange={(value) => handleFieldChange('name', value)}
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
          label="Teléfono"
          value={formData.phone}
          onChange={(value) => handleFieldChange('phone', value)}
          validator={validators.validatePhone}
          fullWidth
          required
          placeholder="5512345678"
        />

        <ValidatedTextField
          label="Dirección"
          value={formData.address}
          onChange={(value) => handleFieldChange('address', value)}
          validator={validators.validateAddress}
          fullWidth
          required
          multiline
          rows={3}
        />

        <Button
          variant="contained"
          onClick={handleSubmit}
          sx={{ mt: 2 }}
          fullWidth
        >
          Enviar Formulario
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
    </Paper>
  );
};

export default ValidatedFormExample; 