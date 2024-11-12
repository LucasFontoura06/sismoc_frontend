import { configureStore } from "@reduxjs/toolkit";

import EmpregoSlice from "@/lib/features/dashboard/emprego/empregoSlice";
import EnderecoSlice from "@/lib/features/endereco/enderecoSlice";
import ParceiroSlice from "@/lib/features/parceiro/parceiroSlice";
import UsuarioSlice from "@/lib/features/usuario/usuarioSlice";
import VagaSlice from "@/lib/features/vaga/vagaSlice";
import SegmentoSlice from "@/lib/features/segmento/segmentoSlice";
import InstrumentoJuridicoSlice from "@/lib/features/instrumento-juridico/instrumentoJuridicoSlice";
import ContatoSlice from "@/lib/features/contato/contatoSlice";
import ListasSlice from "./features/listasOuvidoria/listasSlice";


export const makeStore = () => {
  return configureStore({
    reducer: {
      parceiro: ParceiroSlice,
      endereco: EnderecoSlice,
      emprego: EmpregoSlice,
      vaga: VagaSlice,
      usuario: UsuarioSlice,
      segmento: SegmentoSlice,
      instrumentoJuridico: InstrumentoJuridicoSlice,
      contato: ContatoSlice,
      listasOuvidoria: ListasSlice,
    },
    
  });
};

export type AppStore = ReturnType<typeof makeStore>;
export type RootState = ReturnType<AppStore["getState"]>;
export type AppDispatch = AppStore["dispatch"];
