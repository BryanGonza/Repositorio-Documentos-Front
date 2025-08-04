export interface Facultad {
    ID_FACULTAD: number;
    NOMBRE: string;
    DESCRIPCION: string;
    ESTADO: boolean;
}

export interface ResponseFacultad {
    Lista_Facultad: Facultad[];
}