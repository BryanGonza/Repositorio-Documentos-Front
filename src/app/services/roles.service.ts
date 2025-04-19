import { inject,Injectable } from '@angular/core'; 
import { HttpClient, HttpHeaders } from '@angular/common/http'; 
import { appsettings } from '../setting/appsetting'; 
import { ResponseRoles } from '../interfaces/Roles/ResponsegetRoles'; 
import { Roles } from '../interfaces/Roles/Roles'; 
import { Observable } from 'rxjs'; 
import { RegistroRol } from '../interfaces/Roles/RegistroRol'; 
import { ResponseRegistroRol } from '../interfaces/Roles/RegistroResponseRol'; 
import { ResponseRegistro } from '../interfaces/Usuario/RegistroRespose'; 

@Injectable({ providedIn: 'root' }) 
export class RolesService { private http = inject(HttpClient); private baseAPi : string = appsettings.apiUrl 

  constructor() { } 
  
  //metodo para obtener los roles 
  rolesget(): Observable<ResponseRoles> {
    const token = localStorage.getItem('token') || '';
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    return this.http.get<ResponseRoles>(
      `${this.baseAPi}roles/getRoles`,
      { headers }
    );
  }
 //metodo para elimianar un usuario por id 

 eliminarRol(ID_ROL: number): Observable<ResponseRoles> {
  const token = localStorage.getItem('token') || '';
  const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
  return this.http.request<ResponseRoles>(
    'delete',
    `${this.baseAPi}roles/deleteRoles`,
    {
      headers,
      body: { ID_ROL },
    }
  );
}

// Método para registrar un rol 
registrarRol(objeto: RegistroRol): Observable<ResponseRegistroRol> {
  const token = localStorage.getItem('token') || '';
  const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
  return this.http.post<ResponseRegistroRol>(
    `${this.baseAPi}roles/createRol`,
    objeto,
    { headers }
  );
}

//actualizar rol
actualizarRol(
  ID_ROL: number,
  ROL?: string,
  DESCRIPCION?: string,
  FECHA_CREACION?: Date,
  CREADO_POR?: string,
  FECHA_MODIFICACION?: Date,
  MODIFICADO_POR?: string
): Observable<ResponseRegistro> {
  const token = localStorage.getItem('token') || '';
  const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

  return this.http.put<ResponseRegistro>(
    `${this.baseAPi}roles/updateRoles`,
    {
      ID_ROL,
      ROL,
      DESCRIPCION,
      FECHA_CREACION,
      CREADO_POR,
      FECHA_MODIFICACION,
      MODIFICADO_POR
    },
    { headers }
  );
}
}