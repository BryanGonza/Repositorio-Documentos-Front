export interface tipo_archivo {
    ID_TIPO_ARCHIVO: number;
    TIPO_ARCHIVO: string;
    LIMITE_ALMACENAMIENTO: Number;
}

export interface ResponseTipo_archivo {
    Lista_tipo_archivo: tipo_archivo[];
}