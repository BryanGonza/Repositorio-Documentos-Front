import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { appsettings } from '../setting/appsetting';
import { correo, msg, ResponseDocumetos } from '../interfaces/Documentos/Documetos';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class DocumentosService {
  private http = inject(HttpClient);
  private baseAPi: string = appsettings.apiUrl;
  constructor() {}

  //metodo para obtener los Documetos
  DocumetosGet(): Observable<ResponseDocumetos> {
    return this.http.get<ResponseDocumetos>(
      `${this.baseAPi}Documentos/MostrarDocuemtos`
    );
  }
  getDocumentosPorCorreo(idCorreo: number): Observable<correo> {
    return this.http.get<correo>(
      `${this.baseAPi}Documentos/correo/${idCorreo}`
    );
  }

  getDocumentosUser(idUsuario: number): Observable<ResponseDocumetos> {
    return this.http.get<ResponseDocumetos>(
      `${this.baseAPi}Documentos/DocUser/${idUsuario}`
    );
  }
  //eliminar Documento

  eliminarDcoumento(idDocumento: number): Observable<msg> {
    return this.http.delete<msg>(
      `${this.baseAPi}Documentos/EliminarDocumento/${idDocumento}`
    );
  }
  // , nombre: string, descripcion: string, privacidad: number
  // Método para subir un archivo
  subirDocumento(
    archivo: File,
    idUsuario: number,
    nombre: string,
    descripcion: string,
    es_public: number
  ): Observable<any> {
    // Crear un FormData para enviar el archivo y campos adicionales
    const formData = new FormData();
    formData.append('archivo', archivo); // Clave que espera el backend
    formData.append('ID_USUARIO', String(idUsuario));
    formData.append('ES_PUBLICO', String(es_public));
    formData.append('DESCRIPCION', descripcion);
    formData.append('NOMBRE', nombre);
  
    // Obtener el token y construir el header con Authorization
    const token = localStorage.getItem('token') || '';
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
  
    // Hacer el POST con FormData y headers
    return this.http.post<msg>(
      `${this.baseAPi}Documentos/subirDc`,
      formData,
      { headers }
    );
  }
  
}
