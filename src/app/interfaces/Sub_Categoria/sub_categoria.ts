export interface SubCategoria {
    ID_SUB_CATEGORIA?: number;
    ID_CATEGORIA: number;
    SUB_CATEGORIA: number;
    ESTADO: boolean;
  }
  
  export interface ResponseSubCategoria {
    Listado_Sub_Categoria: SubCategoria[];
  }
  
  export interface MsgResponse {
    msg: string;
  }
  