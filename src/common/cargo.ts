import { CONSTANTES } from "./constantes";

export default class Cargo {
  id: string;
  descricao: string;

  constructor(id: string, descricao: string) {
    this.id = id;
    this.descricao = descricao;
  }

  static empty() {
    return new Cargo(
        CONSTANTES.VAZIO, 
        CONSTANTES.VAZIO
    );
  }
}