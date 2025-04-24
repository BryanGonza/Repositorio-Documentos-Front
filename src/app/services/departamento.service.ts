import { inject,Injectable } from '@angular/core'; 
import { HttpClient } from '@angular/common/http'; 
import { appsettings } from '../setting/appsetting'; 
import { ResponseDepartamento } from '../interfaces/Departamento/ResponsegetDepartamento';
import { departamento } from '../interfaces/Departamento/Departamento';
import { Observable } from 'rxjs'; 
import { Registrodepartamento } from '../interfaces/Departamento/RegistroDepartamento'; 


@Injectable({ providedIn: 'root' }) 
export class DepartamentoService { private http = inject(HttpClient); private baseAPi : string = appsettings.apiUrl 

  constructor() { } 
  
  //metodo para obtener los departamento
  Departamentoget( ) : Observable<ResponseDepartamento>{ 
    return this.http.get<ResponseDepartamento>(`${this.baseAPi}departamentos/getDep`)
 } 

 //metodo para eliminar por id 
 eliminardepartamento(ID_DEPARTAMENTO: number): Observable<ResponseDepartamento> {
   return this.http.request<ResponseDepartamento>('delete', `${this.baseAPi}departamentos/deleteDep`, { body: { ID_DEPARTAMENTO }, }); 
} 

// Método para registrar 
registrardepartamento(objeto:Registrodepartamento): Observable<ResponseDepartamento> { 
  return this.http.post<ResponseDepartamento>(`${this.baseAPi}departamentos/createDep`, objeto); 
} 

//actualizar
 actualizardepartamento(ID_DEPARTAMENTO?: number, ID_FACULTAD?: number, NOMBRE?: string, ESTADO?: boolean ): Observable<ResponseDepartamento> { 
    return this.http.put<ResponseDepartamento>( `${this.baseAPi}departamentos/updateDep`, 
      { ID_DEPARTAMENTO, ID_FACULTAD, NOMBRE, ESTADO } ); 
  } 
}
