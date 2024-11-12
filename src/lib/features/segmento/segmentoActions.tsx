import { ACTIONS_TYPE } from "@/common/actionsType";
import { CONSTANTES } from "@/common/constantes";
import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const fetchSegmento = createAsyncThunk(
  ACTIONS_TYPE.LIST_SEG_PARC,
  async () => {
    try {
      const resp = await axios.get(`${CONSTANTES.API_CNAE_GRUPOS}`);
      return resp.data;
    } catch (error) {
      console.log(error);
    }
  }
);