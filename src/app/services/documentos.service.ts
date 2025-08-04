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
  idTipoDocumento: number,
  nombre: string,
  descripcion: string,
  esPublico: number,
  idDepartamento: number,
  idClase: number,
  idEstructuraArchivos: number,
  idTipoArchivo: number,
  idCategoria: number,
  idSubCategoria: number,
  caracteristicas: { ID_CARACTERISTICA: number; VALOR: string }[]
): Observable<any> {
  const formData = new FormData();

  // Archivo
  formData.append('archivo', archivo);

  // Campos simples
  formData.append('ID_USUARIO', idUsuario.toString());
  formData.append('ID_TIPO_DOCUMENTO', idTipoDocumento.toString());
  formData.append('NOMBRE', nombre);
  formData.append('DESCRIPCION', descripcion);
  formData.append('ES_PUBLICO', String(esPublico));
  formData.append('ID_DEPARTAMENTO', idDepartamento.toString());
  formData.append('ID_CLASE', idClase.toString());
  formData.append('ID_ESTRUCTURA_ARCHIVOS', idEstructuraArchivos.toString());
  formData.append('ID_TIPO_ARCHIVO', idTipoArchivo.toString());
  formData.append('ID_CATEGORIA', idCategoria.toString());
  formData.append('ID_SUB_CATEGORIA', idSubCategoria.toString());

  // Array de características: lo enviamos como JSON
  formData.append('caracteristicas', JSON.stringify(caracteristicas));

  // Header con token
  const token = localStorage.getItem('token') || '';
  const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

  return this.http.post<msg>(
    `${this.baseAPi}Documentos/subirDc`,
    formData,
    { headers }
  );
}

  getDocumentoDetalle(id: number) {
    return this.http.get<DocumentoDetalleResponse>(
      `${this.baseAPi}Documentos/getDocumentoDetalle/${id}`
    );
  }
}
