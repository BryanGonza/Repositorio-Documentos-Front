export interface TipoArchivo {
    ID_TIPO_ARCHIVO: number;
    TIPO_ARCHIVO: string;
    LIMITE_ALMACENAMIENTO?: number;
  }
  
  export interface ResponseTipoArchivo {
    msg?: string;
    Listado_Tipo_Archivo: TipoArchivo[];
  }
  
  export interface MsgResponse {
    msg: string;
  }
  export interface RegistroTipoArchivo {
    TIPO_ARCHIVO: string;
    LIMITE_ALMACENAMIENTO: number;
}
    