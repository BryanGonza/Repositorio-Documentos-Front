import { Component, EventEmitter, Output, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import Swal from 'sweetalert2';
import { SharedService } from '../../../shared.service';
import { DepartamentoService } from '../../../services/departamento.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterLink, CommonModule  ],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent {
  @Output() toggleSidebar = new EventEmitter<void>();

  private sharedService = inject(SharedService);
  private departamentoService = inject(DepartamentoService);
  private router = inject(Router);

  // para mostrar en la vista
  public departamentoName = '';
  public facultadName = '';

  ngOnInit() {
  this.sharedService.departamento$.subscribe(idDepto => {
      console.log('Header recibe ID de depto:', idDepto);
      if (idDepto > 0) this.loadBreadcrumb(idDepto);
    });

    // 2) Carga inicial por si ya había un valor en localStorage
    const initId = this.sharedService.getDepartamento();
    console.log('Header init ID depto:', initId);
    if (initId > 0) this.loadBreadcrumb(initId);
  }

  private loadBreadcrumb(idDepto: number) {
    this.departamentoService.getDepartamentoFacultad(idDepto)
      .subscribe({
        next: resp => {
          console.log('Respuesta getDepartamentoFacultad:', resp);
          // Adáptalo a la propiedad real de tu API
          const detail = resp.Detalle_Departamento_Facultad
                      || (resp as any).detalle
                      || (resp as any).data;
          this.departamentoName = detail.nombre_departamento;
          this.facultadName    = detail.nombre_facultad;
        },
        error: err => {
          console.error('No pude cargar el breadcrumb:', err);
          this.departamentoName = '';
          this.facultadName    = '';
        }
      });
      }

  

  cerrarSesion() {
    Swal.fire({
      title: '¿Estás seguro?',
      text: '¿Deseas cerrar sesión?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, cerrar sesión',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.sharedService.clearRol();
        this.sharedService.clearCorreo();
        this.sharedService.clearDepartamento();
        localStorage.removeItem('token');
        Swal.fire({
          icon: 'success',
          title: 'Sesión cerrada',
          text: 'Has cerrado sesión correctamente.',
          timer: 1500,
          showConfirmButton: false
        }).then(() => {
          this.router.navigate(['/login']);
        });
      }
    });
  }
}
