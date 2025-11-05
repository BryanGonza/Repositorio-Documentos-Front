import { Component, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FacultadService } from '../../../../services/facultad.service';
import Swal from 'sweetalert2';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ResponseFacultad } from '../../../../interfaces/UNAH/Facultad/Facultad';

@Component({
  selector: 'app-actualizar-facultad',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './actualizar-facultad.component.html',
  styleUrls: ['./actualizar-facultad.component.css'], // <- corregido
})
export default class ActualizarFacultadComponent {
  private route = inject(Router);
  private facultadService = inject(FacultadService);

  facultadId: number = 0;
  NombreFacultad: string = '';
  Descrpcion: string = '';
  EstadoFacultad: boolean = true;

  constructor(private activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.queryParams.subscribe(params => {
      this.facultadId = params['id'];
      this.NombreFacultad = params['nombre'] || '';
      this.Descrpcion = params['descripcion'] || '';
      this.EstadoFacultad = params['estado'] === 'true';
    });
  }

  actualizarFacultad() {
    // Limpieza de espacios
    const nombreTrim = this.NombreFacultad.trim();
    const descripcionTrim = this.Descrpcion.trim();

    // Validaciones manuales
    if (!nombreTrim || !descripcionTrim) {
      Swal.fire({
        icon: 'warning',
        title: 'Campos vacíos',
        text: 'El nombre y la descripción son obligatorios.',
        confirmButtonColor: '#3085d6',
      });
      return;
    }

    if (nombreTrim.length < 3 || nombreTrim.length > 100) {
      Swal.fire({
        icon: 'warning',
        title: 'Nombre inválido',
        text: 'El nombre de la facultad debe tener entre 3 y 100 caracteres.',
        confirmButtonColor: '#3085d6',
      });
      return;
    }

    if (!/^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+$/.test(nombreTrim)) {
      Swal.fire({
        icon: 'warning',
        title: 'Nombre inválido',
        text: 'El nombre solo puede contener letras y espacios.',
        confirmButtonColor: '#3085d6',
      });
      return;
    }

    if (descripcionTrim.length < 5 || descripcionTrim.length > 255) {
      Swal.fire({
        icon: 'warning',
        title: 'Descripción inválida',
        text: 'La descripción debe tener entre 5 y 255 caracteres.',
        confirmButtonColor: '#3085d6',
      });
      return;
    }

    if (!/^[A-Za-z0-9ÁÉÍÓÚáéíóúÑñ.,;:()\s-]+$/.test(descripcionTrim)) {
      Swal.fire({
        icon: 'warning',
        title: 'Descripción inválida',
        text: 'La descripción contiene caracteres no permitidos.',
        confirmButtonColor: '#3085d6',
      });
      return;
    }

    // Crear objeto validado
    const datosActualizados: any = {
      ID_FACULTAD: this.facultadId,
      NOMBRE: nombreTrim.toUpperCase(),
      DESCRIPCION: descripcionTrim.toUpperCase(),
      ESTADO: this.EstadoFacultad,
    };

    // Llamada al servicio
    this.facultadService.actualizarfacultad(
      datosActualizados.ID_FACULTAD,
      datosActualizados.NOMBRE,
      datosActualizados.DESCRIPCION,
      datosActualizados.ESTADO
    ).subscribe({
      next: (res) => {
        Swal.fire({
          icon: 'success',
          title: 'Actualización exitosa',
          text: res.msg || 'Facultad actualizada correctamente.',
          confirmButtonColor: '#3085d6',
        }).then(() => {
          this.route.navigate(['facultad']);
        });
      },
      error: (err) => {
        Swal.fire({
          icon: 'error',
          title: 'Error al actualizar',
          text: err.error?.msg || 'Ocurrió un error al actualizar la facultad.',
          confirmButtonColor: '#d33',
        });
      },
    });
  }

  volver() {
    this.route.navigate(['facultad']);
  }
}
