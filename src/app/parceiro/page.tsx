"use client";

import { CONSTANTES } from "@/common/constantes";
import { Box, Tab, Tabs } from "@mui/material";
import { SyntheticEvent, useRef, useState } from "react";
import ParceiroList from "./parceiroList";
import ParceiroForm from "./parceiroForm";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { setAbaAtiva } from "@/lib/features/parceiro/parceiroSlice";

const Parceiro = () => {
  const { abaAtiva } = useAppSelector((state: any) => state.parceiro);
  const dispatch = useAppDispatch();

  const handleChange = (_: SyntheticEvent, aba: number) => {
    dispatch(setAbaAtiva(aba));
  };

  return (
    <Box
      className={
        "min-h-screen flex-col justify-between bg-gradient-to-br from-slate-950 to-slate-700"
      }
      sx={{ overflow: "auto" }}
    >
      <Tabs
        value={abaAtiva}
        onChange={handleChange}
        textColor="secondary"
        indicatorColor="secondary"
        variant="fullWidth"
        aria-label="parceiro tabs"
      >
        <Tab
          value={CONSTANTES.TAB_ONE_PARC}
          label={CONSTANTES.LBL_LIST}
          sx={{
            color:
              abaAtiva == CONSTANTES.TAB_ONE_PARC
                ? "#fff"
                : "#670080"
          }}
        />
        <Tab
          value={CONSTANTES.TAB_TWO_PARC}
          label={CONSTANTES.LBL_PARC}
          sx={{
            color:
              abaAtiva == CONSTANTES.TAB_TWO_PARC
                ? "#fff"
                : "#670080",
          }}
        />
      </Tabs>
      {abaAtiva == CONSTANTES.TAB_ONE_PARC && <ParceiroList />}
      {abaAtiva == CONSTANTES.TAB_TWO_PARC && <ParceiroForm />}
    </Box>
  );
};

export default Parceiro;
