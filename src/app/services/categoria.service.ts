import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Categoria, ResponseCategoria, MsgResponse } from '../interfaces/Categoria/categoria';

@Injectable({
  providedIn: 'root'
})
export class CategoriaService {
  private apiUrl = 'http://localhost:3016/api/categoria';

  constructor(private http: HttpClient) {}

  getCategorias(): Observable<ResponseCategoria> {
        const token = localStorage.getItem('token') || '';
        const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.get<ResponseCategoria>(`${this.apiUrl}/getCategoria`, { headers });
  }

  createCategoria(data: Categoria): Observable<{ msg: string; Nuevo_Registro: Categoria }> {
    const token = localStorage.getItem('token') || '';
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.post<{ msg: string; Nuevo_Registro: Categoria }>(
      `${this.apiUrl}/createCategoria`,
      data,
      { headers }
    );
  }

  updateCategoria(data: Categoria): Observable<MsgResponse> {
    const token = localStorage.getItem('token') || '';
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.put<MsgResponse>(`${this.apiUrl}/updateCategoria`, data, { headers });
  }

  deleteCategoria(ID_CATEGORIA: number): Observable<MsgResponse> {
    const token = localStorage.getItem('token') || '';
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.request<MsgResponse>('delete', `${this.apiUrl}/deleteCategoria`, {
      headers,
      body: { ID_CATEGORIA }
    });
  }
}
export { Categoria };

