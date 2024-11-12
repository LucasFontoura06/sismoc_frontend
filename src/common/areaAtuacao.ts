import { CONSTANTES } from "@/common/constantes";

export default class AreaAtuacao {
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
    return new AreaAtuacao(0, CONSTANTES.SELECT_AREA_ATUACAO)
  }
}