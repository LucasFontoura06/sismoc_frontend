import { CONSTANTES } from "@/common/constantes";
import Loading from "@/components/template/loading";
import {
  addEndereco
} from "@/lib/features/endereco/enderecoActions";
import {
  clearForm,
  handleSubmitEndereco,
  setAbaAtiva
} from "@/lib/features/endereco/enderecoSlice";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  Slide,
} from "@mui/material";
import { useTheme } from '@mui/material/styles';
import { useEffect } from "react";
import EnderecoFields from "./enderecoFields";

const EnderecoForm = (props: any) => {
  const theme = useTheme();
  const dispatch = useAppDispatch();
  const {
    validForm,
    loading,
    valuesEndereco,
    successEndereco,
  } = useAppSelector((state: any) => state.endereco);

  const {
    resetFormEndereco
  } = useAppSelector((state: any) => state.parceiro);

  useEffect(() => {
    if (validForm) {
      dispatch(addEndereco(valuesEndereco));
    }
  }, [validForm, dispatch]);

  useEffect(() => {
    if (resetFormEndereco) {
      dispatch(clearForm());
    }
  }, [resetFormEndereco, dispatch]);

  useEffect(() => {
    if (successEndereco) {
      dispatch(clearForm());
      dispatch(setAbaAtiva(CONSTANTES.TAB_ONE_END));
    }
  }, [successEndereco, dispatch]);

  useEffect(() => {
    // Limpa o formulário ao montar o componente
    dispatch(clearForm());
  }, [dispatch]);

  return (
    <Slide
      direction={props.index == 1 ? "left" : "right"}
      in={true}
      mountOnEnter
      unmountOnExit
    >
      <Box 
        component="form" 
        sx={{ 
          flexGrow: 1,
          margin: props.isReusing ? 0 : 2,
        }}
      >
        {loading ? <Loading open={loading} /> : null}
        <Card 
          elevation={5}
          sx={{
            backgroundColor: theme.palette.mode === 'dark' ? '#242833' : '#ffffff',
            '& .MuiCardHeader-root': {
              backgroundColor: theme.palette.mode === 'dark' ? '#1a1a1a' : '#f5f5f5',
              color: theme.palette.mode === 'dark' ? '#ffffff' : '#000000',
            },
            '& .MuiCardContent-root': {
              backgroundColor: theme.palette.mode === 'dark' ? '#242833' : '#ffffff',
            },
            '& .MuiCardActions-root': {
              backgroundColor: theme.palette.mode === 'dark' ? '#1a1a1a' : '#f5f5f5',
              padding: '16px',
            },
          }}
        >
          <CardHeader
            title={CONSTANTES.LBL_NEW_END}
            sx={{
              '& .MuiTypography-root': {
                fontWeight: 'bold',
                fontSize: '1.25rem',
              },
            }}
          />
          <CardContent>
            <EnderecoFields />
          </CardContent>
          <CardActions sx={{ justifyContent: "flex-end" }}>
            <Button
              variant="contained"
              onClick={() => dispatch(handleSubmitEndereco())}
              sx={{
                backgroundColor: theme.palette.mode === 'dark' ? '#b530b8' : '#1e8cfa',
                color: '#ffffff',
                '&:hover': {
                  backgroundColor: theme.palette.mode === 'dark' ? '#8a248c' : '#1976d2',
                },
                '&:focus': {
                  backgroundColor: theme.palette.mode === 'dark' ? '#8a248c' : '#1976d2',
                },
                '&:active': {
                  backgroundColor: theme.palette.mode === 'dark' ? '#8a248c' : '#1976d2',
                },
                transition: 'background-color 0.3s',
              }}
            >
              {CONSTANTES.BTN_SALVAR.toUpperCase()}
            </Button>
          </CardActions>
        </Card>
      </Box>
    </Slide>
  );
};

export default EnderecoForm;
