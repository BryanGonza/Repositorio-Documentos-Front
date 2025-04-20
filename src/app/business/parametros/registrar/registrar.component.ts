import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { ParametrosService } from '../../../services/parametros.service';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { parametros, registro } from '../../../interfaces/Parametros/resposeParametros';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-registrar',
  standalone: true,
  imports: [FormsModule,CommonModule, ReactiveFormsModule],
  templateUrl: './registrar.component.html',
  styleUrl: './registrar.component.css',
})
export default class RegistrarComponent {
  private route = inject(Router);
    public fromBuild = inject(FormBuilder);
  private parametroService = inject(ParametrosService);

  public fromRegistro: FormGroup = this.fromBuild.group({
      nombreParame: ['', Validators.required],
      ValorParame: ['', Validators.required],
    });

  registrarParametro() {
    const objeto: registro = {
      PARAMETRO: this.fromRegistro.value.nombreParame.toUpperCase(),
      VALOR: this.fromRegistro.value.ValorParame.toUpperCase(),
    };

    this.parametroService.registroPara(objeto).subscribe({
      next: (data) => {
        console.log('Datos a enviar:', objeto);

        if (data.msg.includes('creado correctamente')) {
          Swal.fire({
            icon: 'success',
            title: 'Parametro creado',
            text: data.msg,
            confirmButtonColor: '#3085d6',
          }).then(() => {
            this.route.navigate(['parametros']);
          });
        } else {
          Swal.fire({
            icon: 'error',
            title: 'Error al registrar',
            text: data.msg,
            confirmButtonColor: '#d33',
          });
        }
      },
      error: (error) => {
        console.error('Ocurrió un error:', error);
        Swal.fire({
          icon: 'error',
          title: 'Error en el servidor',
          text: error.error?.msg || 'Error desconocido al registrar parametro.',
          confirmButtonColor: '#d33',
        });
      },
    });
  }

  volver() {
    this.route.navigate(['/parametros']);
  }
}
