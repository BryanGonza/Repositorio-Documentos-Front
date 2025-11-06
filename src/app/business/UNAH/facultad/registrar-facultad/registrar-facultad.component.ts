import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FacultadService } from '../../../../services/facultad.service';
import { RegistroFacultad } from '../../../../interfaces/UNAH/Facultad/RegistroFacultad';
import { CommonModule } from '@angular/common';
import Swal from 'sweetalert2';
import { jwtDecode } from "jwt-decode";

@Component({
  selector: 'app-registrar-facultad',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './registrar-facultad.component.html',
  styleUrls: ['./registrar-facultad.component.css']
})
export class RegistrarFacultadComponent {
  private facultadService = inject(FacultadService);
  private route = inject(Router);
  public fromBuild = inject(FormBuilder);

  public formRegistro: FormGroup = this.fromBuild.group({
    nombreFacultad: [
      '',
      [
        Validators.required,
        Validators.minLength(5), // Cambiado de 3 a 5 caracteres
        Validators.maxLength(100),
        Validators.pattern(/^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+$/) // Solo letras y espacios
      ]
    ],
    descripcion: [
      '',
      [
        Validators.required,
        Validators.minLength(5),
        Validators.maxLength(255),
        Validators.pattern(/^[A-Za-z0-9ÁÉÍÓÚáéíóúÑñ.,;:()\s-]+$/) // Letras, números, signos básicos
      ]
    ],
    estado: [true, Validators.required] // Valor por defecto: true (Activo)
  });

  // Método para registrar la facultad
  registrarFacultad() {
    if (this.formRegistro.invalid) {
      Swal.fire({
        icon: 'warning',
        title: 'Campos incompletos o inválidos',
        text: 'Verifica que todos los campos estén completos y correctos.',
        confirmButtonColor: '#3085d6',
      });
      this.formRegistro.markAllAsTouched();
      return;
    }

    // Limpieza de espacios adicionales
    const nombreFacultad = this.formRegistro.value.nombreFacultad.trim();
    const descripcion = this.formRegistro.value.descripcion.trim();

    // Validación adicional para evitar cadenas vacías después de trim
    if (!nombreFacultad || !descripcion) {
      Swal.fire({
        icon: 'warning',
        title: 'Datos inválidos',
        text: 'El nombre y la descripción no pueden estar vacíos o solo contener espacios.',
        confirmButtonColor: '#3085d6',
      });
      return;
    }

    // Validación específica de longitud después del trim
    if (nombreFacultad.length < 5) {
      Swal.fire({
        icon: 'warning',
        title: 'Nombre muy corto',
        text: 'El nombre de la facultad debe tener al menos 5 caracteres.',
        confirmButtonColor: '#3085d6',
      });
      return;
    }

    if (descripcion.length < 5) {
      Swal.fire({
        icon: 'warning',
        title: 'Descripción muy corta',
        text: 'La descripción debe tener al menos 5 caracteres.',
        confirmButtonColor: '#3085d6',
      });
      return;
    }

    // Asegura que estado sea booleano real (por si viene como string)
    const estadoFormulario = this.formRegistro.value.estado;
    const estadoBooleano = estadoFormulario === true || estadoFormulario === 'true';

    const objeto: RegistroFacultad = {
      NOMBRE: nombreFacultad.toUpperCase(),
      DESCRIPCION: descripcion.toUpperCase(),
      ESTADO: estadoBooleano
    };

    this.facultadService.registrarFacultad(objeto).subscribe({
      next: (data) => {
        Swal.fire({
          icon: 'success',
          title: 'Facultad creada',
          text: data.msg || 'Facultad creada correctamente.',
          confirmButtonColor: '#3085d6',
        }).then(() => {
          this.route.navigate(['facultad']);
        });
      },
      error: (error) => {
        Swal.fire({
          icon: 'error',
          title: 'Error al registrar',
          text: error.error?.msg || 'Ocurrió un error al registrar la facultad.',
          confirmButtonColor: '#d33',
        });
      }
    });
  }

  // Getters para acceder fácilmente a los controles en la plantilla
  get nombreFacultad() {
    return this.formRegistro.get('nombreFacultad');
  }

  get descripcion() {
    return this.formRegistro.get('descripcion');
  }

  get estado() {
    return this.formRegistro.get('estado');
  }

  volver() {
    this.route.navigate(['facultad']);
  }
}