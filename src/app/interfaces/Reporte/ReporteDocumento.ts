// src/app/interfaces/Reporte/ReporteDocumentos.ts

export interface ReporteDocumento {
  ID_BITACORA: number;
  NOMBRE_DOCUMENTO?: string;
  USUARIO_ACCION: string;
  ACCION: string;
  FECHA_CREACION: string;
}

export interface ReporteDocumentosResponse {
  reporte: ReporteDocumento[];
}
