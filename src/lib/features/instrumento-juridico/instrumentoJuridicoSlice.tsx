import { CONSTANTES } from "@/common/constantes";
import {
  convertCidadeDropdown,
  convertStatusIJDropdown,
  convertStringToDate,
  convertTipoIJDropdown,
} from "@/common/utils";
import { createSlice, current } from "@reduxjs/toolkit";
import * as Yup from "yup";
import { getCidade } from "../endereco/enderecoActions";
import {
  addInstrumentoJuridico,
  fetchStatus,
  fetchTiposIJ,
  uploadFileIJ,
} from "./instrumentoJuridicoActions";

const validateDataMenor = (date: string, field: string, state: any) => {
  const dataInformada = convertStringToDate(date);

  // 2. Obter a data assinatura
  const dataAss = convertStringToDate(current(state).valuesIJ.dataAssinatura);

  // 3. Comparar as datas
  const isDataMenor = dataInformada <= dataAss;

  if (isDataMenor) {
    state.errors[field] = CONSTANTES.ERROR_FIELD_DT_LT_CURRENT_DT;
    state.touched[field] = true;
  } else {
    state.errors[field] = CONSTANTES.VAZIO;
  }
};

const validateDataMaior = (date: string, field: string, state: any) => {
  const dataInformada = convertStringToDate(date);

  // 2. Obter a data atual
  const dataAtual = new Date(state.dataAssinaturaIJ);

  // 3. Comparar as datas
  const isDataMaior = dataInformada >= dataAtual;

  if (isDataMaior) {
    state.errors[field] = CONSTANTES.ERROR_FIELD_DT_GT_CURRENT_DT;
    state.touched[field] = true;
  } else {
    state.errors[field] = CONSTANTES.VAZIO;
  }
};

export const ijSchema = Yup.object().shape({
  dataAssinatura: Yup.string().required(CONSTANTES.ERROR_FIELD_REQUIRED),
  dataFim: Yup.string().required(CONSTANTES.ERROR_FIELD_REQUIRED),
  documento: Yup.string(),
  numero: Yup.string().required(CONSTANTES.ERROR_FIELD_REQUIRED),
  objeto: Yup.string().required(CONSTANTES.ERROR_FIELD_REQUIRED),
  status: Yup.string().required(CONSTANTES.ERROR_FIELD_REQUIRED),
  tipo: Yup.string().required(CONSTANTES.ERROR_FIELD_REQUIRED),
  subtipo: Yup.string().when(CONSTANTES.KEY_TYPE_IJ, {
    is: (value: string) => value === CONSTANTES.ID_IJ_ACT, // CASO ALTERADO NO BANCO DE DADOS ALTERAR NO ARQUIVO DE CONSTANTES
    then: (schema: any) => schema.required(CONSTANTES.ERROR_FIELD_REQUIRED),
  }),
  ufAcao: Yup.string().required(CONSTANTES.ERROR_FIELD_REQUIRED),
  localAssinatura: Yup.string().required(CONSTANTES.ERROR_FIELD_REQUIRED),
});

const validateField = (field: string, state: any) => {
  try {
    ijSchema.validateSyncAt(field, state.valuesIJ);
    state.errors[field] = CONSTANTES.VAZIO;
  } catch (error: any) {
    state.errors[field] = error.message;
  } finally {
    state.touched[field] = true;
  }
};

const INITIAL_STATE = {
  createState: false,
  updateState: false,
  loadingIJ: false,
  successIJ: false,
  successUploadFileIJ: false,
  valuesIJ: {
    id: null,
    dataAssinatura: null,
    dataFim: null,
    documento: CONSTANTES.VAZIO,
    arquivo: null,
    numero: CONSTANTES.VAZIO,
    objeto: CONSTANTES.VAZIO,
    parceiro: CONSTANTES.VAZIO,
    status: CONSTANTES.VAZIO,
    tipo: CONSTANTES.VAZIO,
    subtipo: CONSTANTES.VAZIO,
    ufAcao: CONSTANTES.VAZIO,
    localAssinatura: CONSTANTES.VAZIO,
  },
  fileDownloadURL: null as any | null,
  cidades: [] as any[],
  tipos: [] as any[],
  subtipos: [] as any[],
  status: [] as any[],
  errors: {} as any,
  touched: {} as any,
  errorAPI: CONSTANTES.VAZIO,
  response: CONSTANTES.VAZIO,
  validFormIJ: false,
};

