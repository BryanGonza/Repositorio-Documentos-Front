export interface EstructuraArchivos {
    ID_ESTRUCTURA_ARCHIVOS: number;
    ID_DEPARTAMENTO: number;
    DEPARTAMENTO: string; 
    ESPACIO_ALMACENAMIENTO: BigInt;
    NOMBRE: string;
    UBICACION: string;
}

export interface ResponseEstructuraArchivos {
    message: string;
    msg: string;
    Listado_Estrucura_Archivos: EstructuraArchivos[];
}