import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { appsettings } from '../setting/appsetting';
import { Responsetipo_archivo } from '../interfaces/Tipo_Archivo/ResponsegetTipo_archivo';
import { tipo_archivo } from '../interfaces/Tipo_Archivo/Tipo_archivo';
import { Observable } from 'rxjs';
import { RegistroTipo_archivo } from '../interfaces/Tipo_Archivo/RegistroTipo_archivo';

@Injectable({ providedIn: 'root' })
export class Tipo_archivoService {
  private http = inject(HttpClient);
  private baseAPi: string = appsettings.apiUrl;

  constructor() {}

  //metodo para obtener las tipo_archivoes
  Tipo_archivoget(
    ID_TIPO_ARCHIVO?: number,
    TIPO_ARCHIVO?: string,
    LIMITE_ALMACENAMIENTO?: number
  ): Observable<Responsetipo_archivo> {
        const token = localStorage.getItem('token') || '';
         const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.get<Responsetipo_archivo>(
      `${this.baseAPi}tipo_archivo/getTipo_archivo`, {headers}
    );
  }

  //metodo para eliminar por id
  eliminartipo_archivo(
    ID_TIPO_ARCHIVO: number
  ): Observable<Responsetipo_archivo> {
    const token = localStorage.getItem('token') || '';
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.request<Responsetipo_archivo>(
      'delete',
      `${this.baseAPi}tipo_archivo/deleteTipo_archivo`,
      {
        headers,
         body: { ID_TIPO_ARCHIVO } }
    );
  }

  // Método para registrar
  registrartipo_archivo(
    objeto: RegistroTipo_archivo
  ): Observable<Responsetipo_archivo> {
    const token = localStorage.getItem('token') || '';
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.post<Responsetipo_archivo>(
      `${this.baseAPi}tipo_archivo/createTipo_archivo`,
      objeto,
      { headers }
    );
  }

  //actualizar
  actualizartipo_archivo(
    ID_TIPO_ARCHIVO?: number,
    TIPO_ARCHIVO?: string,
    LIMITE_ALMACENAMIENTO?: number
  ): Observable<Responsetipo_archivo> {
    const token = localStorage.getItem('token') || '';
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.put<Responsetipo_archivo>(
      `${this.baseAPi}tipo_archivo/updateTipo_archivo`,
      { ID_TIPO_ARCHIVO, TIPO_ARCHIVO, LIMITE_ALMACENAMIENTO },
      { headers }
      
    );
  }
}
