export interface Caracteristica {
    ID_CARACTERISTICA: number;
    ID_TIPO_CARACTERISTICA: string;
    CARACTERISTICA: string | null;
    VALORES_PREDETERMINADOS: boolean | null;
}

export interface ResponseCaracteristica {
    msg: string;
    listado_Caracteristicas: Caracteristica[];
}