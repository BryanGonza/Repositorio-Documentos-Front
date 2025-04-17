import { Component, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FacultadService } from '../../../../services/facultad.service';
import Swal from 'sweetalert2';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ResponseFacultad } from '../../../../interfaces/UNAH/Facultad/Facultad';

@Component({
  selector: 'app-actualizar-facultad',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './actualizar-facultad.component.html',
  styleUrl: './actualizar-facultad.component.css',
})
export default class ActualizarFacultadComponent {
  private route = inject(Router);
  private facultadService = inject(FacultadService);

  facultadId: number = 0;
  NombreFacultad: string = '';
  EstadoFacultad: boolean = true

  constructor(private activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.queryParams.subscribe(params => {
      this.facultadId = params['id'],
      this.NombreFacultad = params['nombre'];
      this.EstadoFacultad = params['estado'] === 'true';
    });
  }

  actualizarFacultad() {
    const datosActualizados: any = {
      ID_FACULTAD: this.facultadId,
      NOMBRE: this.NombreFacultad.toUpperCase(),
      ESTADO: this.EstadoFacultad,
    };

    this.facultadService.actualizarfacultad(
      datosActualizados.ID_FACULTAD,
      datosActualizados.NOMBRE,
      datosActualizados.ESTADO,
    ).subscribe({
      next: (res) => {
        Swal.fire({
          icon: 'success',
          title: 'Actualización exitosa',
          text: res.msg || 'Facultad actualizada correctamente.',
          confirmButtonColor: '#3085d6',
        }).then(() => {
          this.route.navigate(['facultad']);
        });
      },
      error: (err) => {
        Swal.fire({
          icon: 'error',
          title: 'Error al actualizar',
          text: err.error?.msg || 'Ocurrió un error al actualizar la facultad.',
          confirmButtonColor: '#d33',
        });
      },
    });
  }

  volver() {
    this.route.navigate(['facultad']);
  }
}