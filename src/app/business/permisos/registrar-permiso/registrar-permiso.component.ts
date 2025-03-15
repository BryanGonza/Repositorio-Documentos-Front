import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PermisosService } from '../../../services/permisos.service'; // Asegúrate de crear este servicio
import { RegistroPermiso } from '../../../interfaces/Permisos/RegistroPermisos';
import { CommonModule } from '@angular/common';
import Swal from 'sweetalert2';



@Component({
  selector: 'app-registrar-permiso',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './registrar-permiso.component.html',
  styleUrls: ['./registrar-permiso.component.css']
})
export class RegistrarPermisoComponent {
  private permisosService = inject(PermisosService);
  private route = inject(Router);
  public fromBuild = inject(FormBuilder);

  public formRegistro: FormGroup = this.fromBuild.group({
    idRol: ['', Validators.required], // ID del rol asociado
    idObjeto: ['', Validators.required], // ID del objeto asociado
    permisoInsercion: ['', Validators.required], // Permiso de inserción
    permisoEliminacion: ['', Validators.required], // Permiso de eliminación
    permisoActualizacion: ['', Validators.required], // Permiso de actualización
    permisoConsultar: ['', Validators.required], // Permiso de consulta
    creadoPor: ['', Validators.required] // Usuario que crea el permiso
  });

  // Método para registrar el permiso
  registrarPermiso() {
    if (this.formRegistro.invalid) {
      Swal.fire({
        icon: 'warning',
        title: 'Campos incompletos',
        text: 'Verifica que los campos estén completos.',
        confirmButtonColor: '#3085d6',
      });
      return;
    }

    const objeto: RegistroPermiso = {
      ID_ROL: this.formRegistro.value.idRol,
      ID_OBJETO: this.formRegistro.value.idObjeto,
      PERMISO_INSERCION: this.formRegistro.value.permisoInsercion,
      PERMISO_ELIMINACION: this.formRegistro.value.permisoEliminacion,
      PERMISO_ACTUALIZACION: this.formRegistro.value.permisoActualizacion,
      PERMISO_CONSULTAR: this.formRegistro.value.permisoConsultar,
      CREADO_POR: this.formRegistro.value.creadoPor,
      FECHA_CREACION: new Date() // Agrega la fecha actual
    };

    this.permisosService.registrarPermiso(objeto).subscribe({
      next: (data) => {
        Swal.fire({
          icon: 'success',
          title: 'Permiso creado',
          text: data.msg || 'Permiso creado correctamente.',
          confirmButtonColor: '#3085d6',
        }).then(() => {
          this.route.navigate(['permisos']);
        });
      },
      error: (error) => {
        Swal.fire({
          icon: 'error',
          title: 'Error al registrar',
          text: error.error?.msg || 'Ocurrió un error al registrar el permiso.',
          confirmButtonColor: '#d33',
        });
      }
    });
  }

  // Método para volver a la lista de permisos
  volver() {
    this.route.navigate(['permisos']);
  }
}
