import { uploadArquivo, addLista, getCidade, fetchListasOuvidoria, getCargos, getVagas, updateLista, calcularTotalPostos } from "./listasAction";
import { fetchParceiro } from "../parceiro/parceiroActions";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { convertCidadeDropdown } from "@/common/utils";
import { CONSTANTES } from "@/common/constantes";
import * as Yup from "yup";
import type { RootState } from "@/lib/store";

interface ListasState {
  vagas: any[];
  listas: any[];
  cargos: any[];
  cidades: any[];
  parceiros: any[];
  abaAtiva: number;
  loading: boolean;
  uploading: boolean;
  validForm: boolean;
  error: string | null;
  successMessage: string | null;
  successListasOuvidoria: boolean;

  touched: {
    [key: string]: boolean;
  };

  errors: {
    [key: string]: string;
  };

  values: {
    uf: string;
    cidade: string;
    dataEnvio: string;
    arquivoUrl: string;
    dataGeracao: string;
    totalCandidatos: string;
    totalInteressados: string;
    totalNegativas: string;
    dataRetorno: string | null;
    parceiroSelecionado: string;
    cargoSelecionado: string;
    vagasSelecionadas: string[];
    pbf: {
      comPbf: boolean;
      semPbf: boolean;
    };
    totais: {
      totalCandidatos: number;
      totalInteressados: number;
      totalNegativas: number;
      totalPostos: number;
    };
  };

  vagasSelecionadas: string[];
  isEditing: boolean;
}

export const listasSchema = Yup.object().shape({
  dataRetorno: Yup.string().nullable(),
  uf: Yup.string().required(CONSTANTES.ERROR_FIELD_REQUIRED),
  dataEnvio: Yup.string().required(CONSTANTES.ERROR_FIELD_REQUIRED),
  arquivoUrl: Yup.string().required(CONSTANTES.ERROR_FIELD_REQUIRED),
  dataGeracao: Yup.string().required(CONSTANTES.ERROR_FIELD_REQUIRED),
  cidade: Yup.number().typeError(CONSTANTES.ERROR_FIELD_REQUIRED).required(CONSTANTES.ERROR_FIELD_REQUIRED),
  parceiroSelecionado: Yup.string().required(CONSTANTES.ERROR_FIELD_REQUIRED),
  totalCandidatos: Yup.number().nullable().transform((value) => (isNaN(value) ? null : value)),
  totalInteressados: Yup.number().nullable().transform((value) => (isNaN(value) ? null : value)),
  totalNegativas: Yup.number().nullable().transform((value) => (isNaN(value) ? null : value)),
  vagasSelecionadas: Yup.array()
    .of(Yup.string())
    .min(1, 'Selecione pelo menos uma vaga')
    .required('Selecione pelo menos uma vaga'),
  pbf: Yup.object().shape({
    comPbf: Yup.boolean(),
    semPbf: Yup.boolean()
  }).test('one-option-required', 'Selecione uma opção de PBF', function(value) {
    return value.comPbf || value.semPbf;
  })
});

export const listasSchemaEdit = Yup.object().shape({
  dataRetorno: Yup.string().nullable(),
  uf: Yup.string().required(CONSTANTES.ERROR_FIELD_REQUIRED),
  dataEnvio: Yup.string().required(CONSTANTES.ERROR_FIELD_REQUIRED),
  arquivoUrl: Yup.string(),
  dataGeracao: Yup.string().required(CONSTANTES.ERROR_FIELD_REQUIRED),
  cidade: Yup.number().typeError(CONSTANTES.ERROR_FIELD_REQUIRED).required(CONSTANTES.ERROR_FIELD_REQUIRED),
  parceiroSelecionado: Yup.string().required(CONSTANTES.ERROR_FIELD_REQUIRED),
  totalCandidatos: Yup.number().nullable().transform((value) => (isNaN(value) ? null : value)),
  totalInteressados: Yup.number().nullable().transform((value) => (isNaN(value) ? null : value)),
  totalNegativas: Yup.number().nullable().transform((value) => (isNaN(value) ? null : value)),
  vagasSelecionadas: Yup.array()
    .of(Yup.string())
    .min(1, 'Selecione pelo menos uma vaga')
    .required('Selecione pelo menos uma vaga'),
  pbf: Yup.object().shape({
    comPbf: Yup.boolean(),
    semPbf: Yup.boolean()
  }).test('one-option-required', 'Selecione uma opção de PBF', function(value) {
    return value.comPbf || value.semPbf;
  })
});

