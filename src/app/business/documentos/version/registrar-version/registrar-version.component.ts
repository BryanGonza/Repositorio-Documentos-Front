import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Version } from '../../../../interfaces/Documentos/Version/Version';
import { VersionService } from '../../../../services/version.service';
import { CommonModule } from '@angular/common';
import Swal from 'sweetalert2';
import { RegistroVersion } from '../../../../interfaces/Documentos/Version/RegistroVersion';
import { jwtDecode } from 'jwt-decode';

@Component({
  selector: 'app-registrar-version',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './registrar-version.component.html',
  styleUrls: ['./registrar-version.component.css']
})
export class RegistrarVersionComponent {
  private versionService = inject(VersionService);
  private route = inject(Router);
  public fromBuild = inject(FormBuilder);

  public formRegistro: FormGroup = this.fromBuild.group({
    nombre: [''],
    cambios: [false]
  });

  // Método para registrar la versión
  registrarVersion() {
    if (this.formRegistro.invalid) {
      Swal.fire({
        icon: 'warning',
        title: 'Campos incompletos',
        text: 'Por favor complete los campos requeridos.',
        confirmButtonColor: '#3085d6',
      });
      return;
    }
    const token = localStorage.getItem('token') || '';
    const decodedToken: any = jwtDecode(token);
    const objeto: RegistroVersion = {
      ID_USUARIO: decodedToken.id,
      NOMBRE: this.formRegistro.value.nombre.toUpperCase(),
      CAMBIOS: this.formRegistro.value.cambios,
      FECHA_ACTU: new Date() // Asigna la fecha actual automáticamente
    };

    this.versionService.registrarversion(objeto).subscribe({
      next: (data) => {
        Swal.fire({
          icon: 'success',
          title: 'Versión creada',
          text: data.msg || 'Versión creada correctamente.',
          confirmButtonColor: '#3085d6',
        }).then(() => {
          this.route.navigate(['version']);
        });
      },
      error: (error) => {
        Swal.fire({
          icon: 'error',
          title: 'Error al registrar',
          text: error.error?.msg || 'Ocurrió un error al registrar la versión.',
          confirmButtonColor: '#d33',
        });
      }
    });
  }

  volver() {
    this.route.navigate(['version']);
  }
}
