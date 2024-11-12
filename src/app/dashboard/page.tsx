"use client";

import CapacitaMain from '@/app/dashboard/capacitaMain'; // Importa o componente CapacitaMain
import React, { useState, SyntheticEvent } from 'react'; // Importa React e hooks useState e SyntheticEvent
import EmpregoMain from '@/app/dashboard/empregoMain'; // Importa o componente EmpregoMain
import EmpreenMain from '@/app/dashboard/empreenMain'; // Importa o componente EmpreenMain
import { CONSTANTES } from '@/common/constantes'; // Importa constantes de configuração
import { Box, Tab, Tabs } from '@mui/material'; // Importa componentes Box, Tab e Tabs do Material UI
import { useTheme } from '@mui/material/styles'; // Adicione esta importação

/**
 * Componente Painel
 * 
 * Este componente representa um painel com abas que permitem a navegação entre diferentes seções da interface.
 * O painel é dividido em três seções:
 * 1. EmpregoMain
 * 2. EmpreenMain
 * 3. CapacitaMain
 * 
 * A aba ativa é controlada pelo estado local `aba`, e o conteúdo exibido é atualizado com base na aba selecionada.
 * 
 * @returns {JSX.Element} O componente Painel renderizado.
 */
const Painel = () => {
  // Estado para controlar a aba ativa
  const [aba, setAba] = useState(0);
  const theme = useTheme(); // Adicione o hook useTheme

  /**
   * Função para alterar a aba ativa
   * 
   * @param {SyntheticEvent} _ - Evento sintético do Material UI
   * @param {number} newValue - O novo valor da aba ativa
   */
  const alterarAba = (_: SyntheticEvent, newValue: number) => {
    setAba(newValue);
  };

  return (
    <Box 
      sx={{ 
        width: '100%', 
        height: '94vh', 
        position: 'relative', 
        backgroundColor: 'background.default',
        borderColor: theme.palette.mode === 'dark' ? '#000000' : '#f5f5f5',
        borderStyle: 'solid',
        borderWidth: 1,
      }}
    >
      <Box 
        sx={{ 
          padding: 2, 
          height: 'calc(100% - 48px)', 
          overflowY: 'auto',
          backgroundColor: 'background.default',
        }}
      >
        {aba === 0 && <EmpregoMain />} {/* Exibe o componente EmpregoMain se a aba ativa for 0 */}
        {aba === 1 && <EmpreenMain />} {/* Exibe o componente EmpreenMain se a aba ativa for 1 */}
        {aba === 2 && <CapacitaMain />} {/* Exibe o componente CapacitaMain se a aba ativa for 2 */}
      </Box>

      <Tabs
        aria-label="dashboard tabs"
        indicatorColor="primary"
        variant="fullWidth"
        textColor="primary"
        onChange={alterarAba} // Atualiza a aba ativa ao mudar a aba
        value={aba} // Valor da aba ativa
        sx={{
          boxShadow: theme.palette.mode === 'dark' 
            ? '0px -2px 10px rgba(0, 0, 0, 0.5)'
            : '0px -2px 10px rgba(0, 0, 0, 0.1)',
          backgroundColor: theme.palette.background.paper, // Use a cor do tema
          borderRadius: '10px',
          position: 'absolute',
          width: '100%',
          bottom: 0,
          left: 0,
          '@media (max-width: 600px)': {
            fontSize: '12px',
          },
        }}
      >
        <Tab 
          value={0} 
          label={CONSTANTES.LBL_EMPRE} 
          sx={{ 
            color: aba === 0 
              ? theme.palette.primary.main 
              : theme.palette.text.primary 
          }} 
        />
        <Tab 
          value={1} 
          label={CONSTANTES.LBL_EMPREEN} 
          sx={{ 
            color: aba === 1 
              ? theme.palette.primary.main 
              : theme.palette.text.primary 
          }} 
        />
        <Tab 
          value={2} 
          label={CONSTANTES.LBL_CAPA} 
          sx={{ 
            color: aba === 2 
              ? theme.palette.primary.main 
              : theme.palette.text.primary 
          }} 
        />
      </Tabs>
    </Box>
  );
};

export default Painel;
