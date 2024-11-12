import { createAsyncThunk, isRejectedWithValue } from "@reduxjs/toolkit";
import axios from "axios";
import { CONSTANTES } from "@/common/constantes";
import { ACTIONS_TYPE } from "@/common/actionsType";
import Escolaridade from "@/common/escolaridade";
import Vaga from "@/common/vaga";
import Cargo from "@/common/cargo";

export const fetchEscolaridades = createAsyncThunk(
  ACTIONS_TYPE.FETCH_ESCOLARIDADES,
  async (_, { rejectWithValue }) => {
    try {
      const escolaridades = Escolaridade.getAll(); 
      return escolaridades;
    } catch (error) {
      return rejectWithValue(ACTIONS_TYPE.ERROR_GET_ESCOLARIDADES);
    }
  }
);


export const addVaga = createAsyncThunk(
  ACTIONS_TYPE.SUBMIT_VAGA,
  async (vaga: Vaga, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${CONSTANTES.API_URL}/vagas`, vaga);
      return response.data;
    } catch (error) {
      return rejectWithValue(ACTIONS_TYPE.ERROR_ADD_VAGA);
    }
  }
);

export const updateVaga = createAsyncThunk(
  ACTIONS_TYPE.UPDATE_VAGA,
  async (vaga: Vaga, { rejectWithValue }) => {
    try {
      console.log("Dados da vaga antes de atualizar:", vaga); // Verificar os dados antes de atualizar
      const { id } = vaga;
      const response = await axios.patch(`${CONSTANTES.API_URL}/vagas/${id}`, vaga);
      return response.data;
    } catch (error) {
      return rejectWithValue(ACTIONS_TYPE.ERROR_UPDT_VAGA);
    }
  }
);

// export const updateVaga = createAsyncThunk<Vaga, Vaga>(
//   ACTIONS_TYPE.UPDATE_VAGA,
//   async (vaga, { rejectWithValue }) => {
//     try {
//       console.log("Dados da vaga antes de atualizar:", vaga); // Verificar os dados antes de atualizar
//       const { id } = vaga;
//       const response = await axios.put(`${CONSTANTES.API_URL}/vagas/${id}`, vaga);
//       return response.data;
//     } catch (error) {
//       return rejectWithValue(CONSTANTES.ERROR_UPDT_VAGA);
//     }
//   }
// );

export const fetchVagas = createAsyncThunk(
  ACTIONS_TYPE.LIST_VAGA,  
  async (_, { rejectWithValue }) => {
  try {
    const resp = await axios.get(`${CONSTANTES.API_URL}/vagas`);
    return resp.data;
  } catch (error) {
    return rejectWithValue(CONSTANTES.ERROR_LIST_VAGA);
  }
});

export const getCargos = createAsyncThunk(
  ACTIONS_TYPE.LIST_CARGO,  
  async (_, { rejectWithValue }) => {
  try {
    const resp = await axios.get(`${CONSTANTES.API_URL}/cargos`);
    return resp.data;
  } catch (error) {
    return rejectWithValue(ACTIONS_TYPE.ERROR_GET_CARGO);
  }
});

export const addNovoCargo = createAsyncThunk(
  ACTIONS_TYPE.SUBMIT_CARGO,
  async (novoCargo: string, { rejectWithValue }) => { 
    try {
      const response = await axios.post(`${CONSTANTES.API_URL}/cargos`, {
        descricao: novoCargo,
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(ACTIONS_TYPE.ERROR_ADD_CARGO);
    }
  }
);

export const deleteVaga = createAsyncThunk(
  ACTIONS_TYPE.DEL_VAGA,
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await axios.delete(`${CONSTANTES.API_URL}/vagas/${id}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(ACTIONS_TYPE.ERROR_DEL_VAGA);
    }
  }
);

export const fetchVagaById = createAsyncThunk(
  ACTIONS_TYPE.FETCH_VAGA_BY_ID,
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${CONSTANTES.API_URL}/vagas/${id}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(CONSTANTES.ERROR_GET_VAGA);
    }
  }
);