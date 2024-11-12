import { CONSTANTES } from "@/common/constantes";
import {
    convertTipoIJDropdown
} from "@/common/utils";
import { createSlice, current } from "@reduxjs/toolkit";
import * as Yup from "yup";
import { addContato, fetchContato } from "./contatoActions";

export const contatoSchema = Yup.object().shape({
  nome: Yup.string().required(CONSTANTES.ERROR_FIELD_REQUIRED),
  cargo: Yup.string().required(CONSTANTES.ERROR_FIELD_REQUIRED),
  email: Yup.string()
    .email(CONSTANTES.ERROR_EMAIL_INVALID)
    .required(CONSTANTES.ERROR_FIELD_REQUIRED),
  celular: Yup.string().min(15, CONSTANTES.ERROR_FIELD_REQUIRED).required(CONSTANTES.ERROR_FIELD_REQUIRED),
  telefone: Yup.string(),
  pontoFocal: Yup.boolean().required(CONSTANTES.ERROR_FIELD_REQUIRED),
});

const INITIAL_STATE = {
  createState: false,
  updateState: false,
  loading: false,
  successContato: false,
  expanded: false,
  valuesContato: {
    id: null,
    nome: CONSTANTES.VAZIO,
    cargo: CONSTANTES.VAZIO,
    email: CONSTANTES.VAZIO,
    celular: CONSTANTES.VAZIO,
    telefone: CONSTANTES.VAZIO,
    pontoFocal: false,
  },
  maskPhone: CONSTANTES.MASK_TEL,
  contatos: [] as any[],
  errors: {} as any,
  touched: {} as any,
  errorAPI: CONSTANTES.VAZIO,
  response: CONSTANTES.VAZIO,
  validFormContato: false,
};

const contatoSlice = createSlice({
  name: CONSTANTES.CONTATO_NAME,
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
      state.valuesContato = INITIAL_STATE.valuesContato;
      state.successContato = INITIAL_STATE.successContato;
      state.validFormContato = INITIAL_STATE.validFormContato;
      state.errors = INITIAL_STATE.errors;
      state.touched = INITIAL_STATE.touched;
    },
    setExpanded: (state, action) => {
      state.expanded = action.payload;
    },
    setNome: (state, action) => {
      state.valuesContato.nome = action.payload;

      try {
        contatoSchema.validateSyncAt(CONSTANTES.KEY_CONTATO, state.valuesContato);
        state.errors[CONSTANTES.KEY_CONTATO] = CONSTANTES.VAZIO;
      } catch (error: any) {
        state.errors[CONSTANTES.KEY_CONTATO] = error.message;
      } finally {
        state.touched[CONSTANTES.KEY_CONTATO] = true;
      }
    },
    setCargo: (state, action) => {
      state.valuesContato.cargo = action.payload;

      try {
        contatoSchema.validateSyncAt(CONSTANTES.KEY_CARGO, state.valuesContato);
        state.errors[CONSTANTES.KEY_CARGO] = CONSTANTES.VAZIO;
      } catch (error: any) {
        state.errors[CONSTANTES.KEY_CARGO] = error.message;
      } finally {
        state.touched[CONSTANTES.KEY_CARGO] = true;
      }
    },
    setEmail: (state, action) => {
      state.valuesContato.email = action.payload;

      try {
        contatoSchema.validateSyncAt(CONSTANTES.KEY_EMAIL, state.valuesContato);
        state.errors[CONSTANTES.KEY_EMAIL] = CONSTANTES.VAZIO;
      } catch (error: any) {
        state.errors[CONSTANTES.KEY_EMAIL] = error.message;
      } finally {
        state.touched[CONSTANTES.KEY_EMAIL] = true;
      }
    },
    setCelular: (state, action) => {
      state.valuesContato.celular = action.payload;

      try {
        contatoSchema.validateSyncAt(CONSTANTES.KEY_CEL, state.valuesContato);
        state.errors[CONSTANTES.KEY_CEL] = CONSTANTES.VAZIO;
      } catch (error: any) {
        state.errors[CONSTANTES.KEY_CEL] = error.message;
      } finally {
        state.touched[CONSTANTES.KEY_CEL] = true;
      }
    },
    setTelefone: (state, action) => {
      if (action.payload.length > 14) {
        state.maskPhone = CONSTANTES.MASK_CEL;
      } else {
        state.maskPhone = CONSTANTES.MASK_TEL;
      }
      state.valuesContato.telefone = action.payload;
    },
    setPontoFocal: (state, action) => {
      state.valuesContato.pontoFocal = action.payload;

      try {
        contatoSchema.validateSyncAt(CONSTANTES.KEY_PT_FC, state.valuesContato);
        state.errors[CONSTANTES.KEY_PT_FC] = CONSTANTES.VAZIO;
      } catch (error: any) {
        state.errors[CONSTANTES.KEY_PT_FC] = error.message;
      } finally {
        state.touched[CONSTANTES.KEY_PT_FC] = true;
      }
    },
    handleSubmitContato: (state) => {
      try {
        contatoSchema.validateSync(state.valuesContato, { abortEarly: false });
        state.validFormContato = true;
        if (state.valuesContato.id !== null) {
          state.updateState = true;
        } else {
          state.createState = true;
        }
      } catch (error: any) {
        if (error instanceof Yup.ValidationError) {
          error.inner.forEach((validationFailed: any) => {
            console.log(validationFailed.path);
            state.touched[validationFailed.path] = true;
            state.errors[validationFailed.path] = validationFailed.message;
          });
        }
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchContato.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchContato.fulfilled, (state, action) => {
        state.loading = false;
        state.contatos = convertTipoIJDropdown(action.payload);
      })
      .addCase(fetchContato.rejected, (state, action) => {
        state.loading = false;
        state.errorAPI = action.error.message || CONSTANTES.VAZIO;
      });
      builder
      .addCase(addContato.pending, (state) => {
        state.loading = true;
      })
      .addCase(addContato.fulfilled, (state, action) => {
        state.loading = false;
        state.successContato = true;
      })
      .addCase(addContato.rejected, (state, action) => {
        state.loading = false;
        state.errorAPI = action.error.message || CONSTANTES.VAZIO;
      });
  },
});

export default contatoSlice.reducer;
export const {
  changeStateTrue,
  changeStateFalse,
  clearResponse,
  clearForm,
  setNome,
  setCargo,
  setCelular,
  setTelefone,
  setEmail,
  setPontoFocal,
  handleSubmitContato,
} = contatoSlice.actions;
