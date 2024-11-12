import Cargo from "./cargo";
import { CONSTANTES } from "./constantes";
import { TIPOS_LOGRADOURO } from "./logradouro";
import Parceiro from "./parceiro";
import Segmento from "./segmento";
import { UFS } from "./uf";
import Vaga from "./vaga";
import { Base64 } from 'js-base64';
import { PERFIS } from './perfil';
import { Timestamp } from 'firebase/firestore';

// Função auxiliar para converter entre código e label
export const getPerfil = (codigo: string) => {
  const perfil = PERFIS.find(p => p.codigo === codigo);
  return perfil ? perfil.label : codigo;
};

// Função auxiliar para converter de label para código
export const getPerfilCodigo = (label: string) => {
  const perfil = PERFIS.find(p => p.label === label);
  return perfil ? perfil.codigo : label;
};

export const convertUFDropdown = () => {
  return UFS.map((uf: any) => ({ codigo: uf.label, label: uf.label }));
};

export const convertLogradouroDropdown = () => {
  return TIPOS_LOGRADOURO.map((log: any) => ({
    codigo: log.descricao,
    label: log.descricao,
  }));
};

export const convertTiposParceiroDropdown = (tiposParceiro: any[]) => {
  return tiposParceiro
    .map((tipo: any) => ({
      codigo: tipo.id,
      label: tipo.descricao,
    }))
    .sort((a, b) => a.label.localeCompare(b.label));
};

export const convertCidadeDropdown = (cidades: any[]) => {
  return cidades.map((cidade: any) => ({
    codigo: cidade.id,
    label: cidade.nome,
  }));
};

export const convertSegmentoDropdown = (segmentos: Segmento[]) => {
  return segmentos
    .map((segmento: any) => ({
      codigo: segmento.id,
      label: segmento.descricao,
    }))
    .sort((a, b) => a.label.localeCompare(b.label));
};

export const convertAreaAtuacaoDropdown = (areasAtuacoes: Segmento[]) => {
  return areasAtuacoes
    .map((area: any) => ({
      codigo: area.id,
      label: area.descricao,
    }))
    .sort((a, b) => a.label.localeCompare(b.label));
};

export const convertStatusIJDropdown = (status: any[]) => {
  return status
    .map((status: any) => ({
      codigo: status.id,
      label: status.descricao,
    }))
    .sort((a, b) => a.label.localeCompare(b.label));
};

export const convertTipoIJDropdown = (tipos: any[]) => {
  return tipos
    .map((tipo: any) => ({
      codigo: tipo.id,
      label: tipo.descricao,
      subtipos: tipo.subtipos
        ? tipo.subtipos.map((subtipo: any) => ({
            codigo: subtipo.id,
            label: subtipo.descricao,
          }))
        : [],
    }))
    .sort((a, b) => a.label.localeCompare(b.label));
};

export const convertParceiroDropdown = (parceiros: Parceiro[]) => {
  return parceiros.map((parceiro: Parceiro) => ({
    codigo: parceiro.id,
    label: parceiro.nome,
  })).sort((a, b) => a.label.localeCompare(b.label));
};

export const convertVagasDropdown = (vagas: any[]) => {
  if (!Array.isArray(vagas)) {
    return [];
  }

  return vagas.map((vaga) => ({
    codigo: vaga.id,
    descricao: [
      `Cargo: ${vaga.cargo?.descricao || 'Sem descrição'}`,
      `Cidade: ${vaga.endereco?.cidade || 'N/A'}`,
      `UF: ${vaga.endereco?.uf || 'N/A'}`,
      `Posto(s): ${vaga.postos || 0}`
    ].join(' ‎ | ‎ ')
  }));
};

export const convertCargosDropdown = (cargos: Cargo[]) => {
  // Verifica se cargos é um array e tem elementos, caso contrário retorna um array vazio
  if (!Array.isArray(cargos)) {
    return [];
  }

  return cargos
    .map((cargo: Cargo) => ({
      codigo: cargo.id,
      label: cargo.descricao,
    }))
    .sort((a, b) => a.label.localeCompare(b.label));
};

export const convertEnderecosDropdown = (enderecosParceiro: any[] = []) => {
  // Mapeia os endereços para o formato esperado pelo dropdown
  const enderecos = enderecosParceiro.map((enderecoParceiro: any) => ({
    codigo: enderecoParceiro.id,
    label: `${enderecoParceiro.logradouro} ${enderecoParceiro.numero}, 
            ${enderecoParceiro.complemento || ""}, 
            ${enderecoParceiro.bairro}, 
            ${enderecoParceiro.cidade} - ${enderecoParceiro.uf}, 
            ${enderecoParceiro.cep}`,
  }));
  enderecos.push({ codigo: CONSTANTES.VAZIO, label: CONSTANTES.VAZIO });
  return enderecos.sort((a, b) => a.label.localeCompare(b.label));
};

