/*import { departamento } from "./Departamento"; 


export interface Responsedepartamento {
    Lista_departamento: never[];
    Listado_departamento: never[];
    Listado_Departamento: never[];
    msg: string;
    Lista_Departamento: departamento[];


}*/

import { departamento } from "./Departamento";

export interface ResponseDepartamento{
    msg: string;
    Listado_Departamentos :departamento[]
}