import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { appsettings } from '../setting/appsetting';
import { Caracteristica } from '../interfaces/Documentos/Caracteristica/Caracteristica';
import { ResponseCaracteristica } from '../interfaces/Documentos/Caracteristica/ResponsegetC';
import { RegistroCaracteristica } from '../interfaces/Documentos/Caracteristica/RegistroCaracteristica';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class CaracteristicaService {
  private http = inject(HttpClient);
  private baseAPi: string = appsettings.apiUrl;

  constructor() {}

  //metodo para obtener las registros
  cget(): Observable<ResponseCaracteristica> {
    const token = localStorage.getItem('token') || '';
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.get<ResponseCaracteristica>(
      `${this.baseAPi}caracteristica/getCaracteristica`, { headers }
    );
  }

  //metodo para eliminar por id
  eliminarc(ID_CARACTERISTICA: number): Observable<ResponseCaracteristica> {
    const token = localStorage.getItem('token') || '';
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.request<ResponseCaracteristica>(
      'delete',
      `${this.baseAPi}caracteristica/deleteCaracteristica`,
      { 
        headers,
        body: { ID_CARACTERISTICA } }
    );
  }

  // Método para registrar
  registrarc(
    objeto: RegistroCaracteristica
  ): Observable<ResponseCaracteristica> {
    const token = localStorage.getItem('token') || '';
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.post<ResponseCaracteristica>(
      `${this.baseAPi}caracteristica/createCaracteristica`,
      objeto
    , { headers }
    );
  }

  //actualizar
  actualizarc(
    ID_CARACTERISTICA: number,
    ID_TIPO_CARACTERISTICA: number,
    CARACTERISTICA: string,
    VALORES_PREDETERMINADOS: Boolean
  ): Observable<ResponseCaracteristica> {
    const token = localStorage.getItem('token') || '';
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.put<ResponseCaracteristica>(
      `${this.baseAPi}caracteristica/updateCaracteristica`,
      {
        ID_CARACTERISTICA,
        ID_TIPO_CARACTERISTICA,
        CARACTERISTICA,
        VALORES_PREDETERMINADOS,
      }
    , { headers }
    );
  }
}
