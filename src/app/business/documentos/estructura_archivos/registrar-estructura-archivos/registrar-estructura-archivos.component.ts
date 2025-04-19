import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { EstructuraArchivosService } from '../../../../services/estructura-archivos.service';
import { RegistroEstructuraArchivos } from '../../../../interfaces/Documentos/Estructura_archivos/ResgistroEstructura_archivos';
import { CommonModule } from '@angular/common';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-registrar-estructura-archivos',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './registrar-estructura-archivos.component.html',
  styleUrls: ['./registrar-estructura-archivos.component.css']
})
export class RegistrarEstructuraArchivosComponent {
  private estructuraArchivosService = inject(EstructuraArchivosService);
  private route = inject(Router);
  public fromBuild = inject(FormBuilder);

  public formRegistro: FormGroup = this.fromBuild.group({
    idDepartamento: ['', Validators.required],
    espacioAlmacenamiento: ['', Validators.required],
    nombre: ['', Validators.required],
    ubicacion: ['', Validators.required],
  });

  // Método para registrar la estructura de archivos
  registrarEstructura() {
    if (this.formRegistro.invalid) {
      Swal.fire({
        icon: 'warning',
        title: 'Campos incompletos',
        text: 'Verifica que todos los campos estén completos y con el formato correcto.',
        confirmButtonColor: '#3085d6',
      });
      return;
    }

    const objeto: RegistroEstructuraArchivos = {
      ID_DEPARTAMENTO: this.formRegistro.value.idDepartamento,
      ESPACIO_ALMACENAMIENTO: this.formRegistro.value.espacioAlmacenamiento,
      NOMBRE: this.formRegistro.value.nombre.toUpperCase(),
      UBICACION: this.formRegistro.value.ubicacion.toUpperCase()
    };

    this.estructuraArchivosService.registrarEstructura(objeto).subscribe({
      next: (data) => {
        Swal.fire({
          icon: 'success',
          title: 'Estructura creada',
          text: data.msg || 'Estructura de archivos creada correctamente.',
          confirmButtonColor: '#3085d6',
        }).then(() => {
          this.route.navigate(['estructura_archivos']);
        });
      },
      error: (error) => {
        Swal.fire({
          icon: 'error',
          title: 'Error al registrar',
          text: error.error?.msg || 'Ocurrió un error al registrar la estructura de archivos.',
          confirmButtonColor: '#d33',
        });
      }
    });
  }

  volver() {
    this.route.navigate(['estructura_archivos']);
  }
}