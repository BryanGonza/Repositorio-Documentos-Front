import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SharedService {
  private correoKey = 'userCorreo'; // Clave para localStorage

  // Inicializa el BehaviorSubject con el valor de localStorage si está disponible
  private correoSubject = new BehaviorSubject<string>(this.getStoredCorreo());
  public correo$ = this.correoSubject.asObservable();

  constructor() { }

  // Método seguro para obtener el correo almacenado
  private getStoredCorreo(): string {
    if (typeof window !== 'undefined' && window.localStorage) {
      return localStorage.getItem(this.correoKey) || '';
    }
    return '';
  }

  // Guardar correo en BehaviorSubject y localStorage
  setCorreo(correo: string) {
    this.correoSubject.next(correo);
    if (typeof window !== 'undefined' && window.localStorage) {
      localStorage.setItem(this.correoKey, correo);
    }
  }

  // Obtener el correo actual
  getCorreo(): string {
    return this.correoSubject.getValue();
  }

  // Limpiar el correo (por ejemplo, al cerrar sesión)
  clearCorreo() {
    this.correoSubject.next('');
    if (typeof window !== 'undefined' && window.localStorage) {
      localStorage.removeItem(this.correoKey);
    }
  }
}
