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
  Button,
  Box,
  Alert,
  CircularProgress,
} from "@mui/material";
import type { SelectChangeEvent } from "@mui/material";
import Pagination from "@mui/material/Pagination";
import Stack from "@mui/material/Stack";
import { useGetCompaniesQuery, useCreateCompanyMutation, useUpdateCompanyMutation, useDeleteCompanyMutation } from "../redux/companies/companiesApi";
import type { CreateCompany, UpdateCompany, Company } from "../interfaces";
import GenericModal from "../components/common/GenericModal";
import DeleteConfirmModal from "../components/common/DeleteConfirmModal";
import { useToast } from "../contexts/ToastContext";
import { validators } from "../utils/validators";
import ValidatedTextField from "../components/common/ValidatedTextField";
import "../components/usuarios/usuarios.css";

function Empresas() {
  const [filterText, setFilterText] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [openModal, setOpenModal] = useState(false);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [editingCompany, setEditingCompany] = useState<Company | null>(null);
  const [companyToDelete, setCompanyToDelete] = useState<Company | null>(null);
  
  // Toast hook
  const { showToast } = useToast();

  // Campos del modal
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");

  // API hooks
  const { data: companies = [], error, isLoading, refetch } = useGetCompaniesQuery();
  const [createCompany, { isLoading: isCreating, error: createError, reset: resetCreateError }] = useCreateCompanyMutation();
  const [updateCompany, { isLoading: isUpdating, error: updateError, reset: resetUpdateError }] = useUpdateCompanyMutation();
  const [deleteCompany, { isLoading: isDeleting, error: deleteError, reset: resetDeleteError }] = useDeleteCompanyMutation();

  const filteredData = companies.filter(
    (item) =>
      item.name.toLowerCase().includes(filterText.toLowerCase()) ||
      item.address.toLowerCase().includes(filterText.toLowerCase()) ||
      item.email.toLowerCase().includes(filterText.toLowerCase()) ||
      item.phone.toLowerCase().includes(filterText.toLowerCase())
  );

  const handleChangeRowsPerPage = (event: SelectChangeEvent<number>) => {
    setRowsPerPage(Number(event.target.value));
    setPage(0);
  };

  const handleOpenModal = (company?: Company) => {
    if (company) {
      setEditingCompany(company);
      setName(company.name);
      setAddress(company.address);
      setPhone(company.phone);
      setEmail(company.email);
    } else {
      setEditingCompany(null);
      setName("");
      setAddress("");
      setPhone("");
      setEmail("");
    }
    setOpenModal(true);
  };
  
  const handleCloseModal = () => {
    setOpenModal(false);
    setEditingCompany(null);
    // Limpiar el formulario
    setName("");
    setAddress("");
    setPhone("");
    setEmail("");
  };

  const handleSaveCompany = async () => {
    if (editingCompany) {
      // Actualizar empresa
      const updateData: UpdateCompany = {
        name: name || undefined,
        email: email || undefined,
        phone: phone || undefined,
      };

      try {
        await updateCompany({ id: editingCompany.id, data: updateData }).unwrap();
        handleCloseModal();
        refetch();
        showToast("Empresa actualizada correctamente", "success");
      } catch (err) {
        console.error("Error al actualizar empresa:", err);
        showToast("Error al actualizar empresa", "error");
      }
    } else {
      // Crear nueva empresa
      const newCompany: CreateCompany = {
        name,
        address,
        phone,
        email,
      };

      try {
        await createCompany(newCompany).unwrap();
        handleCloseModal();
        refetch();
        showToast("Empresa creada correctamente", "success");
      } catch (err) {
        console.error("Error al crear empresa:", err);
        showToast("Error al crear empresa", "error");
      }
    }
  };

  const handleDeleteClick = (company: Company) => {
    setCompanyToDelete(company);
    setOpenDeleteModal(true);
  };

  const handleDeleteConfirm = async () => {
    if (companyToDelete) {
      try {
        await deleteCompany(companyToDelete.id).unwrap();
        setOpenDeleteModal(false);
        setCompanyToDelete(null);
        refetch();
        showToast("Empresa eliminada correctamente", "success");
      } catch (err) {
        console.error("Error al eliminar empresa:", err);
        showToast("Error al eliminar empresa", "error");
      }
    }
  };

  const handleDeleteCancel = () => {
    setOpenDeleteModal(false);
    setCompanyToDelete(null);
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
        <Button className="create-user-btn" onClick={() => handleOpenModal()}>
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
              <TableCell>ID</TableCell>
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
                  <TableCell>{row.id}</TableCell>
                  <TableCell>{row.name}</TableCell>
                  <TableCell>{row.address}</TableCell>
                  <TableCell>{row.email}</TableCell>
                  <TableCell>{row.phone}</TableCell>
                  <TableCell>
                    <button 
                      className="action-btn edit-btn" 
                      title="Editar"
                      onClick={() => handleOpenModal(row)}
                    >
                      <i className="fa-solid fa-pen-to-square"></i>
                    </button>
                    <button 
                      className="action-btn delete-btn" 
                      title="Eliminar"
                      onClick={() => handleDeleteClick(row)}
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

      {/* Modal genérico para crear/editar empresa */}
      <GenericModal
        open={openModal}
        onClose={handleCloseModal}
        title={editingCompany ? "Editar Empresa" : "Crear Empresa"}
        onConfirm={handleSaveCompany}
        confirmText={editingCompany ? "Actualizar" : "Crear"}
        isLoading={isCreating || isUpdating}
        error={createError || updateError}
        disabled={!name.trim() || !address.trim() || !email.trim() || !phone.trim()}
      >
                 <Box
           sx={{
             display: "flex",
             gap: 2,
             flexDirection: { xs: "column", md: "row" },
             width: "100%",
             mb: 2,
           }}
         >
           <ValidatedTextField
             label="Nombre de la empresa"
             variant="outlined"
             fullWidth
             sx={{ flex: 1 }}
             className="custom-textfield"
             value={name}
             onChange={setName}
             validator={validators.validateName}
             required
           />
           <ValidatedTextField
             label="Email"
             variant="outlined"
             fullWidth
             sx={{ flex: 1 }}
             className="custom-textfield"
             value={email}
             onChange={setEmail}
             validator={validators.validateEmail}
             required
           />
         </Box>

         <Box
           sx={{
             display: "flex",
             gap: 2,
             flexDirection: { xs: "column", md: "row" },
             width: "100%",
             mb: 2,
           }}
         >
           <ValidatedTextField
             label="Dirección"
             variant="outlined"
             fullWidth
             sx={{ flex: 1 }}
             className="custom-textfield"
             value={address}
             onChange={setAddress}
             validator={validators.validateAddress}
             required
           />
           <ValidatedTextField
             label="Teléfono"
             variant="outlined"
             fullWidth
             sx={{ flex: 1 }}
             className="custom-textfield"
             value={phone}
             onChange={setPhone}
             validator={validators.validatePhone}
             required
           />
         </Box>
      </GenericModal>

      {/* Modal de confirmación para eliminar */}
      <DeleteConfirmModal
        open={openDeleteModal}
        onClose={handleDeleteCancel}
        onConfirm={handleDeleteConfirm}
        title="Eliminar Empresa"
        message="¿Estás seguro de que quieres eliminar la empresa"
        itemName={companyToDelete?.name}
        isLoading={isDeleting}
        error={deleteError}
      />
    </Paper>
  );
}

export default Empresas;
