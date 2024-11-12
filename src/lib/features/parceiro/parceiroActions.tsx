import { ACTIONS_TYPE } from "@/common/actionsType";
import { CONSTANTES } from "@/common/constantes";
import Parceiro from "@/common/parceiro";
import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const fetchParceiro = createAsyncThunk(
  ACTIONS_TYPE.LIST_PARC,
  async () => {
    const resp = await axios.get(`${CONSTANTES.API_URL}/parceiros`);
    return resp.data;
  }
);

export const addParceiro = createAsyncThunk<any, any>(
  ACTIONS_TYPE.ADD_PARC,
  async (parceiro, { rejectWithValue }) => {
    try {
      const resp = await axios.post(
        `${CONSTANTES.API_URL}/parceiros`,
        parceiro
      );
      return resp.data;
    }  catch (error: unknown) {
      if (error instanceof Error) {
        return rejectWithValue(CONSTANTES.ERROR_ADD_PARC);
      }
      return rejectWithValue(CONSTANTES.ERROR_ADD_PARC);
    }
  }
);

export const fetchTiposParceiro = createAsyncThunk(
  ACTIONS_TYPE.LIST_TYPE_PARC,
  async () => {
    try {
      const resp = await axios.get(`${CONSTANTES.API_URL}/tipos_parceiro`);
      return resp.data;
    } catch (error) {
      console.log(error);
    }
  }
);

export const fetchParceiroById = createAsyncThunk(
  ACTIONS_TYPE.GET_PARC,
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${CONSTANTES.API_URL}/parceiros/${id}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(CONSTANTES.ERROR_GET_VAGA);
    }
  }
);

export const fetchAreasAtuacao = createAsyncThunk(
  ACTIONS_TYPE.LIST_AREA_PARC,
  async () => {
    try {
      const resp = await axios.get(`${CONSTANTES.API_URL}/areas_atuacao`);
      return resp.data;
    } catch (error) {
      console.log(error);
    }
  }
);
