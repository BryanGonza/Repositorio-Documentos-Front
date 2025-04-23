export interface Version {
    ID_VERSION: number;
    ID_USUARIO: number;
    NOMBRE: string;
    CAMBIOS: boolean ;
    FECHA_ACTU: Date;
}

export interface ResponseVersion {
    msg: string;
    Listado_Version: Version[];
}