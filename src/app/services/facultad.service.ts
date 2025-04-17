import { inject,Injectable } from '@angular/core'; 
import { HttpClient } from '@angular/common/http'; 
import { appsettings } from '../setting/appsetting'; 
import { ResponseFacultad } from '../interfaces/UNAH/Facultad/ResponsegetFacultad';
import { Facultad } from '../interfaces/UNAH/Facultad/Facultad';
import { Observable } from 'rxjs'; 
import { RegistroFacultad } from '../interfaces/UNAH/Facultad/RegistroFacultad'; 


@Injectable({ providedIn: 'root' }) 
export class FacultadService { private http = inject(HttpClient); private baseAPi : string = appsettings.apiUrl 

  constructor() { } 
  
  //metodo para obtener las facultades
  facultadget() : Observable<ResponseFacultad>{ 
    return this.http.get<ResponseFacultad>(`${this.baseAPi}facultad/getFacultad`)
 } 

 //metodo para eliminar por id 
 eliminarFacultad(ID_FACULTAD: number): Observable<ResponseFacultad> {
   return this.http.request<ResponseFacultad>('delete', `${this.baseAPi}facultad/deleteFacultad`, { body: { ID_FACULTAD }, }); 
} 

// Método para registrar 
registrarFacultad(objeto:RegistroFacultad): Observable<ResponseFacultad> { 
  return this.http.post<ResponseFacultad>(`${this.baseAPi}facultad/createFacultad`, objeto); 
} 

//actualizar rol
 actualizarfacultad( ID_FACULTAD: number, NOMBRE?: string, ESTADO?: boolean ): Observable<ResponseFacultad> { 
    return this.http.put<ResponseFacultad>( `${this.baseAPi}facultad/updateFacultad`, 
      { ID_FACULTAD, NOMBRE, ESTADO } ); 
  } 
}
