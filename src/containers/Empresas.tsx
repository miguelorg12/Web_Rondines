import React, { useState } from "react";
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
  Modal,
  Box,
  Select,
  MenuItem,
} from "@mui/material";
import Pagination from "@mui/material/Pagination";
import Stack from "@mui/material/Stack";
import { empresasData } from "../utils/empresasData";
import "../components/usuarios/usuarios.css";

function Empresas() {
  const [filterText, setFilterText] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [openModal, setOpenModal] = useState(false);

  // Campos del modal
  const [nombre, setNombre] = useState("");
  const [email, setEmail] = useState("");
  const [telefono, setTelefono] = useState("");

  const filteredData = empresasData.filter(
    (item) =>
      item.numEmpresa.toLowerCase().includes(filterText.toLowerCase()) ||
      item.nombre.toLowerCase().includes(filterText.toLowerCase()) ||
      item.direccion.toLowerCase().includes(filterText.toLowerCase())
  );

  const handleChangePage = (_: unknown, newPage: number) => setPage(newPage);
  const handleChangeRowsPerPage = (
    event:
      | React.ChangeEvent<{ value: unknown }>
      | React.ChangeEvent<HTMLInputElement>
      | any
  ) => {
    setRowsPerPage(parseInt(event.target.value as string, 10));
    setPage(0);
  };

  const handleOpenModal = () => setOpenModal(true);
  const handleCloseModal = () => setOpenModal(false);

  const handleCrearEmpresa = () => {
    alert("Empresa creada (simulado)");
    setOpenModal(false);
    setNombre("");
    setEmail("");
    setTelefono("");
  };

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
              <TableCell>Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredData
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((row) => (
                <TableRow key={row.id}>
                  <TableCell>{row.numEmpresa}</TableCell>
                  <TableCell>{row.nombre}</TableCell>
                  <TableCell>{row.direccion}</TableCell>
                  <TableCell>
                    <button className="action-btn edit-btn" title="Editar">
                      <i className="fa-solid fa-pen-to-square"></i>
                    </button>
                    <button className="action-btn delete-btn" title="Eliminar">
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
      <Modal open={openModal} onClose={handleCloseModal}>
        <Box
          sx={{
            background: "#fff",
            borderRadius: 2,
            boxShadow: 24,
            p: 4,
            width: 350,
            mx: "auto",
            mt: "10vh",
            display: "flex",
            flexDirection: "column",
            gap: 2,
          }}
        >
          <h2 style={{ color: "#1e2a38", marginBottom: 10, fontWeight: 600 }}>
            Registrar Empresa
          </h2>
          <TextField
            label="Nombre de la empresa"
            variant="outlined"
            fullWidth
            className="custom-textfield"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
          />
          <TextField
            label="Email"
            variant="outlined"
            fullWidth
            className="custom-textfield"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <TextField
            label="Teléfono"
            variant="outlined"
            fullWidth
            className="custom-textfield"
            value={telefono}
            onChange={(e) => setTelefono(e.target.value)}
          />
          <Box
            sx={{ display: "flex", justifyContent: "flex-end", gap: 2, mt: 2 }}
          >
            <Button className="cancel-btn" onClick={handleCloseModal}>
              Cancelar
            </Button>
            <Button className="create-btn" onClick={handleCrearEmpresa}>
              Crear
            </Button>
          </Box>
        </Box>
      </Modal>
    </Paper>
  );
}

export default Empresas;
