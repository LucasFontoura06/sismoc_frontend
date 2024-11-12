export default class Candidato {
    id: number;
  
    constructor(
      id: number,
    ) {
      this.id = id;
    }
  
    static empty() {
      return new Candidato(
        0,
      );
    }
  }
  