export const convertStringToDate = (date: string) => {
  const partesData = date.split("/");
  const dia = parseInt(partesData[0], 10);
  const mes = parseInt(partesData[1], 10) - 1; // Meses em JavaScript são indexados de 0 a 11
  const ano = parseInt(partesData[2], 10);

  return new Date(ano, mes, dia);
};

export const convertStringUTCToString = (date?: string) => {
  if (!date || typeof date !== "string") {
    return ""; // Retorna string vazia se a data não for fornecida ou não for uma string
  } else {
    // Criando um objeto Date a partir da string de data
    const data = new Date(date);

    // Extraindo o dia, mês e ano da data
    const dia = String(data.getUTCDate()).padStart(2, "0");
    const mes = String(data.getUTCMonth() + 1).padStart(2, "0"); // Meses em JavaScript são indexados de 0 a 11
    const ano = data.getUTCFullYear();

    return `${dia} / ${mes} / ${ano}`;
  }
};

// Função para converter Firestore Timestamp para uma data legível
export const convertTimestampToDateString = (timestamp?: { seconds: number, nanoseconds: number }) => {
  if (!timestamp || typeof timestamp.seconds !== "number") {
    return ""; // Retorna string vazia se o timestamp não for válido
  }

  const date = new Date(timestamp.seconds * 1000); // Converte segundos para milissegundos
  const dia = String(date.getUTCDate()).padStart(2, "0");
  const mes = String(date.getUTCMonth() + 1).padStart(2, "0"); // Meses são indexados de 0 a 11
  const ano = date.getUTCFullYear();

  return `${dia} / ${mes} / ${ano}`;
};


export const isValidDateRegex = (date: string) => {
  const pattern = /^\d{2}\/\d{2}\/\d{4}$/;
  return pattern.test(date);
};

export const retirarMascara = (stringMask: string) => {
  const regex = new RegExp(CONSTANTES.PATTERN_MASK, 'g');
  const stringClear = stringMask.replace(regex, CONSTANTES.VAZIO);
  return stringClear.replace(CONSTANTES.SPACE, CONSTANTES.VAZIO).trim();
};

export const convertObjetoFB = (codigo: string, objetosDropDown: any[], path: string) => {
  console.log(path, codigo, objetosDropDown);
  const objeto = objetosDropDown.find((item) => item.codigo === codigo);
  return { id: objeto.codigo, descricao: objeto.label };
};

export const convertArrayToObjetoFB = (
  codigos: string[],
  objetosDropDown: any[]
) => {
  const arrayObjetos = objetosDropDown.filter((item: any) =>
    codigos.includes(item.codigo)
  );
  return arrayObjetos;
};

export const convertAreasAtuacaoDescricao = (obj: any) => {
  let descricao = CONSTANTES.VAZIO;
  obj.areasAtuacao.map((area: any, idx: number) => {
    descricao += area.label;
    if (idx === obj.areasAtuacao.length - 2) {
      descricao += ' e ';
    } else {
      descricao += ', ';
    }
  });
  return descricao.slice(0, -2);
};

export const convertToDateString = (date: any) => {
  if (date instanceof Timestamp) {
      return convertTimestampToStringListas(date);
  } else if (typeof date === 'string') {
      return convertStringUTCToStringListas(date);
  }
  return "";
};

export const convertTimestampToStringListas = (timestamp: Timestamp) => {
  const data = timestamp.toDate();
  const dia = String(data.getUTCDate()).padStart(2, "0");
  const mes = String(data.getUTCMonth() + 1).padStart(2, "0");
  const ano = data.getUTCFullYear();
  const dataFormatada = `${dia}/${mes}/${ano}`;
  return dataFormatada;
};

export const convertStringUTCToStringListas = (date: string) => {
  if (/^\d{2}\/\d{2}\/\d{4}$/.test(date)) {
      return date;
  }

  const regex = /(\d{1,2}) de (\w+) de (\d{4})/;
  const match = date.match(regex);

  if (match) {
      const dia = match[1].padStart(2, "0");
      const mes = getMonthNumber(match[2]);
      const ano = match[3];

      if (mes !== null) {
          return `${dia}/${mes}/${ano}`;
      }
  }

  return ""; // Retorna string vazia se a data não puder ser convertida
};

// Função auxiliar para converter o nome do mês para o número do mês
const getMonthNumber = (monthName: string): string | null => {
  const months = [
      "janeiro", "fevereiro", "março", "abril", "maio", "junho",
      "julho", "agosto", "setembro", "outubro", "novembro", "dezembro"
  ];
  const monthIndex = months.indexOf(monthName.toLowerCase());
  return monthIndex !== -1 ? String(monthIndex + 1).padStart(2, "0") : null;
};
