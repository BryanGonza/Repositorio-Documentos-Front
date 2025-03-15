export interface RegistroPermiso {
  ID_ROL: string;
  ID_OBJETO: string;
  PERMISO_INSERCION: string;
  PERMISO_ELIMINACION: string;
  PERMISO_ACTUALIZACION: string;
  PERMISO_CONSULTAR: string;
  CREADO_POR: string;
  FECHA_CREACION?: Date; // Campo opcional para la fecha de creación
}