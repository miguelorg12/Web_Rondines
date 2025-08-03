import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TextField,
  Select,
  MenuItem,
  Box,
  Alert,
  CircularProgress,
  Chip,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  FormControl,
  InputLabel,
} from "@mui/material";
import type { SelectChangeEvent } from "@mui/material";
import Pagination from "@mui/material/Pagination";
import Stack from "@mui/material/Stack";
import { useGetReportsQuery, useUpdateIncidentStatusMutation } from "../redux/reports/reportsApi";
import type { Report } from "../interfaces";
import ReportDetailModal from "../components/common/ReportDetailModal";
import { useToast } from "../contexts/ToastContext";
import "../components/usuarios/usuarios.css";

function Reportes() {
  const [filterText, setFilterText] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);
  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const [statusModalOpen, setStatusModalOpen] = useState(false);
  const [selectedIncident, setSelectedIncident] = useState<Report | null>(null);
  const [newStatus, setNewStatus] = useState<string>("");
  const [additionalStatus, setAdditionalStatus] = useState<string>("");

  // API hooks
  const { data: reports = [], error, isLoading } = useGetReportsQuery();
  const [updateStatus, { isLoading: isUpdatingStatus }] = useUpdateIncidentStatusMutation();
  const { showToast } = useToast();

  const filteredData = reports.filter(
    (item) =>
      item.description.toLowerCase().includes(filterText.toLowerCase()) ||
      item.user.name.toLowerCase().includes(filterText.toLowerCase()) ||
      item.user.last_name.toLowerCase().includes(filterText.toLowerCase()) ||
      item.branch.name.toLowerCase().includes(filterText.toLowerCase()) ||
      item.status.toLowerCase().includes(filterText.toLowerCase()) ||
      item.severity.toLowerCase().includes(filterText.toLowerCase())
  );

  const handleChangeRowsPerPage = (event: SelectChangeEvent<number>) => {
    setRowsPerPage(Number(event.target.value));
    setPage(0);
  };

  const handleViewDetails = (report: Report) => {
    setSelectedReport(report);
    setDetailModalOpen(true);
  };

  const handleCloseDetailModal = () => {
    setDetailModalOpen(false);
    setSelectedReport(null);
  };

  const handleChangeStatus = (report: Report) => {
    setSelectedIncident(report);
    setNewStatus(report.status);
    setStatusModalOpen(true);
  };

  const handleCloseStatusModal = () => {
    setStatusModalOpen(false);
    setSelectedIncident(null);
    setNewStatus("");
    setAdditionalStatus("");
  };

  const handleUpdateStatus = async () => {
    if (!selectedIncident || !newStatus) return;

    try {
      await updateStatus({
        id: selectedIncident.id,
        status: newStatus
      }).unwrap();
      
      showToast("Estado del incidente actualizado correctamente", "success");
      handleCloseStatusModal();
    } catch (error) {
      console.error("Error al actualizar estado:", error);
      showToast("Error al actualizar el estado del incidente", "error");
    }
  };

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

  if (isLoading) {
    return (
      <Paper sx={{ width: "100%", overflow: "hidden", p: 2, textAlign: "center" }}>
        <CircularProgress />
        <div>Cargando reportes...</div>
      </Paper>
    );
  }

  if (error) {
    return (
      <Paper sx={{ width: "100%", overflow: "hidden", p: 2 }}>
        <Alert severity="error">Error al cargar reportes</Alert>
      </Paper>
    );
  }

  return (
    <Paper sx={{ width: "100%", overflow: "hidden", p: 2 }}>
      {/* Filtros */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginBottom: 16,
        }}
      >
        <Select
          className="custom-select"
          label="Filas por página"
          size="small"
          value={rowsPerPage}
          onChange={handleChangeRowsPerPage}
        >
          <MenuItem value={5}>5</MenuItem>
          <MenuItem value={10}>10</MenuItem>
          <MenuItem value={15}>15</MenuItem>
        </Select>
        <TextField
          label="Buscar"
          variant="outlined"
          size="small"
          value={filterText}
          onChange={(e) => setFilterText(e.target.value)}
        />
      </div>
      
      <TableContainer className="custom-table-container">
        <Table className="custom-table" stickyHeader>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Descripción</TableCell>
              <TableCell>Guardia</TableCell>
              <TableCell>Sucursal</TableCell>
              <TableCell>Severidad</TableCell>
              <TableCell>Estado</TableCell>
              <TableCell>Fecha</TableCell>
              <TableCell>Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredData
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((row) => (
                <TableRow key={row.id}>
                  <TableCell>{row.id}</TableCell>
                  <TableCell>
                    <Box sx={{ maxWidth: 200 }}>
                      <Typography variant="body2" noWrap>
                        {row.description}
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell>
                    {row.user.name} {row.user.last_name}
                  </TableCell>
                  <TableCell>{row.branch.name}</TableCell>
                  <TableCell>
                    <Chip
                      label={row.severity}
                      color={getSeverityColor(row.severity) as "success" | "warning" | "error" | "default"}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={row.status}
                      color={getStatusColor(row.status) as "info" | "warning" | "success" | "default"}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>
                    {new Date(row.created_at).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    <button 
                      className="action-btn edit-btn" 
                      title="Ver detalles"
                      onClick={() => handleViewDetails(row)}
                    >
                      <i className="fa-solid fa-eye"></i>
                    </button>
                    <button 
                      className="action-btn edit-btn" 
                      title="Cambiar estado"
                      onClick={() => handleChangeStatus(row)}
                      style={{ marginLeft: '8px' }}
                    >
                      <i className="fa-solid fa-edit"></i>
                    </button>
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </TableContainer>
      
      <Stack direction="row" justifyContent="end" sx={{ mt: 2 }}>
        <Pagination
          count={Math.ceil(filteredData.length / rowsPerPage)}
          page={page + 1}
          onChange={(_, value) => setPage(value - 1)}
          color="primary"
          shape="rounded"
          showFirstButton
          showLastButton
        />
      </Stack>

      {/* Modal de detalles del reporte */}
      <ReportDetailModal
        open={detailModalOpen}
        onClose={handleCloseDetailModal}
        report={selectedReport}
      />

      {/* Modal para cambiar estado del incidente */}
      <Dialog 
        open={statusModalOpen} 
        onClose={handleCloseStatusModal} 
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
          <p className="cu-p" style={{ margin: 0 }}>
            Cambiar Estado del Incidente
          </p>
        </DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 1 }}>
            <Typography variant="body2" sx={{ mb: 2 }}>
              Incidente #{selectedIncident?.id} - {selectedIncident?.description.substring(0, 50)}...
            </Typography>
            
            <FormControl fullWidth>
              <InputLabel id="status-label">Nuevo Estado</InputLabel>
              <Select
                labelId="status-label"
                value={newStatus}
                onChange={(e) => setNewStatus(e.target.value)}
                label="Nuevo Estado"
              >
                <MenuItem value="reportado">Reportado</MenuItem>
                <MenuItem value="en_revision">En Revisión</MenuItem>
                <MenuItem value="resuelto">Resuelto</MenuItem>
                <MenuItem value="descartado">Descartado</MenuItem>
              </Select>
            </FormControl>
          </Box>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button 
            className="cancel-btn" 
            onClick={handleCloseStatusModal}
            disabled={isUpdatingStatus}
          >
            Cancelar
          </Button>
          <Button 
            className="create-btn" 
            onClick={handleUpdateStatus}
            disabled={isUpdatingStatus || !newStatus}
          >
            {isUpdatingStatus ? 'Actualizando...' : 'Actualizar Estado'}
          </Button>
        </DialogActions>
      </Dialog>
    </Paper>
  );
}

export default Reportes;
