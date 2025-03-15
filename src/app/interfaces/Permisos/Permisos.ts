export interface Permisos {
    ID_PERMISO: number;
    ID_ROL: number;
    ID_OBJETO: number;
    PERMISO_INSERCION?: string;
    PERMISO_ELIMINACION?: string;
    PERMISO_ACTUALIZACION?: string;
    PERMISO_CONSULTAR?: string;
    CREADO_POR?: string;
    MODIFICADO_POR?: string;
    FECHA_CREACION?: string;
    FECHA_MODIFICACION?: string;
}

export interface ResponsePermisos {
    msg: string;
    ListPermisos: Permisos[];
}
