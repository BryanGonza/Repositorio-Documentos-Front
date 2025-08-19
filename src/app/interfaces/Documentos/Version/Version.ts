export interface Version {
    ID_VERSION: number;
    ID_USUARIO: Number;
    USUARIO: string;
    NOMBRE: string;
    CAMBIOS: boolean 
}

export interface ResponseVersion {
    msg: string;
    Listado_Version: Version[];
}