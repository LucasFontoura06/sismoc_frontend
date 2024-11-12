import { db } from "@/app/firebaseConfig";
import { CONSTANTES } from "@/common/constantes";
import {
  collection,
  onSnapshot,
  Query,
  query,
  where,
} from "firebase/firestore";
import { setParceiros, setMeses, setVagas } from "./empregoSlice";

export const consultarParceiros = (tipo: string) => (dispatch: any) => {
  try {
    switch (tipo) {
      case CONSTANTES.PARC_NAME:
        onSnapshot(
          collection(db, CONSTANTES.COL_PARCEIROS_EMPREGO),
          (snapshot) => {
            let parceiros = { privados: 0, publicos: 0, estadosMunicipios: 0 };
            snapshot.docs.forEach((doc: any) => {
              if (doc.data().tipoIJId == 1) {
                parceiros.privados += doc.data().total;
              } else if (doc.data().tipoIJId == 2) {
                parceiros.publicos += doc.data().total;
              } else {
                parceiros.estadosMunicipios += doc.data().total;
              }
            });
            dispatch(setParceiros(parceiros));
          }
        );

      case CONSTANTES.VGS_NAME:
        onSnapshot(
          collection(db, CONSTANTES.COL_PARCEIROS_EMPREGO),
          (snapshot) => snapshot.docs.map((doc) => doc.data())
        );
    }
  } catch (error) {
    const state = { error: CONSTANTES.ERROR_GET_DASH_ANUAL, parceiros: [] };
    dispatch(setParceiros(state));
  }
};

export const consultarParceirosAno = (ano: number) => (dispatch: any) => {
  try {
    const meses = [
      { mes: CONSTANTES.MES_JAN, total: 0 },
      { mes: CONSTANTES.MES_FEV, total: 0 },
      { mes: CONSTANTES.MES_MAR, total: 0 },
      { mes: CONSTANTES.MES_ABR, total: 0 },
      { mes: CONSTANTES.MES_MAI, total: 0 },
      { mes: CONSTANTES.MES_JUN, total: 0 },
      { mes: CONSTANTES.MES_JUL, total: 0 },
      { mes: CONSTANTES.MES_AGO, total: 0 },
      { mes: CONSTANTES.MES_SET, total: 0 },
      { mes: CONSTANTES.MES_OUT, total: 0 },
      { mes: CONSTANTES.MES_NOV, total: 0 },
      { mes: CONSTANTES.MES_DEC, total: 0 }
    ];
    const colecaoRef = collection(db, CONSTANTES.COL_PARCEIROS_EMPREGO);
    const q = query(
      colecaoRef,
      where(CONSTANTES.QUERY_ANO_FB, CONSTANTES.QUERY_EQUALS_FB as any, ano)
    );
    onSnapshot(q, (snapshot) => {
      snapshot.docs.forEach((doc: any) => {
        meses[doc.data().mes - 1].total += doc.data().total;
      });
      dispatch(setMeses(meses));
    });
  } catch (error) {
    const state = { error: CONSTANTES.ERROR_GET_DASH_ANUAL, parceiros: [] };
    dispatch(setParceiros(state));
  }
};

export const consultarOfertasVagas = () => (dispatch: any) => {
  onSnapshot(
    collection(db, CONSTANTES.COL_PARCEIROS_EMPREGO), 
    (snapshot) => {
      let total = 0;
      snapshot.docs.forEach((doc: any) => {
        total += doc.data().total;
      })
      dispatch(setVagas(total))
    }

  );
}
