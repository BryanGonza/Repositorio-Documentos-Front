import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RolesService } from '../../../services/roles.service'; 
import { RegistroRol } from '../../../interfaces/Roles/RegistroRol';
import { CommonModule } from '@angular/common';
import Swal from 'sweetalert2';
import { SharedService } from '../../../shared.service';

@Component({
  selector: 'app-registrar-rol',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './registrar-rol.component.html',
  styleUrls: ['./registrar-rol.component.css']
})
export class RegistrarRolComponent {
  constructor(private sharedService: SharedService) {}
  private rolesService = inject(RolesService);
  private route = inject(Router);
  public fromBuild = inject(FormBuilder);

  public formRegistro: FormGroup = this.fromBuild.group({
    nombreRol: ['', [
      Validators.required,
      Validators.minLength(3),
      Validators.maxLength(50),
      Validators.pattern(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/),
      this.noEspaciosExtremos
    ]],
    descripcion: ['', [
      Validators.required,
      Validators.minLength(10),
      Validators.maxLength(200),
      this.noEspaciosExtremos
    ]]
  });

  // Validador personalizado para evitar espacios al inicio/fin
  noEspaciosExtremos(control: { value: string }) {
    const value = control.value;
    if (value && (value.startsWith(' ') || value.endsWith(' '))) {
      return { espaciosExtremos: true };
    }
    return null;
  }

  // Método para registrar el rol
  registrarRol() {
    if (this.formRegistro.invalid) {
      this.mostrarErroresValidacion();
      return;
    }

    const objeto: RegistroRol = {
      ROL: this.formRegistro.value.nombreRol.toUpperCase(),
      DESCRIPCION: this.formRegistro.value.descripcion.toUpperCase(),
      CREADO_POR: this.sharedService.getCorreo().toUpperCase(),
    };

    this.rolesService.registrarRol(objeto).subscribe({
      next: (data) => {
        Swal.fire({
          icon: 'success',
          title: 'Rol creado',
          text: data.msg || 'Rol creado correctamente.',
          confirmButtonColor: '#3085d6',
        }).then(() => {
          this.route.navigate(['roles']);
        });
      },
      error: (error) => {
        Swal.fire({
          icon: 'error',
          title: 'Error al registrar',
          text: error.error?.msg || 'Ocurrió un error al registrar el rol.',
          confirmButtonColor: '#d33',
        });
      }
    });
  }

  // Mostrar mensajes de error específicos
  mostrarErroresValidacion() {
    const nombreRol = this.formRegistro.get('nombreRol');
    const descripcion = this.formRegistro.get('descripcion');

    if (nombreRol?.errors) {
      if (nombreRol.errors['required']) {
        this.mostrarError('El nombre del rol es obligatorio');
      } else if (nombreRol.errors['minlength']) {
        this.mostrarError('El nombre debe tener al menos 3 caracteres');
      } else if (nombreRol.errors['maxlength']) {
        this.mostrarError('El nombre no puede exceder los 50 caracteres');
      } else if (nombreRol.errors['pattern']) {
        this.mostrarError('Solo se permiten letras y espacios en el nombre');
      } else if (nombreRol.errors['espaciosExtremos']) {
        this.mostrarError('El nombre no puede comenzar o terminar con espacios');
      }
    } else if (descripcion?.errors) {
      if (descripcion.errors['required']) {
        this.mostrarError('La descripción es obligatoria');
      } else if (descripcion.errors['minlength']) {
        this.mostrarError('La descripción debe tener al menos 10 caracteres');
      } else if (descripcion.errors['maxlength']) {
        this.mostrarError('La descripción no puede exceder los 200 caracteres');
      } else if (descripcion.errors['espaciosExtremos']) {
        this.mostrarError('La descripción no puede comenzar o terminar con espacios');
      }
    }
  }

  mostrarError(mensaje: string) {
    Swal.fire({
      icon: 'warning',
      title: 'Validación',
      text: mensaje,
      confirmButtonColor: '#3085d6',
    });
  }

  volver() {
    this.route.navigate(['roles']);
  }
}