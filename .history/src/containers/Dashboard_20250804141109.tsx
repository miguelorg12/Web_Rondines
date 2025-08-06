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
  
  // Función para calcular estadísticas derivadas
  const calculateDerivedStats = (stats: GeneralStats) => {
    const resolvedIncidents = stats.by_status.find(s => s.status === 'completado')?.count || '0';
    const pendingIncidents = stats.by_status.find(s => s.status === 'pendiente')?.count || '0';
    const criticalIncidents = stats.by_severity.find(s => s.severity === 'alta')?.count || '0';
    
    return {
      resolvedIncidents: parseInt(resolvedIncidents),
      pendingIncidents: parseInt(pendingIncidents),
      criticalIncidents: parseInt(criticalIncidents)
    };
  };
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
  }

  return (
    <Box sx={{ p: 3 }}>
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
         {generalStats ? (
          <>
            <Grid item xs={12} sm={6} md={3}>
              <Card>
                <CardContent>
                  <Typography color="textSecondary" gutterBottom>
                    Total de Incidentes
                  </Typography>
                  <Typography variant="h4">
                    {generalStats.total_incidents}
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
                    {generalStats ? calculateDerivedStats(generalStats).resolvedIncidents : 0}
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
                    {generalStats ? calculateDerivedStats(generalStats).pendingIncidents : 0}
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
                    {generalStats ? calculateDerivedStats(generalStats).criticalIncidents : 0}
                  </Typography>
                </CardContent>
              </Card>
                         </Grid>
           </>
         ) : (
           <Grid item xs={12}>
             <Alert severity="warning">
               No se pudieron cargar las estadísticas generales
             </Alert>
           </Grid>
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
                     <Box key={branch.branch_id} sx={{ mb: 2, p: 2, border: '1px solid #e0e0e0', borderRadius: 1 }}>
                       <Typography variant="subtitle1" fontWeight="bold">
                         {branch.branch_name}
                       </Typography>
                       <Typography variant="body2" color="textSecondary">
                         Empresa: {branch.company_name} | Total de incidentes: {branch.total_incidents}
            </Typography>
                     </Box>
                   ))}
                 </Box>
               </Box>
             ) : (
               <Alert severity="info">
                 No hay datos disponibles para mostrar la gráfica de reportes por sucursal
               </Alert>
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
                     <Box key={company.company_id} sx={{ mb: 2, p: 2, border: '1px solid #e0e0e0', borderRadius: 1 }}>
                       <Typography variant="subtitle1" fontWeight="bold">
                         {company.company_name}
                       </Typography>
                       <Typography variant="body2" color="textSecondary">
                         Total de incidentes: {company.total_incidents} | Sucursales: {company.branches_count}
            </Typography>
                     </Box>
                   ))}
                 </Box>
               </Box>
             ) : (
               <Alert severity="info">
                 No hay datos disponibles para mostrar la gráfica de reportes por empresa
               </Alert>
             )}
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
}

export default Dashboard;
