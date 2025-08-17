import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import {
  TipoCaracteristica,
  ResponseTipoCaracteristica,
  MsgResponse,
} from '../interfaces/Tipo_Caracteristica/tipo_caracteristica';
import { appsettings } from '../setting/appsetting';

@Injectable({
  providedIn: 'root',
})
export class TipoCaracteristicaService {
  private baseUrl = appsettings.apiUrl + 'tipo_caracteristica';

  constructor(private http: HttpClient) {}

  private authHeaders(): HttpHeaders {
    const token = localStorage.getItem('token') || '';
    return new HttpHeaders().set('Authorization', `Bearer ${token}`);
  }

  // Crear nueva característica
  createTipoCaracteristica(
    data: TipoCaracteristica
  ): Observable<{ msg: string; Nuevo_Registro: TipoCaracteristica }> {
    return this.http.post<{ msg: string; Nuevo_Registro: TipoCaracteristica }>(
      `${this.baseUrl}/createTipo_c`,
      data,
      { headers: this.authHeaders() }
    );
  }

  // Obtener todas las características
  getTipoCaracteristicas(): Observable<ResponseTipoCaracteristica> {
    return this.http.get<ResponseTipoCaracteristica>(
      `${this.baseUrl}/getTipo_c`,
      { headers: this.authHeaders() }
    );
  }

  // Actualizar característica existente
  updateTipoCaracteristica(
    data: TipoCaracteristica
  ): Observable<MsgResponse> {
    return this.http.put<MsgResponse>(`${this.baseUrl}/updateTipo_c`, data, {
      headers: this.authHeaders(),
    });
  }

  // Eliminar característica por ID
  deleteTipoCaracteristica(
    ID_TIPO_CARACTERISTICA: number
  ): Observable<MsgResponse> {
    return this.http.request<MsgResponse>(
      'delete',
      `${this.baseUrl}/deleteTipo_c`,
      {
        headers: this.authHeaders(),
        body: { ID_TIPO_CARACTERISTICA },
      }
    );
  }
}