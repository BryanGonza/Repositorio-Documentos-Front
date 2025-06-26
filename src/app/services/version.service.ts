import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { appsettings } from '../setting/appsetting';
import { Version } from '../interfaces/Documentos/Version/Version';
import { ResponseVersion } from '../interfaces/Documentos/Version/ResponsegetVersion';
import { RegistroVersion } from '../interfaces/Documentos/Version/RegistroVersion';

import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class VersionService {
  private http = inject(HttpClient);
  private baseAPi: string = appsettings.apiUrl;

  constructor() {}

  //metodo para obtener las registros
  versionget(): Observable<ResponseVersion> {
    const token = localStorage.getItem('token') || '';
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.get<ResponseVersion>(`${this.baseAPi}version/getVersion`, {
      headers,
    });
  }

  //metodo para eliminar por id
  eliminarversion(ID_VERSION: number): Observable<ResponseVersion> {
    const token = localStorage.getItem('token') || '';
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.request<ResponseVersion>(
      'delete',
      `${this.baseAPi}version/deleteVersion`,
      {
        headers,
        body: { ID_VERSION },
      }
    );
  }

  // Método para registrar
  registrarversion(objeto: RegistroVersion): Observable<ResponseVersion> {
    const token = localStorage.getItem('token') || '';
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.post<ResponseVersion>(
      `${this.baseAPi}version/createVersion`,
      objeto,
      { headers }
    );
  }

  //actualizar
  actualizarVersion(
    ID_VERSION: number,
    ID_USUARIO: number,
    NOMBRE: string,
    CAMBIOS: boolean,
    FECHA_ACTU: Date
  ): Observable<ResponseVersion> {
    const token = localStorage.getItem('token') || '';
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.put<ResponseVersion>(
      `${this.baseAPi}version/updateVersion`,
      { ID_VERSION, ID_USUARIO, NOMBRE, CAMBIOS, FECHA_ACTU },
      { headers }
    );
  }
}
