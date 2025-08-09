import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { appsettings } from '../setting/appsetting';
import { ReporteDocumento, ReporteDocumentosResponse } from '../interfaces/Reporte/ReporteDocumento';

@Injectable({
  providedIn: 'root'
})
export class ReporteDocumentosService {
  private http = inject(HttpClient);
  private baseApi = `${appsettings.apiUrl}reporte/documentos`;

  constructor() {}
  getReporteDocumentos(
    fecha_inicio?: string,
    fecha_fin?: string,
    usuario?: string,
    accion?: string,
    nombre_documento?: string
  ): Observable<ReporteDocumentosResponse> {
    const token = localStorage.getItem('token') || '';
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    let params = '';
    const queryParams: string[] = [];

    if (fecha_inicio) queryParams.push(`fecha_inicio=${fecha_inicio}`);
    if (fecha_fin) queryParams.push(`fecha_fin=${fecha_fin}`);
    if (usuario) queryParams.push(`usuario=${usuario}`);
    if (accion) queryParams.push(`accion=${accion}`);
    if (nombre_documento) queryParams.push(`nombre_documento=${nombre_documento}`);

    if (queryParams.length > 0) {
      params = '?' + queryParams.join('&');
    }

    return this.http.get<ReporteDocumentosResponse>(`${this.baseApi}${params}`, { headers });
  }
}

// Exportamos el tipo ReporteDocumento para reutilizar en componentes
export { ReporteDocumento };