import { createSlice, current } from "@reduxjs/toolkit";
import { CONSTANTES } from "@/common/constantes";
import * as Yup from "yup";
import {
  fetchEscolaridades,
  addVaga,
  updateVaga,
  getCargos,
  addNovoCargo,
  deleteVaga,
  fetchVagaById,
} from "./vagaActions";
import { fetchVagas } from "./vagaActions";
import { getCidade } from "../endereco/enderecoActions";
import { convertCidadeDropdown } from "@/common/utils";

// Esquema de validação para vaga
export const vagaSchema = Yup.object().shape({
  uf: Yup.string().required(CONSTANTES.ERROR_FIELD_REQUIRED),
  codMunicipio: Yup.string().required(CONSTANTES.ERROR_FIELD_REQUIRED),
  escolaridade: Yup.string().required(CONSTANTES.ERROR_FIELD_REQUIRED),
  postos: Yup.number().required(CONSTANTES.ERROR_FIELD_REQUIRED)
    .typeError(CONSTANTES.ERROR_NUMBER_FIELD)
    .min(1, CONSTANTES.ERROR_FIELD_MIN)
    .max(99999, CONSTANTES.ERROR_FIELD_MAX),
  cargo: Yup.object().shape({
    id: Yup.string().required(CONSTANTES.ERROR_FIELD_REQUIRED),
  }).required(CONSTANTES.ERROR_FIELD_REQUIRED),
});

const INITIAL_STATE = {
  createState: false,
  updateState: false,
  loading: false,
  success: false,
  abaAtiva: CONSTANTES.TAB_ONE_VAGA,
  values: {
    id: null,
    cargo: {
      id: CONSTANTES.VAZIO,
      descricao: CONSTANTES.VAZIO},
    uf: CONSTANTES.VAZIO,
    codMunicipio: CONSTANTES.VAZIO,
    bairro: CONSTANTES.VAZIO,
    escolaridade: CONSTANTES.VAZIO,
    cidade: CONSTANTES.VAZIO,
    pcd: false,
    postos: 0,
  },
  novoCargo: CONSTANTES.VAZIO,
  cargos: [] as any[],
  cidades: [] as any[],
  escolaridades: [] as any[],
  error: CONSTANTES.VAZIO,
  errors: {} as any,
  touched: {} as any,
  errorAPI: CONSTANTES.VAZIO,
  response: CONSTANTES.VAZIO,
  vagas: null,
  validForm: false,
};

