import { Component, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CaracteristicaService } from '../../../../services/caracteristica.service';
import Swal from 'sweetalert2';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-actualizar-caracteristica',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './actualizar-caracteristica.component.html',
  styleUrls: ['./actualizar-caracteristica.component.css']
})
export default class ActualizarCaracteristicaComponent {
  private route = inject(Router);
  private caracteristicaService = inject(CaracteristicaService);

  caracteristicaId: number = 0;
  tipoCaracteristica: string = '';
  nombreCaracteristica: string = '';
  valoresPredeterminados: boolean = false;

  constructor(private activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.queryParams.subscribe(params => {
      this.caracteristicaId = params['id'];
      this.tipoCaracteristica = params['idTipo'] || '';
      this.nombreCaracteristica = params['caracteristica'] || '';
      this.valoresPredeterminados = params['valores'] === 'true';
    });
  }

  actualizarCaracteristica() {
    const datosActualizados: any = {
      ID_CARACTERISTICA: this.caracteristicaId,
      ID_TIPO_CARACTERISTICA: this.tipoCaracteristica,
      CARACTERISTICA: this.nombreCaracteristica.toUpperCase(),
      VALORES_PREDETERMINADOS: this.valoresPredeterminados
    };

    this.caracteristicaService.actualizarc(
      datosActualizados.ID_CARACTERISTICA,
      datosActualizados.ID_TIPO_CARACTERISTICA,
      datosActualizados.CARACTERISTICA,
      datosActualizados.VALORES_PREDETERMINADOS
    ).subscribe({
      next: (res) => {
        Swal.fire({
          icon: 'success',
          title: 'Actualización exitosa',
          text: res.msg || 'Característica actualizada correctamente.',
          confirmButtonColor: '#3085d6',
        }).then(() => {
          this.route.navigate(['caracteristicas']);
        });
      },
      error: (err) => {
        Swal.fire({
          icon: 'error',
          title: 'Error al actualizar',
          text: err.error?.msg || 'Ocurrió un error al actualizar la característica.',
          confirmButtonColor: '#d33',
        });
      },
    });
  }

  volver() {
    this.route.navigate(['caracteristicas']);
  }
}