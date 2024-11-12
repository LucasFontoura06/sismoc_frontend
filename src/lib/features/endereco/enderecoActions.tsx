import Endereco from "@/common/endereco";
import { ACTIONS_TYPE } from "../../../common/actionsType";
import { CONSTANTES } from "../../../common/constantes";
import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const getCidade = createAsyncThunk<any, string>(ACTIONS_TYPE.GET_CIDADE, async (uf, { rejectWithValue }) => {
  try {
    const resp = await axios.get(`${CONSTANTES.API_IBGE.replace('<UF>', uf)}`);
    return resp.data;
  } catch (error) {
    return rejectWithValue(CONSTANTES.ERROR_GET_CIDADE);
  } 
})

export const fetchEndereco = createAsyncThunk(ACTIONS_TYPE.LIST_END, async (_, { rejectWithValue }) => {
  try {
    const resp = await axios.get(`${CONSTANTES.API_URL}/enderecos`);
    return resp.data;
  } catch (error) {
    return rejectWithValue(CONSTANTES.ERROR_LIST_END);
  }
});

export const addEndereco = createAsyncThunk<Endereco, any>(ACTIONS_TYPE.ADD_END, async (endereco, { rejectWithValue }) => {
  try {
    const resp = await axios.post(`${CONSTANTES.API_URL}/enderecos`, endereco);
    return resp.data;
  } catch (error) {
    return rejectWithValue(CONSTANTES.ERROR_ADD_END);
  }
});

export const updateEndereco = createAsyncThunk<Endereco, Endereco>(ACTIONS_TYPE.EDIT_END, async (endereco, { rejectWithValue }) => {
  try {
    console.log('dados do endereco antes de atualizar:', endereco)
    const { id } = endereco;
    const resp = await axios.patch(
      `${CONSTANTES.API_URL}/enderecos/${id}`,
      endereco
    );
    return resp.data;
  } catch (error) {
    return rejectWithValue(CONSTANTES.ERROR_UPDT_END);
  }
});

export const deleteEndereco = createAsyncThunk(
  ACTIONS_TYPE.DEL_END,
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await axios.delete(`${CONSTANTES.API_URL}/enderecos/${id}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(ACTIONS_TYPE.ERROR_DEL_END);
    }
  }
);
