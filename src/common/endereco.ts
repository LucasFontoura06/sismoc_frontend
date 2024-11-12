import { CONSTANTES } from "../common/constantes";
import Candidato from "./candidato";
import LocalidadeParceiro from "./localidadeParceiro";
import Vaga from "./vaga";


export default class Endereco {
  id: string;
  #logradouro: string;
  #numero?: string;
  #complemento?: string;
  #bairro: string;
  #cidade: string;
  #uf: string;
  #cep: string;
  vagas?: Vaga[];
  candidatos?: Candidato[];
  localidadesParceiro?: LocalidadeParceiro[];

  constructor(
    id: string,
    logradouro: string,
    numero: string,
    complemento: string,
    bairro: string,
    cidade: string,
    uf: string,
    cep: string,
    vagas?: Vaga[],
    candidatos?: Candidato[],
    localidades?: LocalidadeParceiro[] 
  ) {
    this.id = id;
    this.#logradouro = logradouro;
    this.#complemento = complemento;
    this.#numero = numero;
    this.#bairro = bairro;
    this.#cidade = cidade;
    this.#uf = uf;
    this.#cep = cep;
    this.vagas = vagas ?? [],
    this.candidatos = candidatos ?? [],
    this.localidadesParceiro = localidades ?? []
  }

  get logradouro() {
    return this.#logradouro;
  }
  get numero() {
    return this.#numero;
  }
  get complemento() {
    return this.#complemento;
  }
  get bairro() {
    return this.#bairro;
  }
  get cidade() {
    return this.#cidade;
  }
  get uf() {
    return this.#uf;
  }
  get cep() {
    return this.#cep;
  }

  static empty() {
    return new Endereco(
      CONSTANTES.VAZIO,
      CONSTANTES.VAZIO,
      CONSTANTES.VAZIO,
      CONSTANTES.VAZIO,
      CONSTANTES.VAZIO,
      CONSTANTES.VAZIO,
      CONSTANTES.VAZIO,
      CONSTANTES.VAZIO
    );
  }
}
