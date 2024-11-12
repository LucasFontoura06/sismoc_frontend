"use client";

import { CONSTANTES } from "@/common/constantes";
import Loading from "@/components/template/loading";
import { fetchUsuarios, deleteUsuario, toggleStatusUsuario, updateUsuario } from "@/lib/features/usuario/usuarioActions";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { getPerfil, getPerfilCodigo } from '@/common/utils';
import {
  Box,
  Card,
  CardContent,
  CardHeader,
  Slide,
  IconButton,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
} from "@mui/material";
import {
  DataGrid,
  GridRowModesModel,
  GridRowModes,
  GridActionsCellItem,
  GridRowId,
  GridEventListener,
  GridRowEditStopReasons,
} from "@mui/x-data-grid";
import { useEffect, useState } from "react";
import { ptBR } from '@mui/x-data-grid/locales/ptBR';
import { useTheme } from '@mui/material/styles';
import PersonIcon from '@mui/icons-material/Person';
import PersonOffIcon from '@mui/icons-material/PersonOff';
import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Close';
import { SETORES } from '@/common/setor';
import { PERFIS } from '@/common/perfil';

// Define o tipo do usuário conforme necessário
interface Usuario {
  id: string;
  nome: string;
  email: string;
  perfil: string;
  setor: string;
  ativo: boolean;
}

