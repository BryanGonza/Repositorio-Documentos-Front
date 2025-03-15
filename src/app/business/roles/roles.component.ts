import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { Roles } from '../../interfaces/Roles/Roles';
import { RolesService } from '../../services/roles.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-roles',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './roles.component.html',
  styleUrls: ['./roles.component.css']
})
export default class RolesComponent {

  private rolesService = inject(RolesService);
  private route = inject(Router);
  public filteredRoles: Roles[] = []; // Lista filtrada para mostrar
  public paginatedRoles: Roles[] = []; // Roles para la página actual
  public ListRoles: Roles[] = [];
  public searchQuery: string = ''; // Valor del input de búsqueda

  // Paginación
  public currentPage: number = 1;
  public itemsPerPage: number = 5;
  public totalPages: number = 1; // Asegúrate de definir esta propiedad

  public displayedColumns: string[] = [
    'Id',
    'Rol',
    'Descripcion',
    'FechaCreacion',
    'CreadoPor',
    'FechaModificacion',
    'ModificadoPor'
  ];

  constructor() {
    this.rolesService.rolesget().subscribe({
      next: (data) => {
        if (data.ListRoles.length > 0) {
          this.ListRoles = data.ListRoles;
          this.filteredRoles = data.ListRoles;
          this.updatePagination();
        }
      },
      error: (error) => {
        Swal.fire({
          icon: 'error',
          title: 'Error al cargar roles',
          text: error.message || 'No se pudieron obtener los roles.',
          confirmButtonColor: '#d33',
        });
      },
    });
  }

  // Método para filtrar roles
  filterRoles() {
    const query = this.searchQuery.toLowerCase();
    this.filteredRoles = this.ListRoles.filter(role =>
      role.ROL.toLowerCase().includes(query) ||
      role.DESCRIPCION.toLowerCase().includes(query)
    );
    this.currentPage = 1;
    this.updatePagination();
  }

  // Actualizar paginación
  updatePagination() {
    this.totalPages = Math.ceil(this.filteredRoles.length / this.itemsPerPage);
    this.updatePaginatedRoles();
  }

  // Actualiza los roles visibles según la página actual
  updatePaginatedRoles() {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    this.paginatedRoles = this.filteredRoles.slice(startIndex, endIndex);
  }

  // Métodos de navegación para paginación
  goToFirstPage() {
    this.currentPage = 1;
    this.updatePaginatedRoles();
  }

  goToPreviousPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.updatePaginatedRoles();
    }
  }

  goToNextPage() {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.updatePaginatedRoles();
    }
  }

  goToLastPage() {
    this.currentPage = this.totalPages;
    this.updatePaginatedRoles();
  }

  // Eliminar un rol por ID con SweetAlert2
  eliminarRol(ID_ROL: number) {
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
        this.rolesService.eliminarRol(ID_ROL).subscribe({
          next: (res) => {
            Swal.fire({
              icon: 'success',
              title: 'Eliminado',
              text: res.msg || 'El rol ha sido eliminado exitosamente.',
              confirmButtonColor: '#3085d6',
            });

            // Actualiza la lista después de eliminar
            this.ListRoles = this.ListRoles.filter(role => role.ID_ROL !== ID_ROL);
            this.filteredRoles = this.filteredRoles.filter(role => role.ID_ROL !== ID_ROL);
            this.updatePagination();
          },
          error: (err) => {
            Swal.fire({
              icon: 'error',
              title: 'Error al eliminar',
              text: err.error?.msg || 'Ocurrió un error al eliminar el rol.',
              confirmButtonColor: '#d33',
            });
          }
        });
      }
    });
  }
  editarRol(parame: Roles) {
    console.log("Datos enviados a queryParams:", parame);
    this.route.navigate(['/actualizar-rol'], { queryParams: { 
      id: parame.ID_ROL, 
      rol: parame.ROL, 
      descripcion: parame.DESCRIPCION,
      fechaCreacion: parame.FECHA_CREACION, 
      creadoPor: parame.CREADO_POR, 
      fechaModificacion: parame.FECHA_MODIFICACION, 
      modificadoPor: parame.MODIFICADO_POR
    } });
  }
  



  registro() {
    this.route.navigate(['registrar-rol']);
  }
}
