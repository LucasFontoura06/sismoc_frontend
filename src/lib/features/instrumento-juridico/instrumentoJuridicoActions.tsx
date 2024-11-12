import InstrumentoJuridico from "@/common/instrumentoJuridico";
import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { ACTIONS_TYPE } from "../../../common/actionsType";
import { CONSTANTES } from "../../../common/constantes";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import { storage } from "@/app/firebaseConfig";

export const fetchStatus = createAsyncThunk(
  ACTIONS_TYPE.LIST_STATUS,
  async (_, { rejectWithValue }) => {
    try {
      const resp = await axios.get(
        `${CONSTANTES.API_URL}/instrumentos_juridicos/status`
      );
      return resp.data;
    } catch (error) {
      return rejectWithValue(CONSTANTES.ERROR_LIST_STATUS);
    }
  }
);

export const fetchTiposIJ = createAsyncThunk(
  ACTIONS_TYPE.LIST_TIPOS_IJ,
  async (_, { rejectWithValue }) => {
    try {
      const resp = await axios.get(
        `${CONSTANTES.API_URL}/instrumentos_juridicos/tipos`
      );
      return resp.data;
    } catch (error) {
      return rejectWithValue(CONSTANTES.ERROR_LIST_END);
    }
  }
);

export const fetchInstrumentosJuridicos = createAsyncThunk(
  ACTIONS_TYPE.LIST_IJ,
  async (_, { rejectWithValue }) => {
    try {
      const resp = await axios.get(
        `${CONSTANTES.API_URL}/instrumentos_juridicos`
      );
      return resp.data;
    } catch (error) {
      return rejectWithValue(CONSTANTES.ERROR_LIST_IJ);
    }
  }
);

export const addInstrumentoJuridico = createAsyncThunk<
  InstrumentoJuridico,
  any
>(ACTIONS_TYPE.ADD_IJ, async (instrumentoJuridico, { rejectWithValue }) => {
  try {
    const resp = await axios.post(
      `${CONSTANTES.API_URL}/instrumentos_juridicos`,
      instrumentoJuridico
    );
    return resp.data;
  } catch (error) {
    return rejectWithValue(CONSTANTES.ERROR_ADD_IJ);
  }
});

export const updateInstrumentoJuridico = createAsyncThunk<
  InstrumentoJuridico,
  InstrumentoJuridico
>(ACTIONS_TYPE.EDIT_IJ, async (instrumentoJuridico, { rejectWithValue }) => {
  try {
    const { id } = instrumentoJuridico;
    const resp = await axios.put(
      `${CONSTANTES.API_URL}/instrumentos_juridicos/${id}`,
      instrumentoJuridico
    );
    return resp.data;
  } catch (error) {
    return rejectWithValue(CONSTANTES.ERROR_UPDT_IJ);
  }
});

export const uploadFileIJ = createAsyncThunk(
  ACTIONS_TYPE.UPLOAD_FILE_IJ,
  async (file: File, { rejectWithValue }) => {
    try {
      const currentYear = new Date().getFullYear();
      const storagePath = `${CONSTANTES.STORAGE_PATH_IJ}/${currentYear}/${file.name}`;
      const storageRef = ref(storage, storagePath);
      const uploadTask = uploadBytesResumable(storageRef, file);
      const resp = {
        data: new Promise<string>((resolve, reject) => {
          uploadTask.on(
            "state_changed",
            (snapshot) => {
              const progress =
                (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
              console.log(`Upload está ${progress}% concluído`);
            },
            (error) => {
              console.error("Erro no upload:", error);
              reject(error);
            },
            () => {
              getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                console.log("Arquivo disponível em:", downloadURL);
                resolve(downloadURL);
              });
            }
          );
        })
      };

      return resp.data;
    } catch (error) {
      return rejectWithValue(CONSTANTES.ERROR_UPLOAD_FILE_IJ);
    }
  }
);
