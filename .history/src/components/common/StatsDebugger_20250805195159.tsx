import React from 'react';
import {
  Box,
  Typography,
  Paper,
  Button,
  Alert,
} from '@mui/material';

const StatsDebugger: React.FC = () => {
  const getCurrentMonthDates = () => {
    const now = new Date();
    const firstDay = new Date(now.getFullYear(), now.getMonth(), 1);
    const lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0);
    
    const formatDate = (date: Date) => {
      return date.toISOString().split('T')[0]; // Formato YYYY-MM-DD
    };
    
    return {
      start_date: formatDate(firstDay),
      end_date: formatDate(lastDay)
    };
  };

  const { start_date, end_date } = getCurrentMonthDates();
  const baseUrl = 'https://api-qa.ronditrack.online/api/v1';

  const urls = {
    general: `${baseUrl}/incidents/stats/general?start_date=${start_date}&end_date=${end_date}`,
    byBranch: `${baseUrl}/incidents/stats/by-branch?start_date=${start_date}&end_date=${end_date}`,
    byCompany: `${baseUrl}/incidents/stats/by-company?start_date=${start_date}&end_date=${end_date}`,
  };

  const testUrl = async (url: string, name: string) => {
    try {
      console.log(`🧪 Probando ${name}:`, url);
      const response = await fetch(url);
      const data = await response.text();
      console.log(`📊 Respuesta de ${name}:`, {
        status: response.status,
        statusText: response.statusText,
        data: data.substring(0, 500) + (data.length > 500 ? '...' : '')
      });
      
      if (!response.ok) {
        alert(`❌ Error ${response.status} en ${name}: ${response.statusText}`);
      } else {
        alert(`✅ Éxito en ${name}: ${response.status}`);
      }
    } catch (error) {
      console.error(`❌ Error al probar ${name}:`, error);
      alert(`❌ Error de red en ${name}: ${error}`);
    }
  };

  return (
    <Paper sx={{ p: 3, m: 2 }}>
      <Typography variant="h6" gutterBottom>
        🔧 Debugger de Estadísticas
      </Typography>
      
      <Typography variant="body2" color="textSecondary" sx={{ mb: 2 }}>
        Fechas generadas: {start_date} - {end_date}
      </Typography>

      <Box sx={{ mb: 2 }}>
        <Typography variant="subtitle2" gutterBottom>
          URLs generadas:
        </Typography>
        <Box sx={{ fontFamily: 'monospace', fontSize: '0.75rem', bgcolor: 'grey.100', p: 1, borderRadius: 1 }}>
          <div>General: {urls.general}</div>
          <div>By Branch: {urls.byBranch}</div>
          <div>By Company: {urls.byCompany}</div>
        </Box>
      </Box>

      <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
        <Button 
          variant="outlined" 
          size="small"
          onClick={() => testUrl(urls.general, 'General Stats')}
        >
          Probar General
        </Button>
        <Button 
          variant="outlined" 
          size="small"
          onClick={() => testUrl(urls.byBranch, 'Branch Stats')}
        >
          Probar Branch
        </Button>
        <Button 
          variant="outlined" 
          size="small"
          onClick={() => testUrl(urls.byCompany, 'Company Stats')}
        >
          Probar Company
        </Button>
      </Box>

      <Alert severity="info" sx={{ mt: 2 }}>
        Revisa la consola del navegador para ver los logs detallados de las pruebas.
      </Alert>
    </Paper>
  );
};

export default StatsDebugger; 