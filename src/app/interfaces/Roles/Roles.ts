export interface Roles {
    ID_ROL: number;
    ROL: string;
    DESCRIPCION: string;
    FECHA_CREACION: Date;
    CREADO_POR: string;
    FECHA_MODIFICACION: Date;
    MODIFICADO_POR: string;
  }
  
  export interface ResponseRoles {
    listRoles: Roles[]
  
  }