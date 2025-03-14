import { HttpClient } from '@angular/common/http';
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

  // Método para subir un archivo
  subirDocumento(archivo: File, idUsuario: string): Observable<any> {
    // Crear un FormData para enviar el archivo y el ID de usuario
    const formData = new FormData();
    formData.append('archivo', archivo); // La clave 'archivo' debe coincidir con lo que espera el backend
    formData.append('ID_USUARIO', idUsuario); // Convertir el ID de usuario a string

   return this.http.post<msg>(
         `${this.baseAPi}Documentos/subirDc`,
         formData
       );
  
  }
}
