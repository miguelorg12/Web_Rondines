import { Box, TextField, Button } from "@mui/material";

function CrearUsuario() {
  return (
    <Box>
      <TextField fullWidth label="Nombre" variant="outlined" />
      <TextField fullWidth label="Email" variant="outlined" />
      <Button variant="contained" color="primary">
        Crear Usuario
      </Button>
    </Box>
  );
}

export default CrearUsuario;
