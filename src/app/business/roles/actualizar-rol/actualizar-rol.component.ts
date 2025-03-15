import { Component, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { RolesService } from '../../../services/roles.service';
import Swal from 'sweetalert2';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ResponseRoles } from '../../../interfaces/Roles/Roles';

@Component({
  selector: 'app-actualizar-rol',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './actualizar-rol.component.html',
  styleUrl: './actualizar-rol.component.css',
})
export default class ActualizarRolComponent {
  private route = inject(Router);
  private rolesService = inject(RolesService);

  rolId: number = 0;
  NombreRol: string = '';
  DescripcionRol: string = '';
  FechaCreacion: Date | null = null;
  CreadoPor: string = '';
  ModificadoPor: string = '';

  constructor(private activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    // Usar ActivatedRoute para acceder a los queryParams
    this.activatedRoute.queryParams.subscribe(params => {
      this.rolId = params['id'],
      this.NombreRol = params['rol'];
      this.DescripcionRol = params['descripcion'];
      this.FechaCreacion = params['fechaCreacion'] ? new Date(params['fechaCreacion']) : null;
      this.CreadoPor = params['creadoPor'];
      this.ModificadoPor = params['modificadoPor'];
    });
  }

  actualizarRol() {
    // Crear objeto con los campos a actualizar
    const datosActualizados: any = {
      ID_ROL: this.rolId,
      ROL: this.NombreRol,
      DESCRIPCION: this.DescripcionRol,
      FECHA_CREACION: this.FechaCreacion, // Mantener la fecha de creación original
      CREADO_POR: this.CreadoPor, // Mantener el creado por original
      FECHA_MODIFICACION: new Date(), // Fecha de modificación automática
      MODIFICADO_POR: this.ModificadoPor,
    };

    // Enviar la actualización
    this.rolesService.actualizarRol(
      datosActualizados.ID_ROL,
      datosActualizados.ROL,
      datosActualizados.DESCRIPCION,
      datosActualizados.FECHA_CREACION,
      datosActualizados.CREADO_POR,
      datosActualizados.FECHA_MODIFICACION,
      datosActualizados.MODIFICADO_POR
    ).subscribe({
      next: (res) => {
        Swal.fire({
          icon: 'success',
          title: 'Actualización exitosa',
          text: res.msg || 'Rol actualizado correctamente.',
          confirmButtonColor: '#3085d6',
        }).then(() => {
          this.route.navigate(['roles']);
        });
      },
      error: (err) => {
        Swal.fire({
          icon: 'error',
          title: 'Error al actualizar',
          text: err.error?.msg || 'Ocurrió un error al actualizar el rol.',
          confirmButtonColor: '#d33',
        });
      },
    });
  }

  volver() {
    this.route.navigate(['roles']);
  }
}
