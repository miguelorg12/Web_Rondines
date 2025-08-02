import { useState, useEffect } from "react";
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
  FormControl,
  InputLabel,
  Alert,
  CircularProgress,
} from "@mui/material";
import type { SelectChangeEvent } from "@mui/material";
import Pagination from "@mui/material/Pagination";
import Stack from "@mui/material/Stack";
import { useGetBranchesQuery, useCreateBranchMutation, useUpdateBranchMutation, useDeleteBranchMutation } from "../redux/branches/branchesApi";
import { useGetCompaniesQuery } from "../redux/companies/companiesApi";
import { useGetUsersQuery } from "../redux/users/usersApi";
import type { CreateBranch, UpdateBranch, Branch } from "../interfaces";
import GenericModal from "../components/common/GenericModal";
import DeleteConfirmModal from "../components/common/DeleteConfirmModal";
import { useToast } from "../contexts/ToastContext";
import "../components/usuarios/usuarios.css";

interface ApiError {
  status?: number;
  data?: unknown;
  error?: string;
}

function Sucursales() {
  const [filterText, setFilterText] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [openModal, setOpenModal] = useState(false);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [editingBranch, setEditingBranch] = useState<Branch | null>(null);
  const [branchToDelete, setBranchToDelete] = useState<Branch | null>(null);
  
  // Toast hook
  const { showToast } = useToast();

  // Campos del modal
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [companyId, setCompanyId] = useState<number | "">("");
  const [userId, setUserId] = useState<number | "">("");

  // API hooks
  const { data: branches = [], error, isLoading, refetch } = useGetBranchesQuery();
  const { data: companies = [], isLoading: isLoadingCompanies } = useGetCompaniesQuery();
  const { data: users = [], isLoading: isLoadingUsers } = useGetUsersQuery();

  // Debug: Log cuando los datos cambian
  useEffect(() => {
    if (companies.length > 0) {
      console.log("Companies loaded:", companies);
    }
    if (users.length > 0) {
      console.log("Users loaded:", users);
    }
    if (branches.length > 0) {
      console.log("Branches loaded:", branches);
      console.log("Primera sucursal:", branches[0]);
    }
  }, [companies, users, branches]);
  
  // Asegurar que branches sea un array
  const safeBranches = Array.isArray(branches) ? branches : [];
  
  const [createBranch, { isLoading: isCreating, error: createError }] = useCreateBranchMutation();
  const [updateBranch, { isLoading: isUpdating, error: updateError }] = useUpdateBranchMutation();
  const [deleteBranch, { isLoading: isDeleting, error: deleteError }] = useDeleteBranchMutation();

  const filteredData = safeBranches.filter((item) => {
    if (!item || typeof item !== 'object') return false;
    
    return (
      (item.name?.toLowerCase() || '').includes(filterText.toLowerCase()) ||
      (item.address?.toLowerCase() || '').includes(filterText.toLowerCase())
    );
  });

  const handleChangeRowsPerPage = (event: SelectChangeEvent<number>) => {
    setRowsPerPage(Number(event.target.value));
    setPage(0);
  };

  const handleOpenModal = (branch?: Branch) => {
    if (branch) {
      setEditingBranch(branch);
      setName(branch.name || "");
      setAddress(branch.address || "");
      // Usar los IDs de los objetos anidados si existen
      setCompanyId(branch.company?.id || "");
      setUserId(branch.user?.id || "");
      console.log("Editando sucursal:", branch);
      console.log("company_id:", branch.company?.id);
      console.log("user_id:", branch.user?.id);
    } else {
      setEditingBranch(null);
      setName("");
      setAddress("");
      setCompanyId("");
      setUserId("");
    }
    setOpenModal(true);
  };
  
  const handleCloseModal = () => {
    setOpenModal(false);
    setEditingBranch(null);
    // Limpiar el formulario
    setName("");
    setAddress("");
    setCompanyId("");
    setUserId("");
  };

  const handleSaveBranch = async () => {
    if (!companyId || !userId) {
      setToast({
        open: true,
        message: "Debes seleccionar una empresa y un usuario",
        severity: 'error'
      });
      return;
    }

    if (editingBranch) {
      // Actualizar sucursal
      const updateData: UpdateBranch = {
        name: name || undefined,
        address: address || undefined,
      };

      // Solo agregar user_id si está seleccionado
      if (userId) {
        updateData.user_id = userId as number;
      }

      // Solo agregar company_id si está seleccionado
      if (companyId) {
        updateData.company_id = companyId as number;
      }

      console.log('🔍 Datos de actualización:', updateData);

      try {
        await updateBranch({ id: editingBranch.id, data: updateData }).unwrap();
        handleCloseModal();
        refetch();
        setToast({
          open: true,
          message: "Sucursal actualizada correctamente",
          severity: 'success'
        });
      } catch (err: unknown) {
        console.error("Error al actualizar sucursal:", err);
        const apiError = err as ApiError;
        console.error("Error details:", {
          status: apiError.status,
          data: apiError.data,
          error: apiError.error
        });
        setToast({
          open: true,
          message: `Error al actualizar sucursal: ${apiError.status || 'Error desconocido'}`,
          severity: 'error'
        });
      }
    } else {
      // Crear nueva sucursal
      const newBranch: CreateBranch = {
        name,
        address,
        company_id: companyId as number,
        user_id: userId as number,
      };

      try {
        await createBranch(newBranch).unwrap();
        handleCloseModal();
        refetch();
        setToast({
          open: true,
          message: "Sucursal creada correctamente",
          severity: 'success'
        });
      } catch (err) {
        console.error("Error al crear sucursal:", err);
        setToast({
          open: true,
          message: "Error al crear sucursal",
          severity: 'error'
        });
      }
    }
  };

  const handleDeleteClick = (branch: Branch) => {
    setBranchToDelete(branch);
    setOpenDeleteModal(true);
  };

  const handleDeleteConfirm = async () => {
    if (branchToDelete) {
      try {
        await deleteBranch(branchToDelete.id).unwrap();
        setOpenDeleteModal(false);
        setBranchToDelete(null);
        refetch();
        setToast({
          open: true,
          message: "Sucursal eliminada correctamente",
          severity: 'success'
        });
      } catch (err) {
        console.error("Error al eliminar sucursal:", err);
        setToast({
          open: true,
          message: "Error al eliminar sucursal",
          severity: 'error'
        });
      }
    }
  };

  const handleDeleteCancel = () => {
    setOpenDeleteModal(false);
    setBranchToDelete(null);
  };

  // Función para obtener el nombre de la empresa
  const getCompanyName = (branch: Branch) => {
    return branch.company?.name || 'N/A';
  };

  // Función para obtener el nombre del usuario
  const getUserName = (branch: Branch) => {
    if (!branch.user) return 'N/A';
    return `${branch.user.name} ${branch.user.last_name}`;
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
        <Button className="create-user-btn" onClick={() => handleOpenModal()}>
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
              <TableCell>ID</TableCell>
              <TableCell>Nombre</TableCell>
              <TableCell>Dirección</TableCell>
              <TableCell>Empresa</TableCell>
              <TableCell>Manager</TableCell>
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
                   <TableCell>{getCompanyName(row)}</TableCell>
                   <TableCell>{getUserName(row)}</TableCell>
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

      {/* Modal genérico para crear/editar sucursal */}
      <GenericModal
        open={openModal}
        onClose={handleCloseModal}
        title={editingBranch ? "Editar Sucursal" : "Crear Sucursal"}
        onConfirm={handleSaveBranch}
        confirmText={editingBranch ? "Actualizar" : "Crear"}
        isLoading={isCreating || isUpdating}
        error={createError || updateError}
        disabled={!name.trim() || !address.trim() || !companyId || !userId || companies.length === 0 || users.length === 0 || isLoadingCompanies || isLoadingUsers}
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
          <TextField
            label="Dirección"
            variant="outlined"
            fullWidth
            sx={{ flex: 1 }}
            className="custom-textfield"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            required
          />
        </Box>

        <Box
          sx={{
            display: "flex",
            gap: 2,
            flexDirection: { xs: "column", md: "row" },
            width: "100%",
          }}
        >
          <FormControl fullWidth sx={{ flex: 1 }}>
            <InputLabel id="company-label">Empresa</InputLabel>
                         <Select
               labelId="company-label"
               value={companyId || ""}
               onChange={(e) => setCompanyId(Number(e.target.value))}
               className="custom-textfield"
               label="Empresa"
               required
               disabled={isLoadingCompanies}
             >
               {isLoadingCompanies ? (
                 <MenuItem disabled>Cargando empresas...</MenuItem>
               ) : (
                 companies.map((company) => (
                   <MenuItem key={company.id} value={company.id}>
                     {company.name}
                   </MenuItem>
                 ))
               )}
             </Select>
          </FormControl>

          <FormControl fullWidth sx={{ flex: 1 }}>
            <InputLabel id="user-label">Manager</InputLabel>
                         <Select
               labelId="user-label"
               value={userId || ""}
               onChange={(e) => setUserId(Number(e.target.value))}
               className="custom-textfield"
               label="Manager"
               required
               disabled={isLoadingUsers}
             >
               {isLoadingUsers ? (
                 <MenuItem disabled>Cargando usuarios...</MenuItem>
               ) : (
                 users.map((user) => (
                   <MenuItem key={user.id} value={user.id}>
                     {user.name} {user.last_name}
                   </MenuItem>
                 ))
               )}
             </Select>
          </FormControl>
        </Box>
      </GenericModal>

      {/* Modal de confirmación para eliminar */}
      <DeleteConfirmModal
        open={openDeleteModal}
        onClose={handleDeleteCancel}
        onConfirm={handleDeleteConfirm}
        title="Eliminar Sucursal"
        message="¿Estás seguro de que quieres eliminar la sucursal"
        itemName={branchToDelete?.name}
        isLoading={isDeleting}
        error={deleteError}
             />

       {/* Toast notifications */}
       <Snackbar
         open={toast.open}
         autoHideDuration={6000}
         onClose={() => setToast({ ...toast, open: false })}
         anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
       >
         <Alert 
           onClose={() => setToast({ ...toast, open: false })} 
           severity={toast.severity}
           sx={{ width: '100%' }}
         >
           {toast.message}
         </Alert>
       </Snackbar>
     </Paper>
   );
 }

export default Sucursales;
