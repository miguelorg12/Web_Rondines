import { Box, Typography, Grid, Card, CardContent } from "@mui/material";

function Dashboard() {
  return (
    <Box>
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Sucursales Activas
              </Typography>
              <Typography variant="h3" color="primary">
                12
              </Typography>
              <Typography variant="body2" color="text.secondary">
                +2.5% desde el mes pasado
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Incidencias Hoy
              </Typography>
              <Typography variant="h3" color="error">
                3
              </Typography>
              <Typography variant="body2" color="text.secondary">
                -1 menos que ayer
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Usuarios Activos
              </Typography>
              <Typography variant="h3" color="success.main">
                248
              </Typography>
              <Typography variant="body2" color="text.secondary">
                +12% esta semana
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Reportes Generados
              </Typography>
              <Typography variant="h3" color="info.main">
                87
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Este mes
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}

export default Dashboard;
