import { CONSTANTES } from "@/common/constantes";
import Endereco from "@/common/endereco";
import { convertCidadeDropdown, convertEnderecosDropdown } from "@/common/utils";
import { createSlice, current } from "@reduxjs/toolkit";
import * as Yup from "yup";
import { addEndereco, fetchEndereco, getCidade } from "./enderecoActions";

export const enderecoSchema = Yup.object().shape({
  logradouro: Yup.string().required(CONSTANTES.ERROR_FIELD_REQUIRED),
  complemento: Yup.string(),
  numero: Yup.number()
    .typeError(CONSTANTES.ERROR_NUMBER_FIELD)
    .min(1, CONSTANTES.ERROR_FIELD_MIN)
    .max(99999, CONSTANTES.ERROR_FIELD_MAX),
  bairro: Yup.string().required(CONSTANTES.ERROR_FIELD_REQUIRED),
  uf: Yup.string().required(CONSTANTES.ERROR_FIELD_REQUIRED),
  codMunicipio: Yup.string().required(CONSTANTES.ERROR_FIELD_REQUIRED),
  cep: Yup.string()
    .required(CONSTANTES.ERROR_FIELD_REQUIRED)
    .min(8, CONSTANTES.ERROR_FIELD_MIN_CEP),
});

const INITIAL_STATE = {
  createState: false,
  updateState: false,
  loading: false,
  successEndereco: false,
  abaAtiva: CONSTANTES.TAB_ONE_END,
  valuesEndereco: {
    id: null,
    logradouro: CONSTANTES.VAZIO,
    complemento: CONSTANTES.VAZIO,
    numero: CONSTANTES.VAZIO,
    bairro: CONSTANTES.VAZIO,
    uf: CONSTANTES.VAZIO,
    cidade: CONSTANTES.VAZIO,
    codMunicipio: CONSTANTES.VAZIO,
    cep: CONSTANTES.VAZIO,
    dataCadastro: null,
  },
  enderecoSelecionado: CONSTANTES.VAZIO,
  cidades: [] as any[],
  enderecos: [] as Endereco[],
  errors: {} as any,
  touched: {} as any,
  errorAPI: CONSTANTES.VAZIO,
  response: CONSTANTES.VAZIO,
  validForm: false,
};

