export interface Clase {
  ID_CLASE?: number; 
  NOMBRE: string;
  APROBADO: string;
  RECEPCIONADO: string;
  FORMATO: string;
  ESTADO: boolean;
}

export interface ResponseClases {
  Listado_Clase: Clase[];
}    

export interface MsgResponse {
  msg: string;
}
