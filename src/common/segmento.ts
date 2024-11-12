import { CONSTANTES } from "../common/constantes";

export default class Segmento {
  id: number;
  #descricao: string;

  constructor(id: number, descricao: string) {
    this.id = id;
    this.#descricao = descricao;
  }

  get descricao() {
    return this.#descricao;
  }

  static empty() {
    return new Segmento(0, CONSTANTES.SELECT_SEGMENTO_PARC);
  } 
}