const instrumentoJuridicoSlice = createSlice({
  name: CONSTANTES.IJ_NAME,
  initialState: INITIAL_STATE,
  reducers: {
    changeStateTrue: (state) => {
      state.updateState = true;
    },
    changeStateFalse: (state) => {
      state.updateState = false;
    },
    clearResponse: (state) => {
      state.response = CONSTANTES.VAZIO;
    },
    clearForm: (state) => {
      state.valuesIJ = INITIAL_STATE.valuesIJ;
      state.successIJ = INITIAL_STATE.successIJ;
      state.validFormIJ = INITIAL_STATE.validFormIJ;
      state.errors = INITIAL_STATE.errors;
      state.touched = INITIAL_STATE.touched;
    },
    setNumero: (state, action) => {
      state.valuesIJ.numero = action.payload;
      validateField(CONSTANTES.KEY_NUM, state);
    },
    setObjeto: (state, action) => {
      state.valuesIJ.objeto = action.payload;
      validateField(CONSTANTES.KEY_OBJ, state);
    },
    setDataAssinatura: (state, action) => {
      state.valuesIJ.dataAssinatura = action.payload;
      validateDataMaior(action.payload, CONSTANTES.KEY_DT_ASS, state);
    },
    setDataAssInvalida: (state, action) => {
      if (action.payload) {
        state.errors[CONSTANTES.KEY_DT_ASS] = CONSTANTES.ERROR_FIELD_DT_INVALID;
      } else {
        state.errors[CONSTANTES.KEY_DT_ASS] = CONSTANTES.VAZIO;
      }
    },
    setDataFimInvalida: (state, action) => {
      if (action.payload) {
        state.errors[CONSTANTES.KEY_DT_FIM] = CONSTANTES.ERROR_FIELD_DT_INVALID;
      } else {
        state.errors[CONSTANTES.KEY_DT_FIM] = CONSTANTES.VAZIO;
      }
    },
    setDataFim: (state, action) => {
      state.valuesIJ.dataFim = action.payload;
      validateDataMenor(action.payload, CONSTANTES.KEY_DT_FIM, state);
    },
    setStatus: (state, action) => {
      state.valuesIJ.status = action.payload;
      validateField(CONSTANTES.KEY_STATUS, state);
    },
    setTipo: (state, action) => {
      state.valuesIJ.tipo = action.payload;
      validateField(CONSTANTES.KEY_TYPE_IJ, state);
      const tipo = current(state).tipos.find(
        (t) => t.codigo === action.payload
      );
      state.valuesIJ.subtipo = CONSTANTES.VAZIO;
      if (tipo) {
        state.subtipos = tipo.subtipos;
      } else {
        state.subtipos = INITIAL_STATE.subtipos;
      }
    },
    setSubtipo: (state, action) => {
      state.valuesIJ.subtipo = action.payload;
      validateField(CONSTANTES.KEY_SUBTYPE_IJ, state);
    },
    setDocumento: (state, action) => {
      state.valuesIJ.documento = action.payload;
    },
    setArquivo: (state, action) => {
      state.valuesIJ.arquivo = action.payload;
    },
    setUFAcao: (state, action) => {
      state.valuesIJ.ufAcao = action.payload;
      validateField(CONSTANTES.KEY_UF_ACTION, state);
    },
    setLocalAssinatura: (state, action) => {
      state.valuesIJ.localAssinatura = action.payload;
      validateField(CONSTANTES.KEY_LOCAL_ASS, state);
    },
    setParceiro: (state, action) => {
      state.valuesIJ.parceiro = action.payload;
    },
    handleSubmitIJ: (state) => {
      try {
        ijSchema.validateSync(state.valuesIJ, { abortEarly: false });
        state.validFormIJ = true;
        if (state.valuesIJ.id !== null) {
          state.updateState = true;
        } else {
          state.createState = true;
        }
      } catch (error: any) {
        if (error instanceof Yup.ValidationError) {
          error.inner.forEach((validationFailed: any) => {
            state.touched[validationFailed.path] = true;
            state.errors[validationFailed.path] = validationFailed.message;
          });
        }
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTiposIJ.pending, (state) => {
        state.loadingIJ = true;
      })
      .addCase(fetchTiposIJ.fulfilled, (state, action) => {
        state.loadingIJ = false;
        state.tipos = convertTipoIJDropdown(action.payload);
      })
      .addCase(fetchTiposIJ.rejected, (state, action) => {
        state.loadingIJ = false;
        state.errorAPI = action.error.message || CONSTANTES.VAZIO;
      });
    builder
      .addCase(fetchStatus.pending, (state) => {
        state.loadingIJ = true;
      })
      .addCase(fetchStatus.fulfilled, (state, action) => {
        state.loadingIJ = false;
        state.status = convertStatusIJDropdown(action.payload);
      })
      .addCase(fetchStatus.rejected, (state, action) => {
        state.loadingIJ = false;
        state.errorAPI = action.error.message || CONSTANTES.VAZIO;
      });
    builder
      .addCase(getCidade.pending, (state) => {
        state.loadingIJ = true;
      })
      .addCase(getCidade.fulfilled, (state, action) => {
        state.loadingIJ = false;
        state.cidades = convertCidadeDropdown(action.payload);
      })
      .addCase(getCidade.rejected, (state, action) => {
        state.loadingIJ = false;
        state.errorAPI = action.error.message || CONSTANTES.VAZIO;
      });
    builder
      .addCase(uploadFileIJ.pending, (state) => {
        state.successUploadFileIJ = false;
      })
      .addCase(uploadFileIJ.fulfilled, (state, action) => {
        state.fileDownloadURL = action.payload;
        state.successUploadFileIJ = true;
      })
      .addCase(uploadFileIJ.rejected, (state, action) => {
        state.successUploadFileIJ = false;
        state.errorAPI = action.error.message || CONSTANTES.VAZIO;
      });
    builder
      .addCase(addInstrumentoJuridico.pending, (state) => {
        state.loadingIJ = true;
      })
      .addCase(addInstrumentoJuridico.fulfilled, (state, action) => {
        state.loadingIJ = false;
        state.successIJ = true;
      })
      .addCase(addInstrumentoJuridico.rejected, (state, action) => {
        state.loadingIJ = false;
        state.errorAPI = action.error.message || CONSTANTES.VAZIO;
      });
  },
});

export default instrumentoJuridicoSlice.reducer;
export const {
  changeStateTrue,
  changeStateFalse,
  clearResponse,
  clearForm,
  setTipo,
  setSubtipo,
  setStatus,
  setNumero,
  setObjeto,
  setDocumento,
  setArquivo,
  setUFAcao,
  setLocalAssinatura,
  setDataAssinatura,
  setDataFim,
  setDataAssInvalida,
  setDataFimInvalida,
  setParceiro,
  handleSubmitIJ,
} = instrumentoJuridicoSlice.actions;
