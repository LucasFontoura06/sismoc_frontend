import { ref, uploadBytesResumable, getDownloadURL, deleteObject } from "firebase/storage";
import { doc, getDoc, deleteDoc } from "firebase/firestore";
import { ACTIONS_TYPE } from "../../../common/actionsType";
import { CONSTANTES } from "../../../common/constantes";
import { storage } from '../../../app/firebaseConfig';  
import { createAsyncThunk } from "@reduxjs/toolkit";
import { db } from '../../../app/firebaseConfig';
import axios from "axios";
import { setLoading } from "./listasSlice";
import { Timestamp } from 'firebase/firestore';
import { format } from 'date-fns';

// Ação para fazer o upload de arquivo
export const uploadArquivo = createAsyncThunk<string, File>(
    ACTIONS_TYPE.UPLOAD_ARQUIVO,
    async (file, { rejectWithValue }) => {
        try {
            const currentYear = new Date().getFullYear();
            const storagePath = `listasOuvidorias/${currentYear}/${file.name}`;
            const storageRef = ref(storage, storagePath);

            const uploadTask = await uploadBytesResumable(storageRef, file);
            const downloadURL = await getDownloadURL(uploadTask.ref);

            return downloadURL;  // Retorna a URL do arquivo após o upload bem-sucedido
        } catch (error: unknown) {
            if (error instanceof Error) {
                return rejectWithValue(CONSTANTES.ERROR_UPLOAD_ARQUIVO);
            }
            return rejectWithValue(CONSTANTES.ERROR_UPLOAD_ARQUIVO);
        }
    }
);

// Ação para salvar o formulário no Firestore
export const saveFormulario = createAsyncThunk<any, { usuario: any }>(
    ACTIONS_TYPE.SAVE_FORMULARIO,
    async ({ usuario }, { rejectWithValue }) => {
        try {
            // Grava o objeto 'usuario' no Firestore
            await axios.post(`${CONSTANTES.API_URL}/listasOuvidoria`, usuario.id);
            return usuario;  // Retorna os dados gravados no Firestore
        } catch (error: any) {
            return rejectWithValue(CONSTANTES.ERROR_SAVE_FORMULARIO);
        }
    }
);

// Ação para adicionar uma lista com a URL do arquivo
export const addLista = createAsyncThunk<any, any>(
    ACTIONS_TYPE.ADD_LISTA,
    async (lista, { rejectWithValue }) => {
        try {
            const response = await axios.post(`${CONSTANTES.API_URL}/listasOuvidoria`, lista);
            // Atualiza o documento com seu próprio ID
            const listaComId = { ...response.data, id: response.data.id };
            await axios.patch(`${CONSTANTES.API_URL}/listasOuvidoria/${response.data.id}`, listaComId);
            return { message: 'Lista cadastrada com sucesso!', lista: listaComId };
        } catch (error) {
            console.error('Erro ao adicionar lista:', error);
            if (error instanceof Error) {
                return rejectWithValue(error.message || CONSTANTES.ERROR_ADICIONAR_LISTA);
            } else {
                return rejectWithValue(CONSTANTES.ERROR_ADICIONAR_LISTA);
            }
        }
    }
);

export const updateLista = createAsyncThunk(
    'listas/updateLista',
    async({ id, values }: { id: string, values: any }, { getState, rejectWithValue }) => {
        try {
            const state: any = getState();
            
            const cidade = state.listasOuvidoria.cidades.find(
                (c: any) => c.codigo === values.cidade
            );
            
            const parceiro = state.listasOuvidoria.parceiros.find(
                (p: any) => p.id === values.parceiroSelecionado
            );

            // Calcular total de postos
            const vagasIds = values.vagasSelecionadas;
            const todasVagas = state.listasOuvidoria.vagas;
            const vagasSelecionadas = todasVagas.filter((vaga: any) => 
                vagasIds.includes(vaga.id)
            );
            const totalPostos = vagasSelecionadas.reduce((total: number, vaga: any) => {
                return total + (Number(vaga.postos) || 0);
            }, 0);

            const listaFormatada = {
                arquivo: {
                    nome: values.arquivo.nome,
                    url: values.arquivo.url
                },
                cidade: {
                    descricao: cidade?.label || '',
                    id: values.cidade,
                    uf: values.uf
                },
                datas: {
                    dataCadastro: values.datas?.dataCadastro ? formatarDataBrasileira(values.datas.dataCadastro) : null,
                    dataEnvio: values.dataEnvio ? formatarDataBrasileira(values.dataEnvio) : null,
                    dataGeracao: values.dataGeracao ? formatarDataBrasileira(values.dataGeracao) : null,
                    dataRetorno: values.dataRetorno ? formatarDataBrasileira(values.dataRetorno) : null
                },
                parceiro: {
                    descricao: parceiro?.nome || '',
                    id: values.parceiroSelecionado
                },
                pbf: {
                    comPbf: values.pbf.comPbf,
                    semPbf: values.pbf.semPbf
                },
                totais: {
                    totalCandidatos: Number(values.totalCandidatos) || 0,
                    totalInteressados: Number(values.totalInteressados) || 0,
                    totalNegativas: Number(values.totalNegativas) || 0,
                    totalPostos: totalPostos
                },
                vagas: values.vagasSelecionadas,
                id: id
            };
            
            const response = await axios.patch(
                `${CONSTANTES.API_URL}/listasOuvidoria/${id}`,
                listaFormatada
            );
            
            return response.data;
        } catch (error) {
            console.error('Erro ao atualizar lista:', error);
            return rejectWithValue(CONSTANTES.ERROR_UPDATE_LISTA);
        }
    }
);

