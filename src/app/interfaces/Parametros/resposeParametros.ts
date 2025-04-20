export interface parametros {
    ID_PARAMETRO: number; 
    PARAMETRO: string;
    VALOR: string;
    ADMIN_INTENTOS_INVALIDOS?: number;
    FECHA_CREACION: string;
    FECHA_MODIFICACION: string;
};   
export interface registro{
    PARAMETRO: string;
    VALOR: string;
} 

export interface ResponseParametros{
    ListParametros:parametros[]
};