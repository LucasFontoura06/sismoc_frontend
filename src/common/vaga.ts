import Endereco from "./endereco";
import { CONSTANTES } from "./constantes";

export default class Vaga {
  id: string;
  cargo: string;
  endereco: Endereco;
  quantidadePostos: number;
  escolaridade: string;
  pcd: boolean;

  constructor(
    id: string,
    cargo: string,
    endereco: Endereco,
    quantidadePostos: number,
    escolaridade: string,
    pcd: boolean
  ) {
    this.id = id;
    this.cargo = cargo;
    this.endereco = endereco;
    this.quantidadePostos = quantidadePostos;
    this.escolaridade = escolaridade;
    this.pcd = pcd;
  }

  static empty() {
    return new Vaga(
      CONSTANTES.VAZIO,
      CONSTANTES.VAZIO,
      Endereco.empty(),
      0,
      CONSTANTES.VAZIO,
      false
    );
  }
}
