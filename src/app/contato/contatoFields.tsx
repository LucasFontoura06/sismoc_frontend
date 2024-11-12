import { CONSTANTES } from "@/common/constantes";
import InputForm from "@/components/inputForm";
import {
  setCargo,
  setCelular,
  setEmail,
  setNome,
  setPontoFocal,
  setTelefone,
} from "@/lib/features/contato/contatoSlice";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { Checkbox, FormControlLabel } from "@mui/material";
import Grid from "@mui/material/Unstable_Grid2/Grid2";

const ContatoFields = (props: any) => {
  const dispatch = useAppDispatch();
  const { touched, errors, valuesContato, successContato, maskPhone } =
    useAppSelector((state: any) => state.contato);

  return (
    <Grid container spacing={2}>
      <Grid xs={10} md={10}>
        <InputForm
          label={`* ${CONSTANTES.LBL_NAME_PARC}`}
          name={CONSTANTES.NOME_NAME}
          value={valuesContato.nome}
          onChange={(event: any) => dispatch(setNome(event.target.value))}
          isInvalid={touched.nome && Boolean(errors.nome)}
          msgError={touched.nome ? errors.nome : false}
          tamanhoMax={150}
        />
      </Grid>
      <Grid xs={2} md={2}>
        <FormControlLabel
          control={
            <Checkbox
              checked={valuesContato.pontoFocal}
              value={valuesContato.pontoFocal}
              onChange={(event: any) =>
                dispatch(setPontoFocal(event.target.checked))
              }
              sx={{
                color: "#cbd5e1",
                "&.Mui-checked": {
                  color: "#cbd5e1",
                },
              }}
            />
          }
          label={CONSTANTES.LBL_PTO_FC_PARC}
        />
      </Grid>
      <Grid xs={12} md={12}>
        <InputForm
          label={`* ${CONSTANTES.LBL_CARGO}`}
          name="cargo"
          value={valuesContato.cargo}
          onChange={(event: any) => dispatch(setCargo(event.target.value))}
          isInvalid={touched.cargo && Boolean(errors.cargo)}
          msgError={touched.cargo ? errors.cargo : false}
          tamanhoMax={150}
        />
      </Grid>
      <Grid xs={12} md={4}>
        <InputForm
          label={`* ${CONSTANTES.LBL_EMAIL}`}
          name="email"
          value={valuesContato.email}
          onChange={(event: any) => dispatch(setEmail(event.target.value))}
          isInvalid={touched.email && Boolean(errors.email)}
          msgError={touched.email ? errors.email : false}
        />
      </Grid>
      <Grid xs={12} md={4}>
        <InputForm
          label={`* ${CONSTANTES.LBL_CEL}`}
          name="celular"
          value={valuesContato.celular}
          mask={CONSTANTES.MASK_CEL}
          onChange={(event: any) => dispatch(setCelular(event.target.value))}
          isInvalid={touched.celular && Boolean(errors.celular)}
          msgError={touched.celular ? errors.celular : false}
        />
      </Grid>
      <Grid xs={12} md={4}>
        <InputForm
          label={CONSTANTES.LBL_TEL}
          name="telefone"
          value={valuesContato.telefone}
          mask={maskPhone}
          onChange={(event: any) => dispatch(setTelefone(event.target.value))}
        />
      </Grid>
    </Grid>
  );
};

export default ContatoFields;
