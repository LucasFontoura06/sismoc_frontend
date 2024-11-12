import { motion } from "framer-motion"; // Importação do Framer Motion
import { consultarOfertasVagas, consultarParceiros, consultarParceirosAno } from "@/lib/features/dashboard/emprego/empregoActions";
import FiltroDashboard from "@/app/dashboard/filtroDashboard";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import GraficoLinha from "@/components/graficoLinha";
import React, { useState, useEffect } from "react";
import { CONSTANTES } from "@/common/constantes";
import GraficoTotal from "@/components/total";
import styles from "./empregoMain.module.css";
import dynamic from "next/dynamic";
import { FaBuilding, FaLandmark, FaCity, FaBriefcase, FaUserTie } from 'react-icons/fa';
import { useTheme } from '@mui/material/styles';

const Mapa = dynamic(() => import("./mapa"), { ssr: false });

const Dashboard: React.FC = () => {
    const [year, setYear] = useState<number | null>(2024);
    const [category, setCategory] = useState<string>("");
    const theme = useTheme();

    const { loading, parceiros, error, updateState, response, meses, vagas } = useAppSelector(
        (state: any) => state.emprego
    );

    const dispatch = useAppDispatch();

    const handleFilterChange = (year: number | null, category: string) => {
        setYear(year ?? 2024);
        setCategory(category);
    };

    useEffect(() => {
        if (year !== null) {
            dispatch(consultarParceiros(CONSTANTES.PARC_NAME));
            dispatch(consultarParceirosAno(year));
            dispatch(consultarOfertasVagas());
        }
    }, [dispatch, year]);

    useEffect(() => {
        const root = document.documentElement;
        const isDark = theme.palette.mode === 'dark';

        root.style.setProperty('--background-color', isDark ? '#000000' : '#ffffff');
        root.style.setProperty('--text-color', isDark ? '#ffffff' : '#000000');
        root.style.setProperty('--text-secondary', isDark ? 'rgba(255, 255, 255, 0.7)' : 'rgba(0, 0, 0, 0.7)');
        
        // Cards
        root.style.setProperty('--card-background', isDark 
            ? 'linear-gradient(145deg, #1b2638, #1f2b3d)'
            : 'linear-gradient(145deg, #ffffff, #f8f9fa)');
        
        root.style.setProperty('--card-background-hover', isDark
            ? 'linear-gradient(145deg, #1d2a3f, #222f44)'
            : 'linear-gradient(145deg, #f8f9fa, #ffffff)');
        
        root.style.setProperty('--border-color', isDark 
            ? 'rgba(255, 255, 255, 0.06)'
            : 'rgba(0, 0, 0, 0.06)');
        
        root.style.setProperty('--border-color-hover', isDark
            ? 'rgba(255, 255, 255, 0.1)'
            : 'rgba(0, 0, 0, 0.1)');
        
        // Shadows
        root.style.setProperty('--card-shadow', isDark
            ? '0 4px 20px rgba(0, 0, 0, 0.5), 0 8px 32px rgba(0, 0, 0, 0.5)'
            : '0 4px 20px rgba(0, 0, 0, 0.1), 0 8px 32px rgba(0, 0, 0, 0.1)');
        
        root.style.setProperty('--card-shadow-hover', isDark
            ? '0 8px 28px rgba(0, 0, 0, 0.6), 0 12px 36px rgba(0, 0, 0, 0.6)'
            : '0 8px 28px rgba(0, 0, 0, 0.15), 0 12px 36px rgba(0, 0, 0, 0.15)');
        
        // Gradients
        root.style.setProperty('--border-gradient', isDark
            ? 'linear-gradient(90deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.1) 50%, rgba(255,255,255,0) 100%)'
            : 'linear-gradient(90deg, rgba(0,0,0,0) 0%, rgba(0,0,0,0.1) 50%, rgba(0,0,0,0) 100%)');
    }, [theme.palette.mode]);

    return (
        <div className={styles.geral}>
            <div>
                <h1 className={styles.graficoTitulo}>{CONSTANTES.TITLE_DASH}</h1>
            </div>

            {/* Animação para o filtro */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className={styles.filtroContainer}
            >
                <FiltroDashboard onFilterChange={handleFilterChange} />
            </motion.div>

            <div className={styles.gridContainer}>
                {/* Gráficos Totais */}
                <motion.div
                    className={styles.graficosTotais}
                    whileHover={{ scale: 1.02, transition: { duration: 0.2 } }}
                    style={{
                        '--icon-color': theme.palette.primary.main,
                        '--icon-color-hover': theme.palette.primary.light,
                        '--icon-bg': `${theme.palette.primary.main}1A`,
                        '--icon-bg-hover': `${theme.palette.primary.main}29`,
                    } as React.CSSProperties}
                >
                    <div className={styles.iconContainer}>
                        <FaBuilding className={styles.icon} />
                    </div>
                    <div className={styles.infoContainer}>
                        <h2>{CONSTANTES.TITLE_DASH_TOTAL_PRIV}</h2>
                        <div className={styles.valorTotal}>
                            {parceiros.privados}
                        </div>
                    </div>
                </motion.div>

                <motion.div
                    className={styles.graficosTotais}
                    whileHover={{ scale: 1.02, transition: { duration: 0.2 } }}
                    style={{
                        '--icon-color': theme.palette.primary.main,
                        '--icon-color-hover': theme.palette.primary.light,
                        '--icon-bg': `${theme.palette.primary.main}1A`,
                        '--icon-bg-hover': `${theme.palette.primary.main}29`,
                    } as React.CSSProperties}
                >
                    <div className={styles.iconContainer}>
                        <FaLandmark className={styles.icon} />
                    </div>
                    <div className={styles.infoContainer}>
                        <h2>{CONSTANTES.TITLE_DASH_TOTAL_PUB}</h2>
                        <div className={styles.valorTotal}>
                            {parceiros.publicos}
                        </div>
                    </div>
                </motion.div>

                <motion.div
                    className={styles.graficosTotais}
                    whileHover={{ scale: 1.02, transition: { duration: 0.2 } }}
                    style={{
                        '--icon-color': theme.palette.primary.main,
                        '--icon-color-hover': theme.palette.primary.light,
                        '--icon-bg': `${theme.palette.primary.main}1A`,
                        '--icon-bg-hover': `${theme.palette.primary.main}29`,
                    } as React.CSSProperties}
                >
                    <div className={styles.iconContainer}>
                        <FaCity className={styles.icon} />
                    </div>
                    <div className={styles.infoContainer}>
                        <h2>{CONSTANTES.TITLE_DASH_TOTAL_ESTA_MUN}</h2>
                        <div className={styles.valorTotal}>
                            {parceiros.estadosMunicipios}
                        </div>
                    </div>
                </motion.div>

                <motion.div
                    className={styles.graficosTotais}
                    whileHover={{ scale: 1.02, transition: { duration: 0.2 } }}
                    style={{
                        '--icon-color': theme.palette.primary.main,
                        '--icon-color-hover': theme.palette.primary.light,
                        '--icon-bg': `${theme.palette.primary.main}1A`,
                        '--icon-bg-hover': `${theme.palette.primary.main}29`,
                    } as React.CSSProperties}
                >
                    <div className={styles.iconContainer}>
                        <FaBriefcase className={styles.icon} />
                    </div>
                    <div className={styles.infoContainer}>
                        <h2>{CONSTANTES.TITLE_DASH_TOTAL_VAGAS_OFER}</h2>
                        <div className={styles.valorTotal}>
                            {vagas}
                        </div>
                    </div>
                </motion.div>

                <motion.div
                    className={styles.graficosTotais}
                    whileHover={{ scale: 1.02, transition: { duration: 0.2 } }}
                    style={{
                        '--icon-color': theme.palette.primary.main,
                        '--icon-color-hover': theme.palette.primary.light,
                        '--icon-bg': `${theme.palette.primary.main}1A`,
                        '--icon-bg-hover': `${theme.palette.primary.main}29`,
                    } as React.CSSProperties}
                >
                    <div className={styles.iconContainer}>
                        <FaUserTie className={styles.icon} />
                    </div>
                    <div className={styles.infoContainer}>
                        <h2>{CONSTANTES.TITLE_DASH_TOTAL_VAGAS_CONTRA}</h2>
                        <div className={styles.valorTotal}>
                            {parceiros.estadosMunicipios}
                        </div>
                    </div>
                </motion.div>

                {/* Gráficos de Linhas */}
                <div className={styles.graficosGrandes}>
                    <div
                        className={styles.graficoLinha}
                        // whileHover={{ scale: 1.05, transition: { duration: 0.2 } }}
                    >
                        <h1 className={styles.graficoTitulo}>{CONSTANTES.TITLE_DASH_LINHA_CONTRA}</h1>
                        <GraficoLinha meses={meses} />
                    </div>

                    <div
                        className={styles.graficoLinha}
                        // whileHover={{ scale: 1.05, transition: { duration: 0.2 } }}
                    >
                        <h1 className={styles.graficoTitulo}>{CONSTANTES.TITLE_DASH_LINHA_CONTRA}</h1>
                        <GraficoLinha meses={meses} />
                    </div>
                </div>

                {/* Gráfico Mapa */}
                <div
                    className={styles.graficoMapa}
                    // whileHover={{ scale: 1.05, transition: { duration: 0.2 } }}
                >
                    <h1 className={styles.graficoTitulo}>{CONSTANTES.TITLE_DASH_MAPA}</h1>
                    <Mapa />
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
