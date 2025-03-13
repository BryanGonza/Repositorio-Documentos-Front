import { Component, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PermisosService } from '../../../services/permisos.service'; // Asegúrate de crear este servicio
import Swal from 'sweetalert2';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-actualizar-permiso',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './actualizar-permiso.component.html',
  styleUrls: ['./actualizar-permiso.component.css']
})
export default class ActualizarPermisoComponent {
  private route = inject(Router);
  private permisosService = inject(PermisosService);

  permisoId: number = 0;
  idRol: number = 0;
  idObjeto: number = 0;
  permisoInsercion: string = '';
  permisoEliminacion: string = '';
  permisoActualizacion: string = '';
  permisoConsultar: string = '';
  creadoPor: string = '';
  modificadoPor: string = '';
  fechaCreacion: Date | null = null;
  fechaModificacion: Date | null = null;

  constructor(private activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    // Usar ActivatedRoute para acceder a los queryParams
    this.activatedRoute.queryParams.subscribe(params => {
      this.permisoId = params['id'];
      this.idRol = params['idRol'];
      this.idObjeto = params['idObjeto'];
      this.permisoInsercion = params['permisoInsercion'];
      this.permisoEliminacion = params['permisoEliminacion'];
      this.permisoActualizacion = params['permisoActualizacion'];
      this.permisoConsultar = params['permisoConsultar'];
      this.creadoPor = params['creadoPor'];
      this.modificadoPor = params['modificadoPor'];
      this.fechaCreacion = params['fechaCreacion'] ? new Date(params['fechaCreacion']) : null;
      this.fechaModificacion = params['fechaModificacion'] ? new Date(params['fechaModificacion']) : null;
    });
  }

  actualizarPermiso() {
    // Crear objeto con los campos a actualizar
    const datosActualizados: any = {
      ID_PERMISO: this.permisoId,
      ID_ROL: this.idRol,
      ID_OBJETO: this.idObjeto,
      PERMISO_INSERCION: this.permisoInsercion,
      PERMISO_ELIMINACION: this.permisoEliminacion,
      PERMISO_ACTUALIZACION: this.permisoActualizacion,
      PERMISO_CONSULTAR: this.permisoConsultar,
      CREADO_POR: this.creadoPor, // Mantener el creado por original
      MODIFICADO_POR: this.modificadoPor,
      FECHA_CREACION: this.fechaCreacion, // Mantener la fecha de creación original
      FECHA_MODIFICACION: new Date(), // Fecha de modificación automática
    };

    // Enviar la actualización
    this.permisosService.actualizarPermiso(
      datosActualizados.ID_PERMISO,
      datosActualizados.ID_ROL,
      datosActualizados.ID_OBJETO,
      datosActualizados.PERMISO_INSERCION,
      datosActualizados.PERMISO_ELIMINACION,
      datosActualizados.PERMISO_ACTUALIZACION,
      datosActualizados.PERMISO_CONSULTAR,
      datosActualizados.CREADO_POR,
      datosActualizados.MODIFICADO_POR,
      datosActualizados.FECHA_CREACION,
      datosActualizados.FECHA_MODIFICACION
    ).subscribe({
      next: (res) => {
        Swal.fire({
          icon: 'success',
          title: 'Actualización exitosa',
          text: res.msg || 'Permiso actualizado correctamente.',
          confirmButtonColor: '#3085d6',
        }).then(() => {
          this.route.navigate(['permisos']);
        });
      },
      error: (err) => {
        Swal.fire({
          icon: 'error',
          title: 'Error al actualizar',
          text: err.error?.msg || 'Ocurrió un error al actualizar el permiso.',
          confirmButtonColor: '#d33',
        });
      },
    });
  }

  volver() {
    this.route.navigate(['permisos']);
  }
}
