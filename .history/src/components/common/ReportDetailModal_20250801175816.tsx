import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Typography,
  Grid,
  Card,
  CardMedia,
  CardContent,
  Chip,
  Divider,
} from '@mui/material';
import type { Report } from '../../interfaces';

interface ReportDetailModalProps {
  open: boolean;
  onClose: () => void;
  report: Report | null;
}

const ReportDetailModal: React.FC<ReportDetailModalProps> = ({
  open,
  onClose,
  report,
}) => {
  if (!report) return null;

  const getSeverityColor = (severity: string) => {
    switch (severity.toLowerCase()) {
      case 'baja':
        return 'success';
      case 'media':
        return 'warning';
      case 'alta':
        return 'error';
      case 'critica':
        return 'error';
      default:
        return 'default';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'reportado':
        return 'info';
      case 'en_revision':
        return 'warning';
      case 'resuelto':
        return 'success';
      case 'descartado':
        return 'default';
      default:
        return 'default';
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="lg"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 2,
          padding: 2,
        }
      }}
    >
      <DialogTitle sx={{ pb: 1 }}>
        <Typography variant="h6" component="div">
          Detalles del Reporte #{report.id}
        </Typography>
      </DialogTitle>
      
      <DialogContent>
        <Box sx={{ pt: 1 }}>
          {/* Información principal */}
          <Box sx={{ mb: 3 }}>
            <Typography variant="h6" gutterBottom>
              Descripción del Incidente
            </Typography>
            <Typography variant="body1" sx={{ mb: 2 }}>
              {report.description}
            </Typography>
            
            <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
              <Chip
                label={`Severidad: ${report.severity}`}
                color={getSeverityColor(report.severity) as any}
                size="small"
              />
              <Chip
                label={`Estado: ${report.status}`}
                color={getStatusColor(report.status) as any}
                size="small"
              />
            </Box>
          </Box>

          <Divider sx={{ my: 2 }} />

          {/* Información del usuario */}
          <Box sx={{ mb: 3 }}>
            <Typography variant="h6" gutterBottom>
              Información del Guardia
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <Typography variant="body2" color="text.secondary">
                  Nombre
                </Typography>
                <Typography variant="body1">
                  {report.user.name} {report.user.last_name}
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="body2" color="text.secondary">
                  Email
                </Typography>
                <Typography variant="body1">
                  {report.user.email}
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="body2" color="text.secondary">
                  CURP
                </Typography>
                <Typography variant="body1">
                  {report.user.curp}
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="body2" color="text.secondary">
                  Estado
                </Typography>
                <Chip
                  label={report.user.active ? 'Activo' : 'Inactivo'}
                  color={report.user.active ? 'success' : 'default'}
                  size="small"
                />
              </Grid>
            </Grid>
          </Box>

          <Divider sx={{ my: 2 }} />

          {/* Información de la sucursal */}
          <Box sx={{ mb: 3 }}>
            <Typography variant="h6" gutterBottom>
              Información de la Sucursal
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <Typography variant="body2" color="text.secondary">
                  Nombre
                </Typography>
                <Typography variant="body1">
                  {report.branch.name}
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="body2" color="text.secondary">
                  Dirección
                </Typography>
                <Typography variant="body1">
                  {report.branch.address}
                </Typography>
              </Grid>
            </Grid>
          </Box>

          <Divider sx={{ my: 2 }} />

          {/* Imágenes */}
          {report.images && report.images.length > 0 && (
            <Box>
              <Typography variant="h6" gutterBottom>
                Imágenes del Incidente ({report.images.length})
              </Typography>
              <Grid container spacing={2}>
                {report.images.map((image, index) => (
                  <Grid item xs={12} sm={6} md={4} key={image.id}>
                    <Card>
                      <CardMedia
                        component="img"
                        height="200"
                        image={image.image_url}
                        alt={`Imagen ${index + 1}`}
                        sx={{ objectFit: 'cover' }}
                      />
                      <CardContent>
                        <Typography variant="body2" color="text.secondary">
                          {image.original_name}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          Tamaño: {(parseInt(image.file_size) / 1024 / 1024).toFixed(2)} MB
                        </Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            </Box>
          )}

          {/* Fechas */}
          <Box sx={{ mt: 3 }}>
            <Typography variant="body2" color="text.secondary">
              Creado: {new Date(report.created_at).toLocaleString()}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Actualizado: {new Date(report.updated_at).toLocaleString()}
            </Typography>
          </Box>
        </Box>
      </DialogContent>
      
      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button onClick={onClose} color="primary">
          Cerrar
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ReportDetailModal; 