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
    nombreFacultad: ['', Validators.required],
    estado: [true, Validators.required], // Valor por defecto: true (Activo)
  });

  // Método para registrar la facultad
  registrarFacultad() {
    if (this.formRegistro.invalid) {
      Swal.fire({
        icon: 'warning',
        title: 'Campos incompletos',
        text: 'Verifica que los campos estén completos.',
        confirmButtonColor: '#3085d6',
      });
      return;
    }



    const objeto: RegistroFacultad = {
      NOMBRE: this.formRegistro.value.nombreFacultad.toUpperCase(), 
      ESTADO: this.formRegistro.value.estado
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

  volver() {
    this.route.navigate(['facultad']);
  }
}