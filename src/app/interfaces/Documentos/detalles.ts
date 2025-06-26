export interface DocumentoDetalleResponse {
    doc: Documento;
  }
  
  export interface Documento {
    ID_DOCUMENTO: number;
    ID_USUARIO: number;
    ID_VERSION: number;
    ID_ESTADO: number;
    ID_TIPO_DOCUMENTO: number | null;
    NOMBRE: string;
    FORMATO: string;
    URL: string;
    URl_DOW: string;
    FECHA_SUBIDA: string;
    DRIVE_ID: string;
    ES_PUBLICO: number;
    DESCRIPCION: string;
    detalles: Detalle[];
  }
  
  export interface Detalle {
    ID_DOCUMENTO_DET: number;
    ID_DOCUMENTO: number;
    ID_DEPARTAMENTO: number;
    ID_CLASE: number | null;
    ID_ESTRUCTURA_ARCHIVOS: number;
    ID_TIPO_ARCHIVO: number;
    ID_TIPO_DOCUMENTO_CARACTERISTICA: number;
    ID_CATEGORIA: number;
    ID_SUB_CATEGORIA: number | null;
    FORMATO: string;
    NOMBRE: string;
    departamento: Departamento;
    categoria: Categoria;
    subCategoria: SubCategoria | null;
    clase: Clase | null;
    tipoArchivo: TipoArchivo;
    caracteristica: Caracteristica;
  }
  
  export interface Departamento {
    Nombre: string;
  }
  
  export interface Categoria {
    Categoria: string;
  }
  
  export interface SubCategoria {
    // Aquí debes agregar los campos si es que tu subCategoria tiene más propiedades en el futuro
  }
  
  export interface Clase {
    // Aquí igual, depende de si clase tiene más campos
  }
  
  export interface TipoArchivo {
    Tipo_Archivo: string;
  }
  
  export interface Caracteristica {
    VALOR: string;
    def: DefCaracteristica;
  }
  
  export interface DefCaracteristica {
    Caracteristica: string;
  }
  