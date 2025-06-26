import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Tipo_archivoService } from '../../../services/tipo_archivo.service';
import { RegistroTipo_archivo } from '../../../interfaces/Tipo_Archivo/RegistroTipo_archivo';
import { CommonModule } from '@angular/common';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-registrar-tipo_archivo',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './registrar-tipo_archivo.component.html',
  styleUrls: ['./registrar-tipo_archivo.component.css']
})
export class RegistrarTipo_archivoComponent {
  private Tipo_archivoService = inject(Tipo_archivoService);
  private route = inject(Router);
  public fromBuild = inject(FormBuilder);

  public formRegistro: FormGroup = this.fromBuild.group({
    //IDTipo_archivo: ['', Validators.required],
    Tipo: ['', Validators.required],
    Limite: ['', Validators.required],
    
  });

  // Método para registrar TIPO DE ARCHIVO
  registrarTipo_archivo() {
    if (this.formRegistro.invalid) {
      Swal.fire({
        icon: 'warning',
        title: 'Campos incompletos',
        text: 'Verifica que los campos estén completos.',
        confirmButtonColor: '#3085d6',
      });
      return;
    }

    const objeto: RegistroTipo_archivo = {
     // ID_TIPO_ARCHIVO: this.formRegistro.value.IDTipo_archivo,
      TIPO_ARCHIVO: this.formRegistro.value.Tipo,
      LIMITE_ALMACENAMIENTO: this.formRegistro.value.Limite
    };

    this.Tipo_archivoService.registrartipo_archivo(objeto).subscribe({
      next: (data) => {
        Swal.fire({
          icon: 'success',
          title: 'tipo_archivo creada',
          text: data.msg || 'tipo_archivo creada correctamente.',
          confirmButtonColor: '#3085d6',
        }).then(() => {
          this.route.navigate(['tipo_archivo']);
        });
      },
      error: (error) => {
        Swal.fire({
          icon: 'error',
          title: 'Error al registrar',
          text: error.error?.msg || 'Ocurrió un error al registrar tipo_archivo.',
          confirmButtonColor: '#d33',
        });
      }
    });
  }

  volver() {
    this.route.navigate(['tipo_archivo']);
  }
}