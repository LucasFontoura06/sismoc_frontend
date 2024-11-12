import { createAsyncThunk } from "@reduxjs/toolkit";
import { ACTIONS_TYPE } from "@/common/actionsType";
import { CONSTANTES } from "@/common/constantes";
import Usuario from "@/common/usuario";
import axios from "axios";

// Ação para registrar um novo usuário
export const addUsuario = createAsyncThunk<Usuario, any>(
  ACTIONS_TYPE.ADD_USER, 
  async (usuario, { rejectWithValue }) => {
    try {
      const resp = await axios.post(`${CONSTANTES.API_URL}/usuarios`, usuario);
      return resp.data;
    } catch (error: any) {
      // Caso ocorra um erro, retorna a constante de erro apropriada
      return rejectWithValue(error.response?.data?.message || CONSTANTES.ERROR_ADD_USER);
    }
  }
);

// Ação para buscar a lista de usuários
export const fetchUsuarios = createAsyncThunk(
  ACTIONS_TYPE.LIST_USER, 
  async (_, { rejectWithValue }) => {
    try {
      const resp = await axios.get(`${CONSTANTES.API_URL}/usuarios`);
      return resp.data;
    } catch (error: any) {
      // Caso ocorra um erro, retorna a constante de erro apropriada
      return rejectWithValue(error.response?.data?.message || CONSTANTES.ERROR_LIST_USER);
    }
  }
);

// Ação para atualizar um usuário
export const updateUsuario = createAsyncThunk<Usuario, any>(
  ACTIONS_TYPE.UPDATE_USER, 
  async (usuario, { rejectWithValue }) => {
    try {
      console.log('Enviando atualização:', usuario); // Debug
      const resp = await axios.put(`${CONSTANTES.API_URL}/usuarios/${usuario.id}`, usuario);
      return resp.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || CONSTANTES.ERROR_UPDATE_USER);
    }
  }
);

// Ação para deletar um usuário
export const deleteUsuario = createAsyncThunk<string, string>(
  'usuario/deleteUsuario',
  async (userid, { rejectWithValue }) => {
    try {
      const response = await axios.delete(`${CONSTANTES.API_URL}/usuarios/${userid}`);
      if (response.status === 200) {
        return userid; // Retorne o ID do usuário para que possa ser removido da lista no frontend
      } else {
        return rejectWithValue('Falha na exclusão');
      }
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || CONSTANTES.ERROR_DELETE_USER);
    }
  }
);

// Ação para atualizar o status de um usuário
export const toggleStatusUsuario = createAsyncThunk(
  ACTIONS_TYPE.TOGGLE_STATUS_USER,
  async ({ userId, status }: { userId: string; status: boolean }, { rejectWithValue }) => {
    try {
      const resp = await axios.put(`${CONSTANTES.API_URL}/usuarios/${userId}/status`, { status });
      return resp.data; // Deve retornar o usuário atualizado com id e ativo
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || CONSTANTES.ERROR_UPDATE_STATUS_USER);
    }
  }
);