const enderecoSlice = createSlice({
  name: CONSTANTES.END_NAME,
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
      state.valuesEndereco = INITIAL_STATE.valuesEndereco;
      state.successEndereco = INITIAL_STATE.successEndereco;
      state.validForm = INITIAL_STATE.validForm;
      state.errors = INITIAL_STATE.errors;
      state.touched = INITIAL_STATE.touched;
    },
    setAbaAtiva: (state, action) => {
      state.abaAtiva = action.payload;
    },
    setEndereco: (state, action) => {
      state.enderecoSelecionado = action.payload;
      state.errors = INITIAL_STATE.errors;
    },
    setLogradouro: (state, action) => {
      state.valuesEndereco.logradouro = action.payload;

      try {
        enderecoSchema.validateSyncAt(CONSTANTES.KEY_LOG, state.valuesEndereco);
        state.errors[CONSTANTES.KEY_LOG] = CONSTANTES.VAZIO;
      } catch (error: any) {
        state.errors[CONSTANTES.KEY_LOG] = error.message;
      } finally {
        state.touched[CONSTANTES.KEY_LOG] = true;
      }
    },
    setNumero: (state, action) => {
      state.valuesEndereco.numero = action.payload;

      try {
        enderecoSchema.validateSyncAt(CONSTANTES.KEY_NUM, state.valuesEndereco);
        state.errors[CONSTANTES.KEY_NUM] = CONSTANTES.VAZIO;
      } catch (error: any) {
        state.errors[CONSTANTES.KEY_NUM] = error.message;
      } finally {
        state.touched[CONSTANTES.KEY_NUM] = true;
      }
    },
    setComplemento: (state, action) => {
      state.valuesEndereco.complemento = action.payload;
    },
    setBairro: (state, action) => {
      state.valuesEndereco.bairro = action.payload;

      try {
        enderecoSchema.validateSyncAt(CONSTANTES.KEY_BAIRRO, state.valuesEndereco);
        state.errors[CONSTANTES.KEY_BAIRRO] = CONSTANTES.VAZIO;
      } catch (error: any) {
        state.errors[CONSTANTES.KEY_BAIRRO] = error.message;
      } finally {
        state.touched[CONSTANTES.KEY_BAIRRO] = true;
      }
    },
    setUF: (state, action) => {
      state.valuesEndereco.uf = action.payload;

      try {
        enderecoSchema.validateSyncAt(CONSTANTES.KEY_UF, state.valuesEndereco);
        state.errors[CONSTANTES.KEY_UF] = CONSTANTES.VAZIO;
      } catch (error: any) {
        state.errors[CONSTANTES.KEY_UF] = error.message;
      } finally {
        state.touched[CONSTANTES.KEY_UF] = true;
      }

      state.cidades = [];
    },
    setCodMunicipio: (state, action) => {
      const cid = current(state).cidades.find(
        (c) => c.codigo == action.payload
      );
      state.valuesEndereco.codMunicipio = action.payload;
      state.valuesEndereco.cidade = cid.label;

      try {
        enderecoSchema.validateSyncAt(CONSTANTES.KEY_COD_CID, state.valuesEndereco);
        state.errors[CONSTANTES.KEY_COD_CID] = CONSTANTES.VAZIO;
      } catch (error: any) {
        state.errors[CONSTANTES.KEY_COD_CID] = error.message;
      } finally {
        state.touched[CONSTANTES.KEY_COD_CID] = true;
      }
    },
    setCEP: (state, action) => {
      state.valuesEndereco.cep = action.payload;

      try {
        enderecoSchema.validateSyncAt(CONSTANTES.KEY_CEP, state.valuesEndereco);
        state.errors[CONSTANTES.KEY_CEP] = CONSTANTES.VAZIO;
      } catch (error: any) {
        state.errors[CONSTANTES.KEY_CEP] = error.message;
      } finally {
        state.touched[CONSTANTES.KEY_CEP] = true;
      }
    },

    setValues: (state, action) => {
      state.valuesEndereco = action.payload; // Atualiza os valores da vaga com os dados fornecidos
      console.log('action.payload do setValues:',action.payload)
    },

    setEnderecos: (state, action) => {
      state.enderecos = action.payload; // Atualiza a lista de vagas no estado
    },

    handleSubmitEndereco: (state) => {
      try {
        enderecoSchema.validateSync(state.valuesEndereco, { abortEarly: false });
        state.valuesEndereco.cep = state.valuesEndereco.cep.replaceAll("-", CONSTANTES.VAZIO);
        state.validForm = true;
        if (state.valuesEndereco.id !== null) {
          state.updateState = true;
        } else {
          state.createState = true;
        }
      } catch (error: any) {
        if (error instanceof Yup.ValidationError) {
          error.inner.forEach((validationFailed: any) => {
            if (validationFailed.path !== CONSTANTES.KEY_NUM) {
              state.touched[validationFailed.path] = true;
              state.errors[validationFailed.path] = validationFailed.message;
            } else {
              if (
                error.errors.length == 1 &&
                state.valuesEndereco.numero === CONSTANTES.VAZIO
              ) {
                state.validForm = true;
              }
              state.errors[validationFailed.path] = CONSTANTES.VAZIO;
            }
          });
        }
      }
    },
  },
  
  extraReducers: (builder) => {
    builder
      .addCase(getCidade.pending, (state) => {
        state.loading = true;
      })
      .addCase(getCidade.fulfilled, (state, action) => {
        state.loading = false;
        state.cidades = convertCidadeDropdown(action.payload);
      })
      .addCase(getCidade.rejected, (state, action) => {
        state.loading = false;
        state.errorAPI = action.error.message || CONSTANTES.VAZIO;
      });
    builder
      .addCase(fetchEndereco.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchEndereco.fulfilled, (state, action) => {
        state.loading = false;
        state.enderecos = action.payload;
      })
      .addCase(fetchEndereco.rejected, (state, action) => {
        state.loading = false;
        state.errorAPI = action.error.message || CONSTANTES.VAZIO;
      });
    builder
      .addCase(addEndereco.pending, (state) => {
        state.loading = true;
      })
      .addCase(addEndereco.fulfilled, (state, action) => {
        state.loading = false;
        state.successEndereco = true;
      })
      .addCase(addEndereco.rejected, (state, action) => {
        state.loading = false;
        state.errorAPI = action.error.message || CONSTANTES.VAZIO;
      });
  },
});

export default enderecoSlice.reducer;
export const {
  setAbaAtiva,
  changeStateTrue,
  changeStateFalse,
  clearResponse,
  clearForm,
  setLogradouro,
  setNumero,
  setComplemento,
  setBairro,
  setUF,
  setCodMunicipio,
  setCEP,
  setEndereco,
  handleSubmitEndereco,
  setValues, 
  setEnderecos
} = enderecoSlice.actions;
