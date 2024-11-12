"use client";

import { getAuth, onAuthStateChanged, signOut } from "firebase/auth";
import { Button, IconButton, ThemeProvider } from "@mui/material";
import Brightness7Icon from "@mui/icons-material/Brightness7";
import Brightness4Icon from "@mui/icons-material/Brightness4";
import LogoutIcon from "@mui/icons-material/Logout";
import Content from "@/components/template/content";
import Loading from "@/components/template/loading";
import Titulo from "@/components/template/titulo";
import PaginaLogin from "@/app/login/paginaLogin";
import { CONSTANTES } from "@/common/constantes";
import theme, { lightTheme } from "./styleTheme";
import MenuIcon from "@mui/icons-material/Menu";
import Menu from "@/components/template/menu";
import StoreProvider from "./storeProvider";
import { useState, useEffect, useContext } from "react";
import { useRouter, usePathname } from "next/navigation"; // Importando o useRouter para navegação
import { Inter } from "next/font/google";
import "./globals.css";
import { FileProvider } from "@/common/fileContext";
import { ThemeContextProvider, ColorModeContext, useColorMode } from '../contexts/ThemeContext';
import { useTheme } from '@mui/material/styles';

const inter = Inter({ subsets: ["latin"] });

// Novo componente para o conteúdo principal
function MainContent({
  children,
}: {
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();
  
  // Hooks do tema - agora dentro do contexto
  const { toggleColorMode, mode } = useColorMode();
  const theme = useTheme();

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setIsAuthenticated(true);
        setLoading(false);
        if (pathname === "/login" || pathname === "/") {
          router.push("/dashboard");
        }
      } else {
        setIsAuthenticated(false);
        setLoading(false);
        if (pathname !== "/login") {
          router.push("/login");
        }
      }
    });

    return () => unsubscribe();
  }, [router, pathname]);

  const handleLogout = async () => {
    const auth = getAuth();
    await signOut(auth);
    router.push("/login");
  };

  const handleThemeToggle = () => {
    console.log('Botão de tema clicado');
    console.log('Modo atual:', mode);
    toggleColorMode();
  };

  if (loading) {
    return <Loading open={loading} />;
  }

  return (
    <FileProvider>
      <StoreProvider>
        {!isAuthenticated ? (
          <PaginaLogin />
        ) : (
          <div>
            <Titulo sx={{ display: "flex", alignItems: "center" }}>
              <Button
                onClick={() => setOpen(true)}
                sx={{
                  color: theme.palette.mode === 'dark' ? '#ffffff' : '#000000',
                  backgroundColor: 'transparent',
                  '&:hover': { backgroundColor: 'transparent' },
                  '&:focus': { backgroundColor: 'transparent' }
                }}
              >
                <MenuIcon sx={{ color: theme.palette.mode === 'dark' ? '#ffffff' : '#000000' }} />
              </Button>
              {CONSTANTES.TITLE_APP}
              
              <IconButton
                onClick={handleThemeToggle}
                sx={{
                  position: "absolute",
                  right: "120px",
                  color: theme.palette.mode === 'dark' ? '#ffffff' : '#000000',
                }}
              >
                {theme.palette.mode === 'dark' ? <Brightness7Icon /> : <Brightness4Icon />}
              </IconButton>

              <Button
                onClick={handleLogout}
                sx={{
                  position: "absolute",
                  right: "16px",
                  color: theme.palette.mode === 'dark' ? '#ffffff' : '#000000',
                }}
              >
                <LogoutIcon sx={{
                  color: theme.palette.mode === 'dark' ? '#ffffff' : '#000000',
                  backgroundColor: 'transparent',
                }} />
                Logout
              </Button>
            </Titulo>
            <Menu open={open} setOpen={setOpen} />
            <Content>{children}</Content>
          </div>
        )}
      </StoreProvider>
    </FileProvider>
  );
}

// Componente principal simplificado
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body className={inter.className}>
        <ThemeContextProvider>
          <MainContent>{children}</MainContent>
        </ThemeContextProvider>
      </body>
    </html>
  );
}