import { inject, Injectable } from '@angular/core';
import { appsettings } from '../setting/appsetting';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { parametros, registro, ResponseParametros } from '../interfaces/Parametros/resposeParametros';
import { ResponseRegistro } from '../interfaces/Usuario/RegistroRespose';

@Injectable({
  providedIn: 'root'
})
export class ParametrosService {
  private http = inject(HttpClient);
  private baseAPi: string = appsettings.apiUrl;
  constructor() { }

    //metodo para obtener los usuarios
    parametroGet(): Observable<ResponseParametros> {
      return this.http.get<ResponseParametros>(
        `${this.baseAPi}parametros/getParametros`
      );
    }

    //actualizar parametro
      actualizarParametro(
        ID_PARAMETRO: number,
        PARAMETRO?: string,
        VALOR?: string,
        ADMIN_INTENTOS_INVALIDOS?: number,
      ): Observable<ResponseRegistro> {
        return this.http.put<ResponseRegistro>(
          `${this.baseAPi}parametros/updateParametros`,
          {
            ID_PARAMETRO,
            PARAMETRO,
            VALOR,
            ADMIN_INTENTOS_INVALIDOS
          }
        );
      }
      //registar parametro
        registroPara(objeto: registro ): Observable<ResponseRegistro> {
          return this.http.post<ResponseRegistro>(
            `${this.baseAPi}parametros/CrearParametro`,
            objeto
          );
        }
         eliminarParametro(ID_PARAMETRO: number): Observable<ResponseRegistro> {
           return this.http.request<ResponseRegistro>('delete', `${this.baseAPi}parametros/deleteParametro`, {
             body: { ID_PARAMETRO },
           });
         }
}
