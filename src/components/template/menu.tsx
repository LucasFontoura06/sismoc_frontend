import { CONSTANTES } from "@/common/constantes";
import BarChartIcon from "@mui/icons-material/BarChart";
import GroupsIcons from "@mui/icons-material/Groups";
import PlaceIcon from "@mui/icons-material/Place";
import ViewListIcon from "@mui/icons-material/ViewList";
import WorkOutlineIcon from "@mui/icons-material/WorkOutline";
import ExitToAppIcon from "@mui/icons-material/ExitToApp"; // Ícone para logout
import { FaHandshake } from "react-icons/fa";
import {
  Box,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Divider,
  Typography,
  Avatar,
  useTheme,
  IconButton,
} from "@mui/material";
import { useRouter } from "next/navigation";
import { useEffect, useState, useCallback, useContext } from "react";
import { getAuth, onAuthStateChanged, signOut } from "firebase/auth";
import { getFirestore, query, collection, where, getDocs } from "firebase/firestore"; // Importando Firestore
import { motion } from "framer-motion"; // Importando framer-motion
import CustomAlert from "../alert"; // Importando o componente de mensagem de sucesso
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import { ColorModeContext } from '../../contexts/ThemeContext';

interface MenuProps {
  open: boolean;
  setOpen: (aberto: boolean) => void;
}

interface MenuItem {
  icon: JSX.Element;
  text: string;
  path: string;
}

