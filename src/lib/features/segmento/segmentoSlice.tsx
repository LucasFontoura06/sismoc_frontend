import { CONSTANTES } from "@/common/constantes";
import { convertSegmentoDropdown } from "@/common/utils";
import { createSlice } from "@reduxjs/toolkit";
import {
  fetchSegmento
} from "./segmentoActions";

const INITIAL_STATE = {
  updateState: false,
  loading: false,
  segmentos: [] as any[],
  error: CONSTANTES.VAZIO,
  response: CONSTANTES.VAZIO,
};

const segmentoSlice = createSlice({
  name: CONSTANTES.SEG_NAME,
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
  },
  extraReducers: (builder) => {
    
    builder
      .addCase(fetchSegmento.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchSegmento.fulfilled, (state, action) => {
        state.loading = false;
        state.segmentos = convertSegmentoDropdown(action.payload);
      })
      .addCase(fetchSegmento.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message ?? CONSTANTES.VAZIO;
      });

  },
});

export default segmentoSlice.reducer;
export const {
  changeStateTrue,
  changeStateFalse,
  clearResponse,
} = segmentoSlice.actions;
