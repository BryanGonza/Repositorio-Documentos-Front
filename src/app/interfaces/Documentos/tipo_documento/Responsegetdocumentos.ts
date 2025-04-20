import { TipoDocumento } from "./tipo_documento";

export interface ResponseTipoDocumento{
    msg: string;
    Listado_Tipo_Documento :TipoDocumento[]
}