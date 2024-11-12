"use client";

import { convertStringUTCToString, convertTimestampToDateString, convertStringUTCToStringListas, convertTimestampToStringListas } from "../../common/utils";
import { Box, Button, Card, CardContent, CardHeader, Dialog, DialogActions, DialogContent, DialogTitle, IconButton, Slide, Snackbar, Alert } from "@mui/material";
import { useAppDispatch, useAppSelector } from "../../lib/hooks";
import Loading from "@/components/template/loading";
import { CONSTANTES } from "@/common/constantes";
import { DataGrid } from "@mui/x-data-grid";
import { useEffect, useState } from "react";
import { ptBR } from '@mui/x-data-grid/locales/ptBR';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/DeleteOutlined';
import { listasSchema, listasSchemaEdit, resetForm, setListas, setLoading, setVagasSelecionadas, setValues, setIsEditing, submitForm } from "@/lib/features/listasOuvidoria/listasSlice";
import { deleteLista, fetchListasOuvidoria, updateLista, fetchListaById } from "../../lib/features/listasOuvidoria/listasAction";
import CadastroOuvidoriaForm from "./listasOuvidoriaForm";
import { fetchParceiro } from '../../lib/features/parceiro/parceiroActions';
import { fetchVagas } from '../../lib/features/vaga/vagaActions';
import { useTheme } from '@mui/material/styles';
import { Timestamp } from "firebase/firestore";

interface listasOuvidoria {
  id: string;
  uf: string;
  cidade: string;
  arquivo: string;
  parceiro: string;
  dataEnvio: string;
  dataGeracao: string;
  dataRetorno: string;
  numeroCandi: number;
  codMunicipio: number;
  numeroIntere: number;
  numeroNegativo: number;
}

interface ListaAtualizada {
  id: string;
  arquivo?: {
    nome: string;
    id: string;
  };
  datas?: {
    dataEnvio: string;
    dataGeracao: string;
    dataRetorno: string;
  };
  numeroNegativo?: number;
  numeroCandi?: number;
  numeroIntere?: number;
  uf?: string;
  cidadeSelecionada?: any;
  parceiroSelecionado?: any;
  cargoSelecionado?: any;
  pbf?: {
    comPbf: boolean;
  };
}

