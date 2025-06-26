import { NgIf, NgClass } from '@angular/common';
import { Component, inject } from '@angular/core';
import { Router, NavigationEnd, RouterLink, RouterModule } from '@angular/router';
import { filter } from 'rxjs/operators';
import Swal from 'sweetalert2';
import { SharedService } from '../../../shared.service';
import { ObjetoPermisoExtendido } from '../../../interfaces/Objetos/Objetos';
import { ObjetosService } from '../../../services/objetos.service';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [RouterLink, RouterModule, NgIf, NgClass],
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent {
  public mostrarSubmenu = false;
  public mostrarSubmDoc = false;
  public mostrarSubmMant = false;
  public activeItem: 'inicio' | 'documentos' | 'seguridad' | 'mantenimiento' | '' = '';

  constructor(
    private sharedService: SharedService,
    private route: Router           
  ) {}
 rolActual: string = '';
  ngOnInit() {
    this.route.events
      .pipe(filter((e): e is NavigationEnd => e instanceof NavigationEnd))
      .subscribe(e => this.definirItemActivo(e.urlAfterRedirects));
          this.sharedService.rol$.subscribe((rol) => {
      this.rolActual = rol;
      this.getObjetosConPermisos();
      
    });
  }
    objetos: ObjetoPermisoExtendido[] = [];
  private objetoser = inject(ObjetosService);
  token: string = typeof window !== 'undefined' ? localStorage.getItem('token') || '' : '';

 getObjetosConPermisos(): void {
    this.objetoser.getObjetosPermisos(this.token).subscribe({
      next: (data) => {
        this.objetos = data;
        console.log('Objetos con permisos:', this.objetos);
      },
      error: (err) => {
        console.error('Error al obtener objetos:', err);
      },
    });
  }
  // MEtodo para normalizar cadenas
    private normalize(str: string): string {
      return str
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '');
    }
  
getPermisoPorPalabraClave(clave: string): boolean {
  const claveNormalizada = this.normalize(clave);
  const permiso = this.objetos.find((o) =>
    this.normalize(o.OBJETO).includes(claveNormalizada)
  );

  if (!permiso) return false;

  return (
    permiso.PERMISO_CONSULTAR ||
    permiso.PERMISO_INSERCION ||
    permiso.PERMISO_ACTUALIZACION ||
    permiso.PERMISO_ELIMINACION
  );
}


tienePermisosSeguridad(): boolean {
  const claves = ['usuario', 'parametros', 'roles', 'objetos', 'permisos'];
  return claves.some(clave => this.getPermisoPorPalabraClave(clave));
}

  private definirItemActivo(url: string) {
    // reset
    this.mostrarSubmenu = this.mostrarSubmDoc = this.mostrarSubmMant = false;
  
    const ruta = url.toLowerCase();
  
    if (ruta === '/dhashboard') {
      this.activeItem = 'inicio';
    } else if (ruta.includes('/documentos') || ruta.includes('/subir_documentos')) {
      this.activeItem = 'documentos';
      this.mostrarSubmDoc = true;
    } else if (['usuarios', 'parametros', 'roles', 'objetos', 'permisos'].some(seg => ruta.includes(seg))) {
      this.activeItem = 'seguridad';
      this.mostrarSubmenu = true;
    } else if (['facultad', 'tipo-documento', 'estructura_archivos', 'estado', 'clases', 'tipo-caracteristica', 'categoria', 'sub-categoria', 'tipo de archivo'].some(mant => ruta.includes(mant))) {
      this.activeItem = 'mantenimiento';
      this.mostrarSubmMant = true;
    } else {
      this.activeItem = '';
    }
  }
  
  // Toggle submenu Documentos
  toggleSubmDoc() {
    if (this.activeItem === 'documentos') {
      this.activeItem = '';
      this.mostrarSubmDoc = false;
    } else {
      this.activeItem = 'documentos';
      this.mostrarSubmDoc = true;
      this.mostrarSubmenu = false;
      this.mostrarSubmMant = false;
    }
  }

  // Toggle submenu Seguridad
  toggleSubmenu() {
    if (this.activeItem === 'seguridad') {
      this.activeItem = '';
      this.mostrarSubmenu = false;
    } else {
      this.activeItem = 'seguridad';
      this.mostrarSubmenu = true;
      this.mostrarSubmDoc = false;
      this.mostrarSubmMant = false;
    }
  }

  // Toggle submenu Mantenimiento
  toggleSubmMant() {
    if (this.activeItem === 'mantenimiento') {
      this.activeItem = '';
      this.mostrarSubmMant = false;
    } else {
      this.activeItem = 'mantenimiento';
      this.mostrarSubmMant = true;
      this.mostrarSubmenu = false;
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