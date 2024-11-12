import { CONSTANTES } from "@/common/constantes";
import { createSlice } from "@reduxjs/toolkit";
import * as Yup from "yup";
import { addUsuario, fetchUsuarios, updateUsuario, deleteUsuario, toggleStatusUsuario } from "./usuarioActions";
import Usuario from "@/common/usuario";

// Esquema de validação usando Yup
const usuarioSchema = Yup.object().shape({
  nome: Yup.string().required(CONSTANTES.ERROR_FIELD_REQUIRED),
  email: Yup.string().email(CONSTANTES.ERROR_INVALID_EMAIL).required(CONSTANTES.ERROR_FIELD_REQUIRED),
  setor: Yup.string().required(CONSTANTES.ERROR_FIELD_REQUIRED),
  perfil: Yup.string().required(CONSTANTES.ERROR_FIELD_REQUIRED),
  senha: Yup.string()
    .min(6, CONSTANTES.ERROR_PASSWORD_MIN)
    .required(CONSTANTES.ERROR_FIELD_REQUIRED),
});

const INITIAL_STATE = {
  errors: {} as Record<string, string>,
  touched: {} as Record<string, boolean>,
  usuarios: [] as Usuario[],
  success: false,
  loading: false,
  validForm: false,
  abaAtiva: CONSTANTES.TAB_ONE_USER,
  values: {
    nome: CONSTANTES.VAZIO,
    email: CONSTANTES.VAZIO,
    setor: CONSTANTES.VAZIO,
    perfil: CONSTANTES.VAZIO,
    senha: CONSTANTES.VAZIO,
    ativo: true,
  },
};

const usuarioSlice = createSlice({
  name: CONSTANTES.USER_NAME,
  initialState: INITIAL_STATE,
  reducers: {
    setAbaAtiva: (state, action) => {
      state.abaAtiva = action.payload;
    },
    setNome: (state, action) => {
      state.values.nome = action.payload;
      try {
        usuarioSchema.validateSyncAt('nome', state.values); 
        state.errors[CONSTANTES.NOME_NAME] = CONSTANTES.VAZIO;
      } catch (error: any) {
        state.errors[CONSTANTES.NOME_NAME] = error.message;
      } finally {
        state.touched[CONSTANTES.NOME_NAME] = true;
      }
    },
    setEmail: (state, action) => {
      state.values.email = action.payload;
      try {
        usuarioSchema.validateSyncAt('email', state.values); 
        state.errors[CONSTANTES.EMAIL_NAME] = CONSTANTES.VAZIO;
      } catch (error: any) {
        state.errors[CONSTANTES.EMAIL_NAME] = error.message;
      } finally {
        state.touched[CONSTANTES.EMAIL_NAME] = true;
      }
    },
    setSetor: (state, action) => {
      state.values.setor = action.payload;
      try {
        usuarioSchema.validateSyncAt('setor', state.values); 
        state.errors[CONSTANTES.SETOR_NAME] = CONSTANTES.VAZIO;
      } catch (error: any) {
        state.errors[CONSTANTES.SETOR_NAME] = error.message;
      } finally {
        state.touched[CONSTANTES.SETOR_NAME] = true;
      }
    },
    setPerfil: (state, action) => {
      state.values.perfil = action.payload;
      try {
        usuarioSchema.validateSyncAt('perfil', state.values); 
        state.errors[CONSTANTES.PERFIL_NAME] = CONSTANTES.VAZIO;
      } catch (error: any) {
        state.errors[CONSTANTES.PERFIL_NAME] = error.message;
      } finally {
        state.touched[CONSTANTES.PERFIL_NAME] = true;
      }
    },
    setSenha: (state, action) => {
      state.values.senha = action.payload;
      try {
        usuarioSchema.validateSyncAt('senha', state.values); 
        state.errors[CONSTANTES.SENHA_NAME] = CONSTANTES.VAZIO;
      } catch (error: any) {
        state.errors[CONSTANTES.SENHA_NAME] = error.message;
      } finally {
        state.touched[CONSTANTES.SENHA_NAME] = true;
      }
    },
    submitUsuario: (state) => {
      try {
        usuarioSchema.validateSync(state.values, { abortEarly: false });
        state.validForm = true;
      } catch (error: any) {
        state.success = false;
        if (error instanceof Yup.ValidationError) {
          error.inner.forEach((validationError: any) => {
            state.touched[validationError.path] = true;
            state.errors[validationError.path] = validationError.message;
          });
        }
      }
    },
    resetForm: (state) => {
      state.values = {
        nome: CONSTANTES.VAZIO,
        email: CONSTANTES.VAZIO,
        setor: CONSTANTES.VAZIO,
        perfil: CONSTANTES.USER_NAME,
        senha: CONSTANTES.VAZIO,
        ativo: true,
      };
      state.errors = {};
      state.touched = {};
      state.success = false;
      state.validForm = false;
    },
    clearErrors: (state) => {
      state.errors = {};
      state.touched = {};
    },
    setError: (state, action) => {
      state.errors.general = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUsuarios.pending, (state) => {
        state.loading = true;
        state.success = false;
      })
      .addCase(fetchUsuarios.fulfilled, (state, action) => {
        state.loading = false;
        state.usuarios = action.payload;
        state.success = true;
      })
      .addCase(fetchUsuarios.rejected, (state, action) => {
        state.loading = false;
        state.errors.general = action.error?.message || CONSTANTES.VAZIO;
      })
      .addCase(addUsuario.pending, (state) => {
        state.loading = true;
        state.success = false;
      })
      .addCase(addUsuario.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
      })
      .addCase(addUsuario.rejected, (state, action) => {
        state.loading = false;
        state.errors.general = action.error?.message || CONSTANTES.VAZIO;
      })
      .addCase(updateUsuario.pending, (state) => {
        state.loading = true;
        state.success = false;
      })
      .addCase(updateUsuario.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
      })
      .addCase(updateUsuario.rejected, (state, action) => {
        state.loading = false;
        state.errors.general = action.error?.message || CONSTANTES.VAZIO;
      })
      // LISTA DE USUÁRIOS
      .addCase(deleteUsuario.pending, (state) => {
        state.loading = true;
        state.success = false;
      })
      .addCase(deleteUsuario.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        // Atualiza a lista de usuários removendo o usuário excluído
        state.usuarios = state.usuarios.filter(user => user.id !== action.payload);
        console.log('User deleted and state updated:', state.usuarios);
      })
      .addCase(deleteUsuario.rejected, (state, action) => {
        state.loading = false;
        state.errors.general = action.error?.message || CONSTANTES.VAZIO;
      })
      .addCase(toggleStatusUsuario.pending, (state) => {
        state.loading = true;
      })
      .addCase(toggleStatusUsuario.fulfilled, (state, action) => {
        state.loading = false;
        // Atualiza o usuário na lista
        state.usuarios = state.usuarios.map(user => {
          if (user.id === action.payload.id) {
            console.log('Atualizando usuário:', user.id, 'novo status:', action.payload.ativo);
            return { 
              ...user, 
              ativo: action.payload.ativo 
            };
          }
          return user;
        });
      })
      .addCase(toggleStatusUsuario.rejected, (state, action) => {
        state.loading = false;
        state.errors.general = action.error?.message || CONSTANTES.ERROR_UPDATE_STATUS_USER;
      });

  }
});

export default usuarioSlice.reducer;
export const {
  setNome,
  setEmail,
  setSetor,
  setPerfil,
  setSenha,
  submitUsuario,
  clearErrors,
  setError,
  resetForm,
  setAbaAtiva,
} = usuarioSlice.actions;
