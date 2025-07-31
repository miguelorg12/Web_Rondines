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
  Select,
  MenuItem,
  Button,
  InputAdornment,
} from "@mui/material";
import Pagination from "@mui/material/Pagination";
import Stack from "@mui/material/Stack";
import { logsData } from "../utils/logsData";
import "../components/usuarios/usuarios.css";
import "../components/logs/logs.css";

function Logs() {
  const [filterText, setFilterText] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [fechaInicio, setFechaInicio] = useState("");
  const [fechaFin, setFechaFin] = useState("");

  const filteredData = logsData.filter(
    (item) =>
      (item.numLog.toLowerCase().includes(filterText.toLowerCase()) ||
        item.nombre.toLowerCase().includes(filterText.toLowerCase()) ||
        item.sucursal.toLowerCase().includes(filterText.toLowerCase()) ||
        item.rol.toLowerCase().includes(filterText.toLowerCase()) ||
        item.tipoAccion.toLowerCase().includes(filterText.toLowerCase()) ||
        item.fechaHora.toLowerCase().includes(filterText.toLowerCase())) &&
      (fechaInicio === "" ||
        new Date(item.fechaHora) >= new Date(fechaInicio)) &&
      (fechaFin === "" || new Date(item.fechaHora) <= new Date(fechaFin))
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

  const handleExportarExcel = () => {
    alert("Función de exportar a Excel (simulada)");
    // Aquí irá la lógica real de exportación en el futuro
  };

  return (
    <Paper sx={{ width: "100%", overflow: "hidden", p: 2 }}>
      {/* Botón Exportar a Excel */}
      <div
        style={{
          display: "flex",
          justifyContent: "flex-end",
          marginBottom: 16,
        }}
      >
        <Button className="excel-btn" onClick={handleExportarExcel}>
          Exportar a Excel <i className="fa-solid fa-file-excel"></i>
        </Button>
      </div>
      {/* Filtros */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
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
        {/* Filtro por fechas */}
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <TextField
            label="Fecha inicio"
            type="date"
            size="small"
            value={fechaInicio}
            onChange={(e) => setFechaInicio(e.target.value)}
            InputLabelProps={{ shrink: true }}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <i className="fa-solid fa-calendar-days"></i>
                </InputAdornment>
              ),
            }}
          />
          <TextField
            label="Fecha fin"
            type="date"
            size="small"
            value={fechaFin}
            onChange={(e) => setFechaFin(e.target.value)}
            InputLabelProps={{ shrink: true }}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <i className="fa-solid fa-calendar-days"></i>
                </InputAdornment>
              ),
            }}
          />
        </div>
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
              <TableCell>Num. Log</TableCell>
              <TableCell>Nombre de Usuario</TableCell>
              <TableCell>Sucursal</TableCell>
              <TableCell>Rol</TableCell>
              <TableCell>Tipo de acción</TableCell>
              <TableCell>Fecha y hora</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredData
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((row) => (
                <TableRow key={row.id}>
                  <TableCell>{row.numLog}</TableCell>
                  <TableCell>{row.nombre}</TableCell>
                  <TableCell>{row.sucursal}</TableCell>
                  <TableCell>{row.rol}</TableCell>
                  <TableCell>{row.tipoAccion}</TableCell>
                  <TableCell>{row.fechaHora}</TableCell>
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
    </Paper>
  );
}

export default Logs;
