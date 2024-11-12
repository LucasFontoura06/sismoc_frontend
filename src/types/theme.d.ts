import '@mui/material/styles';

declare module '@mui/material/styles' {
  interface Components {
    MuiBox?: {
      styleOverrides?: {
        root?: {
          backgroundColor?: string;
          border?: string;
        };
      };
    };
  }

  interface Palette {
    menu: {
      background: string;
      hover: string;
      headerBg: string;
      text: string;
      subText: string;
      iconColor: string;
    };
  }

  interface PaletteOptions {
    menu?: {
      background: string;
      hover: string;
      headerBg: string;
      text: string;
      subText: string;
      iconColor: string;
    };
  }
} 