const UsuarioList = (props: any) => {

  const theme = useTheme();
  const dispatch = useAppDispatch();
  const { loading, abaAtiva, usuarios, error, updateState, response } = useAppSelector(
    (state: any) => state.usuario
  );

  // Estado para gerenciar os usuários
  const [users, setUsers] = useState<Usuario[]>(usuarios);

  useEffect(() => {
    if (abaAtiva === CONSTANTES.TAB_ONE_USER) {
      dispatch(fetchUsuarios());
    }
  }, [abaAtiva, dispatch]);

  // Atualize o estado local quando os usuários são carregados
  useEffect(() => {
    console.log('Usuarios atualizados:', usuarios);
    setUsers(usuarios);
  }, [usuarios]);

  // Dialog para confirmar a alteração de status  
  const [openDialog, setOpenDialog] = useState(false);
  const [userToToggle, setUserToToggle] = useState<{ id: string; status: boolean; nome: string } | null>(null);

  const handleToggleClick = (userId: string, currentStatus: boolean, userName: string) => {
    setUserToToggle({ id: userId, status: currentStatus, nome: userName });
    setOpenDialog(true);
  };

  const handleConfirmToggle = async () => {
    if (userToToggle) {
      try {
        await dispatch(toggleStatusUsuario({
          userId: userToToggle.id,
          status: !userToToggle.status
        }));
        dispatch(fetchUsuarios());
      } catch (error) {
        console.error('Erro ao atualizar o status:', error);
      }
    }
    setOpenDialog(false);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setUserToToggle(null);
  };

  const [rowModesModel, setRowModesModel] = useState<GridRowModesModel>({});

  const handleRowEditStop: GridEventListener<'rowEditStop'> = (params, event) => {
    if (params.reason === GridRowEditStopReasons.rowFocusOut) {
      event.defaultMuiPrevented = true;
    }
  };

  const handleEditClick = (id: GridRowId) => () => {
    setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.Edit } });
  };

  const handleSaveClick = (id: GridRowId) => () => {
    setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.View } });
  };

  const handleCancelClick = (id: GridRowId) => () => {
    setRowModesModel({
      ...rowModesModel,
      [id]: { mode: GridRowModes.View, ignoreModifications: true },
    });
  };

  const processRowUpdate = async (newRow: any) => {
    try {
      console.log('Atualizando usuário:', newRow);
      const perfilSelecionado = PERFIS.find(p => p.codigo === newRow.perfil);
      
      const updatedUser = {
        ...newRow,
        id: newRow.id,
        setor: newRow.setor,
        perfil: {
          id: perfilSelecionado?.codigo || '',
          descricao: perfilSelecionado?.label || ''
        }
      };
      
      await dispatch(updateUsuario(updatedUser));
      await dispatch(fetchUsuarios());
      return newRow;
    } catch (error) {
      console.error('Erro ao atualizar usuário:', error);
      throw error;
    }
  };

  const handleRowModesModelChange = (newRowModesModel: GridRowModesModel) => {
    setRowModesModel(newRowModesModel);
  };

  const columns = [
    {
      field: CONSTANTES.KEY_NOME,
      headerName: CONSTANTES.LBL_HEAD_NOME,
      flex: 1,
    },
    {
      field: CONSTANTES.KEY_EMAIL,
      headerName: CONSTANTES.LBL_HEAD_EMAIL,
      flex: 1,
    },

    {
      field: 'setor',
      headerName: 'Setor',
      width: 150,
      editable: true,
      type: 'singleSelect' as const,
      valueOptions: SETORES.map(setor => ({
        value: setor.codigo,
        label: setor.label
      })),
      valueFormatter: (params: any) => {
        const setor = SETORES.find(s => s.codigo === params.value);
        return setor ? setor.label : params.value;
      }
    },
    {
      field: 'perfil',
      headerName: 'Perfil',
      width: 150,
      editable: true,
      type: 'singleSelect' as const,
      valueOptions: PERFIS.map(perfil => ({
        value: perfil.codigo,
        label: perfil.label
      })),
      renderCell: (params: any) => getPerfil(params.row.perfil?.id || '')
      // valueGetter: (params) => {
      //   // Retorna o id do perfil para o componente
      //   return params.row.perfil?.id || '';
      // },
      // valueFormatter: (params) => {
      //   // Usa a função getPerfil que já existe
      //   return getPerfil(params.row.perfil?.id || '');
      // }
    },

    {
      field: 'userStatus',
      headerName: 'Status',
      width: 130,
      renderCell: (params: any) => (
        <IconButton
          onClick={() => handleToggleClick(params.row.id, params.row.ativo, params.row.nome)}
          sx={{
            color: params.row.ativo ? '#4caf50' : '#f44336',
            '&:hover': {
              backgroundColor: 'rgba(0, 0, 0, 0.04)',
            },
          }}
        >
          {params.row.ativo ? <PersonIcon /> : <PersonOffIcon />}
        </IconButton>
      ),
    },

    {
      field: 'actions',
      type: 'actions' as const,
      headerName: 'Ações',
      width: 100,
      cellClassName: 'actions',
      getActions: ({ id }: { id: string }) => {
        const isInEditMode = rowModesModel[id]?.mode === GridRowModes.Edit;

        if (isInEditMode) {
          return [
            <GridActionsCellItem
              icon={<SaveIcon />}
              label="Save"
              onClick={handleSaveClick(id)}
              sx={{
                color: theme.palette.mode === 'dark' ? '#b530b8' : '#1e8cfa',
              }}
            />,
            <GridActionsCellItem
              icon={<CancelIcon />}
              label="Cancel"
              onClick={handleCancelClick(id)}
              sx={{
                color: theme.palette.mode === 'dark' ? '#ffffff' : '#000000',
              }}
            />,
          ];
        }

        return [
          <GridActionsCellItem
            icon={<EditIcon />}
            label="Edit"
            onClick={handleEditClick(id)}
            sx={{
              color: theme.palette.mode === 'dark' ? '#ffffff' : '#000000',
            }}
          />,
          // ... outros botões de ação existentes ...
        ];
      },
    },
  ];

  return (
    <Slide
      direction={props.index === 0 ? "right" : "left"}
      in={true}
      mountOnEnter
      unmountOnExit
    >
      <Box component="form" m={2} sx={{ flexGrow: 1 }}>
        {loading && <Loading open={loading} />}
        <Card
          elevation={5}
          sx={{
            backgroundColor: theme.palette.mode === 'dark' ? '#242833' : '#ffffff',
          }}
        >
          <CardHeader
            title={CONSTANTES.LBL_LIST_TITLE}
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
                rows={users}
                columns={columns}
                editMode="row"
                rowModesModel={rowModesModel}
                onRowModesModelChange={handleRowModesModelChange}
                onRowEditStop={handleRowEditStop}
                processRowUpdate={processRowUpdate}
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

        {/* Dialog para confirmar a alteração de status */}
        <Dialog
          open={openDialog}
          onClose={handleCloseDialog}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title">
            {`Confirmar alteração de status`}
          </DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              {userToToggle?.status
                ? `Deseja desativar o usuário ${userToToggle?.nome}?`
                : `Deseja ativar o usuário ${userToToggle?.nome}?`}
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDialog}
              sx={{
                backgroundColor: theme.palette.mode === 'dark' ? '#b530b8' : '#1e8cfa',
                color: '#ffffff',
                '&:hover': {
                  backgroundColor: theme.palette.mode === 'dark' ? '#8a248c' : '#1976d2',
                }
              }}>
              Cancelar
            </Button>
            <Button onClick={handleConfirmToggle}
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


      </Box>
    </Slide>
  );
};

export default UsuarioList;
