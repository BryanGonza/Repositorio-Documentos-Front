export interface DocumentoCaracteristica {
  ID_TIPO_DOCUMENTO_CARACTERISTICA: number;
  ID_CARACTERISTICA: number;
  ID_TIPO_DOCUMENTO: number;
  def: {
    CARACTERISTICA: string;
  };
  tipo_documento: {
    TIPO_DOCUMENTO: string;
  };
}

export interface ResponseDocumentoCaracteristica {
  msg?: string; // Opcional, porque en tu ejemplo no aparece
  Listado_DocumentoCaracteristica: DocumentoCaracteristica[];
}
export interface DocumentoCaracteristicaRegistro {
  // ID_TIPO_DOCUMENTO_CARACTERISTICA?: number; // Opcional, porque puede no estar presente al registrar
  id_caracteristica: number;
  id_tipo_documento: number;

}

export interface ResposeDocumentoCaracteristica {
  msg?: string; 
}
export interface ApiResponse<T> {
  success: boolean;
  data: T;
}