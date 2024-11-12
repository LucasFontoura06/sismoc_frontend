"use client";

import { setAbaAtiva } from '@/lib/features/usuario/usuarioSlice';
import { useAppDispatch, useAppSelector } from '@/lib/hooks';
import React, { SyntheticEvent } from 'react';
import UserRegistrationForm from './paginaCadastro'; 
import { CONSTANTES } from '@/common/constantes';
import { Box, Tab, Tabs } from '@mui/material';
import UsuarioList from './usuariosList';
import { useTheme } from '@mui/material/styles';

const Painel = () => {
  const theme = useTheme();
  const { abaAtiva } = useAppSelector((state: any) => state.usuario);
  const dispatch = useAppDispatch();

  const alterarAba = (_: SyntheticEvent, aba: number) => {
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
        onChange={alterarAba}
        textColor="secondary"
        indicatorColor="secondary"
        variant="fullWidth"
        aria-label="usuarios tabs"
        sx={{
          backgroundColor: theme.palette.mode === 'dark' ? '#242833' : '#ffffff',
          '& .MuiTabs-indicator': {
            backgroundColor: theme.palette.mode === 'dark' ? '#b530b8' : '#1e8cfa',
          },
        }}
      >
        <Tab
          value={CONSTANTES.TAB_ONE_USER}
          label={CONSTANTES.LBL_LIST}
          sx={{
            color: abaAtiva === CONSTANTES.TAB_ONE_USER ? '#000000' : '#9e9e9e',
            '&:hover': {
              color: '#000000',
            },
            fontWeight: abaAtiva === CONSTANTES.TAB_ONE_USER ? 600 : 400,
          }}
        />
        <Tab
          value={CONSTANTES.TAB_TWO_USER}
          label="Cadastro"
          sx={{
            color: abaAtiva === CONSTANTES.TAB_TWO_USER ? '#000000' : '#9e9e9e',
            '&:hover': {
              color: '#000000',
            },
            fontWeight: abaAtiva === CONSTANTES.TAB_TWO_USER ? 600 : 400,
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
        {abaAtiva === CONSTANTES.TAB_ONE_USER && <UsuarioList />}
        {abaAtiva === CONSTANTES.TAB_TWO_USER && <UserRegistrationForm />}
      </Box>
    </Box>
  );
};

export default Painel;
