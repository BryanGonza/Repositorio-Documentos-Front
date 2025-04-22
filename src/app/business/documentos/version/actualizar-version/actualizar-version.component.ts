import { Component, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { VersionService } from '../../../../services/version.service';
import Swal from 'sweetalert2';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-actualizar-version',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './actualizar-version.component.html',
  styleUrls: ['./actualizar-version.component.css']
})
export default class ActualizarVersionComponent {
  private route = inject(Router);
  private versionService = inject(VersionService);

  versionId: number = 0;
  idUsuario: number = 0;
  nombre: string = '';
  cambios: boolean = false;
  fechaActu: Date = new Date();

  constructor(private activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.queryParams.subscribe(params => {
      this.versionId = params['id'];
      this.idUsuario = params['id_usuario'];
      this.nombre = params['nombre'];
      this.cambios = params['cambios'];
      this.fechaActu = params['fecha_actu'] ? new Date(params['fecha_actu']) : new Date();
    });
  }

  actualizarVersion() {
    const datosActualizados = {
      ID_VERSION: this.versionId,
      ID_USUARIO: this.idUsuario,
      NOMBRE: this.nombre.toUpperCase(),
      CAMBIOS: this.cambios,
      FECHA_ACTU: this.fechaActu
    };

    this.versionService.actualizarVersion(
      datosActualizados.ID_VERSION,
      datosActualizados.ID_USUARIO,
      datosActualizados.NOMBRE,
      datosActualizados.CAMBIOS,
      datosActualizados.FECHA_ACTU
    ).subscribe({
      next: (res) => {
        Swal.fire({
          icon: 'success',
          title: 'Actualización exitosa',
          text: res.msg || 'Versión actualizada correctamente.',
          confirmButtonColor: '#3085d6',
        }).then(() => {
          this.route.navigate(['version']);
        });
      },
      error: (err) => {
        Swal.fire({
          icon: 'error',
          title: 'Error al actualizar',
          text: err.error?.msg || 'Ocurrió un error al actualizar la versión.',
          confirmButtonColor: '#d33',
        });
      },
    });
  }

  volver() {
    this.route.navigate(['version']);
  }
}