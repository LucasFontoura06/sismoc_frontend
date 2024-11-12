import { createTheme } from '@mui/material/styles';

export const lightTheme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#cad4e0',
    },
    background: {
      default: '#ffffff',
      paper: '#ffffff',
    },
    menu: {
      background: '#ffffff',
      hover: '#f5f5f5',
      headerBg: '#e3f2fd',
      text: '#2c2c2c',
      subText: '#666666',
      iconColor: '#1976d2',
    }
  },
});

export const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#7a0099',
    },
    secondary: {
      main: '#cad4e0',
    },
    background: {
      default: '#000000',
      paper: '#000000',
    },
    menu: {
      background: '#121212',
      hover: '#2b2630',
      headerBg: '#1e1e1e',
      text: '#ffffff',
      subText: '#b0b0b0',
      iconColor: '#7a0099',
    }
  },
});
