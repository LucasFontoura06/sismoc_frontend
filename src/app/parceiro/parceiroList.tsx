"use client";

import { CONSTANTES } from "@/common/constantes";
import { convertAreasAtuacaoDescricao } from "@/common/utils";
import { fetchParceiro, fetchParceiroById } from "@/lib/features/parceiro/parceiroActions";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import {
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Slide,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { useEffect, useState } from "react";
import { Atom } from "react-loading-indicators";
import EditIcon from "@mui/icons-material/Edit";
import CloseIcon from "@mui/icons-material/Close";
import DeleteIcon from "@mui/icons-material/DeleteOutlined";
import ParceiroForm from "./parceiroForm";
import { setShowDialogEdit } from "@/lib/features/parceiro/parceiroSlice";
import ParceiroFields from "./parceiroFields";

const ParceiroList = (props: any) => {
  const dispatch = useAppDispatch();
  const [openConfirmDialog, setOpenConfirmDialog] = useState(false);
  const [openEdit, setEditOpen] = useState(false);

  const {
    showDialogEdit,
  } = useAppSelector((state: any) => state.parceiro);

  const setClose = () => {
    setEditOpen(false);
    dispatch(setShowDialogEdit(false));
  };

  const handleEditDialog = (id: string) => {
    dispatch(fetchParceiroById(id))
  };

  const handleCloseConfirmDialog = () => {
    setOpenConfirmDialog(false);
  };

  const handleDeleteConfirm = () => {
    // if (selectedVagaId) {
    //   dispatch(deleteVaga(selectedVagaId))
    //     .unwrap()
    //     .then(() => {
    //       dispatch(fetchVagas()); // Atualiza a lista de vagas após exclusão
    //     })
    //     .catch((error) => {
    //       console.error("Erro ao deletar a vaga:", error);
    //     });
    // }
    handleCloseConfirmDialog();
  };

  const { loading, abaAtiva, parceiros } = useAppSelector(
    (state: any) => state.parceiro
  );

  useEffect(() => {
    if (showDialogEdit) {
      setEditOpen(true);
    }
  }, [showDialogEdit]);

  useEffect(() => {
    if (abaAtiva === CONSTANTES.TAB_ONE_PARC) {
      dispatch(fetchParceiro());
    }
  }, [abaAtiva, dispatch]);

  const columns = [
    {
      field: CONSTANTES.KEY_NAME_PARC,
      headerName: CONSTANTES.TBL_HEAD_NOME,
      flex: 1,
    },
    {
      field: CONSTANTES.KEY_TYPE_PARC,
      headerName: CONSTANTES.TBL_HEAD_TYPE,
      flex: 1,
      renderCell: (params: any) => params.row.tipo?.descricao,
    },
    {
      field: CONSTANTES.KEY_AREA_PARC,
      headerName: CONSTANTES.TBL_HEAD_AREA,
      flex: 1,
      renderCell: (params: any) =>
        params.row.areasAtuacao?.length > 0 &&
        convertAreasAtuacaoDescricao(params.row),
    },
    {
      field: CONSTANTES.KEY_TRATATIVA_PARC,
      headerName: CONSTANTES.TBL_HEAD_STATS,
      flex: 1,
      renderCell: (params: any) =>
        params.row.tratativa
          ? CONSTANTES.LBL_TRATATIVA_PARC
          : CONSTANTES.LBL_CONCLUIDO_PARC,
    },
    {
      field: "actions",
      headerName: "Ações",
      flex: 1,
      renderCell: (params: any) => (
        <>
          <IconButton
            color="primary"
            onClick={() => {
              handleEditDialog(params.row.id);
            }}
            sx={{ marginRight: 1 }}
          >
            <EditIcon />
          </IconButton>
          <IconButton
            color="secondary"
            onClick={() => setOpenConfirmDialog(params.row.id)}
          >
            <DeleteIcon />
          </IconButton>
        </>
      ),
    },
  ];

  return (
    <>
      <Slide
        direction={props.index == 0 ? "right" : "left"}
        in={true}
        mountOnEnter
        unmountOnExit
      >
        <Box component="form" m={2} sx={{ flexGrow: 1 }}>
          <Card className="form" elevation={5}>
            <CardHeader
              title={CONSTANTES.LBL_LIST_PARC}
              className="text-white font-bold"
            />
            <CardContent>
              {loading ? (
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    height: "100%",
                  }}
                >
                  <Atom
                    color="#cbd5e1"
                    size="large"
                    text=""
                    textColor="#b7d350"
                  />
                </Box>
              ) : null}
              {!loading ? (
                <DataGrid
                  rows={parceiros}
                  columns={columns}
                  autoHeight
                  initialState={{
                    pagination: {
                      paginationModel: {
                        pageSize: 5,
                      },
                    },
                  }}
                  pageSizeOptions={[5]}
                  checkboxSelection
                  disableRowSelectionOnClick
                  sx={{
                    "& .MuiDataGrid-cell": {
                      color: "#fff",
                    },
                    "& .MuiDataGrid-checkboxInput": {
                      color: "#fff",
                    },
                    "& .MuiDataGrid-selectedRowCount": {
                      color: "#fff",
                    },
                    "& .MuiTablePagination-actions": {
                      color: "#fff",
                    },
                    "& .MuiTablePagination-displayedRows": {
                      color: "#fff",
                    },
                  }}
                />
              ) : null}
            </CardContent>
          </Card>
        </Box>
      </Slide>

      <Dialog
        fullWidth={true}
        maxWidth={"xl"}
        open={openEdit}
        sx={{ margin: 0, padding: 0 }}
        onClose={setClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <IconButton
          aria-label="close"
          onClick={setClose}
          sx={(theme) => ({
            position: "absolute",
            right: 8,
            top: 8,
            background: "#670080",
            color: theme.palette.grey[500],
          })}
        >
          <CloseIcon />
        </IconButton>
        <DialogContent>
          <ParceiroFields isReusing={true} />
        </DialogContent>
      </Dialog>

      {/* Dialog de Confirmação de Exclusão */}
      <Dialog
          open={openConfirmDialog}
          onClose={handleCloseConfirmDialog}
          aria-labelledby="confirm-dialog-title"
          aria-describedby="confirm-dialog-description"
        >
          <DialogTitle id="confirm-dialog-title">{"Confirmação de Exclusão"}</DialogTitle>
          <DialogContent>
            Você tem certeza que deseja excluir este parceiro?
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
    </>
  );
};

export default ParceiroList;
