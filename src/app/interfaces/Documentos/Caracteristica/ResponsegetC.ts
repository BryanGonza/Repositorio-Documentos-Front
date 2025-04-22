import { Caracteristica } from "./Caracteristica"; 

export interface ResponseCaracteristica {
    msg: string;
    Listado_Caracteristicas: Caracteristica[];
}