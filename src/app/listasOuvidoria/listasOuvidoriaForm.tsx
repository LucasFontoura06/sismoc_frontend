"use client";

import { setUF, setTotalNegativos, resetForm, setDataRetorno, setDataGeracao, setDataEnvio, submitForm, setCidade, setArquivoUrl, setTotalCandidatos, setParceiroSelecionado, setCargoSelecionado, setAbaAtiva, setTotalInteressados, setVagasSelecionadas, setPbf, listasSchema, setValues } from '@/lib/features/listasOuvidoria/listasSlice';
import { Box, Button, Card, CardActions, CardContent, CardHeader, Checkbox, FormControlLabel } from '@mui/material';
import { getCidade, getVagas, submitCadastroOuvidoria, calcularTotalPostos } from '@/lib/features/listasOuvidoria/listasAction';
import { convertParceiroDropdown, convertUFDropdown, convertVagasDropdown } from '@/common/utils';
import { Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import { selectVagas } from '@/lib/features/listasOuvidoria/listasSlice';
import { fetchParceiro } from '@/lib/features/parceiro/parceiroActions';
import { useAppSelector, useAppDispatch } from '@/lib/hooks';
import SelectChipForm from '@/components/selectChipForm';
import Grid from "@mui/material/Unstable_Grid2/Grid2";
import Loading from "@/components/template/loading";
import { useRef, useEffect, useState } from 'react';
import FileInputForm from '@/components/fileInput';
import { CONSTANTES } from '@/common/constantes';
import SelectForm from '@/components/selectForm';
import { useTheme } from '@mui/material/styles';
import InputForm from '@/components/inputForm';
import CustomAlerts from '@/components/alert';
import AddIcon from '@mui/icons-material/Add';
import DataInput from '@/components/data';
import VagaForm from '../vaga/vagaForm';
import dayjs from 'dayjs';

interface CadastroOuvidoriaFormProps {
    isEditing?: boolean;
    showValidationErrors?: boolean;
}

const CadastroOuvidoriaForm: React.FC<CadastroOuvidoriaFormProps> = ({ 
    isEditing = false,
    showValidationErrors = false 
}) => {
    const [alert, setAlert] = useState<{ severity: "success" | "info" | "warning" | "error", title: string, message: string } | null>(null);
    const { values, touched, errors, loading, validForm, abaAtiva, successListasOuvidoria } = useAppSelector((state) => state.listasOuvidoria);
    const theme = useTheme();
    const dispatch = useAppDispatch();
    const [file, setFile] = useState<File | null>(null);
    const fileInputRef = useRef<HTMLInputElement | null>(null);
    const cargos = useAppSelector((state) => state.listasOuvidoria.cargos);
    const cidades = useAppSelector((state) => state.listasOuvidoria.cidades);
    const parceiros = useAppSelector((state) => state.listasOuvidoria.parceiros);
    const vagas = useAppSelector(selectVagas);
    const [openVagaPopup, setOpenVagaPopup] = useState(false);
    const [showErrors, setShowErrors] = useState(false);
    const shouldShowErrors = showValidationErrors || showErrors;

    useEffect(() => {
        setShowErrors(showValidationErrors);
    }, [showValidationErrors]);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile = e.target.files?.[0];
        if (selectedFile) {
            setFile(selectedFile);
            dispatch(setArquivoUrl(selectedFile.name)); // Salvando o nome do arquivo
        } else {
            setFile(null);
            dispatch(setArquivoUrl(''));
        }
    };

    const handleUFChange = (value: string) => {
        dispatch(setUF(value));
    };

    const getDayjsValue = (value: any) => {
        if (!value || value === 'null' || value === 'undefined') return null;
        const date = dayjs(value);
        return date.isValid() ? date : null;
    };

    const handleDateChange = (dispatchAction: any) => (date: any) => {
        const selectedDate = date ? dayjs(date) : null;
        if (selectedDate && selectedDate.isValid()) {
            dispatch(dispatchAction(selectedDate.format()));
        } else {
            dispatch(dispatchAction(null));
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setShowErrors(true);
        dispatch(submitForm());

        try {
            // Valida todos os campos
            await listasSchema.validate(values, { abortEarly: false });
            
            // Verifica se tem arquivo
            if (!file) {
                dispatch(setArquivoUrl('')); // Força o estado do arquivo para vazio para mostrar erro
                return;
            }

            // Se passou por todas as validações, envia o formulário
            await dispatch(submitCadastroOuvidoria({
                file,
                values,
                cidades,
                parceiros,
                vagas,
                cargos
            })).unwrap();
            
            // Limpa o formulário somente após o sucesso
            setTimeout(() => {
                dispatch(resetForm());
                setShowErrors(false);
            }, 100);
            
        } catch (error) {
            // Apenas mantém showErrors como true para mostrar os campos em vermelho
            console.error('Erro de validação:', error);
        }
    };


    useEffect(() => {
        if (abaAtiva === CONSTANTES.TAB_TWO_LISTAS) {
            dispatch(fetchParceiro());
            dispatch(getVagas());
        }
    }, [abaAtiva, dispatch]);

    useEffect(() => {
        if (values.uf) {
            dispatch(getCidade(values.uf));
        }
    }, [values.uf, dispatch]);
    

    useEffect(() => {
        if (successListasOuvidoria) {
            setAlert({
                severity: "success",
                title: "Sucesso",
                message: "Formulário enviado com sucesso!"
            });
            dispatch(resetForm());
            dispatch(setAbaAtiva(CONSTANTES.TAB_ONE_LISTAS));
        }
    }, [successListasOuvidoria, dispatch]);

    useEffect(() => {
        if (isEditing) {
            dispatch(getVagas());
        }
    }, [isEditing, dispatch]);

    useEffect(() => {
        if (!isEditing && (abaAtiva === CONSTANTES.TAB_ONE_LISTAS || successListasOuvidoria)) {
            dispatch(resetForm());
        }
    }, [abaAtiva, successListasOuvidoria, isEditing, dispatch]);

    return (
        <Box component="form" m={4} sx={{ flexGrow: 1 }}>
            {loading ? <Loading open={loading} /> : null}
            {alert && (
                <CustomAlerts
                    severity={alert.severity}
                    title={alert.title}
                    message={alert.message}
                />
            )}
            <Card 
                elevation={0}
                sx={{
                    backgroundColor: theme.palette.mode === 'dark' ? '#242833' : '#ffffff',
                }}
            >
                {!isEditing && (
                    <CardHeader 
                        title={CONSTANTES.LBL_LISTAS_OUVI_TITLE}
                        sx={{
                            backgroundColor: theme.palette.mode === 'dark' ? '#1a1a1a' : '#f5f5f5',
                            color: theme.palette.mode === 'dark' ? '#ffffff' : '#000000',
                            '& .MuiTypography-root': {
                                fontWeight: 'bold',
                                fontSize: '1.25rem',
                            },
                        }}
                    />
                )}
                <CardContent>
                    <Grid container spacing={2}>
                        {!isEditing && (
                            <Grid xs={8} md={3}>
                                <FileInputForm
                                    label={`* ${CONSTANTES.LBL_LISTAS_OUVI_ARQUIVO}`}
                                    type="file"
                                    onChange={handleFileChange}
                                    inputRef={fileInputRef}
                                    isInvalid={showErrors && touched.arquivoUrl && Boolean(errors.arquivoUrl)}
                                    msgError={showErrors && touched.arquivoUrl ? errors.arquivoUrl : false}
                                />
                            </Grid>
                        )}
                        <Grid xs={8} md={3}>
                            <DataInput
                                label={`* ${CONSTANTES.LBL_LISTAS_OUVI_DATA_ENVIO}`}
                                value={getDayjsValue(values.dataEnvio)}
                                disableFuture={true}
                                onChange={(date) => handleDateChange(setDataEnvio)(date)}
                                isInvalid={showErrors && touched.dataEnvio && Boolean(errors.dataEnvio)}
                                msgError={showErrors && touched.dataEnvio ? errors.dataEnvio : false}
                            />
                        </Grid>
                        <Grid xs={8} md={3}>
                            <DataInput
                                label={`* ${CONSTANTES.LBL_LISTAS_OUVI_DATA_GERACAO}`}
                                value={getDayjsValue(values.dataGeracao)}
                                disableFuture={true}
                                onChange={(date) => handleDateChange(setDataGeracao)(date)}
                                isInvalid={showErrors && touched.dataGeracao && Boolean(errors.dataGeracao)}
                                msgError={showErrors && touched.dataGeracao ? errors.dataGeracao : false}
                            />
                        </Grid>
                        <Grid xs={8} md={3}>
                            <DataInput
                                label={CONSTANTES.LBL_LISTAS_OUVI_DATA_RETORNO}
                                value={getDayjsValue(values.dataRetorno)}
                                disableFuture={true}
                                onChange={(date) => handleDateChange(setDataRetorno)(date)}
                                isInvalid={touched.dataRetorno && Boolean(errors.dataRetorno)}
                                msgError={touched.dataRetorno ? errors.dataRetorno : false}
                            />
                        </Grid>
                        <Grid xs={6} md={3}>
                            <InputForm
                                label={CONSTANTES.LBL_LISTAS_OUVI_TOTAL_NEGATI}
                                type="number"
                                value={values.totalNegativas}
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => dispatch(setTotalNegativos(Number(e.target.value)))}
                                isInvalid={touched.totalNegativas && Boolean(errors.totalNegativas)}
                                msgError={touched.totalNegativas ? errors.totalNegativas : false}
                            />
                        </Grid>
                        <Grid xs={6} md={3}>
                            <InputForm
                                label={CONSTANTES.LBL_LISTAS_OUVI_TOTAL_CANDIDA}
                                type="number"
                                value={values.totalCandidatos}
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => dispatch(setTotalCandidatos(Number(e.target.value)))}
                                isInvalid={touched.totalCandidatos && Boolean(errors.totalCandidatos)}
                                msgError={touched.totalCandidatos ? errors.totalCandidatos : false}
                            />
                        </Grid>
                        <Grid xs={6} md={3}>
                            <InputForm
                                label={CONSTANTES.LBL_LISTAS_OUVI_TOTAL_INTERE}
                                type="number"
                                value={values.totalInteressados}
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => dispatch(setTotalInteressados(Number(e.target.value)))}
                                isInvalid={touched.totalInteressados && Boolean(errors.totalInteressados)}
                                msgError={touched.totalInteressados ? errors.totalInteressados : false}
                            />
                        </Grid>
                        <Grid xs={6} md={3}>
                            <SelectForm
                                itens={convertUFDropdown()}
                                label={`* ${CONSTANTES.LBL_UF}`}
                                value={values.uf}
                                onChange={(event: any) => handleUFChange(event.target.value)}
                                isInvalid={showErrors && touched.uf && Boolean(errors.uf)}
                                msgError={showErrors && touched.uf ? errors.uf : false}
                            />
                        </Grid>
                        <Grid xs={6} md={5}>
                            <SelectForm
                                itens={cidades}
                                disabled={!cidades.length}
                                label={`* ${CONSTANTES.LBL_LISTAS_OUVI_MUNICIPIO}`}
                                value={values.cidade}
                                onChange={(event: any) => dispatch(setCidade(event.target.value))}
                                isInvalid={shouldShowErrors && touched.cidade && Boolean(errors.cidade)}
                                msgError={shouldShowErrors && touched.cidade ? errors.cidade : false}
                            />
                        </Grid>
                        <Grid xs={6} md={5}>
                            <SelectForm
                                id="parceiro"
                                label={`* ${CONSTANTES.LBL_PARC}`}
                                itens={convertParceiroDropdown(parceiros)}
                                value={values.parceiroSelecionado}
                                onChange={(event: any) => dispatch(setParceiroSelecionado(event.target.value))}
                                isInvalid={showErrors && touched.parceiroSelecionado && Boolean(errors.parceiroSelecionado)}
                                msgError={showErrors && touched.parceiroSelecionado ? errors.parceiroSelecionado : false}
                            />
                        </Grid>
                        <Grid xs={6} md={2}>
                            <div style={{ 
                                border: showErrors && !values.pbf.comPbf && !values.pbf.semPbf ? '1px solid #d32f2f' : 'none',
                                padding: '8px',
                                borderRadius: '4px'
                            }}>
                                <FormControlLabel
                                    control={
                                        <Checkbox
                                            checked={values.pbf.comPbf}
                                            onChange={(e) => {
                                                if (e.target.checked) {
                                                    dispatch(setPbf({ type: 'comPbf', value: true }));
                                                    dispatch(setPbf({ type: 'semPbf', value: false }));
                                                } else {
                                                    dispatch(setPbf({ type: 'comPbf', value: false }));
                                                }
                                            }}
                                        />
                                    }
                                    label="Com PBF"
                                />
                                <FormControlLabel
                                    control={
                                        <Checkbox
                                            checked={values.pbf.semPbf}
                                            onChange={(e) => {
                                                if (e.target.checked) {
                                                    dispatch(setPbf({ type: 'semPbf', value: true }));
                                                    dispatch(setPbf({ type: 'comPbf', value: false }));
                                                } else {
                                                    dispatch(setPbf({ type: 'semPbf', value: false }));
                                                }
                                            }}
                                        />
                                    }
                                    label="Sem PBF"
                                />
                                {showErrors && !values.pbf.comPbf && !values.pbf.semPbf && (
                                    <div style={{ 
                                        color: '#d32f2f', 
                                        fontSize: '0.75rem',
                                        marginTop: '3px'
                                    }}>
                                        Selecione uma opção de PBF
                                    </div>
                                )}
                            </div>
                        </Grid>
                        <Grid xs={12} md={12}>
                            <SelectChipForm
                                id="vaga"                           
                                label={`* ${CONSTANTES.LBL_VAGA}`}
                                itens={convertVagasDropdown(vagas)}
                                value={values.vagasSelecionadas}
                                onChange={async (event: any) => {
                                    const vagasSelecionadas = event.target.value;
                                    dispatch(setVagasSelecionadas(vagasSelecionadas));
                                    
                                    // Calcular total de postos quando as vagas são selecionadas
                                    const totalPostos = await dispatch(calcularTotalPostos(vagasSelecionadas)).unwrap();
                                    
                                    // Atualizar os valores com o novo total de postos
                                    dispatch(setValues({
                                        ...values,
                                        vagasSelecionadas,
                                        totais: {
                                            ...values.totais,
                                            totalPostos
                                        }
                                    }));
                                }}
                                isInvalid={showErrors && touched.vagasSelecionadas && Boolean(errors.vagasSelecionadas)}
                                msgError={showErrors && touched.vagasSelecionadas ? errors.vagasSelecionadas : false}
                            />
                        </Grid>
                        <Grid xs={4} md={2}>
                            <Button
                                variant="contained"
                                startIcon={<AddIcon />}
                                onClick={() => setOpenVagaPopup(true)}
                                sx={{ 
                                    mt: 2,
                                    backgroundColor: theme.palette.mode === 'dark' ? '#b530b8' : '#1e8cfa',
                                    '&:hover': {
                                        backgroundColor: theme.palette.mode === 'dark' ? '#8a248c' : '#1976d2',
                                    },
                                }}
                            >
                                {CONSTANTES.LBL_ADICIONAR_VAGA}
                            </Button>
                        </Grid>
                    </Grid>
                </CardContent>
                {!isEditing && (
                    <CardActions sx={{ justifyContent: "flex-end" }}>
                        <Button
                            variant="contained"
                            onClick={handleSubmit}
                            disabled={loading}
                            sx={{ 
                                backgroundColor: theme.palette.mode === 'dark' ? '#b530b8' : '#1e8cfa',
                                '&:hover': {
                                    backgroundColor: theme.palette.mode === 'dark' ? '#8a248c' : '#1976d2',
                                },
                                '&.Mui-disabled': {
                                    backgroundColor: theme.palette.mode === 'dark' ? '#424242' : '#e0e0e0',
                                }
                            }}
                        >
                            {CONSTANTES.LBL_CA_CADAS}
                        </Button>
                    </CardActions>
                )}
            </Card>

            <Dialog
                open={openVagaPopup}
                onClose={() => setOpenVagaPopup(false)}
                fullWidth={true}
                maxWidth="lg"
                sx={{
                    '& .MuiDialog-paper': {
                        backgroundColor: theme.palette.mode === 'dark' ? '#242833' : '#ffffff',
                    }
                }}
            >
                <DialogTitle sx={{
                    backgroundColor: theme.palette.mode === 'dark' ? '#1a1a1a' : '#f5f5f5',
                    color: theme.palette.mode === 'dark' ? '#ffffff' : '#000000',
                }}>
                    {CONSTANTES.LBL_ADICIONAR_VAGA}
                </DialogTitle>
                <DialogContent sx={{
                    backgroundColor: theme.palette.mode === 'dark' ? '#242833' : '#ffffff',
                    color: theme.palette.mode === 'dark' ? '#ffffff' : '#000000',
                }}>
                    <VagaForm />
                </DialogContent>
                <DialogActions sx={{
                    backgroundColor: theme.palette.mode === 'dark' ? '#242833' : '#ffffff',
                }}>
                    <Button 
                        onClick={() => setOpenVagaPopup(false)}
                        sx={{ 
                            backgroundColor: theme.palette.mode === 'dark' ? '#b530b8' : '#1e8cfa',
                            color: '#ffffff',
                            '&:hover': {
                                backgroundColor: theme.palette.mode === 'dark' ? '#8a248c' : '#1976d2',
                            }
                        }}
                    >
                        Fechar
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
}

export default CadastroOuvidoriaForm;
