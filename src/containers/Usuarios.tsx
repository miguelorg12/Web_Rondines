import React, { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TablePagination,
  TextField,
  Select,
  MenuItem,
} from "@mui/material";
import { usuariosData } from "../utils/usuariosData";
import "../components/usuarios/usuarios.css";

function Usuarios() {
  const [filterText, setFilterText] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const filteredData = usuariosData.filter(
    (item) =>
      item.numUsuario.toLowerCase().includes(filterText.toLowerCase()) ||
      item.nombre.toLowerCase().includes(filterText.toLowerCase()) ||
      item.sucursal.toLowerCase().includes(filterText.toLowerCase()) ||
      item.rol.toLowerCase().includes(filterText.toLowerCase()) ||
      item.curp.toLowerCase().includes(filterText.toLowerCase())
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

  return (
    <Paper sx={{ width: "100%", overflow: "hidden", p: 2 }}>
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
              <TableCell>Num. Usuario</TableCell>
              <TableCell>Nombre</TableCell>
              <TableCell>Sucursal</TableCell>
              <TableCell>Rol</TableCell>
              <TableCell>CURP</TableCell>
              <TableCell>Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredData
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((row) => (
                <TableRow key={row.id}>
                  <TableCell>{row.numUsuario}</TableCell>
                  <TableCell>{row.nombre}</TableCell>
                  <TableCell>{row.sucursal}</TableCell>
                  <TableCell>{row.rol}</TableCell>
                  <TableCell>{row.curp}</TableCell>
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
      <TablePagination
        component="div"
        count={filteredData.length}
        page={page}
        onPageChange={handleChangePage}
        rowsPerPage={rowsPerPage}
        onRowsPerPageChange={handleChangeRowsPerPage}
        rowsPerPageOptions={[5, 10, 15]}
        labelRowsPerPage="Filas por página"
      />
    </Paper>
  );
}

export default Usuarios;
