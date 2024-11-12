import { createContext, useState, useMemo, useContext } from 'react';
import { ThemeProvider, Theme } from '@mui/material/styles';
import { darkTheme, lightTheme } from '../app/styleTheme';

type ColorModeContextType = {
  toggleColorMode: () => void;
  mode: 'light' | 'dark';
};

export const ColorModeContext = createContext<ColorModeContextType>({ 
  toggleColorMode: () => {},
  mode: 'dark'
});

export const useColorMode = () => {
  const context = useContext(ColorModeContext);
  if (!context) {
    throw new Error('useColorMode must be used within a ThemeContextProvider');
  }
  return context;
};

export function ThemeContextProvider({ children }: { children: React.ReactNode }) {
  const [mode, setMode] = useState<'light' | 'dark'>('dark');

  const colorMode = useMemo(
    () => ({
      toggleColorMode: () => {
        setMode((prevMode) => {
          const newMode = prevMode === 'light' ? 'dark' : 'light';
          return newMode;
        });
      },
      mode
    }),
    [mode]
  );

  const theme = useMemo(
    () => {
      return mode === 'dark' ? darkTheme : lightTheme;
    },
    [mode],
  );

  return (
    <ColorModeContext.Provider value={colorMode}>
      <ThemeProvider theme={theme}>
        {children}
      </ThemeProvider>
    </ColorModeContext.Provider>
  );
} 