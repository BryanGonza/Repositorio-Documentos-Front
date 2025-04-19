import { Component, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { EstadoService } from '../../../services/estado.service';
import Swal from 'sweetalert2';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-actualizar-estado',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './actualizar-estado.component.html',
  styleUrls: ['./actualizar-estado.component.css']
})
export default class ActualizarEstadoComponent {
  private route = inject(Router);
  private estadoService = inject(EstadoService);

  estadoId: number = 0;
  NombreEstado: string = '';

  constructor(private activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.queryParams.subscribe(params => {
      this.estadoId = params['id'];
      this.NombreEstado = params['estado'];
    });
  }

  actualizarEstado() {
    const datosActualizados: any = {
      ID_ESTADO: this.estadoId,
      ESTADO: this.NombreEstado.toUpperCase(),
    };

    this.estadoService.actualizarEstado(
      datosActualizados.ID_ESTADO,
      datosActualizados.ESTADO,
    ).subscribe({
      next: (res) => {
        Swal.fire({
          icon: 'success',
          title: 'Actualización exitosa',
          text: res.msg || 'Estado actualizado correctamente.',
          confirmButtonColor: '#3085d6',
        }).then(() => {
          this.route.navigate(['estado']);
        });
      },
      error: (err) => {
        Swal.fire({
          icon: 'error',
          title: 'Error al actualizar',
          text: err.error?.msg || 'Ocurrió un error al actualizar el estado.',
          confirmButtonColor: '#d33',
        });
      },
    });
  }

  volver() {
    this.route.navigate(['estado']);
  }
}