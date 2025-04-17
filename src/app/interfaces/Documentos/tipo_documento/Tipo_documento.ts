export interface TipoDocumento {
    ID_TIPO_DOCUMENTO: number;
    TIPO_DOCUMENTO?: string;
    ESTADO?: boolean;
}

export interface ResponseTipoDocumento {
    msg: string;
    Listado_Tipo_Documentos: TipoDocumento[];
}
