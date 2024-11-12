import Endereco from "@/common/endereco";
import { ACTIONS_TYPE } from "../../../common/actionsType";
import { CONSTANTES } from "../../../common/constantes";
import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import Contato from "@/common/contato";

export const fetchContato = createAsyncThunk(
  ACTIONS_TYPE.LIST_CONTATO,
  async (_, { rejectWithValue }) => {
    try {
      const resp = await axios.get(`${CONSTANTES.API_URL}/contatos`);
      return resp.data;
    } catch (error) {
      return rejectWithValue(CONSTANTES.ERROR_LIST_CONTATO);
    }
  }
);

export const addContato = createAsyncThunk<Contato, any>(
  ACTIONS_TYPE.ADD_CONTATO,
  async (contato, { rejectWithValue }) => {
    try {
      const resp = await axios.post(`${CONSTANTES.API_URL}/contatos`, contato);
      return resp.data;
    } catch (error) {
      return rejectWithValue(CONSTANTES.ERROR_ADD_CONTATO);
    }
  }
);

export const updateEndereco = createAsyncThunk<Contato, Contato>(
  ACTIONS_TYPE.EDIT_CONTATO,
  async (contato, { rejectWithValue }) => {
    try {
      const { id } = contato;
      const resp = await axios.put(
        `${CONSTANTES.API_URL}/contatos/${id}`,
        contato
      );
      return resp.data;
    } catch (error) {
      return rejectWithValue(CONSTANTES.ERROR_UPDT_CONTATO);
    }
  }
);