const INITIAL_STATE: ListasState = {
  values: {
    dataRetorno: null,
    uf: CONSTANTES.VAZIO,
    cidade: CONSTANTES.VAZIO,
    dataEnvio: CONSTANTES.VAZIO,
    dataGeracao: CONSTANTES.VAZIO,
    totalCandidatos: CONSTANTES.VAZIO,
    totalInteressados: CONSTANTES.VAZIO,
    totalNegativas: CONSTANTES.VAZIO,
    arquivoUrl: CONSTANTES.VAZIO,
    parceiroSelecionado: CONSTANTES.VAZIO,
    cargoSelecionado: CONSTANTES.VAZIO,
    vagasSelecionadas: [],
    totais: {
      totalCandidatos: 0,
      totalInteressados: 0,
      totalNegativas: 0,
      totalPostos: 0
    },
    pbf: {
      comPbf: false,
      semPbf: false
    }
  },
  vagas: [],
  cargos: [],
  errors: {},
  listas: [],
  cidades: [],
  touched: {},
  parceiros: [],
  error: null,
  loading: false,
  uploading: false,
  validForm: false,
  successMessage: null,
  abaAtiva: CONSTANTES.TAB_ONE_LISTAS,
  successListasOuvidoria: false,
  vagasSelecionadas: [],
  isEditing: false,
};

