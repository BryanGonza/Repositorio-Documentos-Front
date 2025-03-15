import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { appsettings } from '../setting/appsetting';
import { ResponsePermisos } from '../interfaces/Permisos/Permisos';
import { Permisos } from '../interfaces/Permisos/Permisos';
import { Observable } from 'rxjs';
import { RegistroPermiso } from '../interfaces/Permisos/RegistroPermisos';
import { ResponseRegistroPermiso } from '../interfaces/Permisos/RegistroResponsePermiso';

@Injectable({
  providedIn: 'root'
})
export class PermisosService {
  private http = inject(HttpClient);
  private baseAPi: string = appsettings.apiUrl;
  
  constructor() { }

 //metodo para obtener los roles
 getPermisos() : Observable<ResponsePermisos>{
     return this.http.get<ResponsePermisos>(`${this.baseAPi}permisos/getPermisos`)
   }
   
   //metodo para elimianar un usuario por id
 eliminarPermiso(ID_PERMISO: number): Observable<ResponsePermisos> {
   return this.http.request<ResponsePermisos>('delete', `${this.baseAPi}permisos/deletePermiso`, {
     body: { ID_PERMISO },
   });
 }

 // Método para registrar un rol 
 registrarPermiso(objeto:RegistroPermiso): Observable<ResponseRegistroPermiso> { 
   return this.http.post<ResponseRegistroPermiso>(`${this.baseAPi}permisos/createPermiso`, objeto); 
 } 

  // Método para actualizar un permiso
  actualizarPermiso(
    ID_PERMISO: number,
    ID_ROL?: number,
    ID_OBJETO?: number,
    PERMISO_INSERCION?: string,
    PERMISO_ELIMINACION?: string,
    PERMISO_ACTUALIZACION?: string,
    PERMISO_CONSULTAR?: string,
    CREADO_POR?: string,
    MODIFICADO_POR?: string,
    FECHA_CREACION?: Date,
    FECHA_MODIFICACION?: Date
  ): Observable<ResponsePermisos> {
    return this.http.put<ResponsePermisos>(`${this.baseAPi}permisos/updatePermiso`, {
      ID_PERMISO,
      ID_ROL,
      ID_OBJETO,
      PERMISO_INSERCION,
      PERMISO_ELIMINACION,
      PERMISO_ACTUALIZACION,
      PERMISO_CONSULTAR,
      CREADO_POR,
      MODIFICADO_POR,
      FECHA_CREACION,
      FECHA_MODIFICACION
    });
  }
}
