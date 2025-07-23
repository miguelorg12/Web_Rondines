import { Box, Typography, Grid, Paper } from "@mui/material";
import { BarChart, PieChart, LineChart } from "@mui/x-charts";

function Dashboard() {
  // Datos hardcodeados de ejemplo
  const usuariosPorRol = [
    { rol: "Admin", cantidad: 3 },
    { rol: "Usuario", cantidad: 7 },
    { rol: "Supervisor", cantidad: 2 },
  ];

  const sucursales = [
    { sucursal: "Centro", cantidad: 5 },
    { sucursal: "Norte", cantidad: 3 },
    { sucursal: "Sur", cantidad: 4 },
  ];

  const logsPorDia = [
    { dia: "Lun", logs: 10 },
    { dia: "Mar", logs: 15 },
    { dia: "Mié", logs: 8 },
    { dia: "Jue", logs: 12 },
    { dia: "Vie", logs: 20 },
  ];

  const reportesPorTipo = [
    { tipo: "Incidencias", value: 8 },
    { tipo: "Visitas", value: 12 },
    { tipo: "Otros", value: 5 },
  ];

  return (
    <Box>
      <Typography variant="h5" sx={{ mb: 3, fontWeight: 600 }}>
        Resumen general
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12} md={6} lg={4}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="subtitle1" sx={{ mb: 1 }}>
              Usuarios por rol
            </Typography>
            <BarChart
              xAxis={[
                { data: usuariosPorRol.map((u) => u.rol), scaleType: "band" },
              ]}
              series={[
                {
                  data: usuariosPorRol.map((u) => u.cantidad),
                  color: "#3b8ee7",
                },
              ]}
              height={220}
            />
          </Paper>
        </Grid>
        <Grid item xs={12} md={6} lg={4}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="subtitle1" sx={{ mb: 1 }}>
              Sucursales activas
            </Typography>
            <PieChart
              series={[
                {
                  data: sucursales.map((s, i) => ({
                    id: i,
                    value: s.cantidad,
                    label: s.sucursal,
                  })),
                },
              ]}
              height={220}
            />
          </Paper>
        </Grid>
        <Grid item xs={12} md={6} lg={4}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="subtitle1" sx={{ mb: 1 }}>
              Logs por día
            </Typography>
            <LineChart
              xAxis={[
                { data: logsPorDia.map((l) => l.dia), scaleType: "point" },
              ]}
              series={[
                { data: logsPorDia.map((l) => l.logs), color: "#fd5765" },
              ]}
              height={220}
            />
          </Paper>
        </Grid>
        <Grid item xs={12} md={6} lg={4}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="subtitle1" sx={{ mb: 1 }}>
              Reportes por tipo
            </Typography>
            <PieChart
              series={[
                {
                  data: reportesPorTipo.map((r, i) => ({
                    id: i,
                    value: r.value,
                    label: r.tipo,
                  })),
                },
              ]}
              height={220}
            />
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
}

export default Dashboard;
