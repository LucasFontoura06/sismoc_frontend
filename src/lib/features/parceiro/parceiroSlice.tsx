import { CONSTANTES } from "@/common/constantes";
import { PONTOS_FOCAIS } from "@/common/pontoFocal";
import {
  convertAreaAtuacaoDropdown,
  convertEnderecosDropdown,
  convertTiposParceiroDropdown
} from "@/common/utils";
import { createSlice } from "@reduxjs/toolkit";
import * as Yup from "yup";
import {
  addParceiro,
  fetchAreasAtuacao,
  fetchParceiro,
  fetchParceiroById,
  fetchTiposParceiro,
} from "./parceiroActions";

export const parceiroSchema = Yup.object().shape({
  nome: Yup.string().required(CONSTANTES.ERROR_FIELD_REQUIRED),
  segmento: Yup.string().required(CONSTANTES.ERROR_FIELD_REQUIRED),
  tipo: Yup.string().required(CONSTANTES.ERROR_FIELD_REQUIRED),
  areasAtuacao: Yup.array().min(1, CONSTANTES.ERROR_FIELD_REQUIRED),
  pontoFocalSISEC: Yup.mixed().oneOf(Array.from(PONTOS_FOCAIS.map((pf) => pf.codigo)), CONSTANTES.ERROR_FIELD_REQUIRED),
  processoSEI: Yup.string(),
  infoAdicional: Yup.string(),
  endereco: Yup.string().required(CONSTANTES.ERROR_FIELD_REQUIRED),
});

