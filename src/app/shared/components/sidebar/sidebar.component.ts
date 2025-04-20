// sidebar.component.ts
import { NgIf, NgClass } from '@angular/common';
import { Component, inject } from '@angular/core';
import { Router, NavigationEnd, RouterLink, RouterModule } from '@angular/router';
import { filter } from 'rxjs/operators';
import Swal from 'sweetalert2';
import { SharedService } from '../../../shared.service';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [RouterLink, RouterModule, NgIf, NgClass],
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent {
  private route = inject(Router);
  public rolActual = '';
  public mostrarSubmenu: boolean = false;
  public mostrarSubmDoc: boolean = false;
  public activeItem: 'inicio' | 'documentos' | 'seguridad' | '' = '';

  constructor(private sharedService: SharedService) {}

  ngOnInit() {
    this.sharedService.rol$.subscribe((rol) => {
      this.rolActual = rol;
    });

    // usamos un type predicate en el filtro para que TS entienda que el event es NavigationEnd
    this.route.events
      .pipe(filter((event): event is NavigationEnd => event instanceof NavigationEnd))
      .subscribe((event) => {
        this.definirItemActivo(event.urlAfterRedirects);
      });
  }

  private definirItemActivo(url: string) {
    // cerramos submenus por defecto
    this.mostrarSubmenu = false;
    this.mostrarSubmDoc = false;

    if (url === '/dhashboard') {
      this.activeItem = 'inicio';
    } else if (url.includes('/Documentos') || url.includes('/subir_documentos')) {
      this.activeItem = 'documentos';
      this.mostrarSubmDoc = true;
    } else if (
      url.includes('/usuarios') ||
      url.includes('/parametros') ||
      url.includes('/roles') ||
      url.includes('/objetos') ||
      url.includes('/permisos')
    ) {
      this.activeItem = 'seguridad';
      this.mostrarSubmenu = true;
    } else {
      this.activeItem = '';
    }
  }

  // Metodo para toggle del submenu Documentos
  toggleSubmDoc() {
    if (this.activeItem === 'documentos') {
      this.activeItem = '';
      this.mostrarSubmDoc = false;
    } else {
      this.activeItem = 'documentos';
      this.mostrarSubmDoc = true;
      this.mostrarSubmenu = false;
    }
  }

  // Metodo para toggle del submenu Seguridad
  toggleSubmenu() {
    if (this.activeItem === 'seguridad') {
      this.activeItem = '';
      this.mostrarSubmenu = false;
    } else {
      this.activeItem = 'seguridad';
      this.mostrarSubmenu = true;
      this.mostrarSubmDoc = false;
    }
  }

  cerrarSesion() {
    Swal.fire({
      title: '¿Estas seguro?',
      text: '¿Deseas cerrar sesion?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si, cerrar sesion',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.sharedService.clearRol();
        this.sharedService.clearCorreo();
        localStorage.removeItem('token');
        Swal.fire({
          icon: 'success',
          title: 'Sesion cerrada',
          text: 'Has cerrado sesion correctamente.',
          timer: 1500,
          showConfirmButton: false
        }).then(() => {
          this.route.navigate(['/login']);
        });
      }
    });
  }
}
