import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { appsettings } from '../setting/appsetting';
import { ResponseTipoDocumento } from '../interfaces/Documentos/tipo_documento/tipo_documento';
import { TipoDocumento } from '../interfaces/Documentos/tipo_documento/tipo_documento';
import { Observable } from 'rxjs';
import { RegistroTipoDocumento } from '../interfaces/Documentos/tipo_documento/RegistroTipo';

@Injectable({ providedIn: 'root' })
export class TipoDocumentoService {
  private http = inject(HttpClient);
  private baseAPi: string = appsettings.apiUrl;

  constructor() {}

  //metodo para obtener las tipos documento
  tipo_dget(): Observable<ResponseTipoDocumento> {
    const token = localStorage.getItem('token') || '';
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.get<ResponseTipoDocumento>(
      `${this.baseAPi}tipo_documento/getTipo_d`,
      { headers }
    );
  }

  //metodo para eliminar por id
  eliminartipo_d(ID_TIPO_DOCUMENTO: number): Observable<ResponseTipoDocumento> {
    const token = localStorage.getItem('token') || '';
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.request<ResponseTipoDocumento>(
      'delete',
      `${this.baseAPi}tipo_documento/deleteTipo_d`,
      
      { headers,
         body: { ID_TIPO_DOCUMENTO } }
    );
  }

  // Método para registrar
  registrartipo_d(
    objeto: RegistroTipoDocumento
  ): Observable<ResponseTipoDocumento> {
    const token = localStorage.getItem('token') || '';
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.post<ResponseTipoDocumento>(
      `${this.baseAPi}tipo_documento/createTipo_d`,
      objeto,
      { headers }
    );
  }

  //actualizar
  actualizartipo_d(
    ID_TIPO_DOCUMENTO: number,
    TIPO_DOCUMENTO?: string,
    ESTADO?: boolean
  ): Observable<ResponseTipoDocumento> {
    const token = localStorage.getItem('token') || '';
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.put<ResponseTipoDocumento>(
      `${this.baseAPi}tipo_documento/updateTipo_d`,
      { ID_TIPO_DOCUMENTO, TIPO_DOCUMENTO, ESTADO }, 
        { headers }
    );
  }
}
