import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { SubCategoria, ResponseSubCategoria, MsgResponse } from '../interfaces/Sub_Categoria/sub_categoria';

@Injectable({
  providedIn: 'root'
})
export class SubCategoriaService {
  private apiUrl = 'http://localhost:3016/api/s_categoria';

  constructor(private http: HttpClient) {}

  getSubCategorias(): Observable<ResponseSubCategoria> {
    return this.http.get<ResponseSubCategoria>(`${this.apiUrl}/getS_categoria`);
  }

  createSubCategoria(data: SubCategoria): Observable<{ msg: string; Nuevo_Registro: SubCategoria }> {
    return this.http.post<{ msg: string; Nuevo_Registro: SubCategoria }>(`${this.apiUrl}/createS_categoria`, data);
  }

  updateSubCategoria(data: SubCategoria): Observable<MsgResponse> {
    return this.http.put<MsgResponse>(`${this.apiUrl}/updateS_categoria`, data);
  }

  deleteSubCategoria(ID_SUB_CATEGORIA: number): Observable<MsgResponse> {
    return this.http.delete<MsgResponse>(`${this.apiUrl}/deleteS_categoria`, {
      body: { ID_SUB_CATEGORIA }
    });
  }
}
