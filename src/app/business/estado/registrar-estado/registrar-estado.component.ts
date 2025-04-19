import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { EstadoService } from '../../../services/estado.service';
import { RegistroEstado } from '../../../interfaces/Estado/RegistroEstado';
import { CommonModule } from '@angular/common';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-registrar-estado',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './registrar-estado.component.html',
  styleUrls: ['./registrar-estado.component.css']
})
export class RegistrarEstadoComponent {
  private estadoService = inject(EstadoService);
  private route = inject(Router);
  public fromBuild = inject(FormBuilder);

  public formRegistro: FormGroup = this.fromBuild.group({
    nombreEstado: ['', Validators.required]
  });

  // Método para registrar el estado
  registrarEstado() {
    if (this.formRegistro.invalid) {
      Swal.fire({
        icon: 'warning',
        title: 'Campo incompleto',
        text: 'Por favor ingrese el nombre del estado.',
        confirmButtonColor: '#3085d6',
      });
      return;
    }

    const objeto: RegistroEstado = {
      ESTADO: this.formRegistro.value.nombreEstado.toUpperCase()
    };

    this.estadoService.registrarEstado(objeto).subscribe({
      next: (data) => {
        Swal.fire({
          icon: 'success',
          title: 'Estado creado',
          text: data.msg || 'Estado creado correctamente.',
          confirmButtonColor: '#3085d6',
        }).then(() => {
          this.route.navigate(['estado']);
        });
      },
      error: (error) => {
        Swal.fire({
          icon: 'error',
          title: 'Error al registrar',
          text: error.error?.msg || 'Ocurrió un error al registrar el estado.',
          confirmButtonColor: '#d33',
        });
      }
    });
  }

  volver() {
    this.route.navigate(['estado']);
  }
}