export default class LocalidadeParceiro {
    id: number;
  
    constructor(
      id: number,
    ) {
      this.id = id;
    }
  
    static empty() {
      return new LocalidadeParceiro(
        0,
      );
    }
  }
  