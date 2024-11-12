import { CONSTANTES } from "../common/constantes";
import Segmento from "./segmento";

export default class Parceiro {
  id: number;
  #nome: string;
  #segmento: Segmento;
  #tipo: any;
  #areaAtuacao: any;
  #enderecos: string[];
  #pontoFocalSISEC: string;
  #dataCadastro?: Date;
  #infoAdicional?: string;
  #processoSEI?: string;

  constructor(
    id: number,
    nome: string,
    segmento: any,
    tipo: any,
    areaAtuacao: any,
    dataCadastro: Date = new Date(),
    enderecos: string[],
    infoAdicional: string,
    pontoFocalSISEC: string,
    processoSEI: string,
  ) {
    this.id = id;
    this.#nome = nome;
    this.#segmento = segmento;
    this.#tipo = tipo;
    this.#areaAtuacao = areaAtuacao;
    this.#dataCadastro = dataCadastro;
    this.#enderecos = enderecos;
    this.#infoAdicional = infoAdicional;
    this.#pontoFocalSISEC = pontoFocalSISEC;
    this.#processoSEI = processoSEI;
  }

  get nome() {
    return this.#nome;
  }
  get segmento() {
    return this.#segmento;
  }
  get tipo() {
    return this.#tipo;
  }
  get areaAtuacao() {
    return this.#areaAtuacao;
  }
  get dataCadastro() {
    return this.#dataCadastro;
  }
  get enderecos() {
    return this.#enderecos;
  }
  get infoAdicional() {
    return this.#infoAdicional;
  }
  get pontoFocalSISEC() {
    return this.#pontoFocalSISEC;
  }
  get processoSEI() {
    return this.#processoSEI;
  }

  static empty() {
    return new Parceiro(
      0,
      CONSTANTES.VAZIO,
      {},
      {},
      {},
      new Date(),
      [],
      CONSTANTES.VAZIO,
      CONSTANTES.VAZIO,
      CONSTANTES.VAZIO
    );
  }
}
