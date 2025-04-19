import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { appsettings } from '../setting/appsetting';
import { lOg } from '../interfaces/Usuario/Login';
import { Observable } from 'rxjs';
import { accesoRespose } from '../interfaces/Usuario/accesoRespose';
import { ResponseUsuarios } from '../interfaces/Usuario/ResposegetUsuarios';
import { ResponseRegistro } from '../interfaces/Usuario/RegistroRespose';
import { registroUsuario } from '../interfaces/Usuario/RegistroUsuario';
import {
  RecuContracontra,
  ResetContrasenaCode,
} from '../interfaces/Usuario/RecuperacionContrasena';
import { emaliUser, Usuarios } from '../interfaces/Usuario/Usuarios';

@Injectable({
  providedIn: 'root',
})
export class UsuariosService {
  private http = inject(HttpClient);
  private baseAPi: string = appsettings.apiUrl;
  constructor() {}

  login(objeto: lOg): Observable<accesoRespose> {
    return this.http.post<accesoRespose>(
      `${this.baseAPi}ms_usuarios/login`,
      objeto
    );
  }
  CambiarPrimerContrasena(obejto: lOg): Observable<accesoRespose> {
    return this.http.post<accesoRespose>(
      `${this.baseAPi}ms_usuarios/cambioContrasena`,
      obejto
    );
  }
  Cambiarcontraperfil(obejto: lOg): Observable<accesoRespose> {
    return this.http.post<accesoRespose>(
      `${this.baseAPi}ms_usuarios/cambiarConperfil`,
      obejto
    );
  }
  perfil(objeto: emaliUser): Observable<Usuarios> {
    return this.http.post<Usuarios>(
      `${this.baseAPi}ms_usuarios/getUsuarioEmail`,
      objeto
    );
  }

  //metodo para obtener los usuarios
  usuariosget(): Observable<ResponseUsuarios> {
  const token = localStorage.getItem('token') || '';
  const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
  return this.http.get<ResponseUsuarios>(`${this.baseAPi}ms_usuarios/getUsuarios`, { headers });
  }
  //metodo para elimianar un usuario por id
  eliminar(ID_USUARIO: number): Observable<ResponseRegistro> {
    const token = localStorage.getItem('token') || '';
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.request<ResponseRegistro>(
      'delete',
      `${this.baseAPi}ms_usuarios/deleteUsuario`,
      {
        headers,
        body: { ID_USUARIO },
      }
    );
  }
  //registrar un usuario
  registro(objeto: registroUsuario): Observable<ResponseRegistro> {
    const token = localStorage.getItem('token') || '';
  const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
  return this.http.post<ResponseRegistro>(`${this.baseAPi}ms_usuarios/register`, objeto, { headers });
}
  //actualizar un usuario
  actualizarUsuario(
    ID_USUARIO: number,
    USUARIO?: string,
    NOMBRE_USUARIO?: string,
    CORREO_ELECTRONICO?: string,
    CONTRASEÑA?: string
  ): Observable<ResponseRegistro> {
    const token = localStorage.getItem('token') || '';
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.put<ResponseRegistro>(
      `${this.baseAPi}ms_usuarios/updateUsuario`,
      {
        ID_USUARIO,
        USUARIO,
        NOMBRE_USUARIO,
        CORREO_ELECTRONICO,
        CONTRASEÑA,
      },
      { headers }
    );
  }
  

  //recuperar contraseña
  recucontraCorre(objeto: RecuContracontra): Observable<ResponseRegistro> {
    return this.http.post<ResponseRegistro>(
      `${this.baseAPi}ms_usuarios/request-password-reset`,
      objeto
    );
  }
  ResetContrasena(objeto: ResetContrasenaCode): Observable<ResponseRegistro> {
    return this.http.post<ResponseRegistro>(
      `${this.baseAPi}ms_usuarios/reset-password`,
      objeto
    );
  }

}