const vagaSlice = createSlice({
  name: CONSTANTES.VGS_NAME,
  initialState: INITIAL_STATE,
  reducers: {
    setAbaAtiva: (state, action) => {
      state.abaAtiva = action.payload;
    },
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
      state.values = INITIAL_STATE.values;
      state.success = INITIAL_STATE.success;
      state.validForm = INITIAL_STATE.validForm;
      state.errors = INITIAL_STATE.errors;
      state.touched = INITIAL_STATE.touched;
    },

    setCargo: (state, action) => {
      const cargo = action.payload;
      state.values.cargo = {
        id: cargo.id,
        descricao: cargo.descricao,
      };
      try {
        vagaSchema.validateSyncAt('cargo.id', state.values);
        state.errors.cargo = CONSTANTES.VAZIO;
      } catch (error: any) {
        state.errors.cargo = error.message;
      } finally {
        state.touched.cargo = true;
      }
    },

    setNovoCargo: (state, action) => {
      state.novoCargo = action.payload; // Define o novo cargo inserido
    },

    setBairro: (state, action) => {
      state.values.bairro = action.payload;
    },

    setUF: (state, action) => {
      state.values.uf = action.payload;

      try {
        vagaSchema.validateSyncAt(CONSTANTES.KEY_UF, state.values);
        state.errors[CONSTANTES.KEY_UF] = CONSTANTES.VAZIO;
      } catch (error: any) {
        state.errors[CONSTANTES.KEY_UF] = error.message;
      } finally {
        state.touched[CONSTANTES.KEY_UF] = true;
      }

      state.cidades = [];
    },

    setCodMunicipio: (state, action) => {
      const cid = current(state).cidades.find(c => c.codigo === action.payload);
      state.values.codMunicipio = String(action.payload);
      state.values.cidade = cid.label

      try {
        vagaSchema.validateSyncAt(CONSTANTES.KEY_COD_CID, state.values);
        state.errors[CONSTANTES.KEY_COD_CID] = CONSTANTES.VAZIO;
      } catch (error: any) {
        state.errors[CONSTANTES.KEY_COD_CID] = error.message;
      } finally {
        state.touched[CONSTANTES.KEY_COD_CID] = true;
      }
    },

    setEscolaridade: (state, action) => {
      state.values.escolaridade = action.payload.id;
      try {
        vagaSchema.validateSyncAt(CONSTANTES.KEY_ESCOL, state.values);
        state.errors[CONSTANTES.KEY_ESCOL] = CONSTANTES.VAZIO
      } catch (error: any) {
        state.errors[CONSTANTES.KEY_ESCOL] = error.message;
      } finally {
        state.touched[CONSTANTES.KEY_ESCOL] = true;
      }
    },

    setPcd: (state, action) => {
      state.values.pcd = action.payload;
    },

    setPostos: (state, action) => {
      state.values.postos = Number(action.payload); 
      try {
        vagaSchema.validateSyncAt(CONSTANTES.KEY_POSTOS, state.values);
        state.errors[CONSTANTES.KEY_POSTOS] = CONSTANTES.VAZIO
      } catch (error: any) {
        state.errors[CONSTANTES.KEY_POSTOS] = error.message;
      } finally {
        state.touched[CONSTANTES.KEY_POSTOS] = true;
      }
    },

    setValues: (state, action) => {
      state.values = action.payload; // Atualiza os valores da vaga com os dados fornecidos
    },

    setVagas: (state, action) => {
      state.vagas = action.payload; // Atualiza a lista de vagas no estado
    },

    handleSubmit: (state) => {
      try {
        vagaSchema.validateSync(state.values, { abortEarly: false });
        state.validForm = true;
        if(state.values.id !== null) {
          state.updateState = true;
        } else {
          state.createState = true;
        }
      } catch (error: any) {
        if (error instanceof Yup.ValidationError) {
          error.inner.forEach((validationFailed: any) => {
            if (validationFailed.path === 'cargo.id') {
              state.touched.cargo = true;
              state.errors.cargo = validationFailed.message;
            } else if (validationFailed.path !== CONSTANTES.KEY_SALARIO) { 
              state.touched[validationFailed.path] = true;
              state.errors[validationFailed.path] = validationFailed.message;
            } else {
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
      .addCase(fetchEscolaridades.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchEscolaridades.fulfilled, (state, action) => {
        state.loading = false;
        state.escolaridades = action.payload;
      })
      .addCase(fetchEscolaridades.rejected, (state, action) => {
        state.loading = false;
        state.errorAPI = action.error.message || CONSTANTES.VAZIO;
      });

    builder
      .addCase(addVaga.pending, (state) => {
        state.loading = true;
      })
      .addCase(addVaga.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
      })
      .addCase(addVaga.rejected, (state, action) => {
        state.loading = false;
        state.errorAPI = action.error.message || CONSTANTES.VAZIO;
      });

    builder
      .addCase(updateVaga.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateVaga.fulfilled, (state, action) => {
        state.loading = false;
      })
      .addCase(updateVaga.rejected, (state, action) => {
        state.loading = false;
        state.errorAPI = action.error.message || CONSTANTES.VAZIO;
      });

    builder
      .addCase(fetchVagas.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchVagas.fulfilled, (state, action) => {
        state.loading = false;
        state.vagas = action.payload;
      })        
      .addCase(fetchVagas.rejected, (state, action) => {
        state.loading = false;
        state.errorAPI = action.error.message || CONSTANTES.VAZIO;
      });

      builder
      .addCase(getCargos.pending, (state) => {
        state.loading = true;  
      })
      .addCase(getCargos.fulfilled, (state, action) => {
        state.loading = false;
        state.cargos = action.payload;
      })
      .addCase(getCargos.rejected, (state, action) => {
        state.loading = false;
        state.errorAPI = action.error.message || CONSTANTES.VAZIO;
      });

      builder
      .addCase(addNovoCargo.pending, (state) => {
        state.loading = true;
      })
      .addCase(addNovoCargo.fulfilled, (state, action) => {
        state.loading = false;
      
        // Verifica se o payload contém apenas o novo cargo ou a lista completa
        // Se for apenas o novo cargo, o adiciona à lista existente
        if (action.payload && action.payload.id) {
          state.cargos = [...state.cargos, action.payload]; // Adiciona o novo cargo à lista existente
        } else {
          state.cargos = action.payload; // Caso o payload seja uma lista, substitui a lista existente
        }
      
        // Se desejar, já seleciona o novo cargo no dropdown:
        // state.values.cargo = action.payload;
        state.novoCargo = ""; // Limpa o campo de novo cargo
      })
      .addCase(addNovoCargo.rejected, (state, action) => {
        state.loading = false;
        state.errorAPI = action.error.message || CONSTANTES.VAZIO;
      });

      builder
      .addCase(deleteVaga.pending, (state) => {
        state.loading = true;
      })
      .addCase(deleteVaga.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
      })
      .addCase(deleteVaga.rejected, (state, action) => {
        state.loading = false;
        state.errorAPI = action.error.message || CONSTANTES.VAZIO;
      });

      builder
      .addCase(fetchVagaById.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchVagaById.fulfilled, (state, action) => {
        state.loading = false;
      })
      .addCase(fetchVagaById.rejected, (state, action) => {
        state.loading = false;
        state.errorAPI = action.error.message || CONSTANTES.VAZIO;
      });

  },
});

export default vagaSlice.reducer;
export const {
  setAbaAtiva,
  changeStateTrue,
  changeStateFalse,
  clearResponse,
  clearForm,
  setCargo,
  setUF,
  setCodMunicipio,
  setBairro,
  setEscolaridade,
  setPcd,
  setPostos,
  setNovoCargo,
  handleSubmit,
  setValues,
  setVagas,
} = vagaSlice.actions;
