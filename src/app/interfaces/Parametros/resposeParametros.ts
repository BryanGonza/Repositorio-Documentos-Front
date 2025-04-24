export interface parametros {
    ID_PARAMETRO: number; 
    PARAMETRO: string;
    VALOR: string;
    ID_USUARIO: number;
    ADMIN_INTENTOS_INVALIDOS?: number;
    FECHA_CREACION: string;
    FECHA_MODIFICACION: string;
    CORREO_ELECTRONICO?: string;
};   
export interface registro{
    PARAMETRO: string;
    ID_USUARIO: number;
    VALOR: string;
} 

export interface ResponseParametros{
    ListParametros:parametros[]
};