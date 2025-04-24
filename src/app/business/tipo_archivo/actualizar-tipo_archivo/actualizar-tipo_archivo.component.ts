import { Component, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Tipo_archivoService } from '../../../services/tipo_archivo.service';
import Swal from 'sweetalert2';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ResponseTipo_archivo } from '../../../interfaces/Tipo_Archivo/Tipo_archivo';

@Component({
  selector: 'app-actualizar-tipo_archivo',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './actualizar-tipo_archivo.component.html',
  styleUrl: './actualizar-tipo_archivo.component.css',
})
export default class ActualizarTipo_archivoComponent {
  private route = inject(Router);
  private tipo_archivoService = inject(Tipo_archivoService);
  

  tipo_archivoId: number = 0;
  tipoTipo_archivo: string = '';
  limiteTipo_archivo: number = 0

  constructor(private activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.queryParams.subscribe(params => {
      this.tipo_archivoId = params['id'],
      this.tipoTipo_archivo = params['tipo'];
      this.limiteTipo_archivo = params['limite'];

    

    });
  }

  actualizarTipo_archivo() {
    const datosActualizados: any = {
      ID_TIPO_ARCHIVO: this.tipo_archivoId,
      TIPO_ARCHIVO: this.tipoTipo_archivo.toUpperCase(),
      LIMITE_ALMACENAMIENTO: this.limiteTipo_archivo,
    };

    this.tipo_archivoService.actualizartipo_archivo(
      datosActualizados.ID_TIPO_ARCHIVO,
      datosActualizados.TIPO_ARCHIVO,
      datosActualizados.LIMITE_ALMACENAMIENTO,
    ).subscribe({
      next: (res) => {
        Swal.fire({
          icon: 'success',
          title: 'Actualización exitosa',
          text: res.msg || 'tipo_archivo actualizada correctamente.',
          confirmButtonColor: '#3085d6',
        }).then(() => {
          this.route.navigate(['tipo_archivo']);
        });
      },
      error: (err) => {
        Swal.fire({
          icon: 'error',
          title: 'Error al actualizar',
          text: err.error?.msg || 'Ocurrió un error al actualizar tipo_archivo.',
          confirmButtonColor: '#d33',
        });
      },
    });
  }

  volver() {
    this.route.navigate(['tipo_archivo']);
  }
}