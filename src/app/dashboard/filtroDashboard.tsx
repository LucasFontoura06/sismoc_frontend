import { motion } from "framer-motion"; // Importação do Framer Motion
import React, { useState } from "react";
import styles from "./filtroDashboard.module.css";
import { CONSTANTES } from "@/common/constantes";
import { Button } from "@mui/material"; // Importando o Button do Material UI

interface FiltroDashboardProps {
    onFilterChange: (year: number | null, category: string, subcategory: string | null, juridicalInstrument: string, situacao: string) => void;
}

const FiltroDashboard: React.FC<FiltroDashboardProps> = ({ onFilterChange }) => {
    const [year, setYear] = useState<number | null>(null);
    const [category, setCategory] = useState<string>("");
    const [subcategory, setSubcategory] = useState<string | null>(null); // Estado para a subcategoria
    const [juridicalInstrument, setJuridicalInstrument] = useState<string>("");
    const [situacao, setSituacao] = useState<string>(""); // Alterado para situacao

    const handleYearChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedYear = event.target.value ? parseInt(event.target.value, 10) : null;
        setYear(selectedYear);
        onFilterChange(selectedYear, category, subcategory, juridicalInstrument, situacao);
    };

    const handleCategoryChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedCategory = event.target.value;
        setCategory(selectedCategory);
        setSubcategory(null); // Limpa a subcategoria quando mudar a categoria
        onFilterChange(year, selectedCategory, null, juridicalInstrument, situacao);
    };

    const handleJuridicalInstrumentChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedInstrument = event.target.value;
        setJuridicalInstrument(selectedInstrument);
        setSubcategory(null); // Limpa a subcategoria ao mudar instrumento jurídico
        onFilterChange(year, category, null, selectedInstrument, situacao);
    };

    const handleSubcategoryChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedSubcategory = event.target.value;
        setSubcategory(selectedSubcategory);
        onFilterChange(year, category, selectedSubcategory, juridicalInstrument, situacao);
    };

    const handleSituacaoChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedSituacao = event.target.value;
        setSituacao(selectedSituacao);
        onFilterChange(year, category, subcategory, juridicalInstrument, selectedSituacao);
    };

    const handleReset = () => {
        setYear(null);
        setCategory("");
        setJuridicalInstrument("");
        setSubcategory(null); // Reseta a subcategoria também
        setSituacao(""); // Reseta a situacao
        onFilterChange(null, "", null, "", ""); // Reseta todos os filtros
    };

    return (
        <div 
            className={styles.container}
            style={{ 
                display: 'flex', 
                alignItems: 'center',  // Alinha verticalmente no centro
                justifyContent: 'flex-start', // Mantém o botão e filtros alinhados na linha
                gap: '16px', // Espaçamento entre os elementos
                padding: '8px', // Adiciona espaçamento ao redor dos elementos
            }}
        >
            <Button
                variant="contained"
                color="primary"
                onClick={handleReset}
                sx={{
                    height: '100%', // Faz o botão ocupar a altura dos selects
                    marginRight: 2,  // Ajuste de espaçamento direito
                }}
            >
                Resetar
            </Button>

            {/* <div className={styles.title}>
                <h1>Filtros:</h1>
            </div> */}

            {/* Filtro para Situação com animação de hover */}
            <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                whileHover={{ scale: 1.05 }} // Adiciona a animação de hover
                transition={{ duration: 0.3 }}
            >
                <select className={styles.select} value={situacao} onChange={handleSituacaoChange}>
                    <option value="">Situação</option>
                    <option value={CONSTANTES.FILTER_ANDAMENTO}>Andamento</option>
                    <option value={CONSTANTES.FILTER_CONSUMADAS}>Consumadas</option>
                </select>
            </motion.div>

            {/* Filtro para Ano com animação de hover */}
            <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                whileHover={{ scale: 1.05 }} // Adiciona a animação de hover
                transition={{ duration: 0.3 }}
            >
                <select className={styles.select} value={year ?? ""} onChange={handleYearChange}>
                    <option value="">Ano</option>
                    <option value={CONSTANTES.FILTER_ANO_2023}>2023</option>
                    <option value={CONSTANTES.FILTER_ANO_2024}>2024</option>
                    <option value={CONSTANTES.FILTER_ANO_2025}>2025</option>
                </select>
            </motion.div>

            {/* Filtro para Categoria com animação de hover */}
            <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                whileHover={{ scale: 1.05 }} // Adiciona a animação de hover
                transition={{ duration: 0.3 }}
            >
                <select className={styles.select} value={category} onChange={handleCategoryChange}>
                    <option value="">Categoria</option>
                    <option value={CONSTANTES.FILTER_PRIVADO}>Entes Privados</option>
                    <option value={CONSTANTES.FILTER_PUBLICO}>Entes Públicos</option>
                    <option value={CONSTANTES.FILTER_ESTADOS_MUNICIPIOS}>Estados e Municípios</option>
                    <option value={CONSTANTES.FILTER_OFERTAS_EMPREGOS}>Ofertas de Emprego</option>
                    <option value={CONSTANTES.FILTER_CONTRATADOS}>Contratados</option>
                </select>
            </motion.div>

            {/* Select para Instrumento Jurídico com animação de hover */}
            <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                whileHover={{ scale: 1.05 }} // Adiciona a animação de hover
                transition={{ duration: 0.3 }}
            >
                <select className={styles.select} value={juridicalInstrument} onChange={handleJuridicalInstrumentChange}>
                    <option value="">Instrumento Jurídico</option>
                    <option value="ACT">ACT</option>
                    <option value="Outro">Outro Instrumento</option>
                </select>
            </motion.div>

            {/* Condicional para renderizar o select de subcategorias com animação de hover */}
            {juridicalInstrument === "ACT" && (
                <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    whileHover={{ scale: 1.05 }} // Adiciona a animação de hover
                    transition={{ duration: 0.3 }}
                >
                    <select className={styles.select} value={subcategory ?? ""} onChange={handleSubcategoryChange}>
                        <option value="">Sub Categoria de ACT</option>
                        <option value="ACT_TERMO_ADITIVO">Termo Aditivo</option>
                    </select>
                </motion.div>
            )}
        </div>
    );
};

export default FiltroDashboard;
