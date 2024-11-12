import { CONSTANTES } from "@/common/constantes";
import { FileContext } from "@/common/fileContext";
import Loading from "@/components/template/loading";
import {
  handleSubmitIJ,
} from "@/lib/features/instrumento-juridico/instrumentoJuridicoSlice";
import {
  handleSubmitParceiro,
} from "@/lib/features/parceiro/parceiroSlice";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import {

  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  Slide,
} from "@mui/material";
import { useCallback, useContext, useEffect, useMemo, useState } from "react";
import { handleSubmitContato } from "@/lib/features/contato/contatoSlice";
import ParceiroFields from "./parceiroFields";

const ParceiroForm = (props: any) => {
  const dispatch = useAppDispatch();
  const fileContext = useContext(FileContext);
  const { valuesContato } = useAppSelector((state: any) => state.contato);
  const { valuesIJ } = useAppSelector(
    (state: any) => state.instrumentoJuridico
  );

  const { loading } = useAppSelector((state: any) => state.parceiro);

  const handleSubmit = useCallback(() => {
    dispatch(handleSubmitParceiro());
    if (valuesIJ.documento || valuesIJ.numero) {
      dispatch(handleSubmitIJ());
    }
    if (valuesContato.nome) {
      dispatch(handleSubmitContato());
    }
  }, [
    dispatch,
    valuesIJ.documento,
    valuesIJ.numero,
    fileContext,
    valuesContato.nome,
  ]);

  return (
    <Slide
      direction={props.index == 1 ? "left" : "right"}
      in={true}
      mountOnEnter
      unmountOnExit
    >
      <div>
        {loading ? <Loading open={loading} /> : null}
        <Card 
          className="form" 
          elevation={5} 
          sx={{ margin: 2 }}
        >
          <CardHeader
            title={CONSTANTES.LBL_NEW_PARC}
            className="text-white font-bold"
          />
          <CardContent>
            <ParceiroFields />
          </CardContent>
          <CardActions
            sx={{ justifyContent: "flex-end" }}
            className="me-2 mb-2"
          >
            <Button
              variant="contained"
              onClick={handleSubmit}
              sx={{ background: "#670080" }}
            >
              {CONSTANTES.BTN_SALVAR.toUpperCase()}
            </Button>
          </CardActions>
        </Card>
      </div>
    </Slide>
  );
};

export default ParceiroForm;
