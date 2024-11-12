export const ACTIONS_TYPE = {
  // Ações relacionadas a Endereço
  ADD_END: "endereco/add",
  LIST_END: "endereco/list",
  EDIT_END: "endereco/edit",
  DEL_END: "endereco/remove",
  GET_CIDADE: "cidade/find",
  LIST_USER: "usuarios/list",
  SUC_ADD_END: "ENDERECO_ADICIONADO", 
  ERROR_ADD_END: "FALHA_ADICIONAR_ENDERECO",
  LIST_STATUS: "instrumentoJuridico/status",
  LIST_TIPOS: "instrumentoJuridico/tipos",
   
  // Ações relacionadas ao Dashboard
  GET_DASH_ANUAL: "dash/emprego/anual",
  LOAD_DASHBOARD: "CARREGAR_CONTROLE",
  GET_QTD_PARC: "QUANTIDADE_PARC",

  // Ações relacionadas a Parceiro
  GET_PARC: "parceiro/find",
  LIST_PARC: "parceiro/list",
  ADD_PARC: "parceiro/add",
  EDIT_PARC: "parceiro/edit",
  DEL_PARC: "parceiro/remove",

  // Ações relacionadas a Instrumentos Jurídico
  LIST_TIPOS_IJ: "tipoIJ/list",
  LIST_STATUS_IJ: "statusIJ/list",
  LIST_IJ: "instrumentoJuridico/list",
  ADD_IJ: "instrumentoJuridico/add",
  EDIT_IJ: "instrumentoJuridico/edit",
  DEL_IJ: "instrumentoJuridico/remove",
  UPLOAD_FILE_IJ: "instrumentoJuridico/upload",
  
  // Ações relacionadas a Tipos, Segmentos e Áreas de Parceiro
  LIST_TYPE_PARC: "tipoParceiro/list",
  LIST_SEG_PARC: "segmento/list",
  LIST_AREA_PARC: "area/list",
  
  // Ações relacionadas a Cargo
  LIST_CARGO: "cargo/list",
  ADD_CARGO: "cargo/add",
  EDIT_CARGO: "cargo/edit",
  DEL_CARGO: "cargo/remove",
  SUBMIT_CARGO: "cargo/submit",
  ERROR_ADD_CARGO: "FALHA_ADICIONAR_CARGO",
  ERROR_GET_CARGO: "FALHA_OBTER_ENDERECO",

  // Ações relacionadas a Vaga
  LIST_VAGA: "vaga/list",
  ADD_VAGA: "vaga/add",
  EDIT_VAGA: "vaga/edit",
  DEL_VAGA: "vaga/remove",
  FETCH_ESCOLARIDADES: "escolaridade/fetch",
  FETCH_ENDERECOS_BY_PARCEIRO: "endereco/byParceiro",
  FETCH_VAGA_BY_ID: 'vagas/fetchVagaById',
  SUBMIT_VAGA: "vaga/submit",
  UPDATE_VAGA: "vaga/update",
  GET_VAGAS: "vaga/find", 

  //Ações relacionadas a Usuário
  ADD_USER: "usuario/add",
  UPDATE_USER: "usuario/update",
  TOGGLE_STATUS_USER: "usuario/status",

  // Sucesso e Erros específicos
  SUC_ADD_VAGA: "VAGA_ADICIONADA",
  ERROR_ADD_VAGA: "FALHA_ADICIONAR_VAGA",
  ERROR_DEL_VAGA: "FALHA_REMOVER_VAGA",
  ERROR_DEL_END: "FALHA_REMOVER_ENDERECO",
  ERROR_UPDT_VAGA: "FALHA_ATUALIZAR_VAGA",
  ERROR_GET_PARC: "FALHA_OBTER_PARCEIROS",
  ERROR_GET_ESCOLARIDADES: "FALHA_OBTER_ESCOLARIDADES",
  ERROR_GET_ENDERECOS_BY_PARC: "FALHA_OBTER_ENDERECOS_POR_PARCEIRO",

  // Ações relacionadas a Listas Ouvidorias
  ADD_LISTA:  "listasOuvidoria/add",
  SAVE_FORMULARIO: "listasOuvidoria/save",
  LIST_LISTAS: "listasOuvidoria/list",
  SUBMIT_CADASTRO_OUVIDORIA: "listasOuvidoria/submit",
  DEL_LISTA: "listasOuvidoria/remove",
  UPDATE_LISTA: "listasOuvidoria/update",
  DELETE_LISTA: "listasOuvidoria/delete",
  FETCH_LISTAS: "listasOuvidoria/fetch",

  // Ações relaciondas a Contato
  LIST_CONTATO: "contato/list",
  ADD_CONTATO: "contato/add",
  EDIT_CONTATO: "contato/edit",
  DEL_CONTATO: "contato/remove",
  UPLOAD_ARQUIVO: "listasOuvidoria/upload",

  // Ações relaciondas a Cargos
  GET_CARGOS: "cargo/find", 

};
