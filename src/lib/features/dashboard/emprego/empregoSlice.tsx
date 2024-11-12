import { CONSTANTES } from "@/common/constantes";
import { createSlice } from "@reduxjs/toolkit";

const INITIAL_STATE = {
  parceiros: [] as any[],
  meses: [] as any[],
  vagas: [] as any[],
  updateState: false,
  loading: false,
  response: CONSTANTES.VAZIO,
  error: CONSTANTES.VAZIO,
};

const empregoSlice = createSlice({
  name: CONSTANTES.TRAB_NAME,
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
    setParceiros: (state, action) => {
      state.parceiros = action.payload;
    },
    setMeses: (state, action) => {
      state.meses = action.payload;
    },
    setVagas: (state, action) => {
      state.vagas = action.payload;
    },
  },
});

export default empregoSlice.reducer;
export const {
  changeStateTrue,
  changeStateFalse,
  clearResponse,
  setParceiros,
  setMeses,
  setVagas,
} = empregoSlice.actions;
