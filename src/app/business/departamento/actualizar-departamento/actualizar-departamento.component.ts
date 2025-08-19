import { Component, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DepartamentoService } from '../../../services/departamento.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import Swal from 'sweetalert2';
import { Facultad } from '../../../interfaces/UNAH/Facultad/Facultad';
import { Departamento } from '../../../interfaces/Documentos/detalles';
import { FacultadService } from '../../../services/facultad.service';

@Component({
  selector: 'app-actualizar-departamento',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './actualizar-departamento.component.html',
  styleUrls: ['./actualizar-departamento.component.css']
})
export default class ActualizarDepartamentoComponent {
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
  nombre: string='';
  estado: boolean = true;
  cargando: boolean = false;

  ngOnInit(): void {
    this.cargarDatosIniciales();
  }

 cargarDatosIniciales(): void {
  this.activatedRoute.queryParams.subscribe(params => {
    this.idDepartamento = +params['iddepa'] || 0;
    this.idFacultad = +params['idfacu'] || 0;
    this.nombre= params['nombre'] || '';

    const estadoParam = params['estado'];
    if (estadoParam === 'ACTIVO') {
      this.estado = true;
    } else if (estadoParam === 'INACTIVO') {
      this.estado = false;
    } else {
      this.estado = false; // o true, según lógica que prefieras
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
    if (this.validarFormulario()) {
      this.cargando = true;

      this.departamentoService.actualizardepartamento(
        this.idDepartamento,
        this.idFacultad,
        this.nombre,
        this.estado,
      ).subscribe({
        next: (res) => {
          this.cargando = false;
          Swal.fire({
            icon: 'success',
            title: 'Actualización exitosa',
            text: res.message || 'Departamento actualizado correctamente.',
            confirmButtonColor: '#3085d6',
          }).then(() => {
            this.route.navigate(['departamento']);
          });
        },
        error: (err) => {
          this.cargando = false;
          Swal.fire({
            icon: 'error',
            title: 'Error al actualizar',
            text: err.error?.message || err.message || 'Ocurrió un error al actualizar el departamento.',
            confirmButtonColor: '#d33',
          });
        },
        
      });
    }
  }

   validarFormulario(): boolean {
     if (!this.idDepartamento) {
       Swal.fire({
         icon: 'error',
         title: 'Error',
         text: 'No se ha especificado el departamento a actualizar',
         confirmButtonColor: '#d33',
       });
       return false;
     }
 
     if (!this.idFacultad) {
       Swal.fire({
         icon: 'error',
         title: 'Error',
         text: 'Debe seleccionar un departamento',
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
