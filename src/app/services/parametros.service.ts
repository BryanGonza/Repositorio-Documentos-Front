import { inject, Injectable } from '@angular/core';
import { appsettings } from '../setting/appsetting';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import {
  parametros,
  registro,
  ResponseParametros,
} from '../interfaces/Parametros/resposeParametros';
import { ResponseRegistro } from '../interfaces/Usuario/RegistroRespose';

@Injectable({
  providedIn: 'root',
})
export class ParametrosService {
  private http = inject(HttpClient);
  private baseAPi: string = appsettings.apiUrl;
  constructor() {}

  //metodo para obtener los usuarios
  parametroGet(): Observable<ResponseParametros> {
    const token = localStorage.getItem('token') || '';
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    return this.http.get<ResponseParametros>(
      `${this.baseAPi}parametros/getParametros`,
      { headers }
    );
  }
  //actualizar parametro
  actualizarParametro(
    ID_PARAMETRO: number,
    PARAMETRO?: string,
    VALOR?: string,
    ADMIN_INTENTOS_INVALIDOS?: number
  ): Observable<ResponseRegistro> {
    const token = localStorage.getItem('token') || '';
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    return this.http.put<ResponseRegistro>(
      `${this.baseAPi}parametros/updateParametros`,
      {
        ID_PARAMETRO,
        PARAMETRO,
        VALOR,
        ADMIN_INTENTOS_INVALIDOS,
      },
      { headers }
    );
  }
  //registar parametro
  registroPara(objeto: registro): Observable<ResponseRegistro> {
    const token = localStorage.getItem('token') || '';
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    return this.http.post<ResponseRegistro>(
      `${this.baseAPi}parametros/CrearParametro`,
      objeto,
      { headers }
    );
  }
  eliminarParametro(ID_PARAMETRO: number): Observable<ResponseRegistro> {
    const token = localStorage.getItem('token') || '';
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    return this.http.request<ResponseRegistro>(
      'delete',
      `${this.baseAPi}parametros/deleteParametro`,
      {
        headers,
        body: { ID_PARAMETRO },
      }
    );
  }
}
