import { inject,Injectable } from '@angular/core'; 
import { HttpClient } from '@angular/common/http'; 
import { appsettings } from '../setting/appsetting'; 
import { ResponseEstado } from '../interfaces/Estado/ResponsegetEstado';
import { Estado } from '../interfaces/Estado/Estado';
import { RegistroEstado } from '../interfaces/Estado/RegistroEstado';
import { Observable } from 'rxjs'; 


@Injectable({ providedIn: 'root' }) 
export class EstadoService { private http = inject(HttpClient); private baseAPi : string = appsettings.apiUrl 

  constructor() { } 
  
  //metodo para obtener las registros
  estadoget() : Observable<ResponseEstado>{ 
    return this.http.get<ResponseEstado>(`${this.baseAPi}estado/getEstado`)
 } 
 

 //metodo para eliminar por id 
 eliminarEstado(ID_ESTADO: number): Observable<ResponseEstado> {
   return this.http.request<ResponseEstado>('delete', `${this.baseAPi}estado/deleteEstado`, { body: { ID_ESTADO }, }); 
} 

// Método para registrar 
registrarEstado(objeto:RegistroEstado): Observable<ResponseEstado> { 
  return this.http.post<ResponseEstado>(`${this.baseAPi}estado/createEstado`, objeto); 
} 

//actualizar 
 actualizarEstado (ID_ESTADO: number, ESTADO: string ): Observable<ResponseEstado> { 
    return this.http.put<ResponseEstado>( `${this.baseAPi}estado/updateEstado`, 
      {ID_ESTADO, ESTADO} ); 
  } 
}