import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RolesService } from '../../../services/roles.service'; 
import { RegistroRol } from '../../../interfaces/Roles/RegistroRol';
import { CommonModule } from '@angular/common';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-registrar-rol',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './registrar-rol.component.html',
  styleUrls: ['./registrar-rol.component.css']
})
export class RegistrarRolComponent {
  private rolesService = inject(RolesService);
  private route = inject(Router);
  public fromBuild = inject(FormBuilder);

  public formRegistro: FormGroup = this.fromBuild.group({
    nombreRol: ['', Validators.required],
    descripcion: ['', Validators.required],
    creadoPor: ['', Validators.required]
  });

  // Método para registrar el rol
  registrarRol() {
    if (this.formRegistro.invalid) {
      Swal.fire({
        icon: 'warning',
        title: 'Campos incompletos',
        text: 'Verifica que los campos estén completos.',
        confirmButtonColor: '#3085d6',
      });
      return;
    }

    const objeto: RegistroRol = {
      ROL: this.formRegistro.value.nombreRol,
      DESCRIPCION: this.formRegistro.value.descripcion,
      CREADO_POR: this.formRegistro.value.creadoPor,
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

  volver() {
    this.route.navigate(['roles']);
  }
}
