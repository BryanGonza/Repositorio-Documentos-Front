export interface departamento {
    ID_DEPARTAMENTO: number;
    ID_FACULTAD: number;
    NOMBRE: string;
    ESTADO: boolean;
    FACULTAD?: string;
}

export interface Responsedepartamento {
    Listado_Departamento: departamento[];
}