import { Component, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { EstructuraArchivosService } from '../../../../services/estructura-archivos.service';
import { DepartamentoService } from '../../../../services/departamento.service';
import { ResponseEstructuraArchivos } from '../../../../interfaces/Documentos/Estructura_archivos/Responsegetestructura_archivos';
import { departamento } from '../../../../interfaces/Departamento/Departamento';
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
  private departamentoService = inject(DepartamentoService);


  Listado_Departamento: any[] = [];
  departamentosCargados: boolean = false;
    cargando: boolean = false;

  estructuraId: number = 0;
  idDepartamento: number = 0;
  nombre: string = '';
  ubicacion: string = '';


   constructor(private activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.cargarDatosIniciales();
  }

  cargarDatosIniciales(): void {
    this.activatedRoute.queryParams.subscribe(params => {
      this.estructuraId = +params['id'] || 0;
      this.nombre = params['nombre'] || '';
      this.ubicacion = params['ubicacion'] || '';

      const posibleId = +params['departamento'];
      const posibleNombre = params['departamento'];

      // Si es un número válido, úsalo directamente
      if (!isNaN(posibleId)) {
        this.idDepartamento = posibleId;
        this.cargarDepartamentos();
      } else {
        // Si es texto (nombre), búscalo después de cargar los usuarios
        this.cargarDepartamentos(posibleNombre);
      }
    });
  }

 cargarDepartamentos(nombreDepartamento: string = ''): void {
    this.departamentoService.Departamentoget().subscribe({
      next: (res) => {
        this.Listado_Departamento = res.Listado_Departamentos || [];
        this.departamentosCargados = true;

        if (nombreDepartamento) {
          const encontrado = this.Listado_Departamento.find(
            d => d.NOMBRE === nombreDepartamento
          );
          this.idDepartamento = encontrado ? encontrado.ID_DEPARTAMENTO : 0;
        }
      },
      error: (err) => {
        console.error("Error al obtener las estructuras", err);
        this.departamentosCargados = true;
        Swal.fire({
          icon: 'warning',
          title: 'Advertencia',
          text: 'Se cargó la página pero no se pudieron obtener las estructuras actualizados.',
          confirmButtonColor: '#3085d6',
        });
      }
    });
  }
  actualizarEstructura(): void {
    if (this.validarFormulario()) {
      this.cargando = true;

      this.estructuraArchivosService.actualizarEstructura(
        this.estructuraId,
        this.idDepartamento,
        this.nombre,
        this.ubicacion
      ).subscribe({
        next: (res) => {
          this.cargando = false;
          Swal.fire({
            icon: 'success',
            title: 'Actualización exitosa',
            text: res.message || ' actualizada correctamente.',
            confirmButtonColor: '#3085d6',
          }).then(() => {
            this.route.navigate(['/estructura_archivos']);
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
    if (!this.estructuraId) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'No se ha especificado la estructura a actualizar',
        confirmButtonColor: '#d33',
      });
      return false;
    }

    if (!this.idDepartamento) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Debe seleccionar una estructura',
        confirmButtonColor: '#d33',
      });
      return false;
    }

    

    if (!this.nombre || this.nombre.trim().length === 0) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'El nombre de la estructura no puede estar vacío',
        confirmButtonColor: '#d33',
      });
      return false;
    }

     if (!this.ubicacion || this.ubicacion.trim().length === 0) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'El nombre de la estructura no puede estar vacío',
        confirmButtonColor: '#d33',
      });
      return false;
    }

    return true;
  }

  volver(): void {
    this.route.navigate(['/estructura_archivos']);
  }
}