"use client"

import { fetchVagas, deleteVaga, updateVaga, fetchVagaById } from "@/lib/features/vaga/vagaActions";
import { CONSTANTES } from "@/common/constantes";
import {
  Box,
  Card,
  CardContent,
  CardHeader,
  Slide,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Button,
  IconButton,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { useEffect, useState } from "react";
import { Atom } from "react-loading-indicators";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { ptBR } from '@mui/x-data-grid/locales/ptBR';
import VagaFields from "./vagaFields";
import { setValues, setVagas, clearForm, vagaSchema } from "@/lib/features/vaga/vagaSlice";
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/DeleteOutlined';
import * as Yup from 'yup';
import { useTheme } from "@mui/material/styles";
import Loading from "@/components/template/loading";

const VagasList = (props: any) => {
  const dispatch = useAppDispatch();
  const theme = useTheme();

  const { loading, vagas, abaAtiva, values } = useAppSelector(
    (state: any) => state.vaga
  );

  useEffect(() => {
    if (abaAtiva === CONSTANTES.TAB_ONE_VAGA) {
      dispatch(fetchVagas());
    }
  }, [abaAtiva, dispatch]);

  const [openConfirmDialog, setOpenConfirmDialog] = useState(false);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [selectedVagaId, setSelectedVagaId] = useState<string | null>(null);

  const handleOpenConfirmDialog = (id: string) => {
    setSelectedVagaId(id);
    setOpenConfirmDialog(true);
  };

  const handleCloseConfirmDialog = () => {
    setOpenConfirmDialog(false);
    setSelectedVagaId(null);
  };

  const handleDeleteConfirm = () => {
    if (selectedVagaId) {
      dispatch(deleteVaga(selectedVagaId))
        .unwrap()
        .then(() => {
          dispatch(fetchVagas()); // Atualiza a lista de vagas após exclusão
        })
        .catch((error) => {
          console.error("Erro ao deletar a vaga:", error);
        });
    }
    handleCloseConfirmDialog();
  };

  const handleOpenEditDialog = async (vaga: any) => {
    try {
      const result = await dispatch(fetchVagaById(vaga.id)).unwrap();
      
      const { endereco, ...restoDaVaga } = result;
  
      // Garantindo que os campos do endereço sejam definidos
      const valoresCompletos = {
        ...restoDaVaga,
        uf: endereco?.uf || '',
        cidade: endereco?.cidade || '',
        codMunicipio: endereco?.codMunicipio || '',
        bairro: endereco?.bairro || ''
      };
  
      dispatch(clearForm()); // Limpa os estados antes de carregar os novos valores
      dispatch(setValues(valoresCompletos));
      setSelectedVagaId(vaga.id);
      setOpenEditDialog(true);
    } catch (error) {
      console.error('Erro ao buscar dados da vaga:', error);
    }
  };
  


  const handleCloseEditDialog = () => {
    setOpenEditDialog(false);
    setSelectedVagaId(null);
  };

  const handleSaveEditVaga = () => {
    try {
      // Valida os valores antes de prosseguir com a atualização
      vagaSchema.validateSync(values, { abortEarly: false });

      if (selectedVagaId) {
        console.log('Valores após edicao:', values);

        // Realiza o dispatch para atualizar a vaga
        dispatch(updateVaga(values))
          .unwrap()
          .then((updatedVaga) => {
            // Atualização local da lista de vagas
            const updatedVagas = vagas.map((vaga: any) =>
              vaga.id === updatedVaga.id ? updatedVaga : vaga
            );
            dispatch(setVagas(updatedVagas));
          })
          .catch((error) => {
            console.error('Erro ao editar a vaga:', error);
          });
      }
      handleCloseEditDialog();
    } catch (error: any) {
      if (error instanceof Yup.ValidationError) {
        error.inner.forEach((validationFailed: any) => {
          console.error('Erro de validação:', validationFailed.message);
        });
      }
    }
  };


  const columns = [
    {
      field: CONSTANTES.KEY_CARG,
      headerName: CONSTANTES.TBL_HEAD_CARG,
      flex: 1,
      renderCell: (params: any) => params.row.cargo?.descricao
    },
    {
      field: CONSTANTES.KEY_ESCOL,
      headerName: CONSTANTES.TBL_HEAD_ESCOL,
      flex: 1
    },
    {
      field: CONSTANTES.KEY_POST,
      headerName: CONSTANTES.TBL_HEAD_POST,
      flex: 1
    },
    {
      field: CONSTANTES.KEY_CID,
      headerName: CONSTANTES.TBL_HEAD_CITY,
      flex: 1,
      renderCell: (params: any) => params.row.endereco?.cidade
    },
    {
      field: CONSTANTES.KEY_UF,
      headerName: CONSTANTES.TBL_HEAD_UF,
      flex: 1,
      renderCell: (params: any) => params.row.endereco?.uf
    },
    {
      field: "actions",
      headerName: "Ações",
      flex: 1,
      renderCell: (params: any) => (
        <>
          <IconButton
            color="primary"
            onClick={() => handleOpenEditDialog(params.row)}
            sx={{ marginRight: 1 }}
          >
            <EditIcon />
          </IconButton>
          <IconButton
            color="secondary"
            onClick={() => handleOpenConfirmDialog(params.row.id)}
          >
            <DeleteIcon />
          </IconButton>
        </>
      )
    }
  ];

  return (
    <Slide
      direction={props.index == 0 ? "right" : "left"}
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
            title={CONSTANTES.LBL_LIST_VAG}
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
            {loading && <Loading open={loading} />}
            {!loading && (
              <DataGrid
                rows={vagas}
                columns={columns}
                localeText={ptBR.components.MuiDataGrid.defaultProps.localeText}
                initialState={{
                  pagination: {
                    paginationModel: { pageSize: 10 },
                  },
                }}
                pageSizeOptions={[10]}
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
                }}
              />
            )}
          </CardContent>
        </Card>

        {/* Dialogs com estilos atualizados */}
        <Dialog
          open={openConfirmDialog}
          onClose={handleCloseConfirmDialog}
          sx={{
            '& .MuiDialog-paper': {
              backgroundColor: theme.palette.mode === 'dark' ? '#242833' : '#ffffff',
            }
          }}
        >
          <DialogTitle sx={{
            backgroundColor: theme.palette.mode === 'dark' ? '#1a1a1a' : '#f5f5f5',
            color: theme.palette.mode === 'dark' ? '#ffffff' : '#000000',
          }}>
            {"Confirmação de Exclusão"}
          </DialogTitle>
          <DialogContent sx={{
            color: theme.palette.mode === 'dark' ? '#ffffff' : '#000000',
          }}>
            Você tem certeza que deseja excluir esta vaga?
          </DialogContent>
          <DialogActions>
            <Button 
              onClick={handleCloseConfirmDialog}
              sx={{ color: theme.palette.mode === 'dark' ? '#ffffff' : '#000000' }}
            >
              Cancelar
            </Button>
            <Button 
              onClick={handleDeleteConfirm}
              sx={{ 
                backgroundColor: theme.palette.mode === 'dark' ? '#b530b8' : '#1e8cfa',
                color: '#ffffff',
                '&:hover': {
                  backgroundColor: theme.palette.mode === 'dark' ? '#8a248c' : '#1976d2',
                }
              }}
            >
              Confirmar
            </Button>
          </DialogActions>
        </Dialog>

        {/* Dialog de Edição com estilos atualizados */}
        <Dialog
          open={openEditDialog}
          onClose={handleCloseEditDialog}
          fullWidth
          maxWidth="xl"
          sx={{
            '& .MuiDialog-paper': {
              backgroundColor: theme.palette.mode === 'dark' ? '#242833' : '#ffffff',
            }
          }}
        >
          <DialogTitle sx={{
            backgroundColor: theme.palette.mode === 'dark' ? '#1a1a1a' : '#f5f5f5',
            color: theme.palette.mode === 'dark' ? '#ffffff' : '#000000',
          }}>
            {"Editar Vaga"}
          </DialogTitle>
          <DialogContent>
            <Card sx={{ 
              padding: 2,
              backgroundColor: theme.palette.mode === 'dark' ? '#242833' : '#ffffff',
            }}>
              <CardContent>
                <VagaFields />
              </CardContent>
            </Card>
          </DialogContent>
          <DialogActions>
            <Button 
              onClick={handleCloseEditDialog}
              sx={{ 
                color: theme.palette.mode === 'dark' ? '#ffffff' : '#000000'
              }}
            >
              Cancelar
            </Button>
            <Button 
              onClick={handleSaveEditVaga}
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

export default VagasList;
