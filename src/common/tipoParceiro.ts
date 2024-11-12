import { CONSTANTES } from "../common/constantes";

export default class TipoParceiro {
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
    return new TipoParceiro(0, CONSTANTES.SELECT_TIPO_PARC)
  }
}