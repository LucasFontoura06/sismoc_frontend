import { CONSTANTES } from "@/common/constantes";
import { PONTOS_FOCAIS } from "@/common/pontoFocal";
import InputForm from "@/components/inputForm";
import SelectChipForm from "@/components/selectChipForm";
import SelectForm from "@/components/selectForm";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Button,
  Checkbox,
  Dialog,
  DialogContent,
  FormControlLabel,
  Grid,
  IconButton,
} from "@mui/material";
import InstrumentoJuridicoFields from "../instrumentoJuridico/instrumentoJudicoFields";
import { GridCloseIcon, GridExpandMoreIcon } from "@mui/x-data-grid";
import ContatoFields from "../contato/contatoFields";
import InputFormMultiline from "@/components/inputFormMultiline";
import { useContext, useEffect, useMemo, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { FileContext } from "@/common/fileContext";
import {
  resetFormParceiro,
  setAbaAtiva,
  setAreasAtuacao,
  setEndereco,
  setListaEndereco,
  setInfoAdicional,
  setLoading,
  setNome,
  setPontoFocalSISEC,
  setProcessoSEI,
  setSegmento,
  setShowContato,
  setShowInstrumentoJuridico,
  setTipo,
  setTratativa,
} from "@/lib/features/parceiro/parceiroSlice";
import {
  addParceiro,
  fetchAreasAtuacao,
  fetchTiposParceiro,
} from "@/lib/features/parceiro/parceiroActions";
import { fetchSegmento } from "@/lib/features/segmento/segmentoActions";
import { fetchEndereco } from "@/lib/features/endereco/enderecoActions";
import { clearForm } from "@/lib/features/instrumento-juridico/instrumentoJuridicoSlice";
import {
  convertArrayToObjetoFB,
  convertObjetoFB,
  retirarMascara,
} from "@/common/utils";
import {
  addInstrumentoJuridico,
  uploadFileIJ,
} from "@/lib/features/instrumento-juridico/instrumentoJuridicoActions";
import { addContato } from "@/lib/features/contato/contatoActions";
import EnderecoForm from "../endereco/enderecoForm";

const ParceiroFields = (props: any) => {
  const dispatch = useAppDispatch();
  const fileContext = useContext(FileContext);
  const [open, setOpen] = useState(false);

  const {
    tiposParceiro,
    areasAtuacao,
    valuesParceiro,
    abaAtiva,
    validFormParceiro,
    successParceiro,
    showDialogEdit,
    listaEndereco,
    touched,
    errors,
    loading,
    showInstrumentoJuridico,
    showContato,
  } = useAppSelector((state: any) => state.parceiro);

  const {
    validFormIJ,
    valuesIJ,
    successIJ,
    cidades,
    status,
    subtipos,
    tipos,
    fileDownloadURL,
    successUploadFileIJ,
  } = useAppSelector((state: any) => state.instrumentoJuridico);

  const { validFormContato, valuesContato, successContato } = useAppSelector(
    (state: any) => state.contato
  );

  const { enderecos, successEndereco } = useAppSelector(
    (state: any) => state.endereco
  );

  const { segmentos } = useAppSelector((state: any) => state.segmento);

  useEffect(() => {
    if (abaAtiva == CONSTANTES.TAB_TWO_PARC) {
      dispatch(fetchTiposParceiro());
      dispatch(fetchSegmento());
      dispatch(fetchAreasAtuacao());
      dispatch(fetchEndereco());
    }
  }, [abaAtiva, dispatch]);

  useEffect(() => {
    const hasNomeContato = Boolean(valuesContato.nome);
    const hasIJNumero = Boolean(valuesIJ.numero);
    if (
      (successParceiro && successIJ && !hasNomeContato) ||
      (successParceiro && successContato && !hasIJNumero) ||
      (successParceiro && successIJ && successParceiro) ||
      (successParceiro && !hasNomeContato && !hasIJNumero)
    ) {
      dispatch(setLoading(false));
      dispatch(resetFormParceiro());
      dispatch(clearForm());
      dispatch(setAbaAtiva(CONSTANTES.TAB_ONE_PARC));
    }
  }, [successIJ, successContato, successParceiro, dispatch]);

  useEffect(() => {
    dispatch(setListaEndereco(enderecos));
  }, [enderecos]);

  const isValidParceiroSubmission = useMemo(() => {
    const hasIJNumero = Boolean(valuesIJ.numero);
    const hasNomeContato = Boolean(valuesContato.nome);
    return (
      validFormParceiro &&
      ((hasIJNumero && validFormIJ) || (!hasIJNumero && !validFormIJ)) &&
      ((hasNomeContato && validFormContato) ||
        (!hasNomeContato && !validFormContato))
    );
  }, [
    valuesIJ.numero,
    validFormIJ,
    validFormParceiro,
    valuesContato.nome,
    validFormContato,
  ]);

  const getValuesIJToSave = () => {
    const objLocalAssinatura = convertObjetoFB(
      valuesIJ.localAssinatura,
      cidades,
      CONSTANTES.LBL_CIDADE
    );
    const objStatus = convertObjetoFB(
      valuesIJ.status,
      status,
      CONSTANTES.LBL_STATUS_IJ
    );
    const tipo = convertObjetoFB(valuesIJ.tipo, tipos, CONSTANTES.LBL_TYPE_IJ);

    const subtipo =
      valuesIJ.subtipo && subtipos.length
        ? convertObjetoFB(valuesIJ.subtipo, subtipos, CONSTANTES.LBL_SUBTYPE_IJ)
        : CONSTANTES.VAZIO;
    const ij = {
      ...valuesIJ,
      parceiro: valuesParceiro.id,
      localAssinatura: objLocalAssinatura,
      status: objStatus,
      tipo: tipo,
      subtipo: subtipo,
    };
    return ij;
  };

  const getValuesContatoToSave = () => {
    const contato = {
      ...valuesContato,
      parceiro: valuesParceiro.id,
      telefone: retirarMascara(valuesContato.telefone),
      celular: retirarMascara(valuesContato.celular),
    };
    return contato;
  };

  useEffect(() => {
    if (fileDownloadURL && successUploadFileIJ) {
      const ij = getValuesIJToSave();
      ij["arquivo"] = fileDownloadURL;
      dispatch(addInstrumentoJuridico(ij));
    }
  }, [fileDownloadURL, successUploadFileIJ, dispatch]);

  useEffect(() => {
    if (isValidParceiroSubmission) {
      const parceiro = {
        id: valuesParceiro.id,
        nome: valuesParceiro.nome,
        segmento: convertObjetoFB(
          valuesParceiro.segmento,
          segmentos,
          CONSTANTES.LBL_SEG_PARC
        ),
        tipo: convertObjetoFB(
          valuesParceiro.tipo,
          tiposParceiro,
          CONSTANTES.LBL_TYPE_PARC
        ),
        areasAtuacao: convertArrayToObjetoFB(
          valuesParceiro.areasAtuacao,
          areasAtuacao
        ),
        dataCadastro: new Date(),
        enderecos: [valuesParceiro.endereco],
        infoAdicional: valuesParceiro.infoAdicional,
        pontoFocalSISEC: valuesParceiro.pontoFocalSISEC,
        tratativa: valuesParceiro.tratativa,
        processoSEI: retirarMascara(valuesParceiro.processoSEI),
      };
      dispatch(addParceiro(parceiro));
    }
  }, [isValidParceiroSubmission, dispatch]);

  useEffect(() => {
    if (successParceiro) {
      if (
        fileContext?.file &&
        valuesIJ.documento &&
        valuesIJ.numero &&
        validFormIJ
      ) {
        const file = fileContext?.file;
        dispatch(uploadFileIJ(file));
      } else if (valuesIJ.numero && validFormIJ) {
        const ij = getValuesIJToSave();
        dispatch(addInstrumentoJuridico(ij));
      }
      if (valuesContato.nome && validFormContato) {
        const contato = getValuesContatoToSave();
        dispatch(addContato(contato));
      }
    } else {
      dispatch(setAbaAtiva(CONSTANTES.TAB_ONE_PARC));
    }
  }, [successParceiro, valuesParceiro.id, dispatch]);

  useEffect(() => {
    if (successEndereco) {
      dispatch(fetchEndereco());
      setOpen(false);
    }
  }, [successEndereco, dispatch]);

  useEffect(() => {
    if (abaAtiva === CONSTANTES.TAB_TWO_PARC) {
      dispatch(resetFormParceiro());
      dispatch(fetchTiposParceiro());
      dispatch(fetchSegmento());
      dispatch(fetchAreasAtuacao());
      dispatch(fetchEndereco());
    }
  }, [abaAtiva, dispatch]);

  useEffect(() => {
    if (showDialogEdit) {
      dispatch(fetchTiposParceiro());
      dispatch(fetchSegmento());
      dispatch(fetchAreasAtuacao());
      dispatch(fetchEndereco());
    }
  }, [showDialogEdit, dispatch]);

  return (
    <>
      <Box component="form" m={1} sx={{ flexGrow: 1 }}>
        <Grid container spacing={1} alignItems="stretch">
          <Grid item xs={12} md={4}>
            <InputForm
              label={`* ${CONSTANTES.LBL_NAME_PARC}`}
              value={valuesParceiro.nome}
              onChange={(event: any) => dispatch(setNome(event.target.value))}
              isInvalid={touched.nome && Boolean(errors.nome)}
              msgError={touched.nome ? errors.nome : false}
              fullWidth
            />
          </Grid>
          <Grid item xs={12} md={3}>
            <SelectForm
              itens={tiposParceiro}
              label={`* ${CONSTANTES.LBL_TYPE_PARC}`}
              value={valuesParceiro.tipo}
              onChange={(event: any) => {
                dispatch(setTipo(event.target.value));
              }}
              isInvalid={touched.tipo && Boolean(errors.tipo)}
              msgError={touched.tipo ? errors.tipo : false}
              fullWidth
            />
          </Grid>
          <Grid item xs={12} md={2}>
            <SelectForm
              itens={PONTOS_FOCAIS}
              label={`* ${CONSTANTES.LBL_PT_FC_SISEC}`}
              value={valuesParceiro.pontoFocalSISEC}
              onChange={(event: any) => {
                dispatch(setPontoFocalSISEC(event.target.value));
              }}
              isInvalid={touched.pontoFocalSISEC && Boolean(errors.pontoFocalSISEC)}
              msgError={touched.pontoFocalSISEC ? errors.pontoFocalSISEC : false}
              fullWidth
            />
          </Grid>
          <Grid item xs={12} md={2}>
            <FormControlLabel
              control={
                <Checkbox
                  checked={valuesParceiro.tratativa}
                  onChange={(event: any) => {
                    dispatch(setTratativa(event.target.checked));
                  }}
                  sx={{
                    color: "#cbd5e1",
                    "&.Mui-checked": {
                      color: "#cbd5e1",
                    },
                  }}
                />
              }
              label={CONSTANTES.LBL_TRATATIVA_PARC}
              sx={{
                color: "#cbd5e1",
              }}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <SelectForm
              itens={segmentos}
              label={`* ${CONSTANTES.LBL_SEG_PARC}`}
              value={valuesParceiro.segmento}
              onChange={(event: any) => {
                dispatch(setSegmento(event.target.value));
              }}
              isInvalid={touched.segmento && Boolean(errors.segmento)}
              msgError={touched.segmento ? errors.segmento : false}
              fullWidth
            />
          </Grid>
          <Grid item xs={12} md={3}>
            <SelectChipForm
              itens={areasAtuacao}
              label={`* ${CONSTANTES.LBL_AREA_PARC}`}
              value={valuesParceiro.areasAtuacao}
              onChange={(event: any) => {
                dispatch(setAreasAtuacao(event.target.value));
              }}
              isInvalid={touched.areasAtuacao && Boolean(errors.areasAtuacao)}
              msgError={touched.areasAtuacao ? errors.areasAtuacao : false}
            />
          </Grid>
          <Grid item xs={12} md={3}>
            <InputForm
              label={CONSTANTES.LBL_PROCESSO_PARC}
              name={CONSTANTES.PROC_NAME}
              mask={CONSTANTES.MASK_PROC}
              value={valuesParceiro.processoSEI}
              onChange={(event: any) =>
                dispatch(setProcessoSEI(event.target.value))
              }
              isInvalid={touched.processoSEI && Boolean(errors.processoSEI)}
              msgError={touched.processoSEI ? errors.processoSEI : false}
              fullWidth
            />
          </Grid>
          <Grid item xs={12} md={12}>
            <Accordion
              expanded={showInstrumentoJuridico}
              onChange={() =>
                dispatch(setShowInstrumentoJuridico(!showInstrumentoJuridico))
              }
              sx={{
                background: "transparent",
                border: "1px solid #cbd5e1",
                color: "#cbd5e1",
              }}
            >
              <AccordionSummary
                expandIcon={<GridExpandMoreIcon />}
                aria-controls="panel1-content"
                id="panel1-header"
              >
                {CONSTANTES.LBL_INST_JUR}
              </AccordionSummary>
              <AccordionDetails>
                <InstrumentoJuridicoFields />
              </AccordionDetails>
            </Accordion>
          </Grid>
          <Grid item xs={11} md={11}>
            <SelectForm
              itens={listaEndereco}
              label={`* ${CONSTANTES.LBL_ENDS}`}
              value={valuesParceiro.endereco}
              onChange={(event: any) => {
                dispatch(setEndereco(event.target.value));
              }}
              isInvalid={touched.endereco && Boolean(errors.endereco)}
              msgError={touched.endereco ? errors.endereco : false}
              fullWidth
            />
          </Grid>
          <Grid item xs={1} md={1}>
            <Button
              variant="contained"
              disabled={loading}
              onClick={() => setOpen(true)}
              sx={{ background: "#670080", fontSize: "12px" }}
            >
              {CONSTANTES.BTN_NEW_END.toUpperCase()}
            </Button>
          </Grid>
          <Grid item xs={12} md={12}>
            <Accordion
              expanded={showContato}
              onChange={() => dispatch(setShowContato(!showContato))}
              sx={{
                background: "transparent",
                border: "1px solid #cbd5e1",
                color: "#cbd5e1",
              }}
            >
              <AccordionSummary
                expandIcon={<GridExpandMoreIcon />}
                aria-controls="panel1-content"
                id="panel1-header"
              >
                {CONSTANTES.LBL_CONTATOS}
              </AccordionSummary>
              <AccordionDetails>
                <ContatoFields />
              </AccordionDetails>
            </Accordion>
          </Grid>
          <Grid item xs={12} md={12}>
            <InputFormMultiline
              label={CONSTANTES.LBL_INFO_ADD}
              name={CONSTANTES.INFO_ADD_NAME}
              value={valuesParceiro.infoAdicional}
              onChange={(event: any) =>
                dispatch(setInfoAdicional(event.target.value))
              }
              fullWidth
            />
          </Grid>
        </Grid>
      </Box>
      <Dialog
        fullWidth={true}
        maxWidth={"lg"}
        open={open}
        sx={{ margin: 0, padding: 0 }}
        onClose={() => setOpen(false)}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <IconButton
          aria-label="close"
          onClick={() => setOpen(false)}
          sx={(theme) => ({
            position: "absolute",
            right: 8,
            top: 8,
            background: "#670080",
            color: theme.palette.grey[500],
          })}
        >
          <GridCloseIcon />
        </IconButton>
        <DialogContent>
          <EnderecoForm isReusing={true} />
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ParceiroFields;
