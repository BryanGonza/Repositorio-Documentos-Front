export interface Facultad {
    ID_FACULTAD: number;
    NOMBRE: string;
    ESTADO: boolean;
}

export interface ResponseFacultad {
    Lista_Facultad: Facultad[];
}