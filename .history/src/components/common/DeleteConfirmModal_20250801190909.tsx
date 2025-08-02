import React, { useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Typography,
  Alert,
  CircularProgress,
} from '@mui/material';

interface DeleteConfirmModalProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  itemName?: string;
  isLoading?: boolean;
  error?: any;
  onErrorClear?: () => void;
}

const DeleteConfirmModal: React.FC<DeleteConfirmModalProps> = ({
  open,
  onClose,
  onConfirm,
  title,
  message,
  itemName,
  isLoading = false,
  error,
  onErrorClear,
}) => {
  return (
    <Dialog 
      open={open} 
      onClose={onClose} 
      maxWidth="sm" 
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 2,
          padding: 2,
        }
      }}
    >
      <DialogTitle sx={{ pb: 1 }}>
        <Typography variant="h6" color="error">
          {title}
        </Typography>
      </DialogTitle>
      <DialogContent>
        <Box sx={{ pt: 1 }}>
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {typeof error === 'string' ? error : 'Error al eliminar'}
            </Alert>
          )}
          <Typography variant="body1" sx={{ mb: 2 }}>
            {message}
            {itemName && (
              <Typography component="span" fontWeight="bold" color="error">
                {' '}{itemName}
              </Typography>
            )}
            ?
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Esta acción no se puede deshacer.
          </Typography>
        </Box>
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button 
          onClick={onClose}
          disabled={isLoading}
        >
          Cancelar
        </Button>
        <Button 
          variant="contained" 
          color="error"
          onClick={onConfirm}
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <CircularProgress size={16} sx={{ mr: 1 }} />
              Eliminando...
            </>
          ) : (
            'Eliminar'
          )}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default DeleteConfirmModal; 