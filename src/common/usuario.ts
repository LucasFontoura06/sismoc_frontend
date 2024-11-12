import { Timestamp } from "firebase/firestore";
import { CONSTANTES } from "./constantes";

export default class Usuario {
  id: string;
  nome: string;
  email: string;
  senha: string;
  perfil: string;
  setor: string;
  ativo: Boolean;
  dataCadastro?: Timestamp;

  constructor(
    id: string,
    nome: string,
    email: string,
    senha: string,
    perfil: string,
    setor: string,
    ativo: boolean,
    dataCadastro?: Timestamp
  ) {
    this.id = id;
    this.nome = nome;
    this.email = email;
    this.senha = senha;
    this.perfil = perfil;
    this.setor = setor;
    this.ativo = ativo;
    this.dataCadastro = dataCadastro ?? Timestamp.now();
  }

  static empty() {
    return new Usuario(
      CONSTANTES.VAZIO,
      CONSTANTES.VAZIO,
      CONSTANTES.VAZIO,
      CONSTANTES.VAZIO,
      CONSTANTES.VAZIO,
      CONSTANTES.VAZIO,
      false
    );
  }
}