// Ação para buscar cidades com base no UF (IBGE)
export const getCidade = createAsyncThunk<any, string>(
    ACTIONS_TYPE.GET_CIDADE,
    async (uf, { rejectWithValue }) => {
        try {
            const resp = await axios.get(`${CONSTANTES.API_IBGE.replace('<UF>', uf)}`);
            return resp.data;
        } catch (error) {
            return rejectWithValue(CONSTANTES.ERROR_GET_CIDADE);
        }
    }
);

// Ação para buscar a lista de usuários
export const fetchListasOuvidoria = createAsyncThunk(
    ACTIONS_TYPE.LIST_LISTAS,
    async (_, { rejectWithValue }) => {
        try {
            const resp = await axios.get(`${CONSTANTES.API_URL}/listasOuvidoria`);
            return resp.data;
        } catch (error: any) {
            // Caso ocorra um erro, retorna a constante de erro apropriada
            return rejectWithValue(error.response?.data?.message || CONSTANTES.ERROR_LIST_USER);
        }
    }
);

// Ação para buscar os cargos
export const getCargos = createAsyncThunk(
    ACTIONS_TYPE.GET_CARGOS,
    async (_, { rejectWithValue }) => {
        try {
            const resp = await axios.get(`${CONSTANTES.API_URL}/cargos`);
            return resp.data;
        } catch (error) {
            return rejectWithValue(CONSTANTES.ERROR_GET_CARGOS);
        }
    }
);

// Adicione esta nova action
export const fetchListaById = createAsyncThunk(
    'listas/fetchById',
    async (id: string) => {
        try {
            const response = await axios.get(`${CONSTANTES.API_URL}/listasOuvidoria/${id}`);
            
            if (!response.data) {
                throw new Error('Lista não encontrada');
            }

            return response.data;
        } catch (error) {
            console.error('Erro ao buscar lista:', error);
            throw error;
        }
    }
);

type Cargo = {
    id: string;
    descricao: string;
};

interface SubmitCadastroOuvidoriaParams {
    file: File;
    values: any; // Idealmente, defina uma interface específica para values
    cargos: Cargo[];
    cidades: any[]; // Idealmente, defina uma interface específica para cidades
    parceiros: { id: string; nome: string; }[];
    vagas: any[]; // Idealmente, defina uma interface específica para vagas
}

// Modifique a função formatarDataBrasileira para o formato específico desejado
const formatarDataBrasileira = (date: Date | string | null) => {
    if (!date) return null;
    
    try {
        const dataObj = typeof date === 'string' ? new Date(date) : date;
        
        // Verifica se a data é válida e não é uma data futura
        if (isNaN(dataObj.getTime()) || dataObj > new Date()) {
            console.error('Data inválida ou futura:', date);
            return null;
        }
        
        return format(dataObj, 'dd/MM/yyyy');
        
    } catch (error) {
        console.error('Erro ao formatar data:', error);
        return null;
    }
};

