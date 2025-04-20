import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import {
  TipoCaracteristica,
  ResponseTipoCaracteristica,
  MsgResponse,
} from '../interfaces/Tipo_Caracteristica/tipo_caracteristica';

@Injectable({
  providedIn: 'root',
})
export class TipoCaracteristicaService {
  private baseUrl = 'http://localhost:3016/api/tipo_caracteristica';

  constructor(private http: HttpClient) {}

  // Crear nueva característica
  createTipoCaracteristica(data: TipoCaracteristica): Observable<{ msg: string; Nuevo_Registro: TipoCaracteristica }> {
    return this.http.post<{ msg: string; Nuevo_Registro: TipoCaracteristica }>(
      `${this.baseUrl}/createTipo_c`,
      data
    );
  }

  // Obtener todas las características
  getTipoCaracteristicas(): Observable<ResponseTipoCaracteristica> {
    return this.http.get<ResponseTipoCaracteristica>(`${this.baseUrl}/getTipo_c`);
  }

  // Actualizar característica existente
  updateTipoCaracteristica(data: TipoCaracteristica): Observable<MsgResponse> {
    return this.http.put<MsgResponse>(`${this.baseUrl}/updateTipo_c`, data);
  }

  // Eliminar característica por ID
  deleteTipoCaracteristica(ID_TIPO_CARACTERISTICA: number): Observable<MsgResponse> {
    return this.http.request<MsgResponse>('delete', `${this.baseUrl}/deleteTipo_c`, {
      body: { ID_TIPO_CARACTERISTICA },
    });
  }
}
