import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DepartamentoService } from '../../../services/departamento.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import Swal from 'sweetalert2';
import { FacultadService } from '../../../services/facultad.service';

@Component({
  selector: 'app-actualizar-departamento',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './actualizar-departamento.component.html',
  styleUrls: ['./actualizar-departamento.component.css']
})
export default class ActualizarDepartamentoComponent implements OnInit {
  private route = inject(Router);
  private departamentoService = inject(DepartamentoService);
  private facultadService = inject(FacultadService);

  constructor(private activatedRoute: ActivatedRoute) {}

  // Listado de facultades para el select
  lista_facultad: any[] = [];
  facultadesCargadas: boolean = false;

  // Datos del formulario
  idDepartamento: number = 0;
  idFacultad: number = 0;
  nombre: string = '';
  estado: boolean = true;
  cargando: boolean = false;

  ngOnInit(): void {
    this.cargarDatosIniciales();
  }

  cargarDatosIniciales(): void {
    this.activatedRoute.queryParams.subscribe(params => {
      this.idDepartamento = +params['iddepa'] || 0;
      this.idFacultad = +params['idfacu'] || 0;
      this.nombre = params['nombre'] || '';

      const estadoParam = params['estado'];
      if (estadoParam?.toUpperCase() === 'ACTIVO') {
        this.estado = true;
      } else if (estadoParam?.toUpperCase() === 'INACTIVO') {
        this.estado = false;
      } else {
        this.estado = false;
      }

      this.cargarFacultades();
    });
  }

  cargarFacultades(): void {
    this.facultadService.facultadget().subscribe({
      next: (res) => {
        this.lista_facultad = res.Lista_Facultad || [];
        this.facultadesCargadas = true;
      },
      error: (err) => {
        console.error("Error al obtener facultades", err);
        this.facultadesCargadas = true;
        Swal.fire({
          icon: 'warning',
          title: 'Advertencia',
          text: 'Se cargó la página pero no se pudieron obtener las facultades.',
          confirmButtonColor: '#3085d6',
        });
      }
    });
  }

  actualizarDepartamento(): void {
    if (!this.validarFormulario()) return;

    this.cargando = true;

    this.departamentoService.actualizardepartamento(
      this.idDepartamento,
      this.idFacultad,
      this.nombre.trim(),
      this.estado,
    ).subscribe({
      next: (res) => {
        this.cargando = false;
        Swal.fire({
          icon: 'success',
          title: 'Actualización exitosa',
          text: res.message || 'Departamento actualizado correctamente.',
          confirmButtonColor: '#3085d6',
        }).then(() => this.route.navigate(['departamento']));
      },
      error: (err) => {
        this.cargando = false;
        Swal.fire({
          icon: 'error',
          title: 'Error al actualizar',
          text: err.error?.message || err.message || 'Ocurrió un error al actualizar el departamento.',
          confirmButtonColor: '#d33',
        });
      }
    });
  }

  validarFormulario(): boolean {
    if (!this.idDepartamento || this.idDepartamento <= 0) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'No se ha especificado un departamento válido a actualizar.',
        confirmButtonColor: '#d33',
      });
      return false;
    }

    if (!this.idFacultad || this.idFacultad <= 0) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Debe seleccionar una facultad válida.',
        confirmButtonColor: '#d33',
      });
      return false;
    }

    if (!this.nombre || this.nombre.trim().length < 3) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'El nombre del departamento debe tener al menos 3 caracteres.',
        confirmButtonColor: '#d33',
      });
      return false;
    }

    // Validación opcional: estado debe ser boolean
    if (typeof this.estado !== 'boolean') {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'El estado del departamento no es válido.',
        confirmButtonColor: '#d33',
      });
      return false;
    }

    return true;
  }

  volver(): void {
    this.route.navigate(['departamento']);
  }
}
