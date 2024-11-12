"use client";

import { CONSTANTES } from "@/common/constantes";
import { setAbaAtiva } from "@/lib/features/vaga/vagaSlice";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { Box, Tab, Tabs, useTheme } from "@mui/material";
import { SyntheticEvent, useState } from "react";
import VagaForm from "./vagaForm";
import VagasList from "./vagaList";

const VagaPage = () => {
  const { abaAtiva } = useAppSelector((state: any) => state.vaga);
  const dispatch = useAppDispatch();
  const theme = useTheme();

  const handleChange = (_: SyntheticEvent, aba: number) => {
    dispatch(setAbaAtiva(aba));
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: theme.palette.mode === 'dark' 
          ? 'rgb(17, 17, 17)' 
          : 'rgb(245, 245, 245)',
        overflow: "auto",
      }}
    >
      <Tabs
        value={abaAtiva}
        onChange={handleChange}
        textColor="secondary"
        indicatorColor="secondary"
        variant="fullWidth"
        aria-label="vagas tabs"
        sx={{
          backgroundColor: theme.palette.mode === 'dark' ? '#242833' : '#ffffff',
          '& .MuiTabs-indicator': {
            backgroundColor: theme.palette.mode === 'dark' ? '#b530b8' : '#1e8cfa',
          },
        }}
      >
        <Tab
          value={CONSTANTES.TAB_ONE_VAGA}
          label={CONSTANTES.LBL_LIST}
          sx={{
            color: abaAtiva === CONSTANTES.TAB_ONE_VAGA 
              ? theme.palette.mode === 'dark' ? '#ffffff' : '#000000'
              : '#9e9e9e',
            '&:hover': {
              color: theme.palette.mode === 'dark' ? '#ffffff' : '#000000',
            },
            fontWeight: abaAtiva === CONSTANTES.TAB_ONE_VAGA ? 600 : 400,
          }}
        />
        <Tab
          value={CONSTANTES.TAB_TWO_VAGA}
          label={CONSTANTES.LBL_VAG}
          sx={{
            color: abaAtiva === CONSTANTES.TAB_TWO_VAGA 
              ? theme.palette.mode === 'dark' ? '#ffffff' : '#000000'
              : '#9e9e9e',
            '&:hover': {
              color: theme.palette.mode === 'dark' ? '#ffffff' : '#000000',
            },
            fontWeight: abaAtiva === CONSTANTES.TAB_TWO_VAGA ? 600 : 400,
          }}
        />
      </Tabs>

      <Box sx={{ 
        flex: 1,
        padding: 2,
        backgroundColor: theme.palette.mode === 'dark' 
          ? 'rgb(17, 17, 17)' 
          : 'rgb(245, 245, 245)',
      }}>
        {abaAtiva === CONSTANTES.TAB_ONE_VAGA && <VagasList />}
        {abaAtiva === CONSTANTES.TAB_TWO_VAGA && <VagaForm />}
      </Box>
    </Box>
  );
};

export default VagaPage;
