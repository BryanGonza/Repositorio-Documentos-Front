export interface RegistroPermiso {
    ID_ROL: number;        
    ID_OBJETO: number;     
    PERMISO_INSERCION: string; 
    PERMISO_ELIMINACION: string; 
    PERMISO_ACTUALIZACION: string; 
    PERMISO_CONSULTAR: string; 
    CREADO_POR: string;     
    FECHA_CREACION? : Date; // Campo opcional para fecha de creación
  }