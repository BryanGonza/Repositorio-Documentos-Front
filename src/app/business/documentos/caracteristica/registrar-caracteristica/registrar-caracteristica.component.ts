import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CaracteristicaService } from '../../../../services/caracteristica.service';
import { RegistroCaracteristica } from '../../../../interfaces/Documentos/Caracteristica/RegistroCaracteristica';
import { CommonModule } from '@angular/common';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-registrar-caracteristica',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './registrar-caracteristica.component.html',
  styleUrls: ['./registrar-caracteristica.component.css']
})
export class RegistrarCaracteristicaComponent {
  private caracteristicaService = inject(CaracteristicaService);
  private route = inject(Router);
  public fromBuild = inject(FormBuilder);

  public formRegistro: FormGroup = this.fromBuild.group({
    tipoCaracteristica: ['', Validators.required],
    nombreCaracteristica: [''],
    valoresPredeterminados: [false]
  });

  // Método para registrar la característica
  registrarCaracteristica() {
    if (this.formRegistro.invalid) {
      Swal.fire({
        icon: 'warning',
        title: 'Campo incompleto',
        text: 'Por favor ingrese al menos el tipo de característica.',
        confirmButtonColor: '#3085d6',
      });
      return;
    }

    const objeto: RegistroCaracteristica = {
      ID_TIPO_CARACTERISTICA: this.formRegistro.value.tipoCaracteristica,
      CARACTERISTICA: this.formRegistro.value.nombreCaracteristica?.toUpperCase(),
      VALORES_PREDETERMINADOS: this.formRegistro.value.valoresPredeterminados
    };

    this.caracteristicaService.registrarc(objeto).subscribe({
      next: (data) => {
        Swal.fire({
          icon: 'success',
          title: 'Característica creada',
          text: data.msg || 'Característica creada correctamente.',
          confirmButtonColor: '#3085d6',
        }).then(() => {
          this.route.navigate(['caracteristicas']);
        });
      },
      error: (error) => {
        Swal.fire({
          icon: 'error',
          title: 'Error al registrar',
          text: error.error?.msg || 'Ocurrió un error al registrar la característica.',
          confirmButtonColor: '#d33',
        });
      }
    });
  }

  volver() {
    this.route.navigate(['caracteristicas']);
  }
}
