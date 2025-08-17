import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Categoria, ResponseCategoria, MsgResponse } from '../interfaces/Categoria/categoria';
import { appsettings } from '../setting/appsetting';

@Injectable({ providedIn: 'root' })
export class CategoriaService {
 
  private baseUrl = appsettings.apiUrl + 'categoria';

  constructor(private http: HttpClient) {}

  private authHeaders(): HttpHeaders {
    const token = localStorage.getItem('token') || '';
    return new HttpHeaders().set('Authorization', `Bearer ${token}`);
  }

  getCategorias(): Observable<ResponseCategoria> {
    return this.http.get<ResponseCategoria>(`${this.baseUrl}/getCategoria`, {
      headers: this.authHeaders(),
    });
  }

  createCategoria(data: Categoria): Observable<{ msg: string; Nuevo_Registro: Categoria }> {
    return this.http.post<{ msg: string; Nuevo_Registro: Categoria }>(
      `${this.baseUrl}/createCategoria`,
      data,
      { headers: this.authHeaders() }
    );
  }

  updateCategoria(data: Categoria): Observable<MsgResponse> {
    return this.http.put<MsgResponse>(`${this.baseUrl}/updateCategoria`, data, {
      headers: this.authHeaders(),
    });
  }

  deleteCategoria(ID_CATEGORIA: number): Observable<MsgResponse> {
    return this.http.request<MsgResponse>('delete', `${this.baseUrl}/deleteCategoria`, {
      headers: this.authHeaders(),
      body: { ID_CATEGORIA },
    });
  }
}

export { Categoria };
