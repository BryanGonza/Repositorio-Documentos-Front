import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { appsettings } from '../setting/appsetting';
import { ResponseFacultad } from '../interfaces/UNAH/Facultad/ResponsegetFacultad';
import { Facultad } from '../interfaces/UNAH/Facultad/Facultad';
import { Observable } from 'rxjs';
import { RegistroFacultad } from '../interfaces/UNAH/Facultad/RegistroFacultad';

@Injectable({ providedIn: 'root' })
export class FacultadService {
  private http = inject(HttpClient);
  private baseAPi: string = appsettings.apiUrl;

  constructor() {}

  //metodo para obtener las facultades
  facultadget(): Observable<ResponseFacultad> {
    const token = localStorage.getItem('token') || '';
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.get<ResponseFacultad>(
      `${this.baseAPi}facultad/getFacultad`,
      { headers }
    );
  }

  //metodo para eliminar por id
  eliminarFacultad(ID_FACULTAD: number): Observable<ResponseFacultad> {
    const token = localStorage.getItem('token') || '';
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.request<ResponseFacultad>(
      'delete',
      `${this.baseAPi}facultad/deleteFacultad`,
      {
        headers,
        body: { ID_FACULTAD },
      }
    );
  }

  // Método para registrar
  registrarFacultad(objeto: RegistroFacultad): Observable<ResponseFacultad> {
    const token = localStorage.getItem('token') || '';
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.post<ResponseFacultad>(
      `${this.baseAPi}facultad/createFacultad`,
      objeto,
      { headers }
    );
  }

  //actualizar rol
  actualizarfacultad(
    ID_FACULTAD: number,
    NOMBRE?: string,
    ESTADO?: boolean
  ): Observable<ResponseFacultad> {
    const token = localStorage.getItem('token') || '';
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.put<ResponseFacultad>(
      `${this.baseAPi}facultad/updateFacultad`,
      { ID_FACULTAD, NOMBRE, ESTADO },
      { headers }
    );
  }
}
