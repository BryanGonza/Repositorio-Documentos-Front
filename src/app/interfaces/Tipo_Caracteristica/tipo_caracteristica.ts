export interface TipoCaracteristica {
  ID_TIPO_CARACTERISTICA?: number;
  TIPO_CARACTERISTICA: string | null;
}

export interface ResponseTipoCaracteristica {
  Listado_Tipo_Caracteristica: TipoCaracteristica[];
}

export interface MsgResponse {
  msg: string;
}

  