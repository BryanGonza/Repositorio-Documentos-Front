import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { PermisosService } from '../../services/permisos.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-permisos',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './permisos.component.html',
  styleUrls: ['./permisos.component.css']
})
export default class PermisosComponent {

  private permisosService = inject(PermisosService);
  private route = inject(Router);
  public filteredPermisos: any[] = []; // Lista filtrada para mostrar
  public paginatedPermisos: any[] = []; // Permisos para la página actual
  public ListPermisos: any[] = [];
  public searchQuery: string = ''; // Valor del input de búsqueda

  // Paginación
  public currentPage: number = 1;
  public itemsPerPage: number = 5;
  public totalPages: number = 1; // Asegúrate de definir esta propiedad

  public displayedColumns: string[] = [
    'ID_PERMISO',
    'ID_ROL',
    'ID_OBJETO',
    'PERMISO_INSERCION',
    'PERMISO_ELIMINACION',
    'PERMISO_ACTUALIZACION',
    'PERMISO_CONSULTAR',
    'CREADO_POR',
    'MODIFICADO_POR',
    'FECHA_CREACION',
    'FECHA_MODIFICACION'
  ];

  constructor() {
    this.permisosService.getPermisos().subscribe({
      next: (data) => {
        if (data.ListPermisos.length > 0) {
          this.ListPermisos = data.ListPermisos;
          this.filteredPermisos = data.ListPermisos;
          this.updatePagination();
        }
      },
      error: (error) => {
        Swal.fire({
          icon: 'error',
          title: 'Error al cargar permisos',
          text: error.message || 'No se pudieron obtener los permisos.',
          confirmButtonColor: '#d33',
        });
      },
    });
  }

  // Método para filtrar permisos
  filterPermisos() {
    const query = this.searchQuery.toLowerCase();
    this.filteredPermisos = this.ListPermisos.filter(permiso =>
      permiso.ID_ROL.toString().includes(query) ||
      permiso.ID_OBJETO.toString().includes(query) ||
      permiso.PERMISO_INSERCION.toLowerCase().includes(query) ||
      permiso.PERMISO_ELIMINACION.toLowerCase().includes(query) ||
      permiso.PERMISO_ACTUALIZACION.toLowerCase().includes(query) ||
      permiso.PERMISO_CONSULTAR.toLowerCase().includes(query)
    );
    this.currentPage = 1;
    this.updatePagination();
  }

  // Actualizar paginación
  updatePagination() {
    this.totalPages = Math.ceil(this.filteredPermisos.length / this.itemsPerPage);
    this.updatePaginatedPermisos();
  }

  // Actualiza los permisos visibles según la página actual
  updatePaginatedPermisos() {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    this.paginatedPermisos = this.filteredPermisos.slice(startIndex, endIndex);
  }

  // Métodos de navegación para paginación
  goToFirstPage() {
    this.currentPage = 1;
    this.updatePaginatedPermisos();
  }

  goToPreviousPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.updatePaginatedPermisos();
    }
  }

  goToNextPage() {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.updatePaginatedPermisos();
    }
  }

  goToLastPage() {
    this.currentPage = this.totalPages;
    this.updatePaginatedPermisos();
  }

  // Eliminar un permiso por ID con SweetAlert2
  eliminarPermiso(ID_PERMISO: number) {
    Swal.fire({
      title: '¿Estás seguro?',
      text: '¡No podrás revertir esto!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.permisosService.eliminarPermiso(ID_PERMISO).subscribe({
          next: (res) => {
            Swal.fire({
              icon: 'success',
              title: 'Eliminado',
              text: res.msg || 'El permiso ha sido eliminado exitosamente.',
              confirmButtonColor: '#3085d6',
            });

            // Actualiza la lista después de eliminar
            this.ListPermisos = this.ListPermisos.filter(permiso => permiso.ID_PERMISO !== ID_PERMISO);
            this.filteredPermisos = this.filteredPermisos.filter(permiso => permiso.ID_PERMISO !== ID_PERMISO);
            this.updatePagination();
          },
          error: (err) => {
            Swal.fire({
              icon: 'error',
              title: 'Error al eliminar',
              text: err.error?.msg || 'Ocurrió un error al eliminar el permiso.',
              confirmButtonColor: '#d33',
            });
          }
        });
      }
    });
  }

  editarPermiso(param: any) {
    console.log("Datos enviados a queryParams:", param);
    this.route.navigate(['actualizar-permiso'], { queryParams: { 
      id: param.ID_PERMISO, 
      idRol: param.ID_ROL, 
      idObjeto: param.ID_OBJETO,
      permisoInsercion: param.PERMISO_INSERCION, 
      permisoEliminacion: param.PERMISO_ELIMINACION, 
      permisoActualizacion: param.PERMISO_ACTUALIZACION, 
      permisoConsultar: param.PERMISO_CONSULTAR,
      creadoPor: param.CREADO_POR, 
      modificadoPor: param.MODIFICADO_POR, 
      fechaCreacion: param.FECHA_CREACION, 
      fechaModificacion: param.FECHA_MODIFICACION
    } });
  }

  registro() {
    this.route.navigate(['registrar-permiso']);
  }
}