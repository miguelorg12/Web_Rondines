import React, { useState } from "react";
import {
  Box,
  TextField,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  Button,
} from "@mui/material";
import type { SelectChangeEvent } from "@mui/material";
import { useNavigate } from "react-router-dom";
import "../components/usuarios/usuarios.css";

function CrearUsuario() {
  const [rol, setRol] = useState("");
  const [sucursal, setSucursal] = useState("");
  const navigate = useNavigate();

  const handleChangeRol = (e: SelectChangeEvent) =>
    setRol(e.target.value as string);
  const handleChangeSucursal = (e: SelectChangeEvent) =>
    setSucursal(e.target.value as string);

  const handleCancelar = () => {
    navigate("/usuarios");
  };

  const handleCrear = () => {
    // Aquí irá el POST a la API en el futuro
    alert("Usuario creado (simulado)");
  };

  return (
    <Box sx={{ width: "100%" }}>
      <p className="cu-p">Registrar usuarios</p>
      <p className="cu-p2">Datos personales</p>
      <Box
        sx={{
          display: "flex",
          gap: 2,
          flexDirection: { xs: "column", md: "row" },
          width: "100%",
        }}
      >
        <TextField
          label="Nombre"
          variant="outlined"
          fullWidth
          sx={{ flex: 1 }}
          className="custom-textfield"
        />
        <TextField
          label="Apellidos"
          variant="outlined"
          fullWidth
          sx={{ flex: 1 }}
          className="custom-textfield"
        />
        <TextField
          label="CURP"
          variant="outlined"
          fullWidth
          sx={{ flex: 1 }}
          className="custom-textfield"
        />
      </Box>

      <p className="cu-p2">Datos de contacto</p>
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
        />
        <TextField
          label="Teléfono"
          variant="outlined"
          fullWidth
          sx={{ flex: 1 }}
          className="custom-textfield"
        />
      </Box>

      <p className="cu-p2">Datos del usuario</p>
      <Box
        sx={{
          display: "flex",
          gap: 2,
          flexDirection: { xs: "column", md: "row" },
          width: "100%",
        }}
      >
        <TextField
          label="Nombre de usuario"
          variant="outlined"
          fullWidth
          sx={{ flex: 1 }}
          className="custom-textfield"
        />
        <TextField
          label="Contraseña"
          variant="outlined"
          type="password"
          fullWidth
          sx={{ flex: 1 }}
          className="custom-textfield"
        />
        <TextField
          label="Confirmar contraseña"
          variant="outlined"
          type="password"
          fullWidth
          sx={{ flex: 1 }}
          className="custom-textfield"
        />
      </Box>
      <Box
        sx={{
          display: "flex",
          gap: 2,
          flexDirection: { xs: "column", md: "row" },
          width: "100%",
          mt: 2,
        }}
      >
        <FormControl fullWidth sx={{ flex: 1 }}>
          {rol === "" && (
            <InputLabel id="rol-label" shrink={false}>
              Rol
            </InputLabel>
          )}
          <Select
            labelId="rol-label"
            value={rol}
            onChange={handleChangeRol}
            className="custom-textfield"
            displayEmpty
            inputProps={{ "aria-label": "Rol" }}
          >
            <MenuItem value="admin">Admin</MenuItem>
            <MenuItem value="usuario">Usuario</MenuItem>
            <MenuItem value="supervisor">Supervisor</MenuItem>
          </Select>
        </FormControl>
        <FormControl fullWidth sx={{ flex: 1 }}>
          {sucursal === "" && (
            <InputLabel id="sucursal-label" shrink={false}>
              Sucursal
            </InputLabel>
          )}
          <Select
            labelId="sucursal-label"
            value={sucursal}
            onChange={handleChangeSucursal}
            className="custom-textfield"
            displayEmpty
            inputProps={{ "aria-label": "Sucursal" }}
          >
            <MenuItem value="centro">Centro</MenuItem>
            <MenuItem value="norte">Norte</MenuItem>
            <MenuItem value="sur">Sur</MenuItem>
          </Select>
        </FormControl>
      </Box>

      {/* Botones al final, alineados a la derecha */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "flex-end",
          gap: 2,
          mt: 4,
        }}
      >
        <Button className="cancel-btn" onClick={handleCancelar}>
          Cancelar
        </Button>
        <Button className="create-btn" onClick={handleCrear}>
          Crear
        </Button>
      </Box>
    </Box>
  );
}

export default CrearUsuario;
