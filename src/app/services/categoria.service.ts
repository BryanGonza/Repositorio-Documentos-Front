import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Categoria, ResponseCategoria, MsgResponse } from '../interfaces/Categoria/categoria';

@Injectable({
  providedIn: 'root'
})
export class CategoriaService {
  private apiUrl = 'http://localhost:3016/api/categoria';

  constructor(private http: HttpClient) {}

  getCategorias(): Observable<ResponseCategoria> {
    return this.http.get<ResponseCategoria>(`${this.apiUrl}/getCategoria`);
  }

  createCategoria(data: Categoria): Observable<{ msg: string; Nuevo_Registro: Categoria }> {
    return this.http.post<{ msg: string; Nuevo_Registro: Categoria }>(
      `${this.apiUrl}/createCategoria`,
      data
    );
  }

  updateCategoria(data: Categoria): Observable<MsgResponse> {
    return this.http.put<MsgResponse>(`${this.apiUrl}/updateCategoria`, data);
  }

  deleteCategoria(ID_CATEGORIA: number): Observable<MsgResponse> {
    return this.http.request<MsgResponse>('delete', `${this.apiUrl}/deleteCategoria`, {
      body: { ID_CATEGORIA }
    });
  }
}
export { Categoria };

