import { inject, Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { ObjetoPermiso } from './interfaces/Objetos/Objetos';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { appsettings } from './setting/appsetting';

@Injectable({
  providedIn: 'root'
})
export class SharedService {private http = inject(HttpClient); private baseAPi : string = appsettings.apiUrl 
  // clave para almacenar el rol en localStorage
  private correoKey = 'userCorreo';
  private rolKey = 'userRol';
    private permisosKey = 'userPermisos';

  // correo
  private correoSubject = new BehaviorSubject<string>(this.getStoredCorreo());
  public correo$ = this.correoSubject.asObservable();
    private permisosSubject = new BehaviorSubject<ObjetoPermiso[]>(this.getStoredPermisos());
    public permisos$ = this.permisosSubject.asObservable();

  // Rol
  private rolSubject = new BehaviorSubject<string>(this.getStoredRol());
  public rol$ = this.rolSubject.asObservable();

  constructor() { }

  // Métodos para correo

  private getStoredCorreo(): string {
    if (typeof window !== 'undefined' && window.localStorage) {
      return localStorage.getItem(this.correoKey) || '';
    }
    return '';
  }

  setCorreo(correo: string) {
    this.correoSubject.next(correo);
    if (typeof window !== 'undefined' && window.localStorage) {
      localStorage.setItem(this.correoKey, correo);
    }
  }

  getCorreo(): string {
    return this.correoSubject.getValue();
  }

  clearCorreo() {
    this.correoSubject.next('');
    if (typeof window !== 'undefined' && window.localStorage) {
      localStorage.removeItem(this.correoKey);
    }
  }
// Métodos para permisos
 private getStoredPermisos(): ObjetoPermiso[] {
    if (typeof window !== 'undefined' && window.localStorage) {
      const permisos = localStorage.getItem(this.permisosKey);
      return permisos ? JSON.parse(permisos) : [];
    }
    return [];
  }
  setPermisos(permisos: ObjetoPermiso[]) {
    this.permisosSubject.next(permisos);
    if (typeof window !== 'undefined' && window.localStorage) {
      localStorage.setItem(this.permisosKey, JSON.stringify(permisos));
    }
  }

  getPermisos(): ObjetoPermiso[] {
    return this.permisosSubject.getValue();
  }

  clearPermisos() {
    this.permisosSubject.next([]);
    if (typeof window !== 'undefined' && window.localStorage) {
      localStorage.removeItem(this.permisosKey);
    }
  }

  // Método para verificar permisos
  
hasPermission(objeto: string, accion: 'CONSULTAR' | 'INSERCION' | 'ACTUALIZACION' | 'ELIMINACION'): boolean {
  const permisos = this.getPermisos();
  const permiso = permisos.find(p => 
    p.OBJETO.trim().toLowerCase() === objeto.trim().toLowerCase());
  
  if (!permiso) return false;
  
  // Mapeo manual de acciones a propiedades
  switch(accion) {
    case 'CONSULTAR':
      return (permiso as any).PERMISO_CONSULTAR === 'SI';
    case 'INSERCION':
      return (permiso as any).PERMISO_INSERCION === 'SI';
    case 'ACTUALIZACION':
      return (permiso as any).PERMISO_ACTUALIZACION === 'SI';
    case 'ELIMINACION':
      return (permiso as any).PERMISO_ELIMINACION === 'SI';
    default:
      return false;
  }
}
  // Metodos para rol

  private getStoredRol(): string {
    if (typeof window !== 'undefined' && window.localStorage) {
      return localStorage.getItem(this.rolKey) || '';
    }
    return '';
  }

  setRol(rol: string) {
    this.rolSubject.next(rol);
    if (typeof window !== 'undefined' && window.localStorage) {
      localStorage.setItem(this.rolKey, rol);
    }
  }

  getRol(): string {
    return this.rolSubject.getValue();
  }

  clearRol() {
    this.rolSubject.next('');
    if (typeof window !== 'undefined' && window.localStorage) {
      localStorage.removeItem(this.rolKey);
    }
  }

  // Método para limpiar ambos en caso de logout
  clearAll() {
    this.clearCorreo();
    this.clearRol();
    this.clearPermisos();
  }

  
}
