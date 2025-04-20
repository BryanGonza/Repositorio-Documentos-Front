export interface Objetos {
    ID_OBJETO: number;
    OBJETO: string;
    TIPO_OBJETO: string;
    DESCRIPCION: string;
    FECHA_CREACION: Date;
    CREADO_POR: string;
    FECHA_MODIFICACION: Date;
    MODIFICADO_POR: string;

}
export interface ObjetoPermiso {
    ID_OBJETO: number;
    OBJETO: string;
    TIPO_OBJETO: string;
    DESCRIPCION: string;
    FECHA_CREACION: string;
    CREADO_POR: string;
    FECHA_MODIFICACION: string;
    MODIFICADO_POR: string;
    allowed: boolean;
  }
  

export interface ResponseObjetos {
    msg: string;
    Lista_Objetos: Objetos[];
}
export interface ObjetoPermisoExtendido {
    ID_OBJETO: number;
    OBJETO: string;
    TIPO_OBJETO: string;
    DESCRIPCION: string;
    FECHA_CREACION: string;
    CREADO_POR: string;
    FECHA_MODIFICACION: string;
    MODIFICADO_POR: string;
  
    PERMISO_CONSULTAR: boolean;
    PERMISO_INSERCION: boolean;
    PERMISO_ACTUALIZACION: boolean;
    PERMISO_ELIMINACION: boolean;
  }
  