export const submitCadastroOuvidoria = createAsyncThunk(
    'listas/submitCadastroOuvidoria',
    async ({ file, values, cidades, parceiros, vagas, cargos }: SubmitCadastroOuvidoriaParams, { dispatch }) => {
        dispatch(setLoading(true));

        try {
            const arquivoUrl = await dispatch(uploadArquivo(file)).unwrap();
            const cidadeSelecionada = cidades.find((cidade: any) => cidade.codigo === values.cidade);

            const listasOuvidoriaData = {
                cidade: {
                    id: values.cidade,
                    descricao: cidadeSelecionada?.label || '',
                    uf: values.uf
                },
                parceiro: {
                    id: values.parceiroSelecionado,
                    descricao: parceiros.find(parceiro => parceiro.id === values.parceiroSelecionado)?.nome || '',
                },
                datas: {
                    dataCadastro: formatarDataBrasileira(new Date()),
                    dataEnvio: values.dataEnvio ? formatarDataBrasileira(values.dataEnvio) : null,
                    dataGeracao: values.dataGeracao ? formatarDataBrasileira(values.dataGeracao) : null,
                    dataRetorno: values.dataRetorno ? formatarDataBrasileira(values.dataRetorno) : null
                },
                totais: {
                    totalCandidatos: values.totalCandidatos === '' ? null : Number(values.totalCandidatos),
                    totalInteressados: values.totalInteressados === '' ? null : Number(values.totalInteressados),
                    totalNegativas: values.totalNegativas === '' ? null : Number(values.totalNegativas),
                },
                vagas: values.vagasSelecionadas,
                arquivo: {
                    nome: file?.name || '',
                    url: arquivoUrl
                },
                pbf: {
                    comPbf: values.pbf.comPbf,
                    semPbf: values.pbf.semPbf
                }
            }; 

            const response = await dispatch(addLista(listasOuvidoriaData)).unwrap();
            return 'Formulário enviado com sucesso!';
        } catch (error) {
            console.error('Erro no submitCadastroOuvidoria:', error);
            dispatch(setLoading(false));
            throw error;
        }
    }
);

export const deleteLista = createAsyncThunk(
    'listas/deleteLista',
    async (id: string, { rejectWithValue }) => {
        try {
            // Primeiro, buscar os dados da lista para obter o nome do arquivo
            const response = await axios.get(`${CONSTANTES.API_URL}/listasOuvidoria/${id}`);
            const listaData = response.data;

            // Deletar o arquivo do Storage
            if (listaData?.arquivo?.nome) {
                const storageRef = ref(storage, `listasOuvidorias/2024/${listaData.arquivo.nome}`);
                await deleteObject(storageRef);
            }

            // Deletar o registro da API
            await axios.delete(`${CONSTANTES.API_URL}/listasOuvidoria/${id}`);
            return id;
        } catch (error: any) {
            console.error('Erro ao deletar lista:', error.response?.data || error.message);
            return rejectWithValue(error.response?.data?.message || 'Erro ao deletar lista');
        }
    }
);

// Ação para buscar vagas
export const getVagas = createAsyncThunk<any, void>(
    ACTIONS_TYPE.GET_VAGAS,
    async (_, { rejectWithValue }) => {
        try {
            const resp = await axios.get(`${CONSTANTES.API_URL}/vagas`);
            
            
            // Ajuste o mapeamento para corresponder à estrutura do Firebase
            const vagasFormatadas = resp.data.map((vaga: any) => ({
                id: vaga.id,
                cargo: vaga.cargo,
                endereco: vaga.endereco,
                postos: vaga.postos
            }));
            
            
            return vagasFormatadas;
            
        } catch (error) {
            console.error('Erro ao buscar vagas:', error);
            return rejectWithValue(CONSTANTES.ERROR_GET_VAGAS);
        }
    }
);

// Função para buscar detalhes das vagas e calcular total de postos
export const calcularTotalPostos = createAsyncThunk(
    'listas/calcularTotalPostos',
    async (vagasIds: string[], { getState, rejectWithValue }) => {
        try {
            console.log('IDs das vagas selecionadas:', vagasIds);
            
            // Pegar as vagas do estado
            const state: any = getState();
            const todasVagas = state.listasOuvidoria.vagas;
            
            // Filtrar apenas as vagas selecionadas
            const vagasSelecionadas = todasVagas.filter((vaga: any) => 
                vagasIds.includes(vaga.id)
            );
            
            console.log('Vagas selecionadas:', vagasSelecionadas);
            
            // Calcular o total de postos
            const totalPostos = vagasSelecionadas.reduce((total: number, vaga: any) => {
                return total + (Number(vaga.postos) || 0);
            }, 0);
            
            console.log('Total de postos calculado:', totalPostos);
            
            return totalPostos;
        } catch (error) {
            console.error('Erro ao calcular total de postos:', error);
            return rejectWithValue('Erro ao calcular total de postos');
        }
    }
);

