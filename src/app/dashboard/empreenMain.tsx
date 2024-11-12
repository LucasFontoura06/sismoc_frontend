import { CONSTANTES } from "@/common/constantes";
import GraficoTotal from "@/components/total";
import styles from "./dashboard.module.css";
import CustomLabels from './graficoBarras';
import PieColor from './graficoPizza';
import React from 'react';


const Dashboard: React.FC = () => {
  const entesPrivados = 10;
  const entesPublicos = 80;
  const estadosMunicipios = 30;

  return (
    <div className="text-white">

      <h1 className={styles.graficoTitulo}>{CONSTANTES.TITLE_DASH}</h1>

      <div className={styles.graficoContainer}>

        <div className={styles.graficoTotal}>
          <h2>{CONSTANTES.TITLE_DASH_TOTAL_PRIV}</h2>
          <GraficoTotal value={entesPrivados} fill="#52b202" />
        </div>

        <div className={styles.graficoTotal}>
          <h2>{CONSTANTES.TITLE_DASH_TOTAL_PUB}</h2>
          <GraficoTotal value={entesPublicos} fill="#52b202" />
        </div>

        <div className={styles.graficoTotal}>
          <h2>{CONSTANTES.TITLE_DASH_TOTAL_ESTA_MUN}</h2>
          <GraficoTotal value={estadosMunicipios} fill="#52b202" />
        </div>

      </div>

      <div className={styles.graficoGrandeContainer}>

        <div className={styles.graficoGrandeItem}>
          <h1 className={styles.graficoTitulo}>grafico 05</h1>
          <PieColor />
        </div>

        <div className={styles.graficoGrandeItem}>
          <h1 className={styles.graficoTitulo}>grafico 04</h1>
          <CustomLabels />
        </div>

      </div>

      <div className={styles.tabsMenu}></div>
    </div>
  );
};

export default Dashboard;
