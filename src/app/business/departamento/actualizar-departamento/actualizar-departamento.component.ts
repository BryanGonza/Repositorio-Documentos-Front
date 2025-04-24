import { Component, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DepartamentoService } from '../../../services/departamento.service';
import Swal from 'sweetalert2';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Responsedepartamento } from '../../../interfaces/Departamento/Departamento';

@Component({
  selector: 'app-actualizar-departamento',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './actualizar-departamento.component.html',
  styleUrl: './actualizar-departamento.component.css',
})
export default class ActualizardepartamentoComponent {
  private route = inject(Router);
  private departamentoService = inject(DepartamentoService);
  

  departamentoId: number = 0;
  facultadId: number = 0;
  nombre: string = '';
  estado: boolean = true


  constructor(private activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.queryParams.subscribe(params => {
      this.departamentoId = params['iddepa'],
      this.facultadId = params['idfacu'],
      this.nombre = params['nombre'];
      this.estado = params['estado'];

    });
  }

  actualizardepartamento() {
    const datosActualizados: any = {
      ID_DEPARTAMENTO: this.departamentoId,
      ID_FACULTAD: this.facultadId,
      NOMBRE: this.nombre.toUpperCase(),
      ESTADO: this.estado,
    };

    this.departamentoService.actualizardepartamento(
      datosActualizados.ID_DEPARTAMENTO,
      datosActualizados.ID_FACULTAD,
      datosActualizados.NOMBRE,
      datosActualizados.ESTADO,
    ).subscribe({
      next: (res) => {
        Swal.fire({
          icon: 'success',
          title: 'Actualización exitosa',
          text: res.msg || 'departamento actualizada correctamente.',
          confirmButtonColor: '#3085d6',
        }).then(() => {
          this.route.navigate(['departamento']);
        });
      },
      error: (err) => {
        Swal.fire({
          icon: 'error',
          title: 'Error al actualizar',
          text: err.error?.msg || 'Ocurrió un error al actualizar departamento.',
          confirmButtonColor: '#d33',
        });
      },
    });
  }

  volver() {
    this.route.navigate(['departamento']);
  }
}