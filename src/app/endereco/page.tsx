"use client";

import { CONSTANTES } from "@/common/constantes";
import { setAbaAtiva } from "@/lib/features/endereco/enderecoSlice";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { Box, Tab, Tabs } from "@mui/material";
import { useTheme } from '@mui/material/styles';
import EnderecoForm from "./enderecoForm";
import EnderecoList from "./enderecoList";
import { SyntheticEvent } from "react";

const Endereco = () => {
  const theme = useTheme();
  const { abaAtiva } = useAppSelector((state: any) => state.endereco);
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
        aria-label="endereço tabs"
        sx={{
          backgroundColor: theme.palette.mode === 'dark' ? '#242833' : '#ffffff',
          '& .MuiTabs-indicator': {
            backgroundColor: theme.palette.mode === 'dark' ? '#b530b8' : '#1e8cfa',
          },
        }}
      >
        <Tab
          value={CONSTANTES.TAB_ONE_END}
          label={CONSTANTES.LBL_LIST}
          sx={{
            color: abaAtiva === CONSTANTES.TAB_ONE_END ? '#000000' : '#9e9e9e',
            '&:hover': {
              color: '#000000',
            },
            fontWeight: abaAtiva === CONSTANTES.TAB_ONE_END ? 600 : 400,
          }}
        />
        <Tab
          value={CONSTANTES.TAB_TWO_END}
          label={CONSTANTES.LBL_END}
          sx={{
            color: abaAtiva === CONSTANTES.TAB_TWO_END ? '#000000' : '#9e9e9e',
            '&:hover': {
              color: '#000000',
            },
            fontWeight: abaAtiva === CONSTANTES.TAB_TWO_END ? 600 : 400,
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
        {abaAtiva === CONSTANTES.TAB_ONE_END && <EnderecoList />}
        {abaAtiva === CONSTANTES.TAB_TWO_END && <EnderecoForm />}
      </Box>
    </Box>
  );
};

export default Endereco;
