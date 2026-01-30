import { useState } from 'react';
import { ThemeProvider, CssBaseline, Container, AppBar, Toolbar, Typography, Box, Snackbar, Alert } from '@mui/material';
import ScienceIcon from '@mui/icons-material/Science';
import axios from 'axios';
import { theme } from './theme';
import type { ChemicalReaction, ReactionScenario } from './types/chemistry';
import ReactionInput from './components/ReactionInput';
import ReactionDisplay from './components/ReactionDisplay';
import './App.css';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

function App() {
  const [reaction, setReaction] = useState<ChemicalReaction | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handlePredict = async (scenario: ReactionScenario) => {
    setLoading(true);
    setError(null);

    try {
      const response = await axios.post(`${API_URL}/api/reactions/predict`, scenario);
      setReaction(response.data);
    } catch (err) {
      console.error('Error predicting reaction:', err);
      setError('Failed to predict reaction. Please check your API configuration and try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box
        sx={{
          minHeight: '100vh',
          background: 'linear-gradient(180deg, #0a1929 0%, #001e3c 100%)',
        }}
      >
        {/* App Bar */}
        <AppBar position="static" elevation={0} sx={{ background: 'rgba(0,0,0,0.3)', backdropFilter: 'blur(10px)' }}>
          <Toolbar>
            <ScienceIcon sx={{ mr: 2, fontSize: 32 }} />
            <Typography variant="h5" component="div" sx={{ flexGrow: 1, fontWeight: 700 }}>
              AI Chemistry Virtual Lab
            </Typography>
            <Typography variant="caption" sx={{ opacity: 0.7 }}>
              Powered by LangChain & OpenAI Models
            </Typography>
          </Toolbar>
        </AppBar>

        {/* Main Content */}
        <Container maxWidth="xl" sx={{ py: 4 }}>
          <Box sx={{ mb: 4 }}>
            <ReactionInput onPredict={handlePredict} loading={loading} />
          </Box>

          <ReactionDisplay reaction={reaction} />
        </Container>

        {/* Error Snackbar */}
        <Snackbar
          open={!!error}
          autoHideDuration={6000}
          onClose={() => setError(null)}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        >
          <Alert onClose={() => setError(null)} severity="error" variant="filled">
            {error}
          </Alert>
        </Snackbar>
      </Box>
    </ThemeProvider>
  );
}

export default App;
