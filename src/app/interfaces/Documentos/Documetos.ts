export interface documento {
    ID_DOCUMENTO: number; 
    ID_USUARIO: number;
    ID_ESTADO: number;
    NOMBRE: string;
    ID_TIPO_DOCUMENTO: number;
    URL: string;
    FECHA_SUBIDA: string;
    URl_DOW: string;
    DRIVE_ID: string;
    CORREO: string;
    DESCRIPCION: string;
    ES_PUBLICO: number;
};   
export interface correo{
    correo: string;
}
export interface msg{
    msg: string;
}

export interface ResponseDocumetos{
    ListDocume:documento[]
};

export interface ActualizarDocumentoRequest {
  ID_DOCUMENTO: number;
  NOMBRE: string;
  DESCRIPCION: string;
  ES_PUBLICO: number;
}