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
  FormControl,
  InputLabel,
} from "@mui/material";
import Pagination from "@mui/material/Pagination";
import Stack from "@mui/material/Stack";
import { sucursalesData } from "../utils/sucursalesData";
import { empresasData } from "../utils/empresasData";
import { sucursalesColumns } from "../components/sucursales/sucursalesColumns";
import "../components/usuarios/usuarios.css";

function Sucursales() {
  const [filterText, setFilterText] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [openModal, setOpenModal] = useState(false);

  // Campos del modal
  const [nombre, setNombre] = useState("");
  const [direccion, setDireccion] = useState("");
  const [empresa, setEmpresa] = useState("");

  const filteredData = sucursalesData.filter(
    (item) =>
      item.numSucursal.toLowerCase().includes(filterText.toLowerCase()) ||
      item.nombre.toLowerCase().includes(filterText.toLowerCase()) ||
      item.direccion.toLowerCase().includes(filterText.toLowerCase()) ||
      item.empresa.toLowerCase().includes(filterText.toLowerCase())
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

  const handleCrearSucursal = () => {
    alert("Sucursal creada (simulado)");
    setOpenModal(false);
    setNombre("");
    setDireccion("");
    setEmpresa("");
  };

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
              {sucursalesColumns.map((col) => (
                <TableCell key={col.name}>{col.name}</TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredData
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((row) => (
                <TableRow key={row.id}>
                  <TableCell>{row.numSucursal}</TableCell>
                  <TableCell>{row.empresa}</TableCell>
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

      {/* Modal para crear sucursal */}
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
            Registrar Sucursal
          </h2>
          <TextField
            label="Nombre de la sucursal"
            variant="outlined"
            fullWidth
            className="custom-textfield"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
          />
          <TextField
            label="Dirección"
            variant="outlined"
            fullWidth
            className="custom-textfield"
            value={direccion}
            onChange={(e) => setDireccion(e.target.value)}
          />
          <FormControl fullWidth sx={{ mt: 1 }}>
            {empresa === "" && (
              <InputLabel id="empresa-label" shrink={false}>
                Empresa
              </InputLabel>
            )}
            <Select
              labelId="empresa-label"
              value={empresa}
              onChange={(e) => setEmpresa(e.target.value)}
              className="custom-textfield"
              displayEmpty
              inputProps={{ "aria-label": "Empresa" }}
            >
              {empresasData.map((emp) => (
                <MenuItem key={emp.id} value={emp.nombre}>
                  {emp.nombre}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <Box
            sx={{ display: "flex", justifyContent: "flex-end", gap: 2, mt: 2 }}
          >
            <Button className="cancel-btn" onClick={handleCloseModal}>
              Cancelar
            </Button>
            <Button className="create-btn" onClick={handleCrearSucursal}>
              Crear
            </Button>
          </Box>
        </Box>
      </Modal>
    </Paper>
  );
}

export default Sucursales;
