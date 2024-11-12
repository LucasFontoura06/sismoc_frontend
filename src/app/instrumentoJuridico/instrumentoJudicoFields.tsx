import { CONSTANTES } from "@/common/constantes";
import { FileContext } from "@/common/fileContext";
import { convertUFDropdown, convertFileToBase64 } from "@/common/utils";
import DataInput from "@/components/data";
import FileInputForm from "@/components/fileInput";
import InputForm from "@/components/inputForm";
import InputFormMultiline from "@/components/inputFormMultiline";
import SelectForm from "@/components/selectForm";
import { getCidade } from "@/lib/features/endereco/enderecoActions";
import {
  fetchStatus,
  fetchTiposIJ,
} from "@/lib/features/instrumento-juridico/instrumentoJuridicoActions";
import {
  setArquivo,
  setDataAssinatura,
  setDataAssInvalida,
  setDataFim,
  setDataFimInvalida,
  setDocumento,
  setLocalAssinatura,
  setNumero,
  setObjeto,
  setStatus,
  setSubtipo,
  setTipo,
  setUFAcao,
} from "@/lib/features/instrumento-juridico/instrumentoJuridicoSlice";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import Grid from "@mui/material/Unstable_Grid2/Grid2";
import dayjs from "dayjs";
import { useCallback, useEffect, useState } from "react";
import { useContext } from "react";

