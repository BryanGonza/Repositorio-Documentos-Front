import { Component, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CaracteristicaService } from '../../../../services/caracteristica.service';
import Swal from 'sweetalert2';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TipoCaracteristicaService } from '../../../../services/tipo_caracteristica.service';

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
  private tipocService = inject(TipoCaracteristicaService);

  listado_Tipo_Caracteristicas: any[] = [];
  tipocCargados: boolean = false;
  cargando: boolean = false;

  caracteristicaId: number = 0;
  idtipoc: number = 0;
  tipoCaracteristica: string = '';
  nombreCaracteristica: string = '';
  valoresPredeterminados: boolean = false;

  constructor(private activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.cargarDatosIniciales();
  }

  cargarDatosIniciales(): void {
    this.activatedRoute.queryParams.subscribe(params => {
      this.caracteristicaId = +params['id'] || 0;
      this.tipoCaracteristica = params['tipoCaracteristica'] || '';
      this.nombreCaracteristica = params['caracteristica'] || '';
      this.valoresPredeterminados = params['valores'] === 'true' || false;

      this.cargartipoc();
    });
  }

  cargartipoc(): void {
    this.tipocService.getTipoCaracteristicas().subscribe({
      next: (res) => {
        this.listado_Tipo_Caracteristicas = res.Listado_Tipo_Caracteristica || [];
        this.tipocCargados = true;

        // Buscar ID del tipo según el nombre recibido
        const encontrado = this.listado_Tipo_Caracteristicas.find(
          t => t.TIPO_CARACTERISTICA.toLowerCase() === this.tipoCaracteristica.toLowerCase()
        );

        this.idtipoc = encontrado ? encontrado.ID_TIPO_CARACTERISTICA : 0;
      },
      error: (err) => {
        console.error("Error al obtener tipos de característica:", err);
        this.tipocCargados = true;
        Swal.fire({
          icon: 'warning',
          title: 'Advertencia',
          text: 'No se pudieron obtener los tipos de características.',
          confirmButtonColor: '#3085d6',
        });
      }
    });
  }

  actualizarCaracteristica(): void {
    if (this.validarFormulario()) {
      this.cargando = true;

      this.caracteristicaService.actualizarc(
        this.caracteristicaId,
        this.idtipoc,
        this.tipoCaracteristica,
        this.nombreCaracteristica,
        this.valoresPredeterminados
      ).subscribe({
        next: (res) => {
          this.cargando = false;
          Swal.fire({
            icon: 'success',
            title: 'Actualización exitosa',
            text: res.message || 'Característica actualizada correctamente.',
            confirmButtonColor: '#3085d6',
          }).then(() => {
            this.route.navigate(['caracteristicas']);
          });
        },
        error: (err) => {
          this.cargando = false;
          Swal.fire({
            icon: 'error',
            title: 'Error al actualizar',
            text: err.error?.message || err.message || 'Ocurrió un error al actualizar.',
            confirmButtonColor: '#d33',
          });
        },
      });
    }
  }

  validarFormulario(): boolean {
    if (!this.caracteristicaId) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'No se ha especificado la característica a actualizar',
        confirmButtonColor: '#d33',
      });
      return false;
    }

    if (!this.idtipoc) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Debe seleccionar un tipo de característica',
        confirmButtonColor: '#d33',
      });
      return false;
    }
      if (!this.tipoCaracteristica || this.tipoCaracteristica.trim().length === 0) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'El nombre de la característica no puede estar vacío',
        confirmButtonColor: '#d33',
      });
      return false;
    }

    if (!this.nombreCaracteristica || this.nombreCaracteristica.trim().length === 0) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'El nombre de la característica no puede estar vacío',
        confirmButtonColor: '#d33',
      });
      return false;
    }

    return true;
  }

  volver(): void {
    this.route.navigate(['caracteristicas']);
  }
}
