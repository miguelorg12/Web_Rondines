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
  FormControl,
  InputLabel,
  Alert,
  CircularProgress,
} from "@mui/material";
import type { SelectChangeEvent } from "@mui/material";
import Pagination from "@mui/material/Pagination";
import Stack from "@mui/material/Stack";
import { useGetBranchesQuery, useCreateBranchMutation, useDeleteBranchMutation } from "../redux/branches/branchesApi";
import { useGetCompaniesQuery } from "../redux/companies/companiesApi";
import type { CreateBranch } from "../interfaces";
import "../components/usuarios/usuarios.css";

function Sucursales() {
  const [filterText, setFilterText] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [openModal, setOpenModal] = useState(false);

  // Campos del modal
  const [branchNumber, setBranchNumber] = useState("");
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState("");
  const [manager, setManager] = useState("");
  const [companyId, setCompanyId] = useState<number | "">("");

  // API hooks
  const { data: branches = [], error, isLoading, refetch } = useGetBranchesQuery();
  const { data: companies = [] } = useGetCompaniesQuery();
  
  // Asegurar que branches sea un array
  const safeBranches = Array.isArray(branches) ? branches : [];
  const [createBranch, { isLoading: isCreating, error: createError }] = useCreateBranchMutation();
  const [deleteBranch, { isLoading: isDeleting }] = useDeleteBranchMutation();

  const filteredData = safeBranches.filter(
    (item) =>
      (item.branchNumber?.toLowerCase() || '').includes(filterText.toLowerCase()) ||
      (item.name?.toLowerCase() || '').includes(filterText.toLowerCase()) ||
      (item.address?.toLowerCase() || '').includes(filterText.toLowerCase()) ||
      (item.company?.toLowerCase() || '').includes(filterText.toLowerCase())
  );

  const handleChangeRowsPerPage = (event: SelectChangeEvent<number>) => {
    setRowsPerPage(Number(event.target.value));
    setPage(0);
  };

  const handleOpenModal = () => setOpenModal(true);
  
  const handleCloseModal = () => {
    setOpenModal(false);
    // Limpiar el formulario
    setBranchNumber("");
    setName("");
    setAddress("");
    setPhone("");
    setManager("");
    setCompanyId("");
  };

  const handleCreateBranch = async () => {
    if (!companyId) {
      alert("Debes seleccionar una empresa");
      return;
    }

    const newBranch: CreateBranch = {
      branchNumber,
      company_id: companyId as number,
      name,
      address,
      phone: phone || undefined,
      manager: manager || undefined,
    };

    try {
      await createBranch(newBranch).unwrap();
      handleCloseModal();
      refetch(); // Refrescar la lista
    } catch (err) {
      console.error("Error al crear sucursal:", err);
    }
  };

  const handleDeleteBranch = async (branchId: number) => {
    if (window.confirm("¿Estás seguro de que quieres eliminar esta sucursal?")) {
      try {
        await deleteBranch(branchId).unwrap();
        refetch(); // Refrescar la lista
      } catch (err) {
        console.error("Error al eliminar sucursal:", err);
      }
    }
  };

  if (isLoading) {
    return (
      <Paper sx={{ width: "100%", overflow: "hidden", p: 2, textAlign: "center" }}>
        <CircularProgress />
        <div>Cargando sucursales...</div>
      </Paper>
    );
  }

  if (error) {
    return (
      <Paper sx={{ width: "100%", overflow: "hidden", p: 2 }}>
        <Alert severity="error">Error al cargar sucursales</Alert>
      </Paper>
    );
  }

  return (
    <Paper sx={{ width: "100%", overflow: "hidden", p: 2 }}>
      {/* Botón Crear sucursal */}
      <div
        style={{
          display: "flex",
          justifyContent: "flex-end",
          marginBottom: 16,
        }}
      >
        <Button className="create-user-btn" onClick={handleOpenModal}>
          Crear sucursal
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
              <TableCell>Num sucursal</TableCell>
              <TableCell>Empresa</TableCell>
              <TableCell>Nombre</TableCell>
              <TableCell>Dirección</TableCell>
              <TableCell>Teléfono</TableCell>
              <TableCell>Manager</TableCell>
              <TableCell>Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredData
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((row) => (
                <TableRow key={row.id}>
                  <TableCell>{row.branchNumber}</TableCell>
                  <TableCell>{row.company}</TableCell>
                  <TableCell>{row.name}</TableCell>
                  <TableCell>{row.address}</TableCell>
                  <TableCell>{row.phone || '-'}</TableCell>
                  <TableCell>{row.manager || '-'}</TableCell>
                  <TableCell>
                    <button className="action-btn edit-btn" title="Editar">
                      <i className="fa-solid fa-pen-to-square"></i>
                    </button>
                    <button 
                      className="action-btn delete-btn" 
                      title="Eliminar"
                      onClick={() => handleDeleteBranch(row.id)}
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

      {/* Modal para crear sucursal */}
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
          <p className="cu-p" style={{ margin: 0 }}>Crear Sucursal</p>
        </DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 1 }}>
            {createError && (
              <Alert severity="error" sx={{ mb: 2 }}>
                Error al crear sucursal
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
                label="Número de sucursal"
                variant="outlined"
                fullWidth
                sx={{ flex: 1 }}
                className="custom-textfield"
                value={branchNumber}
                onChange={(e) => setBranchNumber(e.target.value)}
                required
              />
              <TextField
                label="Nombre de la sucursal"
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
                mb: 2,
              }}
            >
              <TextField
                label="Teléfono"
                variant="outlined"
                fullWidth
                sx={{ flex: 1 }}
                className="custom-textfield"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
              <TextField
                label="Manager"
                variant="outlined"
                fullWidth
                sx={{ flex: 1 }}
                className="custom-textfield"
                value={manager}
                onChange={(e) => setManager(e.target.value)}
              />
            </Box>

            <FormControl fullWidth>
              <InputLabel id="company-label">Empresa</InputLabel>
              <Select
                labelId="company-label"
                value={companyId}
                onChange={(e) => setCompanyId(Number(e.target.value))}
                className="custom-textfield"
                label="Empresa"
                required
              >
                {companies.map((company) => (
                  <MenuItem key={company.id} value={company.id}>
                    {company.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
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
            onClick={handleCreateBranch}
            disabled={isCreating}
          >
            {isCreating ? 'Creando...' : 'Crear'}
          </Button>
        </DialogActions>
      </Dialog>
    </Paper>
  );
}

export default Sucursales;
