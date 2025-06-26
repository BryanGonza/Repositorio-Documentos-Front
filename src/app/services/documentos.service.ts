import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { appsettings } from '../setting/appsetting';
import {
  correo,
  msg,
  ResponseDocumetos,
} from '../interfaces/Documentos/Documetos';
import { Observable } from 'rxjs';
import { DocumentoDetalleResponse } from '../interfaces/Documentos/detalles';

@Injectable({
  providedIn: 'root',
})
export class DocumentosService {
  private http = inject(HttpClient);
  private baseAPi: string = appsettings.apiUrl;
  constructor() {}

  //metodo para obtener los Documetos
  DocumetosGet(): Observable<ResponseDocumetos> {
    let headers = new HttpHeaders();
    if (typeof window !== 'undefined' && localStorage) {
      const token = localStorage.getItem('token') || '';
      headers = headers.set('Authorization', `Bearer ${token}`);
    }
    return this.http.get<ResponseDocumetos>(
      `${this.baseAPi}Documentos/MostrarDocuemtos`,
      { headers }
    );
  }
  getDocumentosPorCorreo(idCorreo: number): Observable<correo> {
    const token = localStorage.getItem('token') || '';
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.get<correo>(
      `${this.baseAPi}Documentos/correo/${idCorreo}`,
      { headers }
    );
  }

  getDocumentosUser(idUsuario: number): Observable<ResponseDocumetos> {
    const token = localStorage.getItem('token') || '';
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.get<ResponseDocumetos>(
      `${this.baseAPi}Documentos/DocUser/${idUsuario}`,
      { headers }
    );
  }
  //eliminar Documento

  eliminarDcoumento(idDocumento: number): Observable<msg> {
    const token = localStorage.getItem('token') || '';
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
    return this.http.delete<msg>(
      `${this.baseAPi}Documentos/EliminarDocumento/${idDocumento}`,
      { headers }
    );
  }
  // , nombre: string, descripcion: string, privacidad: number
  // Método para subir un archivo
  subirDocumento(
    archivo: File,
    idUsuario: number,
    nombre: string,
    descripcion: string,
    es_public: number,
    ID_DEPARTAMENTO: number,
    ID_ESTRUCTURA_ARCHIVO: number,
    ID_TIPO_ARCHIVO: number,
    ID_CATEGORIA: number,
    ID_CARACTERISTICA: number,
    VALOR_CARACTERISTICA: string
  ): Observable<any> {
    // Crear un FormData para enviar el archivo y campos adicionales
    const formData = new FormData();
    formData.append('archivo', archivo); // Clave que espera el backend
    formData.append('ID_USUARIO', String(idUsuario));
    formData.append('ES_PUBLICO', String(es_public));
    formData.append('DESCRIPCION', descripcion);
    formData.append('NOMBRE', nombre);
    formData.append('ID_DEPARTAMENTO', String(ID_DEPARTAMENTO));
    formData.append('ID_ESTRUCTURA_ARCHIVOS', String(ID_ESTRUCTURA_ARCHIVO));
    formData.append('ID_TIPO_ARCHIVO', String(ID_TIPO_ARCHIVO));
    formData.append('ID_CATEGORIA', String(ID_CATEGORIA));
    formData.append('ID_CARACTERISTICA', String(ID_CARACTERISTICA));
    formData.append('VALOR_CARACTERISTICA', VALOR_CARACTERISTICA);

    // Obtener el token y construir el header con Authorization
    const token = localStorage.getItem('token') || '';
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    // Hacer el POST con FormData y headers
    return this.http.post<msg>(`${this.baseAPi}Documentos/subirDc`, formData, {
      headers,
    });
  }
  getDocumentoDetalle(id: number) {
    return this.http.get<DocumentoDetalleResponse>(
      `${this.baseAPi}Documentos/getDocumentoDetalle/${id}`
    );
  }
}
