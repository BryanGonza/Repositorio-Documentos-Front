import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { appsettings } from '../setting/appsetting';
import { Observable } from 'rxjs';
import {
  ObjetoPermiso,
  ObjetoPermisoExtendido,
  Objetos,
} from '../interfaces/Objetos/Objetos';
import { ResponseObjetos } from '../interfaces/Objetos/Objetos';
import { RegistroObjetos } from '../interfaces/Objetos/RegistroObjetos';

@Injectable({ providedIn: 'root' })
export class ObjetosService {
  private http = inject(HttpClient);
  private baseAPi: string = appsettings.apiUrl;

  constructor() {}

  //metodo para obtener los roles
  objetosget(): Observable<ResponseObjetos> {
    const token = localStorage.getItem('token') || '';
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    return this.http.get<ResponseObjetos>(`${this.baseAPi}objetos/getObjetos`, {
      headers,
    });
  }

  //metodo para elimianar un usuario por id
  eliminar(ID_OBJETO: number): Observable<ResponseObjetos> {
    const token = localStorage.getItem('token') || '';
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.request<ResponseObjetos>(
      'delete',
      `${this.baseAPi}objetos/deleteObjetos`,
      { headers, body: { ID_OBJETO } }
    );
  }
  // Método para registrar un rol
  registrarObjeto(objeto: RegistroObjetos): Observable<ResponseObjetos> {
    const token = localStorage.getItem('token') || '';
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.post<ResponseObjetos>(
      `${this.baseAPi}objetos/createObjetos`,
      objeto,
      { headers }
    );
  }
  // Método para actualizar un objeto
  actualizarObjeto(

    ID_OBJETO: number,
    OBJETO?: string,
    TIPO_OBJETO?: string,
    DESCRIPCION?: string,
    FECHA_CREACION?: Date,
    CREADO_POR?: string,
    FECHA_MODIFICACION?: Date,
    MODIFICADO_POR?: string
  ): Observable<ResponseObjetos> {
    const token = localStorage.getItem('token') || '';
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.put<ResponseObjetos>(
      `${this.baseAPi}objetos/updateObjetos`,
      {
        ID_OBJETO,
        OBJETO,
        TIPO_OBJETO,
        DESCRIPCION,
        FECHA_CREACION,
        CREADO_POR,
        FECHA_MODIFICACION,
        MODIFICADO_POR,
      },
      { headers }
    );
  }

  getObjetosPermiss(
    token = localStorage.getItem('token') || ''
  ): Observable<ObjetoPermiso[]> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
    return this.http.get<ObjetoPermiso[]>(
      `${this.baseAPi}objetos/objetosPermisos`,
      { headers }
    );
  }
  getObjetosPermisos(
    token = localStorage.getItem('token') || ''
  ): Observable<ObjetoPermisoExtendido[]> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
    return this.http.get<ObjetoPermisoExtendido[]>(
      `${this.baseAPi}objetos/objetosPermisos`,
      { headers }
    );
  }
}
