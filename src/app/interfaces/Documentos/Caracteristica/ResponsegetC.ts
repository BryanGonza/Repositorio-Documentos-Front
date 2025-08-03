import { Caracteristica } from "./Caracteristica"; 

export interface ResponseCaracteristica {
    message: string;
    msg: string;
    Listado_Caracteristicas: Caracteristica[];
}