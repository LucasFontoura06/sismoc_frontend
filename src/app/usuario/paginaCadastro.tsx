"use client";  // Instrução do Next.js para utilizar o componente no lado do cliente

import { setEmail, setNome, setPerfil, setSenha, setSetor, submitUsuario, resetForm } from "@/lib/features/usuario/usuarioSlice";
import { Box, Button, Card, CardActions, CardContent, CardHeader, IconButton, InputAdornment, Slide } from "@mui/material";
import { addUsuario } from "@/lib/features/usuario/usuarioActions";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import Grid from "@mui/material/Unstable_Grid2/Grid2";
import Loading from "@/components/template/loading";
import { CONSTANTES } from "@/common/constantes";
import SelectForm from "@/components/selectForm";
import InputForm from "@/components/inputForm";
import { useEffect, useState } from "react";
import styles from './cadastro.module.css';
import { PERFIS } from "@/common/perfil";
import { SETORES } from "@/common/setor";
import { useTheme } from '@mui/material/styles';
import { getPerfil, getPerfilCodigo } from '@/common/utils';


function UserRegistrationForm() {

  // ---- CONSTANTES ----
  const theme = useTheme();
  const dispatch = useAppDispatch();
  const [showPassword, setShowPassword] = useState(false);

  const {
    values,
    validForm,
    success,
    loading,
    errors,
    touched
  } = useAppSelector(
    (state: any) => state.usuario
  );

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleMouseDownPassword = (event: React.MouseEvent) => {
    event.preventDefault();
  };

  // ---- USE EFFECT ----
  useEffect(() => {
    if (validForm) {
      const perfilSelecionado = PERFIS.find(p => p.codigo === values.perfil);
      const usuarioParaSalvar = {
        ...values,
        perfil: {
          id: perfilSelecionado?.codigo || '',
          descricao: perfilSelecionado?.label || ''
        }
      };
  
      dispatch(addUsuario(usuarioParaSalvar))
        .then(() => {
          console.log(CONSTANTES.SUCCESS_USER_REGISTRADO);
          dispatch(resetForm());
        })
        .catch((err: any) => {
          console.log(CONSTANTES.ERROR_CA_USER, err);
        });
    }
  }, [validForm, values, dispatch]);

  return (
    <Slide
      direction="left"
      in={true}
      mountOnEnter
      unmountOnExit
    >
      <Box component="form" m={2} sx={{ flexGrow: 1 }}>
        {loading ? <Loading open={loading} /> : null}
        <Card
          elevation={5}
          sx={{
            backgroundColor: theme.palette.mode === 'dark' ? '#242833' : '#ffffff',
          }}
        >
          <CardHeader
            title={CONSTANTES.LBL_CA_TITLE}
            sx={{
              backgroundColor: theme.palette.mode === 'dark' ? '#1a1a1a' : '#f5f5f5',
              color: theme.palette.mode === 'dark' ? '#ffffff' : '#000000',
              '& .MuiTypography-root': {
                fontWeight: 'bold',
                fontSize: '1.25rem',
              },
            }}
          />

          <CardContent>
            <Grid container spacing={2}>
              <Grid xs={8} md={4}>
                <InputForm
                  label={`* ${CONSTANTES.LBL_CA_NOME}`}
                  name="nome"
                  value={values.nome}
                  onChange={(event: any) =>
                    dispatch(setNome(event.target.value))
                  }
                  isInvalid={touched.nome && Boolean(errors.nome)}
                  msgError={touched.nome ? errors.nome : false}
                />
              </Grid>

              {/* ---- INPUT E-MAIL ---- */}
              <Grid xs={8} md={4}>
                <InputForm
                  label={`* ${CONSTANTES.LBL_CA_EMAIL}`}
                  name="email"
                  type="email"
                  value={values.email}
                  onChange={(event: any) =>
                    dispatch(setEmail(event.target.value))
                  }
                  isInvalid={touched.email && Boolean(errors.email)}
                  msgError={touched.email ? errors.email : false}
                />
              </Grid>

              {/* ---- INPUT SETOR ---- */}
              <Grid xs={8} md={4}>
                <SelectForm
                  label={`* ${CONSTANTES.LBL_CA_SETOR}`}
                  name="setor"
                  value={values.setores}
                  onChange={(event: any) =>
                    dispatch(setSetor(event.target.value))
                  }
                  isInvalid={touched.setor && Boolean(errors.setor)}
                  msgError={touched.setor ? errors.setor : false}
                  itens={SETORES}
                />
              </Grid>

              {/* ---- INPUT PERFIL ---- */}
              <Grid xs={8} md={6}>
                <SelectForm
                  label={`* ${CONSTANTES.LBL_LO_PERFIL}`}
                  name="perfil"
                  value={values.perfil}
                  onChange={(event: any) =>
                    dispatch(setPerfil(event.target.value))
                  }
                  isInvalid={touched.perfil && Boolean(errors.perfil)}
                  msgError={touched.perfil ? errors.perfil : false}
                  itens={PERFIS}
                />
              </Grid>

              {/* ---- INPUT SENHA ---- */}
              <Grid xs={8} md={6}>
                <InputForm
                  label={`* ${CONSTANTES.LBL_LO_SENHA}`}
                  name="senha"
                  type={showPassword ? 'text' : 'password'}
                  value={values.senha}
                  onChange={(event: any) =>
                    dispatch(setSenha(event.target.value))
                  }
                  isInvalid={touched.senha && Boolean(errors.senha)}
                  msgError={touched.senha ? errors.senha : false}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={handleClickShowPassword}
                          onMouseDown={handleMouseDownPassword}
                          edge="end"
                          sx={{
                            color: theme.palette.mode === 'dark' ? '#ffffff' : '#000000',
                          }}
                        >
                          {showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>
            </Grid>
          </CardContent>

          <CardActions sx={{ justifyContent: "flex-end" }} className="me-2 mb-2">
            <Button
              variant="contained"
              onClick={() => dispatch(submitUsuario())}
              sx={{
                backgroundColor: theme.palette.mode === 'dark' ? '#b530b8' : '#1e8cfa',
                '&:hover': {
                  backgroundColor: theme.palette.mode === 'dark' ? '#8a248c' : '#1976d2',
                },
              }}
            >
              {CONSTANTES.LBL_CA_CADAS}
            </Button>
          </CardActions>
        </Card>
      </Box>
    </Slide>
  );
}

export default UserRegistrationForm;