// Definindo variantes de animação para o framer-motion
const menuVariants = {
  open: {
    opacity: 1,
    x: 0,
    transition: { type: "spring", stiffness: 300, damping: 30 },
  },
  closed: {
    opacity: 0,
    x: "-100%",
    transition: { type: "spring", stiffness: 300, damping: 40 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, x: -20 },
  visible: (i: number) => ({
    opacity: 1,
    x: 0,
    transition: { delay: i * 0.1 },
  }),
};

// Função para buscar o perfil do Firestore
const buscarPerfilUsuario = async (uid: string) => {
  const db = getFirestore();
  const q = query(collection(db, "usuarios"), where("id", "==", uid));
  const querySnapshot = await getDocs(q);

  if (!querySnapshot.empty) {
    const userDoc = querySnapshot.docs[0];
    const userData = userDoc.data();
    return userData.perfil; // Retorna o objeto perfil completo
  } else {
    console.error("Nenhum usuário encontrado com o UID:", uid);
    return null;
  }
};

export default function Menu(props: MenuProps) {
  const router = useRouter();

  const [user, setUser] = useState<{
    name: string;
    email: string;
    perfil?: {
      id: string;
      descricao: string;
    };
  } | null>(null);

  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [showLogoutMessage, setShowLogoutMessage] = useState(false);
  const [lastActivity, setLastActivity] = useState(Date.now()); // Registra a última atividade
  const LOGOUT_TIMEOUT = 30 * 60 * 1000; // 1 minuto em milissegundos
  const theme = useTheme();
  const colorMode = useContext(ColorModeContext);

  // Função para resetar o timer de inatividade
  const resetActivityTimer = useCallback(() => {
    setLastActivity(Date.now());
  }, []);

  // Função para verificar inatividade e fazer logout
  const checkInactivity = useCallback(() => {
    const currentTime = Date.now();
    if (currentTime - lastActivity > LOGOUT_TIMEOUT) {
      handleLogout();
    }
  }, [lastActivity]);

  // Função de logout
  const handleLogout = useCallback(() => {
    const auth = getAuth();
    signOut(auth)
      .then(() => {
        setShowLogoutMessage(true);
        setTimeout(() => {
          setShowLogoutMessage(false);
          router.push(CONSTANTES.ROUTE_LOGIN);
        }, 3000);
      })
      .catch((error) => {
        console.error("Erro ao fazer logout:", error);
      });
  }, [router]);

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        if (!user) {  // Só mostra a mensagem se o usuário ainda não estiver definido
          try {
            const userProfile = await buscarPerfilUsuario(firebaseUser.uid);
            if (userProfile) {
              setUser({
                name: firebaseUser.displayName || "Usuário",
                email: firebaseUser.email || "",
                perfil: userProfile, // Agora recebe o objeto perfil completo
              });
              setShowSuccessMessage(true); // Mostra a mensagem de sucesso
              setTimeout(() => {
                setShowSuccessMessage(false); // Oculta após 3 segundos
              }, 3000);
            } else {
              console.error("Usuário não encontrado no Firestore com UID:", firebaseUser.uid);
            }
          } catch (error) {
            console.error("Erro ao buscar os dados do Firestore:", error);
          }
        }
      }
    });

    // Monitora eventos de atividade do usuário
    // window.addEventListener("mousemove", resetActivityTimer);
    // window.addEventListener("keydown", resetActivityTimer);

    // const inactivityCheckInterval = setInterval(checkInactivity, 1000); // Verifica a cada 1 segundo

    return () => {
      // window.removeEventListener("mousemove", resetActivityTimer);
      // window.removeEventListener("keydown", resetActivityTimer);
      // clearInterval(inactivityCheckInterval);
      unsubscribe();
    };
  }, [checkInactivity, resetActivityTimer, router, user]);

  const handleNavigation = (path: string) => {
    router.push(path);
    props.setOpen(false); // Fecha o Drawer após a navegação
  };

  const ThemeToggle = () => {
    const colorMode = useContext(ColorModeContext);

    return (
      <IconButton onClick={colorMode.toggleColorMode} color="inherit">
        {theme.palette.mode === 'dark' ? <Brightness7Icon /> : <Brightness4Icon />}
      </IconButton>
    );
  };

  const menuItems = [
    {
      icon: <BarChartIcon sx={{ color: theme.palette.menu.iconColor }} />,
      text: CONSTANTES.ITEM_MENU_DASH,
      path: CONSTANTES.ROUTE_DASH,
    },
    {
      icon: <PlaceIcon sx={{ color: theme.palette.menu.iconColor }} />,
      text: CONSTANTES.ITEM_MENU_END,
      path: CONSTANTES.ROUTE_END,
    },
    {
      icon: <FaHandshake style={{ color: theme.palette.menu.iconColor }} size={26} />,
      text: CONSTANTES.ITEM_MENU_PARC,
      path: CONSTANTES.ROUTE_PARC,
    },
    // Modificar esta parte
    ...(user?.perfil?.descricao === "Administrador" ? [{
      icon: <GroupsIcons sx={{ color: theme.palette.menu.iconColor }} />,
      text: CONSTANTES.ITEM_MENU_USER,
      path: CONSTANTES.ROUTE_USER,
    }] : []),
    {
      icon: <WorkOutlineIcon sx={{ color: theme.palette.menu.iconColor }} />,
      text: CONSTANTES.ITEM_MENU_VAG,
      path: CONSTANTES.ROUTE_VAG,
    },
    {
      icon: <ViewListIcon sx={{ color: theme.palette.menu.iconColor }} />,
      text: CONSTANTES.ITEM_MENU_LISTAS,
      path: CONSTANTES.ROUT_LISTAS,
    },
  ];

  const DrawerList = (
    <motion.div
      initial={props.open ? "closed" : "open"}
      animate={props.open ? "open" : "closed"}
      variants={menuVariants}
      style={{ height: "100%" }}
    >
      <Box sx={{ height: "100%", display: "flex", flexDirection: "column", overflow: "hidden" }}>
        {user && (
          <Box sx={{
            display: "flex",
            alignItems: "center",
            padding: "16px",
            backgroundColor: theme.palette.menu.headerBg,
            overflow: "hidden"
          }}>
            <Avatar sx={{ bgcolor: "secondary.main", marginRight: 2 }}>
              {user.name.charAt(0).toUpperCase()}
            </Avatar>
            <Box>
              <Typography variant="body1" sx={{
                color: theme.palette.menu.text
              }}>
                {user.name}
              </Typography>
              <Typography variant="body2" sx={{
                color: theme.palette.menu.subText
              }}>
                {user.email}
              </Typography>
              {user.perfil && (
                <Typography variant="body2" sx={{
                  color: theme.palette.menu.subText
                }}>
                  Perfil: {user.perfil.descricao}
                </Typography>
              )}
            </Box>
          </Box>
        )}

        <List sx={{ flexGrow: 1, overflowY: "auto", overflowX: "hidden" }}>
          {menuItems.map((item, i) => {
            return (
              <motion.div
                key={item.path}
                custom={i}
                initial="hidden"
                animate="visible"
                variants={itemVariants}
                whileHover={{
                  scale: 1.05,
                  backgroundColor: theme.palette.menu.hover,
                }}
              >
                <ListItem disablePadding>
                  <ListItemButton
                    onClick={() => handleNavigation(item.path)}
                    sx={{
                      '&:hover': {
                        backgroundColor: theme.palette.menu.hover,
                      }
                    }}
                  >
                    <ListItemIcon>{item.icon}</ListItemIcon>
                    <ListItemText
                      primary={item.text}
                      sx={{
                        color: theme.palette.menu.text
                      }}
                    />
                  </ListItemButton>
                </ListItem>
              </motion.div>
            );
          })}
        </List>

        <Box sx={{ padding: 0, mt: "auto" }}>
          <Divider />
          <ListItem disablePadding>
            <ListItemButton
              onClick={handleLogout}
              sx={{
                '&:hover': {
                  backgroundColor: theme.palette.menu.hover,
                }
              }}
            >
              <ListItemIcon>
                <ExitToAppIcon sx={{
                  color: theme.palette.mode === 'dark' ? '#ffffff' : '#000000'
                }} />
              </ListItemIcon>
              <ListItemText
                primary="Logout"
                sx={{
                  '& .MuiTypography-root': {
                    color: theme.palette.mode === 'dark' ? '#ffffff' : '#000000'
                  }
                }}
              />
            </ListItemButton>
          </ListItem>
        </Box>
      </Box>
    </motion.div>
  );

  return (
    <>
      {showSuccessMessage && (
        <Box sx={{ position: "fixed", bottom: 10, right: 10, zIndex: 1000 }}>
          <CustomAlert severity="success" title="Login Bem-sucedido" message="Você fez login com sucesso!" />
        </Box>
      )}

      {showLogoutMessage && (
        <Box sx={{ position: "fixed", bottom: 10, right: 10, zIndex: 1000 }}>
          <CustomAlert severity="success" title="Logout Bem-sucedido" message="Você saiu com sucesso!" />
        </Box>
      )}

      <Drawer
        open={props.open}
        onClose={() => props.setOpen(false)}
        sx={{
          "& .MuiDrawer-paper": {
            backgroundColor: theme.palette.menu.background,
            color: theme.palette.menu.text,
            height: "100vh",
            overflow: "hidden",
          },
        }}
      >
        {DrawerList}
      </Drawer>
    </>
  );
}