const ListasOuvidoria = (props: any) => {
  const dispatch = useAppDispatch();
  const { loading, abaAtiva, listas, error, values } = useAppSelector(
    (state: any) => state.listasOuvidoria
  );

  const [showErrors, setShowErrors] = useState(false);

  const [openConfirmDialog, setOpenConfirmDialog] = useState(false);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [selectedListaId, setSelectedListaId] = useState<string | null>(null);
  const [alert, setAlert] = useState<{
    severity: 'success' | 'error';
    title: string;
    message: string;
  } | null>(null);
  const [snackbar, setSnackbar] = useState<{
    open: boolean;
    message: string;
    severity: 'success' | 'error';
  }>({
    open: false,
    message: '',
    severity: 'success'
  });

  const theme = useTheme();

  const handleOpenConfirmDialog = (id: string) => {
    setSelectedListaId(id);
    setOpenConfirmDialog(true);
  };

  const handleCloseConfirmDialog = () => {
    setOpenConfirmDialog(false);
    setSelectedListaId(null);
  };

  const handleOpenEditDialog = async (lista: any) => {
    try {
      dispatch(setLoading(true));
      dispatch(setIsEditing(true));
      setShowErrors(false);
  
      await Promise.all([
        dispatch(fetchParceiro()),
        dispatch(fetchVagas()).unwrap()
      ]);
  
      const listaAtualizada = await dispatch(fetchListaById(lista.id)).unwrap();
  
      setSelectedListaId(lista.id);
      console.log('Dados da lista para edição:', listaAtualizada);
  
      const valoresFormatados = {
        id: listaAtualizada.id,
        uf: listaAtualizada.cidade?.uf || '',
        cidade: listaAtualizada.cidade?.id || '',
        parceiroSelecionado: listaAtualizada.parceiro?.id || '',
        vagasSelecionadas: listaAtualizada.vagas || [],
        dataEnvio: listaAtualizada.datas?.dataEnvio || '',
        dataGeracao: listaAtualizada.datas?.dataGeracao || '',
        dataRetorno: listaAtualizada.datas?.dataRetorno || '',
        // Alteração aqui: usando os mesmos nomes do backend
        totalCandidatos: listaAtualizada.totais?.totalCandidatos || 0,
        totalInteressados: listaAtualizada.totais?.totalInteressados || 0,
        totalNegativas: listaAtualizada.totais?.totalNegativas || 0,
        pbf: {
          comPbf: listaAtualizada.pbf?.comPbf || false,
          semPbf: listaAtualizada.pbf?.semPbf || false
        },
        arquivo: {
          nome: listaAtualizada.arquivo?.nome || '',
          url: listaAtualizada.arquivo?.url || ''
        }
      };
  
      console.log('Valores formatados:', valoresFormatados); // Adicione este log para debug
      await dispatch(setValues(valoresFormatados));
      setOpenEditDialog(true);
    } catch (error) {
      console.error('Erro ao buscar dados para edição:', error);
      setSnackbar({
        open: true,
        message: 'Erro ao carregar dados para edição',
        severity: 'error'
      });
    } finally {
      dispatch(setLoading(false));
    }
  };

  const handleCloseEditDialog = () => {
    setOpenEditDialog(false);
    setShowValidationErrors(false);
    dispatch(resetForm());
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  // Função para converter datas
  const convertToDateString = (date: any) => {

    // Verifica se o objeto possui as propriedades 'seconds' e 'nanoseconds'
    if (date && typeof date.seconds === 'number' && typeof date.nanoseconds === 'number') {
      const timestamp = new Timestamp(date.seconds, date.nanoseconds);
      const result = convertTimestampToStringListas(timestamp);
      return result;
    } else if (date instanceof Timestamp) {
      const result = convertTimestampToStringListas(date);
      return result;
    } else if (typeof date === 'string') {
      const result = convertStringUTCToStringListas(date);
      return result;
    }

    return "";
  };

  const handleDeleteConfirm = async () => {
    if (selectedListaId) {
      try {
        await dispatch(deleteLista(selectedListaId)).unwrap();
        await dispatch(fetchListasOuvidoria());
        setSnackbar({
          open: true,
          message: 'Lista deletada com sucesso!',
          severity: 'success'
        });
      } catch (error: any) {
        setSnackbar({
          open: true,
          message: error.message || 'Erro ao deletar a lista',
          severity: 'error'
        });
      }
    }
    handleCloseConfirmDialog();
  };

  const [showValidationErrors, setShowValidationErrors] = useState(false);

  const handleSaveEdit = async () => {
    try {
      dispatch(setLoading(true));

      if (!selectedListaId) {
        throw new Error('ID da lista não encontrado');
      }

      setShowValidationErrors(true); // Ativa a exibição dos erros
      dispatch(submitForm()); // Dispara a validação

      try {
        // Tenta validar os campos
        await listasSchemaEdit.validate(values, {
          abortEarly: false
        });

        // Se a validação passar, continua com o update
        await dispatch(updateLista({
          id: selectedListaId,
          values
        })).unwrap();

        setSnackbar({
          open: true,
          message: 'Lista atualizada com sucesso!',
          severity: 'success'
        });

        setOpenEditDialog(false);
        dispatch(fetchListasOuvidoria());
        dispatch(resetForm());
        setShowValidationErrors(false);

      } catch (error: any) {
        // Se houver erro de validação, mantém os erros visíveis
        if (error.name === 'ValidationError') {
          error.inner.forEach((err: any) => {
            dispatch({
              type: 'listasOuvidoria/setTouched',
              payload: { [err.path]: true }
            });
          });
        }
        throw error;
      }

    } catch (error: any) {
      console.error('Erro ao salvar edição:', error);
      const errorMessage = error.name === 'ValidationError'
        ? 'Por favor, preencha todos os campos obrigatórios'
        : 'Erro ao atualizar lista';

      setSnackbar({
        open: true,
        message: errorMessage,
        severity: 'error'
      });
    } finally {
      dispatch(setLoading(false));
    }
  };

  useEffect(() => {
    if (abaAtiva === CONSTANTES.TAB_ONE_LISTAS) {
      dispatch(fetchListasOuvidoria());
    }
  }, [abaAtiva, dispatch]);

  useEffect(() => {
    if (error) {
      console.error(CONSTANTES.ERRO_BUSC_LISTAS, error);
    }
  }, [error]);



  const columns = [
    {
      field: CONSTANTES.KEY_ARQUIVO,
      headerName: CONSTANTES.LBL_ARQUIVO,
      flex: 2,
      renderCell: (params: any) => params.row.arquivo?.nome,
    },
    {
      field: CONSTANTES.KEY_PARCEIRO_SELECIONADO,
      headerName: CONSTANTES.LBL_PARCEIRO,
      flex: 2,
      renderCell: (params: any) => params.row.parceiro?.descricao,
    },
    {
      field: CONSTANTES.KEY_DATA_RETORNO,
      headerName: CONSTANTES.LBL_DATA_RETORNO,
      flex: 1,
      renderCell: (params: any) => {
        const dataRetorno = params.row.datas?.dataRetorno;
        return convertToDateString(dataRetorno);
      },
    },
    {
      field: CONSTANTES.KEY_DATA_ENVIO,
      headerName: CONSTANTES.LBL_DATA_ENVIO,
      flex: 1,
      renderCell: (params: any) => convertToDateString(params.row.datas?.dataEnvio),
    },
    {
      field: "actions",
      headerName: "Ações",
      flex: 1,
      renderCell: (params: any) => (
        <>
          <IconButton
            onClick={() => handleOpenEditDialog(params.row)}
            sx={{
              color: theme.palette.mode === 'dark' ? '#b530b8' : '#1e8cfa',
              marginRight: 1,
              '&:hover': {
                backgroundColor: theme.palette.mode === 'dark' ? 'rgba(181, 48, 184, 0.1)' : 'rgba(30, 140, 250, 0.1)',
              },
            }}
          >
            <EditIcon />
          </IconButton>
          <IconButton
            onClick={() => handleOpenConfirmDialog(params.row.id)}
            sx={{
              color: '#670080',
              '&:hover': {
                backgroundColor: 'rgba(103, 0, 128, 0.1)',
              },
            }}
          >
            <DeleteIcon />
          </IconButton>
        </>
      )
    }
  ];

  return (
    <Slide
      direction={props.index === 0 ? "right" : "left"}
      in={true}
      mountOnEnter
      unmountOnExit
    >
      <Box component="form" m={4} sx={{ flexGrow: 1 }}>
        {loading && <Loading open={loading} />}
        <Card
          elevation={5}
          sx={{
            backgroundColor: theme.palette.mode === 'dark' ? '#242833' : '#ffffff',
          }}
        >
          <CardHeader
            title={CONSTANTES.LBL_LIST_TITLE_LISTAS}
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
            {!loading && (
              <DataGrid
                rows={listas}
                columns={columns}
                localeText={ptBR.components.MuiDataGrid.defaultProps.localeText}
                initialState={{
                  pagination: {
                    paginationModel: { pageSize: 10 },
                  },
                }}
                pageSizeOptions={[10]}
                checkboxSelection
                disableRowSelectionOnClick
                autoHeight
                sx={{
                  backgroundColor: theme.palette.mode === 'dark' ? '#242833' : '#ffffff',
                  color: theme.palette.mode === 'dark' ? '#ffffff' : '#000000',
                  '& .MuiDataGrid-cell': {
                    color: theme.palette.mode === 'dark' ? '#ffffff' : '#000000',
                  },
                  '& .MuiDataGrid-columnHeaders': {
                    backgroundColor: theme.palette.mode === 'dark' ? '#1a1a1a' : '#f5f5f5',
                    color: theme.palette.mode === 'dark' ? '#ffffff' : '#000000',
                  },
                  '& .MuiDataGrid-footerContainer': {
                    backgroundColor: theme.palette.mode === 'dark' ? '#1a1a1a' : '#f5f5f5',
                    color: theme.palette.mode === 'dark' ? '#ffffff' : '#000000',
                  },
                  '& .MuiCheckbox-root': {
                    color: theme.palette.mode === 'dark' ? '#b530b8' : '#1e8cfa',
                  },
                  '& .MuiTablePagination-root': {
                    color: theme.palette.mode === 'dark' ? '#ffffff' : '#000000',
                  },
                  '& .MuiDataGrid-row:hover': {
                    backgroundColor: theme.palette.mode === 'dark' ? '#333333' : '#f5f5f5',
                  },
                  '& .MuiDataGrid-row.Mui-selected': {
                    backgroundColor: theme.palette.mode === 'dark' ? '#333333' : '#e3f2fd',
                    '&:hover': {
                      backgroundColor: theme.palette.mode === 'dark' ? '#404040' : '#dbedfc',
                    },
                  },
                }}
              />
            )}
          </CardContent>
        </Card>

        {/* Dialogs */}
        <Dialog
          open={openConfirmDialog}
          onClose={handleCloseConfirmDialog}
        >
          <DialogTitle sx={{
            color: theme.palette.mode === 'dark' ? '#ffffff' : '#000000',
            backgroundColor: theme.palette.mode === 'dark' ? '#242833' : '#ffffff',
          }}>
            {"Confirmação de Exclusão"}
          </DialogTitle>
          <DialogContent sx={{
            backgroundColor: theme.palette.mode === 'dark' ? '#242833' : '#ffffff',
            color: theme.palette.mode === 'dark' ? '#ffffff' : '#000000',
          }}>
            Você tem certeza que deseja excluir esta lista?
          </DialogContent>
          <DialogActions sx={{
            backgroundColor: theme.palette.mode === 'dark' ? '#242833' : '#ffffff',
          }}>
            <Button
              onClick={handleCloseConfirmDialog}
              sx={{ color: theme.palette.mode === 'dark' ? '#ffffff' : '#000000' }}
            >
              Cancelar
            </Button>
            <Button
              onClick={handleDeleteConfirm}
              sx={{
                backgroundColor: '#670080',
                color: '#ffffff',
                '&:hover': {
                  backgroundColor: '#4a005c',
                }
              }}
            >
              Confirmar
            </Button>
          </DialogActions>
        </Dialog>

        {/* Dialog de Edição */}
        <Dialog
          open={openEditDialog}
          onClose={handleCloseEditDialog}
          fullWidth
          maxWidth="xl"
        >
          <DialogTitle sx={{
            backgroundColor: theme.palette.mode === 'dark' ? '#242833' : '#ffffff',
            color: theme.palette.mode === 'dark' ? '#ffffff' : '#000000',
          }}>
            {"Editar Lista Cadastrada"}
          </DialogTitle>
          <DialogContent sx={{
            backgroundColor: theme.palette.mode === 'dark' ? '#242833' : '#ffffff',
          }}>
            <CadastroOuvidoriaForm
              isEditing={true}
              showValidationErrors={showValidationErrors}
            />
          </DialogContent>
          <DialogActions sx={{
            backgroundColor: theme.palette.mode === 'dark' ? '#242833' : '#ffffff',
          }}>
            <Button
              onClick={handleCloseEditDialog}
              sx={{ color: theme.palette.mode === 'dark' ? '#ffffff' : '#000000' }}
            >
              Cancelar
            </Button>
            <Button
              onClick={handleSaveEdit}
              sx={{
                backgroundColor: theme.palette.mode === 'dark' ? '#b530b8' : '#1e8cfa',
                color: '#ffffff',
                '&:hover': {
                  backgroundColor: theme.palette.mode === 'dark' ? '#8a248c' : '#1976d2',
                }
              }}
            >
              Salvar
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </Slide>
  );
};

export default ListasOuvidoria;
