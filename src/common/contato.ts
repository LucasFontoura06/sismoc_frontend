import { CONSTANTES } from "../common/constantes";


export default class Contato {
  id: number;
  #nome: string;
  #email?: string;
  #celular?: string;
  #telefone: string;
  #pontoFocal: boolean;
  #cargo: string;
  #parceiro: string;

  constructor(
    id: number,
    nome: string,
    email: string,
    celular: string,
    telefone: string,
    pontoFocal: boolean,
    cargo: string,
    parceiro: string
  ) {
    this.id = id;
    this.#nome = nome;
    this.#email = email;
    this.#celular = celular;
    this.#telefone = telefone;
    this.#pontoFocal = pontoFocal;
    this.#cargo = cargo;
    this.#parceiro = parceiro;
  }

  get logradouro() {
    return this.#nome;
  }
  get email() {
    return this.#email;
  }
  get celular() {
    return this.#celular;
  }
  get telefone() {
    return this.#telefone;
  }
  get pontoFocal() {
    return this.#pontoFocal;
  }
  get cargo() {
    return this.#cargo;
  }
  get parceiro() {
    return this.#parceiro;
  }

  static empty() {
    return new Contato(
      0,
      CONSTANTES.VAZIO,
      CONSTANTES.VAZIO,
      CONSTANTES.VAZIO,
      CONSTANTES.VAZIO,
      false,
      CONSTANTES.VAZIO,
      CONSTANTES.VAZIO
    );
  }
}
