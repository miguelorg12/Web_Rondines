import React, { useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Alert,
  CircularProgress,
} from '@mui/material';

interface GenericModalProps {
  open: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  onConfirm: () => void;
  confirmText: string;
  cancelText?: string;
  isLoading?: boolean;
  error?: any;
  disabled?: boolean;
}

const GenericModal: React.FC<GenericModalProps> = ({
  open,
  onClose,
  title,
  children,
  onConfirm,
  confirmText,
  cancelText = 'Cancelar',
  isLoading = false,
  error,
  disabled = false,
}) => {
  return (
    <Dialog 
      open={open} 
      onClose={onClose} 
      maxWidth="md" 
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 2,
          padding: 2,
        }
      }}
    >
      <DialogTitle sx={{ pb: 1 }}>
        <p className="cu-p" style={{ margin: 0 }}>{title}</p>
      </DialogTitle>
      <DialogContent>
        <Box sx={{ pt: 1 }}>
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {typeof error === 'string' ? error : 'Error en la operación'}
            </Alert>
          )}
          {children}
        </Box>
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button 
          className="cancel-btn" 
          onClick={onClose}
          disabled={isLoading}
        >
          {cancelText}
        </Button>
        <Button 
          className="create-btn" 
          onClick={onConfirm}
          disabled={isLoading || disabled}
        >
          {isLoading ? (
            <>
              <CircularProgress size={16} sx={{ mr: 1 }} />
              Procesando...
            </>
          ) : (
            confirmText
          )}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default GenericModal; 