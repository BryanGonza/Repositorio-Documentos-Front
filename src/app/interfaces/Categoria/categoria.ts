export interface Categoria {
    ID_CATEGORIA?: number;
    CATEGORIA: string;
    ESTADO: boolean;
  }
  
  export interface ResponseCategoria {
    Listado_Categoria: Categoria[];
    Listado_Categorias: Categoria[];
  }
  
  export interface MsgResponse {
    msg: string;
  }
  
  export interface CategoriaResponse {
    msg: string;
    Listado_Categoria: Categoria[];
  }