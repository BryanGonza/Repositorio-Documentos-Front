import { Component, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { EstructuraArchivosService } from '../../../../services/estructura-archivos.service';
import { ResponseEstructuraArchivos } from '../../../../interfaces/Documentos/Estructura_archivos/Responsegetestructura_archivos';
import Swal from 'sweetalert2';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-actualizar-estructura-archivos',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './actualizar-estructura-archivos.component.html',
  styleUrl: './actualizar-estructura-archivos.component.css',
})
export default class ActualizarEstructuraArchivosComponent {
  private route = inject(Router);
  private estructuraArchivosService = inject(EstructuraArchivosService);

  estructuraId: number = 0;
  idDepartamento: number = 0;
  espacioAlmacenamiento: number = 0;
  nombre: string = '';
  ubicacion: string = '';

  constructor(private activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.queryParams.subscribe(params => {
      this.estructuraId = params['id'];
      this.idDepartamento = Number(params['id_departamento']);
      this.espacioAlmacenamiento = Number(params['espacio']);
      this.nombre = params['nombre'];
      this.ubicacion = params['ubicacion'];
    });
  }

  actualizarEstructura() {
    const datosActualizados:  any = {
      ID_ESTRUCTURA_ARCHIVOS: this.estructuraId,
      ID_DEPARTAMENTO: this.idDepartamento,
      ESPACIO_ALMACENAMIENTO: this.espacioAlmacenamiento,
      NOMBRE: this.nombre.toUpperCase(),
      UBICACION: this.ubicacion.toUpperCase()
    };

    this.estructuraArchivosService.actualizarEstructura(
      datosActualizados.ID_ESTRUCTURA_ARCHIVOS,
      datosActualizados.ID_DEPARTAMENTO,
      datosActualizados.ESPACIO_ALMACENAMIENTO,
      datosActualizados.NOMBRE,
      datosActualizados.UBICACION,
    ).subscribe({
      next: (res) => {
        Swal.fire({
          icon: 'success',
          title: 'Actualización exitosa',
          text: res.msg || 'Estructura de archivos actualizada correctamente.',
          confirmButtonColor: '#3085d6',
        }).then(() => {
          this.route.navigate(['estructura_archivos']);
        });
      },
      error: (err) => {
        Swal.fire({
          icon: 'error',
          title: 'Error al actualizar',
          text: err.error?.msg || 'Ocurrió un error al actualizar la estructura de archivos.',
          confirmButtonColor: '#d33',
        });
      },
    });
  }

  volver() {
    this.route.navigate(['estructura_archivos']);
  }
}