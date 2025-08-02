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
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Box,
  Select,
  MenuItem,
  Alert,
  CircularProgress,
} from "@mui/material";
import type { SelectChangeEvent } from "@mui/material";
import Pagination from "@mui/material/Pagination";
import Stack from "@mui/material/Stack";
import { useGetCompaniesQuery, useCreateCompanyMutation, useDeleteCompanyMutation } from "../redux/companies/companiesApi";
import type { CreateCompany } from "../interfaces";
import "../components/usuarios/usuarios.css";

function Empresas() {
  const [filterText, setFilterText] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [openModal, setOpenModal] = useState(false);

  // Campos del modal
  const [companyNumber, setCompanyNumber] = useState("");
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");

  // API hooks
  const { data: companies = [], error, isLoading, refetch } = useGetCompaniesQuery();
  const [createCompany, { isLoading: isCreating, error: createError }] = useCreateCompanyMutation();
  const [deleteCompany, { isLoading: isDeleting }] = useDeleteCompanyMutation();

  const filteredData = companies.filter(
    (item) =>
      item.companyNumber.toLowerCase().includes(filterText.toLowerCase()) ||
      item.name.toLowerCase().includes(filterText.toLowerCase()) ||
      item.address.toLowerCase().includes(filterText.toLowerCase()) ||
      item.email.toLowerCase().includes(filterText.toLowerCase())
  );

  const handleChangeRowsPerPage = (event: SelectChangeEvent<number>) => {
    setRowsPerPage(Number(event.target.value));
    setPage(0);
  };

  const handleOpenModal = () => setOpenModal(true);
  
  const handleCloseModal = () => {
    setOpenModal(false);
    // Limpiar el formulario
    setCompanyNumber("");
    setName("");
    setAddress("");
    setPhone("");
    setEmail("");
  };

  const handleCreateCompany = async () => {
    const newCompany: CreateCompany = {
      companyNumber,
      name,
      address,
      phone,
      email,
    };

    try {
      await createCompany(newCompany).unwrap();
      handleCloseModal();
      refetch(); // Refrescar la lista
    } catch (err) {
      console.error("Error al crear empresa:", err);
    }
  };

  const handleDeleteCompany = async (companyId: number) => {
    if (window.confirm("¿Estás seguro de que quieres eliminar esta empresa?")) {
      try {
        await deleteCompany(companyId).unwrap();
        refetch(); // Refrescar la lista
      } catch (err) {
        console.error("Error al eliminar empresa:", err);
      }
    }
  };

  if (isLoading) {
    return (
      <Paper sx={{ width: "100%", overflow: "hidden", p: 2, textAlign: "center" }}>
        <CircularProgress />
        <div>Cargando empresas...</div>
      </Paper>
    );
  }

  if (error) {
    return (
      <Paper sx={{ width: "100%", overflow: "hidden", p: 2 }}>
        <Alert severity="error">Error al cargar empresas</Alert>
      </Paper>
    );
  }

  return (
    <Paper sx={{ width: "100%", overflow: "hidden", p: 2 }}>
      {/* Botón Crear empresa */}
      <div
        style={{
          display: "flex",
          justifyContent: "flex-end",
          marginBottom: 16,
        }}
      >
        <Button className="create-user-btn" onClick={handleOpenModal}>
          Crear empresa
        </Button>
      </div>
      {/* Filtros: paginado y buscador */}
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
              <TableCell>Num empresa</TableCell>
              <TableCell>Nombre</TableCell>
              <TableCell>Dirección</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Teléfono</TableCell>
              <TableCell>Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredData
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((row) => (
                <TableRow key={row.id}>
                  <TableCell>{row.companyNumber}</TableCell>
                  <TableCell>{row.name}</TableCell>
                  <TableCell>{row.address}</TableCell>
                  <TableCell>{row.email}</TableCell>
                  <TableCell>{row.phone}</TableCell>
                  <TableCell>
                    <button className="action-btn edit-btn" title="Editar">
                      <i className="fa-solid fa-pen-to-square"></i>
                    </button>
                    <button 
                      className="action-btn delete-btn" 
                      title="Eliminar"
                      onClick={() => handleDeleteCompany(row.id)}
                      disabled={isDeleting}
                    >
                      <i className="fa-solid fa-trash"></i>
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

      {/* Modal para crear empresa */}
      <Dialog 
        open={openModal} 
        onClose={handleCloseModal} 
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
          <p className="cu-p" style={{ margin: 0 }}>Crear Empresa</p>
        </DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 1 }}>
            {createError && (
              <Alert severity="error" sx={{ mb: 2 }}>
                Error al crear empresa
              </Alert>
            )}
            
            <Box
              sx={{
                display: "flex",
                gap: 2,
                flexDirection: { xs: "column", md: "row" },
                width: "100%",
                mb: 2,
              }}
            >
              <TextField
                label="Número de empresa"
                variant="outlined"
                fullWidth
                sx={{ flex: 1 }}
                className="custom-textfield"
                value={companyNumber}
                onChange={(e) => setCompanyNumber(e.target.value)}
                required
              />
              <TextField
                label="Nombre de la empresa"
                variant="outlined"
                fullWidth
                sx={{ flex: 1 }}
                className="custom-textfield"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </Box>

            <TextField
              label="Dirección"
              variant="outlined"
              fullWidth
              className="custom-textfield"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              required
              sx={{ mb: 2 }}
            />

            <Box
              sx={{
                display: "flex",
                gap: 2,
                flexDirection: { xs: "column", md: "row" },
                width: "100%",
              }}
            >
              <TextField
                label="Email"
                variant="outlined"
                fullWidth
                sx={{ flex: 1 }}
                className="custom-textfield"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <TextField
                label="Teléfono"
                variant="outlined"
                fullWidth
                sx={{ flex: 1 }}
                className="custom-textfield"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required
              />
            </Box>
          </Box>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button 
            className="cancel-btn" 
            onClick={handleCloseModal}
            disabled={isCreating}
          >
            Cancelar
          </Button>
          <Button 
            className="create-btn" 
            onClick={handleCreateCompany}
            disabled={isCreating}
          >
            {isCreating ? 'Creando...' : 'Crear'}
          </Button>
        </DialogActions>
      </Dialog>
    </Paper>
  );
}

export default Empresas;
