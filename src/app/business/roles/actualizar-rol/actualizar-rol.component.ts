import { Component, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { RolesService } from '../../../services/roles.service';
import Swal from 'sweetalert2';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ResponseRoles } from '../../../interfaces/Roles/Roles';
import { SharedService } from '../../../shared.service';

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

  // Variables para controlar los valores originales
  originalNombreRol: string = '';
  originalDescripcionRol: string = '';

  constructor(private activatedRoute: ActivatedRoute, private sharedService: SharedService) {}

  ngOnInit(): void {
    this.activatedRoute.queryParams.subscribe(params => {
      this.rolId = params['id'];
      this.NombreRol = params['rol'];
      this.DescripcionRol = params['descripcion'];
      this.FechaCreacion = params['fechaCreacion'] ? new Date(params['fechaCreacion']) : null;
      this.CreadoPor = params['creadoPor'];
      
      // Guardar valores originales para comparación
      this.originalNombreRol = params['rol'];
      this.originalDescripcionRol = params['descripcion'];
    });
  }

  // Validar campos antes de actualizar
  validarCampos(): boolean {
    // Validar que no estén vacíos
    if (!this.NombreRol || !this.DescripcionRol) {
      Swal.fire({
        icon: 'error',
        title: 'Campos requeridos',
        text: 'Todos los campos son obligatorios',
        confirmButtonColor: '#d33'
      });
      return false;
    }

    // Validar longitud mínima
    if (this.NombreRol.trim().length < 3) {
      Swal.fire({
        icon: 'error',
        title: 'Nombre muy corto',
        text: 'El nombre del rol debe tener al menos 3 caracteres',
        confirmButtonColor: '#d33'
      });
      return false;
    }

    if (this.DescripcionRol.trim().length < 10) {
      Swal.fire({
        icon: 'error',
        title: 'Descripción muy corta',
        text: 'La descripción debe tener al menos 10 caracteres',
        confirmButtonColor: '#d33'
      });
      return false;
    }

    // Validar caracteres permitidos en el nombre
    const nombreRegex = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/;
    if (!nombreRegex.test(this.NombreRol)) {
      Swal.fire({
        icon: 'error',
        title: 'Caracteres inválidos',
        text: 'El nombre solo puede contener letras y espacios',
        confirmButtonColor: '#d33'
      });
      return false;
    }

    // Validar espacios al inicio/fin
    if (this.NombreRol !== this.NombreRol.trim() || this.DescripcionRol !== this.DescripcionRol.trim()) {
      Swal.fire({
        icon: 'error',
        title: 'Espacios no permitidos',
        text: 'No se permiten espacios al inicio o final',
        confirmButtonColor: '#d33'
      });
      return false;
    }

    return true;
  }

  // Verificar si hay cambios reales
  hayCambios(): boolean {
    return this.NombreRol !== this.originalNombreRol || 
           this.DescripcionRol !== this.originalDescripcionRol;
  }

  actualizarRol() {
    // Validar campos primero
    if (!this.validarCampos()) {
      return;
    }

    // Verificar si hay cambios
    if (!this.hayCambios()) {
      Swal.fire({
        icon: 'warning',
        title: 'Sin cambios',
        text: 'No has realizado ningún cambio en los datos del rol',
        confirmButtonColor: '#3085d6'
      });
      return;
    }

    // Crear objeto con los campos a actualizar
    const datosActualizados: any = {
      ID_ROL: this.rolId,
      ROL: this.NombreRol.toUpperCase().trim(),
      DESCRIPCION: this.DescripcionRol.toUpperCase().trim(),
      FECHA_CREACION: this.FechaCreacion,
      CREADO_POR: this.CreadoPor,
      FECHA_MODIFICACION: new Date(),
      MODIFICADO_POR: this.sharedService.getCorreo().toUpperCase(), 
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