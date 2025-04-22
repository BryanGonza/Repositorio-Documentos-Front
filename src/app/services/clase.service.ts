import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import {
  Clase as ImportedClase,
  ResponseClases,
} from '../interfaces/UNAH/Facultad/clase'; // Importa la interfaz Clase desde el archivo correcto

export interface Clase {
  ID_CLASE?: number;
  NOMBRE: string;
  APROBADO: string;
  RECEPCIONADO: string;
  FORMATO: string;
  ESTADO: boolean;
}

@Injectable({
  providedIn: 'root',
})
export class ClaseService {
  private baseUrl = 'http://localhost:3016/api/clase';

  constructor(private http: HttpClient) {}

  //  Crear una nueva clase
  createClase(clase: Clase): Observable<any> {
    const token = localStorage.getItem('token') || '';
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.post(`${this.baseUrl}/createClase`, clase, { headers });
  }

  //  Obtener todas las clases
  getClases(): Observable<any> {
    const token = localStorage.getItem('token') || '';
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.get(`${this.baseUrl}/getClase`, { headers });
  }

  //  Actualizar clase existente
  updateClase(clase: Clase): Observable<any> {
    const token = localStorage.getItem('token') || '';
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.put(`${this.baseUrl}/updateClase`, clase, { headers });
  }

  //  Eliminar clase por ID
  deleteClase(ID_CLASE: number): Observable<any> {
    const token = localStorage.getItem('token') || '';
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.request('delete', `${this.baseUrl}/deleteClase`, {
      headers,
      body: { ID_CLASE },
    });
  }
}
