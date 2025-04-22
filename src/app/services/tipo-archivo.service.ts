import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { appsettings } from '../setting/appsetting';
import { Observable } from 'rxjs';
import { RegistroTipoArchivo, ResponseTipoArchivo } from '../interfaces/tipo-archivo/tipo-archivo';

@Injectable({
  providedIn: 'root'
})
export class TipoArchivoService {

  private http = inject(HttpClient);
   private baseAPi: string = appsettings.apiUrl;
 
   constructor() {}
 

   //metodo para obtener las facultades
   Tipoarchivoget(): Observable<ResponseTipoArchivo> {
     const token = localStorage.getItem('token') || '';
     const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
     return this.http.get<ResponseTipoArchivo>(
       `${this.baseAPi}tipo_archivo/getTipo_archivo`,
       { headers }
     );
   }
 
  //  metodo para eliminar por id
   eliminarFacultad(ID_TIPO_ARCHIVO: number): Observable<ResponseTipoArchivo> {
     const token = localStorage.getItem('token') || '';
     const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
     return this.http.request<ResponseTipoArchivo>(
       'delete',
       `${this.baseAPi}tipo_archivo/deleteTipo_archivo`,
       {
         headers,
         body: { ID_TIPO_ARCHIVO },
       }
     );
   }
 
  // Método para registrar
   registrarFacultad(objeto: RegistroTipoArchivo): Observable<ResponseTipoArchivo> {
     const token = localStorage.getItem('token') || '';
     const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
     return this.http.post<ResponseTipoArchivo>(
       `${this.baseAPi}tipo_archivo/createTipo_archivo`,
       objeto,
       { headers }
     );
   }
 
  // actualizar rol
   actualizarfacultad(
     ID_TIPO_ARCHIVO: number,
     TIPO_ARCHIVO?: string,
     LIMITE_ALMACENAMIENTO?: number
   ): Observable<ResponseTipoArchivo> {
     const token = localStorage.getItem('token') || '';
     const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
     return this.http.put<ResponseTipoArchivo>(
       `${this.baseAPi}tipo_archivo/updateTipo_archivo`,
       { ID_TIPO_ARCHIVO, TIPO_ARCHIVO, LIMITE_ALMACENAMIENTO },
       { headers }
     );
   }
}
