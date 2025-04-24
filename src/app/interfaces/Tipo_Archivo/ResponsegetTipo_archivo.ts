/*export interface Tipo_archivo {
   ID_TIPO_ARCHIVO: number;
    TIPO_ARCHIVO: string;
    LIMITE_ALMACENAMIENTO: Number;
}

export interface Responsetipo_archivo {
    msg: string;
    Lista_Tipo_archivo: Tipo_archivo[];
} */


import { tipo_archivo } from "./Tipo_archivo"; 


export interface Responsetipo_archivo {
    Listado_Tipo_Archivo: never[];
    msg: string;
    Lista_Tipo_archivo: tipo_archivo[];
}