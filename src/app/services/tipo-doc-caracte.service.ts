import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { appsettings } from '../setting/appsetting';
import { Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';

import {
  ApiResponse,
  DocumentoCaracteristica,
  DocumentoCaracteristicaRegistro,
  ResponseDocumentoCaracteristica,
  ResposeDocumentoCaracteristica,
} from '../interfaces/Documentos/TipoDocuemtoCaracte/TipoDcoCara';
interface ApiWrapper {
  success: boolean;
  data: any; // lo dejamos `any` para adaptarnos a lo que venga
}
@Injectable({
  providedIn: 'root',
})
export class TipoDocCaracteService {
  private http = inject(HttpClient);
  private baseAPi: string = appsettings.apiUrl;
  constructor() {}

  //metodo para obtener las caracteristicas de tipo documento
  TipoDocCaraget(): Observable<ResponseDocumentoCaracteristica> {
    return this.http.get<ResponseDocumentoCaracteristica>(
      `${this.baseAPi}tipo_doc_caracteristica/get_doc_cara`
    );
  }

  //metodo para elimianar caracteristicas de tipo documento
  eliminarDocCaracte(
    id_caracteristica: number,
    id_tipo_documento: number
  ): Observable<ResponseDocumentoCaracteristica> {
    return this.http.request<ResponseDocumentoCaracteristica>(
      'delete',
      `${this.baseAPi}tipo_doc_caracteristica/eliminar_doc_cara`,
      {
        body: { id_caracteristica, id_tipo_documento },
      }
    );
  }

  // Método para registrar caracteristicas de tipo documento
  registrarDocCarac(
    objeto: DocumentoCaracteristicaRegistro
  ): Observable<ResposeDocumentoCaracteristica> {
    return this.http.post<ResposeDocumentoCaracteristica>(
      `${this.baseAPi}tipo_doc_caracteristica/createTipo_doc_cara`,
      objeto
    );
  }

actualizartdc(
  id_tipo_documento: number,
  id_caracteristica_actual: number,
  id_caracteristica_nueva: number
) {
  const token = localStorage.getItem('token') || '';
  const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

  return this.http.put<ResposeDocumentoCaracteristica>(
    `${this.baseAPi}tipo_doc_caracteristica/upd_doc_cara`,
    { id_tipo_documento, id_caracteristica_actual, id_caracteristica_nueva },
    { headers }
  );
}


  /** Devuelve directamente un arreglo. */
  getByTipo(idTipoDocumento: number): Observable<DocumentoCaracteristica[]> {
    return this.http
      .get<ApiWrapper>(
        `${this.baseAPi}tipo_doc_caracteristica/get_Tipo/${idTipoDocumento}`
      )
      .pipe(
        map((wrapper) => {
          const d = wrapper.data;
          if (Array.isArray(d.Listado_DocumentoCaracteristica)) {
            return d.Listado_DocumentoCaracteristica;
          }

          if (Array.isArray(d)) {
            return d;
          }

          return [d as DocumentoCaracteristica];
        })
      );
  }

  getDetalleCaracteristicasDocumento(
    idDocumento: number
  ): Observable<CaracteristicaDocumento[]> {
    const token = localStorage.getItem('token') || '';
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http
      .get<any>(
        `http://localhost:3016/detalle-caracteristicas/${idDocumento}`,
        { headers }
      )
      .pipe(
        map((res) => {
          // Extrae la lista de CaracteristicaDocumento
          const data = res.data?.Listado_CaracteristicasDocumento;
          if (Array.isArray(data)) return data as CaracteristicaDocumento[];
          if (data) return [data] as CaracteristicaDocumento[];
          return [];
        })
      );
  }
}

export interface CaracteristicaDocumento {
  ID_DOCUMENTO_CARACTERISTICA: number;
  ID_DOCUMENTO: number;
  ID_TIPO_DOCUMENTO_CARACTERISTICA: number;
  VALOR: string;
  ID_TIPO_DOCUMENTO: number;
  TIPO_DOCUMENTO: string;
  ID_CARACTERISTICA: number;
  CARACTERISTICA: string;
  // Nuevos campos
  ID_DEPARTAMENTO: number;
  NOMBRE_DEPARTAMENTO: string;
}
