import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { appsettings } from '../setting/appsetting';
import { ResponseEstructuraArchivos } from '../interfaces/Documentos/Estructura_archivos/Estructura_archivos';
import { EstructuraArchivos } from '../interfaces/Documentos/Estructura_archivos/Estructura_archivos';
import { Observable } from 'rxjs';
import { RegistroEstructuraArchivos } from '../interfaces/Documentos/Estructura_archivos/ResgistroEstructura_archivos';

@Injectable({ providedIn: 'root' })
export class EstructuraArchivosService {
  private http = inject(HttpClient);
  private baseAPi: string = appsettings.apiUrl;

  constructor() {}

  //metodo para obtener las registros
  estructuraget(): Observable<ResponseEstructuraArchivos> {
    const token = localStorage.getItem('token') || '';
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.get<ResponseEstructuraArchivos>(
      `${this.baseAPi}estructura_archivos/getEstructura`, { headers }
    );
  }

  //metodo para eliminar por id
  eliminarEstructura(
    ID_ESTRUCTURA_ARCHIVOS: number
  ): Observable<ResponseEstructuraArchivos> {
    const token = localStorage.getItem('token') || '';
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.request<ResponseEstructuraArchivos>(
      'delete',
      `${this.baseAPi}estructura_archivos/deleteEstructura`,
      { 
        headers,
        body: { ID_ESTRUCTURA_ARCHIVOS } }
    );
  }

  // Método para registrar
  registrarEstructura(
    objeto: RegistroEstructuraArchivos
  ): Observable<ResponseEstructuraArchivos> {
    const token = localStorage.getItem('token') || '';
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.post<ResponseEstructuraArchivos>(
      `${this.baseAPi}estructura_archivos/createEstructura`,
      objeto,
      { headers }
    );
  }

  //actualizar
  actualizarEstructura(
    ID_ESTRUCTURA_ARCHIVOS: number,
    ID_DEPARTAMENTO: number,
    ESPACIO_ALMACENAMIENTO: bigint,
    NOMBRE: string,
    UBICACION: string
  ): Observable<ResponseEstructuraArchivos> {
    const token = localStorage.getItem('token') || '';
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.put<ResponseEstructuraArchivos>(
      `${this.baseAPi}estructura_archivos/updateEstructura`,
      {
        ID_ESTRUCTURA_ARCHIVOS,
        ID_DEPARTAMENTO,
        ESPACIO_ALMACENAMIENTO,
        NOMBRE,
        UBICACION,
      },
      { headers }
    );
  }
}
