import { CONSTANTES } from "../common/constantes";
import Candidato from "./candidato";
import LocalidadeParceiro from "./localidadeParceiro";
import Parceiro from "./parceiro";
import Vaga from "./vaga";

export default class InstrumentoJuridico {
  id: number;
  #documento?: string;
  #objeto?: string;
  #numero?: number;
  #tipoIJ: any;
  #status: any;
  #parceiro: Parceiro;
  #processoSEI: string;
  #dataAssinatura: Date;
  #dataFim?: Date;

  constructor(
    id: number,
    documento?: string,
    objeto?: string,
    numero?: number,
    tipoIJ: any = {},
    status: any = {},
    parceiro: Parceiro = Parceiro.empty(),
    processoSEI: string = CONSTANTES.VAZIO,
    dataAssinatura: Date = new Date(),
    dataFim?: Date
  ) {
    this.id = id;
    this.#documento = documento;
    this.#objeto = objeto;
    this.#numero = numero;
    this.#tipoIJ = tipoIJ;
    this.#status = status;
    this.#parceiro = parceiro;
    this.#processoSEI = processoSEI;
    (this.#dataAssinatura = dataAssinatura), (this.#dataFim = dataFim);
  }

  get documento() {
    return this.#documento;
  }

  get objeto() {
    return this.#objeto;
  }
  get numero() {
    return this.#numero;
  }
  get tipoIJ() {
    return this.#tipoIJ;
  }
  get status() {
    return this.#status;
  }
  get parceiro() {
    return this.#parceiro;
  }
  get processoSEI() {
    return this.#processoSEI;
  }
  get dataAssinatura() {
    return this.#dataAssinatura;
  }
  get dataFim() {
    return this.#dataFim;
  }

  static empty() {
    return new InstrumentoJuridico(
      0,
      CONSTANTES.VAZIO,
      CONSTANTES.VAZIO,
      0,
      {},
      {},
      Parceiro.empty(),
      CONSTANTES.VAZIO,
      new Date(),
      new Date()
    );
  }
}
