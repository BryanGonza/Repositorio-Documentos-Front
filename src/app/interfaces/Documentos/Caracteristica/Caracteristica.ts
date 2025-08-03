export interface Caracteristica {
    ID_CARACTERISTICA: number;
    ID_TIPO_CARACTERISTICA: string;
    CARACTERISTICA: string | null;
    VALORES_PREDETERMINADOS: boolean | null;
    NOMBRE_TIPO_CARACTERISTICA: string;
}

export interface ResponseCaracteristica {
    msg: string;
    listado_Caracteristicas: Caracteristica[];
}