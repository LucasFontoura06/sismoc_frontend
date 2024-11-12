"use client";

import { CONSTANTES } from "@/common/constantes";
import Loading from "@/components/template/loading";
import { fetchEndereco, updateEndereco, deleteEndereco } from "@/lib/features/endereco/enderecoActions";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
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
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/DeleteOutlined';
import { DataGrid } from "@mui/x-data-grid";
import { useEffect, useState } from "react";
import { setEnderecos, setValues, clearForm, enderecoSchema } from '@/lib/features/endereco/enderecoSlice'
import { ptBR } from '@mui/x-data-grid/locales/ptBR';
import * as Yup from 'yup'
import Endereco from "@/common/endereco";
import EnderecoFields from "./enderecoFields";
import { useTheme } from '@mui/material/styles';

const EnderecoList = (props: any) => {
  const theme = useTheme();
  const dispatch = useAppDispatch();

  const { loading, enderecos, abaAtiva, valuesEndereco } = useAppSelector(
    (state: any) => state.endereco
  );

  useEffect(() => {
    if (abaAtiva === CONSTANTES.TAB_ONE_END) {
      dispatch(fetchEndereco());
    }
  }, [abaAtiva]);

  const [openConfirmDialog, setOpenConfirmDialog] = useState(false);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [selectedEnderecoId, setSelectedEnderecoId] = useState<string | null>(null);

  const handleOpenConfirmDialog = (id: string) => {
    setSelectedEnderecoId(id);
    setOpenConfirmDialog(true);
  };

  const handleCloseConfirmDialog = () => {
    setOpenConfirmDialog(false);
    setSelectedEnderecoId(null);
  };

  const handleDeleteConfirm = () => {
    if (selectedEnderecoId) {
      dispatch(deleteEndereco(selectedEnderecoId))
        .unwrap()
        .then(() => {
          dispatch(fetchEndereco()); // Atualiza a lista dps de excluir
        })
        .catch((error) => {
          console.error("Erro ao deletar o endereco:", error);
        });
    }
    handleCloseConfirmDialog();
  };

  const handleOpenEditDialog = (endereco: any) => {
    const valoresCompletosEndereco = {
      ...endereco,
      cep: endereco.cep ? endereco.cep.replace("-", CONSTANTES.VAZIO) : '',
      cidade: endereco.cidade || '',
      codMunicipio: endereco.codMunicipio || '',
    };
  
    dispatch(clearForm()); // Limpa os estados antes de carregar os novos valores
    dispatch(setValues(valoresCompletosEndereco));
    setSelectedEnderecoId(endereco.id);
    setOpenEditDialog(true);
  };
  
  

  const handleCloseEditDialog = () => {
    setOpenEditDialog(false);
    setSelectedEnderecoId(null);
  };

  const handleSaveEditEndereco = () => {
    try {
      // Valida os valores antes de prosseguir com a atualização
      console.log('values do handleSaveEditEndereco:', valuesEndereco);
      enderecoSchema.validateSync(valuesEndereco, { abortEarly: false });
  
      if (selectedEnderecoId) {
        console.log('Valores após edição do endereço:', valuesEndereco);
  
        // Remove o hífen do CEP antes de salvar
        const { dataCadastro = undefined, ...valuesToSave } = {
          ...valuesEndereco,
          cep: valuesEndereco.cep.replaceAll("-", CONSTANTES.VAZIO),
        };
  
        // Realiza o dispatch para atualizar o endereço, excluindo o campo dataCadastro
        dispatch(updateEndereco(valuesToSave))
          .unwrap()
          .then((updatedEndereco) => {
            // Atualização local da lista de endereços
            const updatedEnderecos = enderecos.map((endereco: any) =>
              endereco.id === updatedEndereco.id ? updatedEndereco : endereco
            );
            dispatch(setEnderecos(updatedEnderecos));
          })
          .catch((error) => {
            console.error('Erro ao editar o endereço:', error);
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
      field: CONSTANTES.KEY_LOG,
      headerName: CONSTANTES.TBL_HEAD_LOG,
      flex: 1,
    },
    {
      field: CONSTANTES.KEY_COMPL,
      headerName: CONSTANTES.TBL_HEAD_COMPL,
      flex: 1,
    },
    {
      field: CONSTANTES.KEY_CID,
      headerName: CONSTANTES.TBL_HEAD_CITY,
      flex: 1,
      renderCell: (params: any) => params.row.cidade.label,
    },
    {
      field: CONSTANTES.KEY_UF,
      headerName: CONSTANTES.TBL_HEAD_UF,
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
      <Box 
        component="form" 
        sx={{ 
          flexGrow: 1,
          margin: 2,
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
              padding: '24px',
            },
          }}
        >
          <CardHeader
            title={CONSTANTES.LBL_LIST_END}
            sx={{
              '& .MuiTypography-root': {
                fontWeight: 'bold',
                fontSize: '1.25rem',
              },
            }}
          />
          <CardContent>
            {!loading && (
              <DataGrid
                rows={enderecos}
                columns={columns}
                localeText={ptBR.components.MuiDataGrid.defaultProps.localeText}
                autoHeight
                initialState={{
                  pagination: {
                    paginationModel: {
                      pageSize: 5,
                    },
                  },
                }}
                pageSizeOptions={[5]}
                // checkboxSelection
                disableRowSelectionOnClick
                sx={{
                  border: theme.palette.mode === 'dark' ? '1px solid #333' : '1px solid #e0e0e0',
                  '& .MuiDataGrid-main': {
                    backgroundColor: theme.palette.mode === 'dark' ? '#242833' : '#ffffff',
                  },
                  '& .MuiDataGrid-cell': {
                    color: theme.palette.mode === 'dark' ? '#ffffff' : '#000000',
                    borderColor: theme.palette.mode === 'dark' ? '#333' : '#e0e0e0',
                  },
                  '& .MuiDataGrid-columnHeaders': {
                    backgroundColor: theme.palette.mode === 'dark' ? '#1a1a1a' : '#f5f5f5',
                    color: theme.palette.mode === 'dark' ? '#ffffff' : '#000000',
                    borderColor: theme.palette.mode === 'dark' ? '#333' : '#e0e0e0',
                  },
                  '& .MuiDataGrid-footerContainer': {
                    backgroundColor: theme.palette.mode === 'dark' ? '#1a1a1a' : '#f5f5f5',
                    color: theme.palette.mode === 'dark' ? '#ffffff' : '#000000',
                    borderColor: theme.palette.mode === 'dark' ? '#333' : '#e0e0e0',
                  },
                  '& .MuiCheckbox-root': {
                    color: theme.palette.mode === 'dark' ? '#b530b8' : '#670080',
                  },
                  '& .MuiTablePagination-root': {
                    color: theme.palette.mode === 'dark' ? '#ffffff' : '#000000',
                  },
                  '& .MuiButtonBase-root': {
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

        {/* Dialog de Confirmação de Exclusão */}
        <Dialog
          open={openConfirmDialog}
          onClose={handleCloseConfirmDialog}
          aria-labelledby="confirm-dialog-title"
          aria-describedby="confirm-dialog-description"
        >
          <DialogTitle id="confirm-dialog-title">{"Confirmação de Exclusão"}</DialogTitle>
          <DialogContent>
            Você tem certeza que deseja excluir este endereco?
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseConfirmDialog} color="primary">
              Cancelar
            </Button>
            <Button onClick={handleDeleteConfirm} color="secondary" autoFocus>
              Confirmar
            </Button>
          </DialogActions>
        </Dialog>

        {/* Dialog de Edição de Vaga */}
        <Dialog
          open={openEditDialog}
          onClose={handleCloseEditDialog}
          fullWidth={true}
          maxWidth="xl"
          aria-labelledby="edit-dialog-title"
        >
          <DialogTitle id="edit-dialog-title">{"Editar Endereço"}</DialogTitle>
          <DialogContent>
            <Card sx={{ padding: 2 }}>
              <CardContent>
                <EnderecoFields />
              </CardContent>
            </Card>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseEditDialog} color="primary">
              Cancelar
            </Button>
            <Button onClick={handleSaveEditEndereco} color="secondary">
              Salvar
            </Button>
          </DialogActions>
        </Dialog>

      </Box>
    </Slide>
  );
};

export default EnderecoList;
