import { createTheme } from '@mui/material/styles';

export const theme = createTheme({
    palette: {
        mode: 'dark',
        primary: {
            main: '#00bcd4', // Cyan - chemistry/science theme
            light: '#62efff',
            dark: '#008ba3',
        },
        secondary: {
            main: '#4caf50', // Green - for chemical reactions
            light: '#80e27e',
            dark: '#087f23',
        },
        background: {
            default: '#0a1929',
            paper: '#132f4c',
        },
        success: {
            main: '#66bb6a',
        },
        error: {
            main: '#f44336',
        },
    },
    typography: {
        fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
        h3: {
            fontWeight: 700,
            letterSpacing: '-0.5px',
        },
        h5: {
            fontWeight: 600,
        },
        h6: {
            fontWeight: 600,
        },
    },
    shape: {
        borderRadius: 12,
    },
    components: {
        MuiButton: {
            styleOverrides: {
                root: {
                    textTransform: 'none',
                    fontWeight: 600,
                    borderRadius: 8,
                },
            },
        },
        MuiCard: {
            styleOverrides: {
                root: {
                    backgroundImage: 'none',
                    borderRadius: 16,
                },
            },
        },
        MuiTextField: {
            styleOverrides: {
                root: {
                    '& .MuiOutlinedInput-root': {
                        borderRadius: 10,
                    },
                },
            },
        },
    },
});
