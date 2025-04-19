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

  // correo
  private correoSubject = new BehaviorSubject<string>(this.getStoredCorreo());
  public correo$ = this.correoSubject.asObservable();

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
  }

  
}
