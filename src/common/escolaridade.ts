export default class Escolaridade {
  id: number;
  descricao: string;

  constructor(id: number, descricao: string) {
    this.id = id;
    this.descricao = descricao;
  }

  static getAll(): { id: number, descricao: string }[] { // Retorna objetos planos
    return [
      { id: 1, descricao: "Ensino Fundamental Completo" },
      { id: 2, descricao: "Ensino Fundamental Incompleto" },
      { id: 3, descricao: "Ensino Médio Completo" },
      { id: 4, descricao: "Ensino Médio Incompleto" },
      { id: 5, descricao: "Ensino Superior Completo" },
      { id: 6, descricao: "Ensino Superior Incompleto" },
    ];
  }

  static empty() {
    return { id: 0, descricao: "" };
  }
}
