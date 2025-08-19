import { Component, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { VersionService } from '../../../../services/version.service';
import Swal from 'sweetalert2';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UsuariosService } from '../../../../services/usuarios.service';

@Component({
  selector: 'app-actualizar-version',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './actualizar-version.component.html',
  styleUrls: ['./actualizar-version.component.css']
})
export default class ActualizarVersionComponent {
  private route = inject(Router);
  private versionService = inject(VersionService);
  private usuariosService = inject(UsuariosService);

  listUsuarios: any[] = [];
  usuariosCargados: boolean = false;
  cargando: boolean = false;

  // Datos del formulario
  versionId: number = 0;
  idUsuario: number = 0;
  nombre: string = '';
  cambios: boolean = false;
  

  constructor(private activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.cargarDatosIniciales();
  }

  cargarDatosIniciales(): void {
    this.activatedRoute.queryParams.subscribe(params => {
      this.versionId = +params['id'] || 0;
      this.nombre = params['nombre'] || '';
      this.cambios = params['cambios'] === 'true' || false;

      const posibleIdUsuario = +params['usuario'];
      const posibleNombreUsuario = params['usuario'];

      // Si es un número válido, úsalo directamente
      if (!isNaN(posibleIdUsuario)) {
        this.idUsuario = posibleIdUsuario;
        this.cargarUsuarios();
      } else {
        // Si es texto (nombre), búscalo después de cargar los usuarios
        this.cargarUsuarios(posibleNombreUsuario);
      }
    });
  }

  cargarUsuarios(nombreUsuario: string = ''): void {
    this.usuariosService.usuariosget().subscribe({
      next: (res) => {
        this.listUsuarios = res.ListUsuarios || [];
        this.usuariosCargados = true;

        if (nombreUsuario) {
          const encontrado = this.listUsuarios.find(
            u => u.NOMBRE_USUARIO === nombreUsuario
          );
          this.idUsuario = encontrado ? encontrado.ID_USUARIO : 0;
        }
      },
      error: (err) => {
        console.error("Error al obtener usuarios", err);
        this.usuariosCargados = true;
        Swal.fire({
          icon: 'warning',
          title: 'Advertencia',
          text: 'Se cargó la página pero no se pudieron obtener los usuarios actualizados.',
          confirmButtonColor: '#3085d6',
        });
      }
    });
  }

  actualizarVersion(): void {
    if (this.validarFormulario()) {
      this.cargando = true;

      this.versionService.actualizarVersion(
        this.versionId,
        this.idUsuario,
        this.nombre,
        this.cambios
      ).subscribe({
        next: (res) => {
          this.cargando = false;
          Swal.fire({
            icon: 'success',
            title: 'Actualización exitosa',
            text: res.message || 'Versión actualizada correctamente.',
            confirmButtonColor: '#3085d6',
          }).then(() => {
            this.route.navigate(['version']);
          });
        },
        error: (err) => {
          this.cargando = false;
          Swal.fire({
            icon: 'error',
            title: 'Error al actualizar',
            text: err.error?.message || err.message || 'Ocurrió un error al actualizar la versión.',
            confirmButtonColor: '#d33',
          });
        },
      });
    }
  }

  validarFormulario(): boolean {
    if (!this.versionId) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'No se ha especificado la versión a actualizar',
        confirmButtonColor: '#d33',
      });
      return false;
    }

    if (!this.idUsuario) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Debe seleccionar un usuario',
        confirmButtonColor: '#d33',
      });
      return false;
    }

    if (!this.nombre || this.nombre.trim().length === 0) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'El nombre de la versión no puede estar vacío',
        confirmButtonColor: '#d33',
      });
      return false;
    }

    return true;
  }

  volver(): void {
    this.route.navigate(['version']);
  }
}