const InstrumentoJuridicoFields = (props: any) => {
  const dispatch = useAppDispatch();
  const fileContext = useContext(FileContext);
  const setFile = (file: File) => {
    if (fileContext && typeof fileContext.setFile === 'function') {
      fileContext.setFile(file);
    }
  };
  const {
    touched,
    errors,
    valuesIJ,
    tipos,
    subtipos,
    status,
    cidades,
    successIJ,
  } = useAppSelector((state: any) => state.instrumentoJuridico);

  const dtAssinatura = useState<string>(CONSTANTES.VAZIO)[0];
  const dtFim = useState<string>(CONSTANTES.VAZIO)[0];

  const { showInstrumentoJuridico, valuesParceiro, successParceiro } =
    useAppSelector((state: any) => state.parceiro);

  useEffect(() => {
    if (showInstrumentoJuridico) {
      dispatch(fetchTiposIJ());
      dispatch(fetchStatus());
    }
  }, [showInstrumentoJuridico, dispatch]); // AQUI VAI O OBJETO A SER MONITORADO CASO SEU ESTADO MUDE

  useEffect(() => {
    if (valuesIJ.ufAcao) {
      dispatch(getCidade(valuesIJ.ufAcao));
    }
  }, [valuesIJ.ufAcao, dispatch]);

  const handleDataAssinaturaChange = useCallback(
    (date: any) => {
      if (date !== CONSTANTES.INVALID_DATE) {
        const primeiroDigito = date?.split("/")[2][0];
        if (parseInt(primeiroDigito) > 0) {
          dispatch(setDataAssinatura(date));
        }
      } else {
        dispatch(setDataAssInvalida(true));
      }
    },
    [dispatch]
  );

  const handleDataFimChange = useCallback(
    (date: any) => {
      if (date !== CONSTANTES.INVALID_DATE) {
        const primeiroDigito = date?.split("/")[2][0];
        if (parseInt(primeiroDigito) > 0) {
          dispatch(setDataFim(date));
        }
      } else {
        dispatch(setDataFimInvalida(true));
      }
    },
    [dispatch]
  );

  const handleUFChange = useCallback(
    (value: string) => {
      dispatch(setUFAcao(value));
    },
    [dispatch]
  );

  const handleFileChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      dispatch(setDocumento(file.name));
      setFile(file);
    }
  }, [dispatch, setFile]);

  return (
    <Grid container spacing={2}>
      <Grid xs={10} md={10}>
        <FileInputForm
          label={CONSTANTES.LBL_SELECT_FILE}
          name={CONSTANTES.FILE_NAME}
          onChange={handleFileChange}
          value={valuesIJ.documento}
        />
      </Grid>
      <Grid xs={2} md={2}>
        <InputForm
          label={`* ${CONSTANTES.LBL_NUM}`}
          mask={CONSTANTES.MASK_NUM}
          value={valuesIJ.numero}
          onChange={(event: any) => dispatch(setNumero(event.target.value))}
          isInvalid={touched.numero && Boolean(errors.numero)}
          msgError={touched.numero ? errors.numero : false}
        />
      </Grid>
      <Grid xs={12} md={12}>
        <InputFormMultiline
          label={`* ${CONSTANTES.LBL_OBJ}`}
          name={CONSTANTES.OBJ_NAME}
          value={valuesIJ.objeto}
          onChange={(event: any) => dispatch(setObjeto(event.target.value))}
          isInvalid={touched.objeto && Boolean(errors.objeto)}
          msgError={touched.objeto ? errors.objeto : false}
        />
      </Grid>
      <Grid xs={12} md={subtipos.length > 0 ? 6 : 9}>
        <SelectForm
          itens={tipos}
          label={`* ${CONSTANTES.LBL_TYPE_IJ}`}
          value={valuesIJ.tipo}
          onChange={(event: any) => dispatch(setTipo(event.target.value))}
          isInvalid={touched.tipo && Boolean(errors.tipo)}
          msgError={touched.tipo ? errors.tipo : false}
        />
      </Grid>
      {subtipos.length > 0 && (
        <Grid xs={12} md={3}>
          <SelectForm
            itens={subtipos}
            label={`* ${CONSTANTES.LBL_SUBTYPE_IJ}`}
            value={valuesIJ.subtipo}
            onChange={(event: any) => dispatch(setSubtipo(event.target.value))}
            isInvalid={touched.subtipo && Boolean(errors.subtipo)}
            msgError={touched.subtipo ? errors.subtipo : false}
          />
        </Grid>
      )}
      <Grid xs={12} md={3}>
        <SelectForm
          itens={status}
          label={`* ${CONSTANTES.LBL_STATUS_IJ}`}
          value={valuesIJ.status}
          onChange={(event: any) => dispatch(setStatus(event.target.value))}
          isInvalid={touched.status && Boolean(errors.status)}
          msgError={touched.status ? errors.status : false}
        />
      </Grid>
      <Grid xs={2} md={2}>
        <SelectForm
          itens={convertUFDropdown()}
          label={`* ${CONSTANTES.LBL_UF_ACTION}`}
          value={valuesIJ.ufAcao}
          onChange={(event: any) => handleUFChange(event.target.value)}
          isInvalid={touched.ufAcao && Boolean(errors.ufAcao)}
          msgError={touched.ufAcao ? errors.ufAcao : false}
        />
      </Grid>
      <Grid xs={10} md={10}>
        <SelectForm
          itens={cidades}
          disabled={!cidades.length}
          label={`* ${CONSTANTES.LBL_LOCAL_ASS}`}
          value={valuesIJ.localAssinatura}
          onChange={(event: any) =>
            dispatch(setLocalAssinatura(event.target.value))
          }
          isInvalid={touched.localAssinatura && Boolean(errors.localAssinatura)}
          msgError={touched.localAssinatura ? errors.localAssinatura : false}
        />
      </Grid>
      <Grid xs={12} md={6}>
        <DataInput
          label={`* ${CONSTANTES.LBL_DT_ASS}`}
          value={dtAssinatura ? dayjs(dtAssinatura) : null}
          disableFuture={true}
          onChange={(date) => {
            if (date) {
              handleDataAssinaturaChange(date.format(CONSTANTES.PATTERN_DATE));
            }
          }}
          isInvalid={touched.dataAssinatura && Boolean(errors.dataAssinatura)}
          msgError={touched.dataAssinatura ? errors.dataAssinatura : false}
        />
      </Grid>
      <Grid xs={12} md={6}>
        <DataInput
          label={`* ${CONSTANTES.LBL_DT_FIM}`}
          value={dtFim ? dayjs(dtFim) : null}
          disablePast={true}
          onChange={(date) => {
            if (date) {
              handleDataFimChange(date.format(CONSTANTES.PATTERN_DATE));
            }
          }}
          isInvalid={touched.dataFim && Boolean(errors.dataFim)}
          msgError={touched.dataFim ? errors.dataFim : false}
        />
      </Grid>
    </Grid>
  );
};

export default InstrumentoJuridicoFields;
