import { useState } from "react";
import {
  Paper,
  Grid,
  Card,
  CardContent,
  Typography,
  Box,
  CircularProgress,
  Alert,
} from "@mui/material";
import {
  useGetGeneralStatsQuery,
  useGetStatsByBranchQuery,
  useGetStatsByCompanyQuery,
} from "../redux/stats/statsApi";
import StatsDebugger from "../components/common/StatsDebugger";

function Dashboard() {
  // Función para obtener las fechas del primer y último día del mes actual
  const getCurrentMonthDates = () => {
    const now = new Date();
    const firstDay = new Date(now.getFullYear(), now.getMonth(), 1);
    const lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0);
    
    const formatDate = (date: Date) => {
      return date.toLocaleDateString('es-ES', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      });
    };
    
    return {
      start_date: formatDate(firstDay),
      end_date: formatDate(lastDay)
    };
  };

  const { start_date, end_date } = getCurrentMonthDates();

  // API hooks para estadísticas
  const { data: generalStats, error: generalError, isLoading: generalLoading } = useGetGeneralStatsQuery();
  const { data: branchStats, error: branchError, isLoading: branchLoading } = useGetStatsByBranchQuery();
  const { data: companyStats, error: companyError, isLoading: companyLoading } = useGetStatsByCompanyQuery();

  const isLoading = generalLoading || branchLoading || companyLoading;
  const hasError = generalError || branchError || companyError;

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (hasError) {
    console.error('❌ Errores en Dashboard:', {
      generalError,
      branchError,
      companyError
    });
    
    return (
      <Box sx={{ p: 3 }}>
        <Typography variant="h4" gutterBottom>
          Dashboard
        </Typography>
        <Typography variant="body2" color="textSecondary" sx={{ mb: 3 }}>
          Período: {start_date} - {end_date}
        </Typography>
        
        <Alert severity="error" sx={{ mb: 2 }}>
          Error al cargar las estadísticas del dashboard
        </Alert>
        
        <Paper sx={{ p: 3 }}>
          <Typography variant="h6" gutterBottom>
            Detalles del Error:
          </Typography>
          <Box sx={{ fontFamily: 'monospace', fontSize: '0.875rem' }}>
            <Typography variant="body2" color="error">
              General Stats Error: {generalError ? JSON.stringify(generalError, null, 2) : 'None'}
            </Typography>
            <Typography variant="body2" color="error" sx={{ mt: 1 }}>
              Branch Stats Error: {branchError ? JSON.stringify(branchError, null, 2) : 'None'}
            </Typography>
            <Typography variant="body2" color="error" sx={{ mt: 1 }}>
              Company Stats Error: {companyError ? JSON.stringify(companyError, null, 2) : 'None'}
            </Typography>
          </Box>
        </Paper>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Dashboard
      </Typography>
      <Typography variant="body2" color="textSecondary" sx={{ mb: 3 }}>
        Período: {start_date} - {end_date}
      </Typography>

      {/* Estadísticas Generales */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12}>
          <Typography variant="h5" gutterBottom>
            Estadísticas Generales
          </Typography>
        </Grid>
        {generalStats && (
          <>
            <Grid item xs={12} sm={6} md={3}>
              <Card>
                <CardContent>
                  <Typography color="textSecondary" gutterBottom>
                    Total de Incidentes
                  </Typography>
                  <Typography variant="h4">
                    {generalStats.totalIncidents}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Card>
                <CardContent>
                  <Typography color="textSecondary" gutterBottom>
                    Incidentes Resueltos
                  </Typography>
                  <Typography variant="h4" color="success.main">
                    {generalStats.resolvedIncidents}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Card>
                <CardContent>
                  <Typography color="textSecondary" gutterBottom>
                    Incidentes Pendientes
                  </Typography>
                  <Typography variant="h4" color="warning.main">
                    {generalStats.pendingIncidents}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Card>
                <CardContent>
                  <Typography color="textSecondary" gutterBottom>
                    Incidentes Críticos
                  </Typography>
                  <Typography variant="h4" color="error.main">
                    {generalStats.criticalIncidents}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          </>
        )}
      </Grid>

      {/* Gráfica de Reportes por Sucursal */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12}>
          <Typography variant="h5" gutterBottom>
            Reportes por Sucursal
          </Typography>
        </Grid>
        <Grid item xs={12}>
          <Paper sx={{ p: 3, minHeight: 400 }}>
            {branchStats && branchStats.length > 0 ? (
              <Box>
                <Typography variant="h6" gutterBottom>
                  Datos disponibles para gráfica
                </Typography>
                <Box sx={{ mt: 2 }}>
                  {branchStats.map((branch, index) => (
                    <Box key={branch.branchId} sx={{ mb: 2, p: 2, border: '1px solid #e0e0e0', borderRadius: 1 }}>
                      <Typography variant="subtitle1" fontWeight="bold">
                        {branch.branchName}
                      </Typography>
                      <Typography variant="body2" color="textSecondary">
                        Total: {branch.totalIncidents} | Resueltos: {branch.resolvedIncidents} | Pendientes: {branch.pendingIncidents}
                      </Typography>
                    </Box>
                  ))}
                </Box>
              </Box>
            ) : (
              <Typography variant="body1" color="textSecondary">
                No hay datos disponibles para mostrar la gráfica de reportes por sucursal
              </Typography>
            )}
          </Paper>
        </Grid>
      </Grid>

      {/* Gráfica de Reportes por Empresa */}
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Typography variant="h5" gutterBottom>
            Reportes por Empresa
          </Typography>
        </Grid>
        <Grid item xs={12}>
          <Paper sx={{ p: 3, minHeight: 400 }}>
            {companyStats && companyStats.length > 0 ? (
              <Box>
                <Typography variant="h6" gutterBottom>
                  Datos disponibles para gráfica
                </Typography>
                <Box sx={{ mt: 2 }}>
                  {companyStats.map((company, index) => (
                    <Box key={company.companyId} sx={{ mb: 2, p: 2, border: '1px solid #e0e0e0', borderRadius: 1 }}>
                      <Typography variant="subtitle1" fontWeight="bold">
                        {company.companyName}
                      </Typography>
                      <Typography variant="body2" color="textSecondary">
                        Total: {company.totalIncidents} | Resueltos: {company.resolvedIncidents} | Pendientes: {company.pendingIncidents}
                      </Typography>
                    </Box>
                  ))}
                </Box>
              </Box>
            ) : (
              <Typography variant="body1" color="textSecondary">
                No hay datos disponibles para mostrar la gráfica de reportes por empresa
              </Typography>
            )}
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
}

export default Dashboard;