const listasSlice = createSlice({
  name: "listasOuvidoria",
  initialState: INITIAL_STATE,
  reducers: {
    setDataEnvio: (state, action) => {
      state.values.dataEnvio = action.payload;
      try {
        listasSchema.validateSyncAt('dataEnvio', state.values);
        state.errors[CONSTANTES.DATA_ENVIO_NAME] = CONSTANTES.VAZIO;
      } catch (error: any) {
        state.errors[CONSTANTES.DATA_ENVIO_NAME] = error.message;
      } finally {
        state.touched.dataEnvio = true;
      }
    },

    setDataGeracao: (state, action) => {
      state.values.dataGeracao = action.payload;
      try {
        listasSchema.validateSyncAt('dataGeracao', state.values);
        state.errors[CONSTANTES.DATA_GERACAO_NAME] = CONSTANTES.VAZIO;
      } catch (error: any) {
        state.errors[CONSTANTES.DATA_GERACAO_NAME] = error.message;
      } finally {
        state.touched.dataGeracao = true;
      }
    },

    setDataRetorno: (state, action) => {
      state.values.dataRetorno = action.payload;
      try {
        listasSchema.validateSyncAt('dataRetorno', state.values);
        state.errors[CONSTANTES.DATA_RETORNO_NAME] = CONSTANTES.VAZIO;
      } catch (error: any) {
        state.errors[CONSTANTES.DATA_RETORNO_NAME] = error.message;
      } finally {
        state.touched.dataRetorno = true;
      }
    },

    setTotalNegativos: (state, action) => {
      state.values.totalNegativas = action.payload;
      try {
        listasSchema.validateSyncAt('totalNegativas', state.values);
        state.errors[CONSTANTES.NUMERO_NEGATIVO_NAME] = CONSTANTES.VAZIO;
      } catch (error: any) {
        state.errors[CONSTANTES.NUMERO_NEGATIVO_NAME] = error.message;
      } finally {
        state.touched.totalNegativas = true;
      }
    },

    setTotalCandidatos: (state, action) => {
      state.values.totalCandidatos = action.payload;
      try {
        listasSchema.validateSyncAt('totalCandidatos', state.values);
        state.errors[CONSTANTES.NUMERO_CANDIDATOS_NAME] = CONSTANTES.VAZIO;
      } catch (error: any) {
        state.errors[CONSTANTES.NUMERO_CANDIDATOS_NAME] = error.message;
      } finally {
        state.touched.totalCandidatos = true;
      }
    },

    setTotalInteressados: (state, action) => {
      state.values.totalInteressados = action.payload;
      try {
        listasSchema.validateSyncAt('totalInteressados', state.values);
        state.errors[CONSTANTES.NUMERO_INTERESSE_NAME] = CONSTANTES.VAZIO;
      } catch (error: any) {
        state.errors[CONSTANTES.NUMERO_INTERESSE_NAME] = error.message;
      } finally {
        state.touched.totalInteressados = true;
      }
    },

    setUF: (state, action) => {
      state.values.uf = action.payload;
      try {
        listasSchema.validateSyncAt('uf', state.values);
        state.errors[CONSTANTES.UF_NAME] = CONSTANTES.VAZIO;
      } catch (error: any) {
        state.errors[CONSTANTES.UF_NAME] = error.message;
      } finally {
        state.touched.uf = true;
      }
    },

    setCidade: (state, action) => {
      state.values.cidade = action.payload;
      try {
        listasSchema.validateSyncAt('cidade', state.values);
        state.errors[CONSTANTES.CIDADE_NAME] = CONSTANTES.VAZIO;
      } catch (error: any) {
        state.errors[CONSTANTES.CIDADE_NAME] = error.message;
      } finally {
        state.touched.cidade = true;
      }
    },

    setArquivoUrl: (state, action) => {
      state.values.arquivoUrl = action.payload;
      try {
        listasSchema.validateSyncAt('arquivoUrl', state.values);
        state.errors[CONSTANTES.ARQUIVO_URL_NAME] = CONSTANTES.VAZIO;
      } catch (error: any) {
        state.errors[CONSTANTES.ARQUIVO_URL_NAME] = error.message;
      } finally {
        state.touched.arquivoUrl = true;
      }
    },

    setParceiroSelecionado: (state, action) => {
      state.values.parceiroSelecionado = action.payload;
      try {
        listasSchema.validateSyncAt('parceiroSelecionado', state.values);
        state.errors[CONSTANTES.PARC_NAME] = CONSTANTES.VAZIO;
      } catch (error: any) {
        state.errors[CONSTANTES.PARC_NAME] = error.message;
      } finally {
        state.touched.parceiroSelecionado = true;
      }
    },

    setCargoSelecionado: (state, action) => {
      state.values.cargoSelecionado = action.payload;
      try {
        listasSchema.validateSyncAt('cargoSelecionado', state.values);
        state.errors[CONSTANTES.CARGO_NAME] = CONSTANTES.VAZIO;
      } catch (error: any) {
        state.errors[CONSTANTES.CARGO_NAME] = error.message;
      } finally {
        state.touched.cargoSelecionado = true;
      }
    },

    resetForm: (state) => {
      state.values = INITIAL_STATE.values;
      state.errors = {};
      state.touched = {};
      state.successMessage = null;
      state.error = null;
      state.validForm = false;
      state.successListasOuvidoria = false;
    },

    clearMessages: (state) => {
      state.error = null;
      state.successMessage = null;
    },

    setAbaAtiva: (state, action) => {
      state.abaAtiva = action.payload;
    },

    setValues: (state, action) => {
      state.values = action.payload; // Atualiza os valores da lista com os dados fornecidos
    },

    setListas: (state, action) => {
      state.vagas = action.payload; // Atualiza a lista de vagas no estado
    },

    submitForm: (state) => {
      try {
        listasSchema.validateSync(state.values, { abortEarly: false });
        state.validForm = true;
        state.errors = {};
      } catch (error) {
        state.validForm = false;
        if (error instanceof Yup.ValidationError) {
          error.inner.forEach((validationError) => {
            if (validationError.path) {
              state.errors[validationError.path] = validationError.message;
              state.touched[validationError.path] = true;
            }
          });
        }
      }
    },

    setVagasSelecionadas: (state, action) => {
      state.values.vagasSelecionadas = action.payload;
      try {
        listasSchema.validateSyncAt('vagasSelecionadas', state.values);
        state.errors[CONSTANTES.VAGA_SELECIONADA_NAME] = CONSTANTES.VAZIO;
      } catch (error: any) {
        state.errors[CONSTANTES.VAGA_SELECIONADA_NAME] = error.message;
      } finally {
        state.touched.vagasSelecionadas = true;
      }
    },

    setPbf: (state, action) => {
      if (action.payload.type === 'comPbf') {
        state.values.pbf.comPbf = action.payload.value;
      } else if (action.payload.type === 'semPbf') {
        state.values.pbf.semPbf = action.payload.value;
      }
      
      try {
        listasSchema.validateSyncAt('pbf', state.values);
        state.errors['pbf'] = '';
      } catch (error: any) {
        state.errors['pbf'] = error.message;
      } finally {
        state.touched.pbf = true;
      }
    },

    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },

    setIsEditing: (state, action: PayloadAction<boolean>) => {
      state.isEditing = action.payload;
    },

    setTouched: (state, action: PayloadAction<{ [key: string]: boolean }>) => {
      state.touched = {
        ...state.touched,
        ...action.payload
      };
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(uploadArquivo.pending, (state) => {
        state.uploading = true;
        state.error = null;
        state.successMessage = null;
      })
      .addCase(uploadArquivo.fulfilled, (state, action) => {
        state.uploading = false;
        state.values.arquivoUrl = action.payload;
      })
      .addCase(uploadArquivo.rejected, (state, action) => {
        state.uploading = false;
        state.error = action.payload as string;
      })
      .addCase(addLista.pending, (state) => {
        state.loading = true;
      })
      .addCase(addLista.fulfilled, (state) => {
        state.loading = false;
        state.successMessage = CONSTANTES.SUCCESS_LISTA_CADASTRADA;
        state.successListasOuvidoria = true;
        state.validForm = false;
      })
      .addCase(addLista.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(getCidade.pending, (state) => {
        state.loading = true;
      })
      .addCase(getCidade.fulfilled, (state, action) => {
        state.loading = false;
        state.cidades = convertCidadeDropdown(action.payload);
      })
      .addCase(getCidade.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || CONSTANTES.VAZIO;
      })
      .addCase(fetchParceiro.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchParceiro.fulfilled, (state, action) => {
        state.loading = false;
        state.parceiros = action.payload;
      })
      .addCase(fetchParceiro.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || CONSTANTES.VAZIO;
      })
      .addCase(fetchListasOuvidoria.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchListasOuvidoria.fulfilled, (state, action) => {
        state.loading = false;
        state.listas = action.payload;
      })
      .addCase(fetchListasOuvidoria.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || CONSTANTES.VAZIO;
      })
      .addCase(getCargos.pending, (state) => {
        state.loading = true;
      })
      .addCase(getCargos.fulfilled, (state, action) => {
        state.loading = false;
        state.cargos = action.payload;
      })
      .addCase(getCargos.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || CONSTANTES.VAZIO;
      })
      .addCase(getVagas.pending, (state) => {
        state.loading = true;
      })
      .addCase(getVagas.fulfilled, (state, action) => {
        state.loading = false;
        state.vagas = action.payload;
      })
      .addCase(getVagas.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || CONSTANTES.ERROR_GET_VAGAS;
      })
      .addCase(updateLista.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateLista.fulfilled, (state) => {
        state.loading = false;
        state.successMessage = CONSTANTES.SUCCESS_LISTA_ATUALIZADA;
        state.successListasOuvidoria = true;
      })
      .addCase(updateLista.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(calcularTotalPostos.fulfilled, (state, action) => {
        if (!state.values.totais) {
            state.values.totais = {
                totalCandidatos: 0,
                totalInteressados: 0,
                totalNegativas: 0,
                totalPostos: 0
            };
        }
        state.values.totais.totalPostos = action.payload;
      });
  },
});

export const {
  setUF,
  resetForm,
  setCargoSelecionado,
  setCidade,
  setValues,
  submitForm,
  setAbaAtiva,
  setParceiroSelecionado,
  setDataEnvio,
  setArquivoUrl,
  clearMessages,
  setDataGeracao,
  setDataRetorno,
  setTotalCandidatos,
  setTotalInteressados,
  setTotalNegativos,
  setListas,
  setVagasSelecionadas,
  setPbf,
  setLoading,
  setIsEditing,
  setTouched,
} = listasSlice.actions;

export const selectValues = (state: RootState) => state.listasOuvidoria.values;
export const selectErrors = (state: RootState) => state.listasOuvidoria.errors;
export const selectCidades = (state: RootState) => state.listasOuvidoria.cidades;
export const selectSuccessMessage = (state: RootState) => state.listasOuvidoria.successMessage;
export const selectError = (state: RootState) => state.listasOuvidoria.error;
export const selectVagas = (state: RootState) => state.listasOuvidoria.vagas;

export default listasSlice.reducer;
