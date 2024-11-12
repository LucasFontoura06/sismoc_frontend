"use client";

import { useAppDispatch, useAppSelector } from '@/lib/hooks';
import React, { useState, SyntheticEvent } from 'react';
import { CONSTANTES } from '@/common/constantes';
import { Box, Tab, Tabs } from '@mui/material';
import CadastroOuvidoriaForm from './listasOuvidoriaForm';
import ListasOuvidoria from './listasOuvidoriaList';
import { setAbaAtiva, resetForm } from '@/lib/features/listasOuvidoria/listasSlice';
import { useTheme } from '@mui/material/styles';

const Painel = () => {
  const theme = useTheme();
  const { abaAtiva } = useAppSelector((state: any) => state.listasOuvidoria);
  const dispatch = useAppDispatch();

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
        aria-label="listas tabs"
        sx={{
          backgroundColor: theme.palette.mode === 'dark' ? '#242833' : '#ffffff',
          '& .MuiTabs-indicator': {
            backgroundColor: theme.palette.mode === 'dark' ? '#b530b8' : '#1e8cfa',
          },
        }}
      >
        <Tab
          value={CONSTANTES.TAB_ONE_LISTAS}
          label={CONSTANTES.LBL_LIST}
          sx={{
            color: abaAtiva === CONSTANTES.TAB_ONE_LISTAS ? '#000000' : '#9e9e9e',
            '&:hover': {
              color: '#000000',
            },
            fontWeight: abaAtiva === CONSTANTES.TAB_ONE_LISTAS ? 600 : 400,
          }}
        />
        <Tab
          value={CONSTANTES.TAB_TWO_LISTAS}
          label={CONSTANTES.LBL_LISTAS_OUVI_TITLE}
          sx={{
            color: abaAtiva === CONSTANTES.TAB_TWO_LISTAS ? '#000000' : '#9e9e9e',
            '&:hover': {
              color: '#000000',
            },
            fontWeight: abaAtiva === CONSTANTES.TAB_TWO_LISTAS ? 600 : 400,
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
        {abaAtiva === CONSTANTES.TAB_ONE_LISTAS && <ListasOuvidoria />}
        {abaAtiva === CONSTANTES.TAB_TWO_LISTAS && <CadastroOuvidoriaForm />}
      </Box>
    </Box>
  );
};

export default Painel;
