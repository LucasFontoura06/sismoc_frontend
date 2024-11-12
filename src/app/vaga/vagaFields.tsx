import React, { useEffect, useState } from "react";
import {
  FormControlLabel,
  Checkbox,
  Button,
  Dialog,
  DialogContent,
} from "@mui/material";
import Grid from "@mui/material/Unstable_Grid2/Grid2";
import { CONSTANTES } from "@/common/constantes";
import InputForm from "@/components/inputForm";
import SelectForm from "@/components/selectForm";
import {
  fetchEscolaridades, getCargos,
  addNovoCargo
} from "@/lib/features/vaga/vagaActions";
import {
  setCargo,
  setBairro,
  setEscolaridade,
  setPcd,
  setPostos,
  setNovoCargo
} from "@/lib/features/vaga/vagaSlice";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { convertCargosDropdown, convertUFDropdown } from "@/common/utils";
import { setCodMunicipio, setUF, } from "@/lib/features/vaga/vagaSlice";
import { getCidade } from "@/lib/features/endereco/enderecoActions";
import { useTheme } from "@mui/material/styles";

const VagaFields = (props: any) => {
  const dispatch = useAppDispatch();
  const {
    cidades,
    novoCargo,
    escolaridades,
    cargos,
    values,
    touched,
    errors,
  } = useAppSelector((state: any) => state.vaga);

  const [open, setOpen] = useState(false);
  const theme = useTheme();

  useEffect(() => {
    dispatch(fetchEscolaridades());
  }, [dispatch]);

  useEffect(() => {
    dispatch(getCargos());
  }, [dispatch]);

  const handleUFChange = (value: string) => {
    dispatch(setUF(value));
  };

  useEffect(() => {
    if (values.uf) {
      dispatch(getCidade(values.uf));
    }
  }, [values.uf, dispatch]);

  const handleAddCargo = () => {
    if (novoCargo) {
      dispatch(addNovoCargo(novoCargo)).then(() => {
        setOpen(false); // Fecha o pop-up após o novo cargo ser adicionado
      });
      dispatch(setNovoCargo("")); // Limpa o input
    }
  };

  // useEffect(() => {
  //   console.log('Cargos:', cargos);
  // }, [cargos]);

  return (
    <Grid container spacing={2}>
      <Grid xs={12} md={3}>
        <SelectForm
          id="cargosList"
          label={`* ${CONSTANTES.LBL_CARGO}`}  // O '*' indica que o campo é obrigatório
          itens={convertCargosDropdown(cargos)}
          value={values.cargo.id}  // Certifique-se de que o valor é o 'id' do cargo
          explicit={false}
          onChange={(event: any) => {
            const valorSelecionado = event.target.value;
            const cargoSelecionado = cargos.find((cargo: any) => cargo.id === valorSelecionado);
            dispatch(setCargo({ id: cargoSelecionado.id, descricao: cargoSelecionado.descricao }));
          }}
          isInvalid={touched.cargo && Boolean(errors.cargo)}
          msgError={touched.cargo ? errors.cargo : false}
        />
      </Grid>
      <Grid xs={1} md={1}>
        <Button
          variant="contained"
          onClick={() => setOpen(true)}
          sx={{ 
            backgroundColor: theme.palette.mode === 'dark' ? '#b530b8' : '#1e8cfa',
            color: '#ffffff',
            fontSize: "12px",
            '&:hover': {
              backgroundColor: theme.palette.mode === 'dark' ? '#8a248c' : '#1976d2',
            }
          }}
        >
          {CONSTANTES.BTN_NEW_CARGO.toUpperCase()}
        </Button>
      </Grid>
      <Grid xs={12} md={3}>
        <SelectForm
          id="escolaridade"
          label={`* ${CONSTANTES.LBL_ESCO}`}
          itens={escolaridades.map((escolaridade: any) => ({
            label: escolaridade.descricao,
            value: escolaridade.id,
          }))}
          value={values.escolaridade}
          explicit={true}
          onChange={(event: any) => dispatch(setEscolaridade({ id: event.target.value, descricao: "" }))}
          isInvalid={touched.escolaridade && Boolean(errors.escolaridade)}
          msgError={touched.escolaridade ? errors.escolaridade : false}
        />
      </Grid>
      <Grid xs={6} md={1}>
        <InputForm
          id="postos"
          label="* Postos"
          type="number"
          value={values.postos}
          onChange={(event: any) => dispatch(setPostos(event.target.value))}
          isInvalid={touched.postos && Boolean(errors.postos)}
          msgError={touched.postos ? errors.postos : false}
        />
      </Grid>
      <Grid xs={2} md={2}>
        <FormControlLabel
          control={
            <Checkbox
              id="pcd"
              checked={values.pcd}
              onChange={(event: any) => dispatch(setPcd(event.target.checked))}
              sx={{
                color: "#cbd5e1",
                "&.Mui-checked": {
                  color: "#cbd5e1",
                },
              }}
            />
          }
          label="Vaga PCD"
          sx={{
            color: "#cbd5e1",
          }}
        />
      </Grid>
      <Grid xs={6} md={1}>
        <SelectForm
          itens={convertUFDropdown()}
          label={`* ${CONSTANTES.LBL_UF}`}
          value={values.uf}
          explicit={true}
          onChange={(event: any) => handleUFChange(event.target.value)}
          isInvalid={touched.uf && Boolean(errors.uf)}
          msgError={touched.uf ? errors.uf : false}
        />
      </Grid>
      <Grid xs={6} md={4}>
        <SelectForm
          id = 'Cidade'
          itens={cidades}
          disabled={!cidades.length}
          label={`* ${CONSTANTES.LBL_CIDADE}`}
          value={values.codMunicipio}
          onChange={(event: any) =>
            dispatch(setCodMunicipio(event.target.value),
            console.log(values.codMunicipio, cidades))
          }
          isInvalid={touched.codMunicipio && Boolean(errors.codMunicipio)}
          msgError={touched.codMunicipio ? errors.codMunicipio : false}
        />
      </Grid>
      <Grid xs={6} md={4}>
        <InputForm
          id="Bairro"
          label={CONSTANTES.LBL_BAIRRO}
          value={values.bairro}
          onChange={(event: any) => dispatch(setBairro(event.target.value))}
          isInvalid={touched.bairro && Boolean(errors.bairro)}
          msgError={touched.bairro ? errors.bairro : false}
        />
        <div>
          <strong>{Boolean(errors.bairro)}</strong>
        </div>
      </Grid>

      <Dialog
        fullWidth={true}
        maxWidth={"lg"}
        open={open}
        sx={{ margin: 0, padding: 0 }}
        onClose={() => setOpen(false)}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogContent>
          <Grid xs={12} md={8}>
            <InputForm
              id="novoCargo"
              label="Adicionar novo cargo"
              type="text"
              value={novoCargo}
              onChange={(event: any) => {
                dispatch(setNovoCargo(event.target.value));
              }}
              isInvalid={touched.novoCargo && Boolean(errors.novoCargo)}
              msgError={touched.novoCargo ? errors.novoCargo : false}
              disabled={false} // antes: {values.cargo.id !== CONSTANTES.VAZIO}
            />
          </Grid>
          <Grid xs={12} md={4}>
            <Button
              variant="contained"
              onClick={handleAddCargo}
              sx={{ 
                backgroundColor: theme.palette.mode === 'dark' ? '#b530b8' : '#1e8cfa',
                color: '#ffffff',
                '&:hover': {
                  backgroundColor: theme.palette.mode === 'dark' ? '#8a248c' : '#1976d2',
                },
                ml: 1,
              }}
            >
              NOVO CARGO
            </Button>
          </Grid>
        </DialogContent>
      </Dialog>
    </Grid>



  );
};

export default VagaFields;