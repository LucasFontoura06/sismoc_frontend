"use client";

import { signInWithEmailAndPassword } from "firebase/auth";
import { CONSTANTES } from "@/common/constantes";
import styles from './login.module.css';
import { useState } from "react";
import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  createTheme,
  Grid,
  TextField
} from "@mui/material";
import { auth } from "../firebaseConfig";
import CustomAlert from "../../components/alert"; // Importa o componente de alertas

const lightTheme = createTheme({
  palette: {
    mode: "light", // Força o modo claro
    primary: {
      main: "#1976d2", // Azul padrão
    },
    background: {
      default: "#fff", // Fundo branco
      paper: "#f5f5f5", // Cor do card
    },
    text: {
      primary: "#000", // Texto preto
    },
  },
});

function LoginForm() {
  const [formData, setFormData] = useState({
    email: '',
    senha: '',
  });

  const [error, setError] = useState('');
  const [showSuccessMessage, setShowSuccessMessage] = useState(false); // Estado para exibir mensagem de sucesso
  const [showErrorMessage, setShowErrorMessage] = useState(false); // Estado para exibir mensagem de erro

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError('');
    setShowErrorMessage(false);
    setShowSuccessMessage(false);

    try {
      const userCredential = await signInWithEmailAndPassword(auth, formData.email, formData.senha);
      console.log('Usuário logado:', userCredential.user);

      // Exibe a mensagem de sucesso
      setShowSuccessMessage(true);
      setTimeout(() => {
        setShowSuccessMessage(false); // Remove a mensagem após 3 segundos
      }, 3000);

    } catch (error) {
      console.error('Erro ao fazer login:', error);
      // setError(CONSTANTES.ERROR_LOG_USER);

      // Exibe a mensagem de erro
      setShowErrorMessage(true);
      setTimeout(() => {
        setShowErrorMessage(false); // Remove a mensagem após 3 segundos
      }, 3000);
    }
  };

  return (
    <div className={styles.loginContainer}>
      {/* Mensagem de sucesso */}
      {showSuccessMessage && (
        <Box
          sx={{
            position: "fixed",
            bottom: 10,
            right: 10,
            zIndex: 1000,
          }}
        >
          <CustomAlert
            severity="success"
            title="Login Bem-sucedido"
            message="Você fez login com sucesso!"
          />
        </Box>
      )}

      {/* Mensagem de erro */}
      {showErrorMessage && (
        <Box
          sx={{
            position: "fixed",
            bottom: 10,
            right: 10,
            zIndex: 1000,
          }}
        >
          <CustomAlert
            severity="error"
            title="Erro de Login"
            message="Usuário ou senha incorretos."
          />
        </Box>
      )}

      <Box component="form" className={styles.loginForm} onSubmit={handleSubmit}>
        <Card className={styles.noShadowCard}>
          <CardHeader
            title={CONSTANTES.LBL_LO_TITLE}
            className={styles.loginHeader}
          />
          <CardContent>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  label={CONSTANTES.LBL_LO_EMAIL}
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  fullWidth
                  required
                  className={styles.inputField}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      "& fieldset": {
                        borderColor: "#ccc", // Borda cinza clara padrão
                      },
                      "&:hover fieldset": {
                        borderColor: "#888", // Borda cinza mais escura ao passar o mouse
                      },
                      "&.Mui-focused fieldset": {
                        borderColor: "#1b2638", // Borda azul escura ao focar
                      },
                    },
                    "& .MuiInputLabel-root": {
                      color: "#666", // Cor padrão da label
                    },
                    "& .MuiInputLabel-root.Mui-focused": {
                      color: "#1b2638", // Cor da label ao focar (mesma do foco da borda)
                    },
                    input: {
                      color: "#000", // Cor do texto dentro do input (preto)
                    },
                  }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label={CONSTANTES.LBL_LO_SENHA}
                  name="senha"
                  type="password"
                  value={formData.senha}
                  onChange={handleInputChange}
                  fullWidth
                  required
                  className={styles.inputField}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      "& fieldset": {
                        borderColor: "#ccc", // Borda cinza clara padrão
                      },
                      "&:hover fieldset": {
                        borderColor: "#888", // Borda cinza mais escura ao passar o mouse
                      },
                      "&.Mui-focused fieldset": {
                        borderColor: "#1b2638", // Borda azul escura ao focar
                      },
                    },
                    "& .MuiInputLabel-root": {
                      color: "#666", // Cor padrão da label
                    },
                    "& .MuiInputLabel-root.Mui-focused": {
                      color: "#1b2638", // Cor da label ao focar
                    },
                    input: {
                      color: "#000", // Cor do texto dentro do input (preto)
                    },
                  }}
                />
              </Grid>
            </Grid>
            {error && (
              <div className={styles.errorMessage}>{error}</div>
            )}
          </CardContent>
          <CardActions sx={{ justifyContent: "center" }}>
            <Button type="submit" variant="contained" className={styles.loginButton}>
              {CONSTANTES.LBL_LO_BTN_ENTRAR}
            </Button>
          </CardActions>
        </Card>
      </Box>


    </div>
  );
}

export default LoginForm;