const validateField = (field: string, state: any) => {
  try {
    parceiroSchema.validateSyncAt(field, state.valuesParceiro);
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
  abaAtiva: CONSTANTES.TAB_ONE_PARC,
  loading: false,
  parceiros: [] as any[],
  successParceiro: false,
  valuesParceiro: {
    id: null,
    tratativa: false,
    nome: CONSTANTES.VAZIO,
    segmento: CONSTANTES.VAZIO,
    tipo: CONSTANTES.VAZIO,
    areasAtuacao: [] as any[],
    processoSEI: CONSTANTES.VAZIO,
    infoAdicional: CONSTANTES.VAZIO,
    pontoFocalSISEC: CONSTANTES.VAZIO,
    endereco: CONSTANTES.VAZIO,
  },
  validFormParceiro: false,
  showEndereco: false,
  showInstrumentoJuridico: false,
  showContato: false,
  showDialogEdit: false,
  errors: {} as any,
  touched: {} as any,
  tiposParceiro: [] as any[],
  listaEndereco: [] as any[],
  areasAtuacao: [] as any[],
  error: CONSTANTES.VAZIO,
  response: CONSTANTES.VAZIO,
  resetFormEndereco: false,
};

const parceiroSlice = createSlice({
  name: CONSTANTES.PARC_NAME,
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
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setAbaAtiva: (state, action) => {
      state.abaAtiva = action.payload;
    },
    setShowDialogEdit: (state, action) => {
      state.showDialogEdit = action.payload;
    },
    setTratativa: (state, action) => {
      state.valuesParceiro.tratativa = action.payload;
    },
    setNome: (state, action) => {
      state.valuesParceiro.nome = action.payload;
      validateField(CONSTANTES.KEY_NAME_PARC, state);
    },
    setTipo: (state, action) => {
      state.valuesParceiro.tipo = action.payload;
      validateField(CONSTANTES.KEY_TYPE_PARC, state);
    },
    setPontoFocalSISEC: (state, action) => {
      state.valuesParceiro.pontoFocalSISEC = action.payload;
      validateField(CONSTANTES.KEY_PTO_FC_SISEC, state);
    },
    setSegmento: (state, action) => {
      state.valuesParceiro.segmento = action.payload;
      validateField(CONSTANTES.KEY_SEG_PARC, state);
    },
    setAreasAtuacao: (state, action) => {
      state.valuesParceiro.areasAtuacao = action.payload;
      validateField(CONSTANTES.KEY_AREA_PARC, state);
    },
    setEndereco: (state, action) => {
      state.valuesParceiro.endereco = action.payload;
      validateField(CONSTANTES.KEY_END_PARC, state);
    },
    setProcessoSEI: (state, action) => {
      state.valuesParceiro.processoSEI = action.payload;
      validateField(CONSTANTES.KEY_PROCESSO_SEI, state);
    },
    setShowEndereco: (state, action) => {
      state.showEndereco = action.payload;
    },
    setShowInstrumentoJuridico: (state, action) => {
      state.showInstrumentoJuridico = action.payload;
    },
    setShowContato: (state, action) => {
      state.showContato = action.payload;
    },
    setListaEndereco: (state, action) => {
      state.listaEndereco = convertEnderecosDropdown(action.payload);
    },
    setInfoAdicional: (state, action) => {
      state.valuesParceiro.infoAdicional = action.payload;
    },
    setResetFormEndereco: (state, action) => {
      state.resetFormEndereco = action.payload;
    },
    resetFormParceiro: (state) => {
      return {
        ...INITIAL_STATE,
        tiposParceiro: state.tiposParceiro,
        areasAtuacao: state.areasAtuacao,
        listaEndereco: state.listaEndereco,
        abaAtiva: CONSTANTES.TAB_TWO_PARC,
      };
    },
    handleSubmitParceiro: (state) => {
      try {
        parceiroSchema.validateSync(state.valuesParceiro, {
          abortEarly: false,
        });
        state.validFormParceiro = true;
        if (state.valuesParceiro.id !== null) {
          state.updateState = true;
        } else {
          state.createState = true;
        }
      } catch (error: any) {
        if (error instanceof Yup.ValidationError) {
          state.showInstrumentoJuridico = true;
          state.showEndereco = true;
          state.showContato = true;
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
      .addCase(fetchParceiro.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchParceiro.fulfilled, (state, action) => {
        state.loading = false;
        state.parceiros = action.payload;
      })
      .addCase(fetchParceiro.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message ?? CONSTANTES.VAZIO;
      });
    builder
      .addCase(fetchParceiroById.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchParceiroById.fulfilled, (state, action) => {
        console.log('Dados do Parceiro', action.payload);
        state.valuesParceiro = action.payload;
        state.valuesParceiro.tipo = action.payload.tipo.id;
        state.valuesParceiro.segmento = action.payload.segmento.id;
        state.valuesParceiro.areasAtuacao = action.payload.areasAtuacao.map((area: any) => area.codigo);
        state.showDialogEdit = true;
      })
      .addCase(fetchParceiroById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message ?? CONSTANTES.VAZIO;
      });
    builder
      .addCase(fetchTiposParceiro.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchTiposParceiro.fulfilled, (state, action) => {
        state.loading = false;
        state.tiposParceiro = convertTiposParceiroDropdown(action.payload);
      })
      .addCase(fetchTiposParceiro.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message ?? CONSTANTES.VAZIO;
      });

    builder
      .addCase(fetchAreasAtuacao.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchAreasAtuacao.fulfilled, (state, action) => {
        state.loading = false;
        state.areasAtuacao = convertAreaAtuacaoDropdown(action.payload);
      })
      .addCase(fetchAreasAtuacao.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message ?? CONSTANTES.VAZIO;
      });

    builder
      .addCase(addParceiro.pending, (state) => {
        state.loading = true;
      })
      .addCase(addParceiro.fulfilled, (state, action) => {
        state.valuesParceiro.id = action.payload.id;
        state.validFormParceiro = false;
        state.successParceiro = true;
        state.createState = false;
        state.updateState = false;
        // state.abaAtiva = CONSTANTES.TAB_ONE_PARC;
        // state.valuesParceiro = INITIAL_STATE.valuesParceiro;
        state.errors = INITIAL_STATE.errors;
        state.touched = INITIAL_STATE.touched;
      })
      .addCase(addParceiro.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message ?? CONSTANTES.VAZIO;
      });
  },
});

export default parceiroSlice.reducer;
export const {
  changeStateTrue,
  changeStateFalse,
  clearResponse,
  setShowInstrumentoJuridico,
  setShowEndereco,
  setShowContato,
  setShowDialogEdit,
  setLoading,
  setAbaAtiva,
  setTratativa,
  setNome,
  setTipo,
  setSegmento,
  setEndereco,
  setListaEndereco,
  setAreasAtuacao,
  setProcessoSEI,
  setPontoFocalSISEC,
  setInfoAdicional,
  resetFormParceiro,
  setResetFormEndereco,
  handleSubmitParceiro,
} = parceiroSlice.actions;

