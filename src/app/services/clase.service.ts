import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Clase as ImportedClase, ResponseClases} from '../interfaces/UNAH/Facultad/clase'; // Importa la interfaz Clase desde el archivo correcto


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
    return this.http.post(`${this.baseUrl}/createClase`, clase);
  }

  //  Obtener todas las clases
  getClases(): Observable<any> {
    return this.http.get(`${this.baseUrl}/getClase`);
  }

  //  Actualizar clase existente
  updateClase(clase: Clase): Observable<any> {
    return this.http.put(`${this.baseUrl}/updateClase`, clase);
  }

  //  Eliminar clase por ID
  deleteClase(ID_CLASE: number): Observable<any> {
    return this.http.request('delete', `${this.baseUrl}/deleteClase`, {
      body: { ID_CLASE },
    });
  }
}