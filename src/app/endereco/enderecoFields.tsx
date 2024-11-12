import { CONSTANTES } from "@/common/constantes";
import {
  convertLogradouroDropdown,
  convertUFDropdown
} from "@/common/utils";
import InputForm from "@/components/inputForm";
import SelectForm from "@/components/selectForm";
import {
  fetchEndereco,
  getCidade,
} from "@/lib/features/endereco/enderecoActions";
import {
  setBairro,
  setCEP,
  setCodMunicipio,
  setComplemento,
  setLogradouro,
  setNumero,
  setUF
} from "@/lib/features/endereco/enderecoSlice";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import Grid from "@mui/material/Unstable_Grid2/Grid2";
import { useEffect } from "react";
import { useTheme } from '@mui/material/styles';

const EnderecoFields = (props: any) => {
  const theme = useTheme();
  const dispatch = useAppDispatch();
  const {
    touched,
    errors,
    validForm,
    loading,
    valuesEndereco,
    success,
    enderecoSelecionado,
    cidades,
  } = useAppSelector((state: any) => state.endereco);

  const { abaAtiva } = useAppSelector((state: any) => state.parceiro);

  useEffect(() => {
    if (abaAtiva == CONSTANTES.TAB_TWO_PARC) {
      dispatch(fetchEndereco());
    }
  }, [abaAtiva]);

  useEffect(() => {
    if (valuesEndereco.uf) {
      dispatch(getCidade(valuesEndereco.uf));
    }
  }, [valuesEndereco.uf, dispatch]);

  const handleUFChange = (value: string) => {
    dispatch(setUF(value));
  };

  const customStyles = {
    input: {
      backgroundColor: theme.palette.mode === 'dark' ? '#242833' : '#ffffff',
      borderRadius: 1,
    },
    select: {
      backgroundColor: theme.palette.mode === 'dark' ? '#242833' : '#ffffff',
      borderRadius: 1,
    }
  };

  return (
    <Grid 
      container 
      spacing={2}
      sx={{
        padding: 2,
        backgroundColor: theme.palette.mode === 'dark' ? '#1a1a1a' : '#f5f5f5',
        borderRadius: 1,
      }}
    >
      <Grid xs={8} md={4}>
        <SelectForm
          disabled={Boolean(enderecoSelecionado !== CONSTANTES.VAZIO)}
          itens={convertLogradouroDropdown()}
          label={`* ${CONSTANTES.LBL_LOGRADOURO}`}
          value={valuesEndereco.logradouro}
          onChange={(event: any) => dispatch(setLogradouro(event.target.value))}
          isInvalid={touched.logradouro && Boolean(errors.logradouro)}
          msgError={touched.logradouro ? errors.logradouro : false}
          customStyles={customStyles.select}
        />
      </Grid>
      <Grid xs={4} md={2}>
        <InputForm
          label={CONSTANTES.LBL_NUM}
          type="number"
          value={valuesEndereco.numero}
          disabled={Boolean(enderecoSelecionado !== CONSTANTES.VAZIO)}
          onChange={(event: any) => dispatch(setNumero(event.target.value))}
          isInvalid={touched.numero && Boolean(errors.numero)}
          msgError={touched.numero ? errors.numero : false}
          sx={customStyles.input}
        />
      </Grid>
      <Grid xs={12} md={6}>
        <InputForm
          label={CONSTANTES.LBL_COMPL}
          value={valuesEndereco.complemento}
          disabled={Boolean(enderecoSelecionado !== CONSTANTES.VAZIO)}
          onChange={(event: any) => dispatch(setComplemento(event.target.value))}
          sx={customStyles.input}
        />
      </Grid>
      <Grid xs={6} md={5}>
        <InputForm
          label={`* ${CONSTANTES.LBL_BAIRRO}`}
          value={valuesEndereco.bairro}
          disabled={Boolean(enderecoSelecionado !== CONSTANTES.VAZIO)}
          onChange={(event: any) => dispatch(setBairro(event.target.value))}
          isInvalid={touched.bairro && Boolean(errors.bairro)}
          msgError={touched.bairro ? errors.bairro : false}
          sx={customStyles.input}
        />
      </Grid>
      <Grid xs={6} md={1}>
        <SelectForm
          itens={convertUFDropdown()}
          label={`* ${CONSTANTES.LBL_UF}`}
          value={valuesEndereco.uf}
          disabled={Boolean(enderecoSelecionado !== CONSTANTES.VAZIO)}
          onChange={(event: any) => handleUFChange(event.target.value)}
          isInvalid={touched.uf && Boolean(errors.uf)}
          msgError={touched.uf ? errors.uf : false}
          customStyles={customStyles.select}
        />
      </Grid>
      <Grid xs={6} md={4}>
        <SelectForm
          itens={cidades}
          disabled={!cidades.length}
          label={`* ${CONSTANTES.LBL_CIDADE}`}
          value={valuesEndereco.codMunicipio}
          onChange={(event: any) => dispatch(setCodMunicipio(event.target.value))}
          isInvalid={touched.codMunicipio && Boolean(errors.codMunicipio)}
          msgError={touched.codMunicipio ? errors.codMunicipio : false}
          customStyles={customStyles.select}
        />
      </Grid>
      <Grid xs={6} md={2}>
        <InputForm
          label={`* ${CONSTANTES.LBL_CEP}`}
          mask={CONSTANTES.MASK_CEP}
          value={valuesEndereco.cep}
          name={CONSTANTES.KEY_CEP}
          disabled={Boolean(enderecoSelecionado !== CONSTANTES.VAZIO)}
          onChange={(event: any) => dispatch(setCEP(event.target.value))}
          isInvalid={touched.cep && Boolean(errors.cep)}
          msgError={touched.cep ? errors.cep : false}
          sx={customStyles.input}
        />
      </Grid>
    </Grid>
  );
};

export default EnderecoFields;
