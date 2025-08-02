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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Box,
  FormControl,
  InputLabel,
  Alert,
  CircularProgress,
} from "@mui/material";
import type { SelectChangeEvent } from "@mui/material";
import Pagination from "@mui/material/Pagination";
import Stack from "@mui/material/Stack";
import { useGetUsersQuery, useCreateUserMutation, useDeleteUserMutation } from "../redux/users/usersApi";
import { useGetBranchesQuery } from "../redux/branches/branchesApi";
import type { CreateUser } from "../interfaces";
import { validators } from "../utils/validators";
import ValidatedTextField from "../components/common/ValidatedTextField";
import "../components/usuarios/usuarios.css";

function Usuarios() {
  const [filterText, setFilterText] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [openModal, setOpenModal] = useState(false);
  
  // Estados para el formulario del modal
  const [name, setName] = useState("");
  const [lastName, setLastName] = useState("");
  const [curp, setCurp] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  // biometric se maneja automáticamente
  const [roleId, setRoleId] = useState<number | "">("");
  const [branchId, setBranchId] = useState<number | "">("");
  
  // API hooks
  const { data: users = [], error, isLoading, refetch } = useGetUsersQuery();
  const { data: branches = [] } = useGetBranchesQuery();
  const [createUser, { isLoading: isCreating, error: createError }] = useCreateUserMutation();
  const [deleteUser, { isLoading: isDeleting }] = useDeleteUserMutation();

  // Filtrar usuarios
  const filteredData = users.filter(
    (item) =>
      item.name.toLowerCase().includes(filterText.toLowerCase()) ||
      item.last_name.toLowerCase().includes(filterText.toLowerCase()) ||
      item.email.toLowerCase().includes(filterText.toLowerCase()) ||
      item.curp.toLowerCase().includes(filterText.toLowerCase()) ||
      item.role.name.toLowerCase().includes(filterText.toLowerCase())
  );

  const handleChangeRowsPerPage = (event: SelectChangeEvent<number>) => {
    setRowsPerPage(Number(event.target.value));
    setPage(0);
  };

  const handleOpenModal = () => {
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    // Limpiar el formulario
    setName("");
    setLastName("");
    setCurp("");
    setEmail("");
    setPassword("");
    setConfirmPassword("");
    setRoleId("");
    setBranchId("");
  };

  const handleCreateUser = async () => {
    if (password !== confirmPassword) {
      alert("Las contraseñas no coinciden");
      return;
    }

    const userData = {
      name,
      last_name: lastName,
      curp,
      email,
      password,
      role_id: roleId as number,
      branch_id: branchId as number,
    };

    // Usar la función helper para agregar biometric automáticamente
    const newUser: CreateUser = {
      ...userData,
      biometric: 0, // Se envía automáticamente como 0 (número)
    };

    try {
      await createUser(newUser).unwrap();
      handleCloseModal();
      refetch(); // Refrescar la lista
    } catch (err) {
      console.error("Error al crear usuario:", err);
    }
  };

  const handleDeleteUser = async (userId: number) => {
    if (window.confirm("¿Estás seguro de que quieres eliminar este usuario?")) {
      try {
        await deleteUser(userId).unwrap();
        refetch(); // Refrescar la lista
      } catch (err) {
        console.error("Error al eliminar usuario:", err);
      }
    }
  };

  if (isLoading) {
    return (
      <Paper sx={{ width: "100%", overflow: "hidden", p: 2, textAlign: "center" }}>
        <CircularProgress />
        <div>Cargando usuarios...</div>
      </Paper>
    );
  }

  if (error) {
    return (
      <Paper sx={{ width: "100%", overflow: "hidden", p: 2 }}>
        <Alert severity="error">Error al cargar usuarios</Alert>
      </Paper>
    );
  }

  return (
    <Paper sx={{ width: "100%", overflow: "hidden", p: 2 }}>
      {/* Botón Crear usuario */}
      <div
        style={{
          display: "flex",
          justifyContent: "flex-end",
          marginBottom: 16,
        }}
      >
        <Button className="create-user-btn" onClick={handleOpenModal}>
          Crear usuario
        </Button>
      </div>
      
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
              <TableCell>Nombre</TableCell>
              <TableCell>Apellido</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>CURP</TableCell>
              <TableCell>Rol</TableCell>
              <TableCell>Estado</TableCell>
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
                  <TableCell>{row.last_name}</TableCell>
                  <TableCell>{row.email}</TableCell>
                  <TableCell>{row.curp}</TableCell>
                  <TableCell>{row.role.name}</TableCell>
                  <TableCell>
                    <span style={{ 
                      color: row.active ? 'green' : 'red',
                      fontWeight: 'bold'
                    }}>
                      {row.active ? 'Activo' : 'Inactivo'}
                    </span>
                  </TableCell>
                  <TableCell>
                    <button className="action-btn edit-btn" title="Editar">
                      <i className="fa-solid fa-pen-to-square"></i>
                    </button>
                    <button 
                      className="action-btn delete-btn" 
                      title="Eliminar"
                      onClick={() => handleDeleteUser(row.id)}
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

      {/* Modal para crear usuario */}
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
          <p className="cu-p" style={{ margin: 0 }}>Crear Usuario</p>
        </DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 1 }}>
            {createError && (
              <Alert severity="error" sx={{ mb: 2 }}>
                Error al crear usuario
              </Alert>
            )}
            
            <p className="cu-p2">Datos personales</p>
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
                 label="Nombre"
                 value={name}
                 onChange={(value) => setName(value)}
                 validator={validators.validateName}
                 fullWidth
                 sx={{ flex: 1 }}
                 className="custom-textfield"
                 required
               />
               <ValidatedTextField
                 label="Apellido"
                 value={lastName}
                 onChange={(value) => setLastName(value)}
                 validator={validators.validateName}
                 fullWidth
                 sx={{ flex: 1 }}
                 className="custom-textfield"
                 required
               />
               <ValidatedTextField
                 label="CURP"
                 value={curp}
                 onChange={(value) => setCurp(value)}
                 validator={validators.validateCURP}
                 fullWidth
                 sx={{ flex: 1 }}
                 className="custom-textfield"
                 required
                 placeholder="GODE560427MDFLML09"
               />
            </Box>

            <p className="cu-p2">Datos de contacto</p>
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
                label="Email"
                variant="outlined"
                fullWidth
                sx={{ flex: 1 }}
                className="custom-textfield"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              {/* Campo biométrico se maneja automáticamente */}
              <Box sx={{ flex: 1, p: 2, bgcolor: 'info.50', borderRadius: 1, border: '1px solid #1976d2' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: '0.875rem', color: '#1976d2' }}>
                  <span style={{ fontSize: '1.2em' }}>ℹ️</span>
                  <strong>Campo Biométrico:</strong> Se maneja automáticamente
                </div>
              </Box>
            </Box>

            <p className="cu-p2">Datos del usuario</p>
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
                label="Contraseña"
                variant="outlined"
                type="password"
                fullWidth
                sx={{ flex: 1 }}
                className="custom-textfield"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <TextField
                label="Confirmar contraseña"
                variant="outlined"
                type="password"
                fullWidth
                sx={{ flex: 1 }}
                className="custom-textfield"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
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
                <InputLabel id="role-label">Rol</InputLabel>
                <Select
                  labelId="role-label"
                  value={roleId}
                  onChange={(e) => setRoleId(Number(e.target.value))}
                  className="custom-textfield"
                  label="Rol"
                  required
                >
                  <MenuItem value={1}>SuperAdmin</MenuItem>
                  <MenuItem value={2}>CompanyAdmin</MenuItem>
                  <MenuItem value={3}>BranchAdmin</MenuItem>
                  <MenuItem value={4}>Guard</MenuItem>
                </Select>
              </FormControl>
              <FormControl fullWidth sx={{ flex: 1 }}>
                <InputLabel id="branch-label">Sucursal</InputLabel>
                <Select
                  labelId="branch-label"
                  value={branchId}
                  onChange={(e) => setBranchId(Number(e.target.value))}
                  className="custom-textfield"
                  label="Sucursal"
                >
                  {branches.map((branch) => (
                    <MenuItem key={branch.id} value={branch.id}>
                      {branch.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>
            
            {/* Mensaje informativo sobre el campo biométrico */}
            <Box sx={{ mt: 2, p: 2, bgcolor: 'warning.50', borderRadius: 1, border: '1px solid #ed6c02' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: '0.875rem', color: '#ed6c02' }}>
                <span style={{ fontSize: '1.2em' }}>⚠️</span>
                <strong>Nota:</strong> El campo "Datos Biométricos" se envía automáticamente como null. 
                Este campo quedará pendiente para futuras implementaciones.
              </div>
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
            onClick={handleCreateUser}
            disabled={isCreating}
          >
            {isCreating ? 'Creando...' : 'Crear'}
          </Button>
        </DialogActions>
      </Dialog>
    </Paper>
  );
}

export default Usuarios;
