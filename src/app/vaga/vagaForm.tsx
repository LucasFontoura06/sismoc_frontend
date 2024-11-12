import React, { useEffect } from "react";
import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  Slide,
  useTheme,
} from "@mui/material";
import { CONSTANTES } from "@/common/constantes";
import {
  addVaga,
} from "@/lib/features/vaga/vagaActions";
import {
  handleSubmit,
  setAbaAtiva,
  clearForm,
} from "@/lib/features/vaga/vagaSlice";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import VagaFields from "./vagaFields";

const VagaForm = (props: any) => {
  const dispatch = useAppDispatch();
  const {
    values,
    validForm,
    success,
  } = useAppSelector((state: any) => state.vaga);
  const theme = useTheme();

  useEffect(() => {
    if (validForm) {
      dispatch(addVaga(values));
    }
  }, [validForm, dispatch, values]);

  useEffect(() => {
    // Limpa o formulário ao montar o componente
    return () => {
      dispatch(clearForm());
    };
  }, [dispatch]);

  useEffect(() => {
    if (success) {
      dispatch(clearForm());
      dispatch(setAbaAtiva(CONSTANTES.TAB_ONE_VAGA));
    }
  }, [success, dispatch]);

  return (
    <Slide
      direction={props.index == 1 ? "left" : "right"}
      in={true}
      mountOnEnter
      unmountOnExit
    >
      <Box component="form" m={4} sx={{ flexGrow: 1 }}>
        <Card 
          elevation={5}
          sx={{
            backgroundColor: theme.palette.mode === 'dark' ? '#242833' : '#ffffff',
          }}
        >
          <CardHeader
            title={CONSTANTES.LBL_NEW_VAG}
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
            <VagaFields />
          </CardContent>
          <CardActions sx={{ justifyContent: "flex-end" }}>
            <Button
              variant="contained"
              onClick={() => dispatch(handleSubmit())}
              sx={{ 
                backgroundColor: theme.palette.mode === 'dark' ? '#b530b8' : '#1e8cfa',
                '&:hover': {
                  backgroundColor: theme.palette.mode === 'dark' ? '#8a248c' : '#1976d2',
                }
              }}
            >
              {CONSTANTES.BTN_SALVAR}
            </Button>
          </CardActions>
        </Card>
      </Box>
    </Slide>
  );
};

export default VagaForm;
