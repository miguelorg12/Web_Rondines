import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Snackbar, Alert } from '@mui/material';

interface ToastContextType {
  showToast: (message: string, severity: 'success' | 'error' | 'warning' | 'info') => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

interface ToastProviderProps {
  children: ReactNode;
}

export const ToastProvider: React.FC<ToastProviderProps> = ({ children }) => {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [severity, setSeverity] = useState<'success' | 'error' | 'warning' | 'info'>('success');

  const showToast = (message: string, severity: 'success' | 'error' | 'warning' | 'info') => {
    setMessage(message);
    setSeverity(severity);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <Snackbar
        open={open}
        autoHideDuration={4000}
        onClose={handleClose}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        sx={{ 
          zIndex: 99999,
          '& .MuiSnackbar-root': {
            top: '20px !important',
            right: '20px !important'
          }
        }}
      >
        <Alert 
          onClose={handleClose} 
          severity={severity}
          sx={{ 
            width: '100%',
            minWidth: '300px',
            fontSize: '1rem',
            fontWeight: 'bold',
            boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
            '&.MuiAlert-standardSuccess': {
              backgroundColor: '#4caf50',
              color: 'white',
              '& .MuiAlert-icon': {
                color: 'white'
              }
            },
            '&.MuiAlert-standardError': {
              backgroundColor: '#f44336',
              color: 'white',
              '& .MuiAlert-icon': {
                color: 'white'
              }
            },
            '&.MuiAlert-standardWarning': {
              backgroundColor: '#ff9800',
              color: 'white',
              '& .MuiAlert-icon': {
                color: 'white'
              }
            },
            '&.MuiAlert-standardInfo': {
              backgroundColor: '#2196f3',
              color: 'white',
              '& .MuiAlert-icon': {
                color: 'white'
              }
            }
          }}
        >
          {message}
        </Alert>
      </Snackbar>
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (context === undefined) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
}; 