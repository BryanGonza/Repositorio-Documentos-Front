import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { PermisosService } from '../../services/permisos.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import Swal from 'sweetalert2';
import { ObjetosService } from '../../services/objetos.service';
import { RolesService } from '../../services/roles.service';

@Component({
  selector: 'app-permisos',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './permisos.component.html',
  styleUrls: ['./permisos.component.css']
})
export default class PermisosComponent {
  public listaRoles: any[] = [];
  public listaObjetos: any[] = [];  
  private permisosService = inject(PermisosService);
  private route = inject(Router);
  public filteredPermisos: any[] = []; // Lista filtrada para mostrar
  public paginatedPermisos: any[] = []; // Permisos para la página actual
  public ListPermisos: any[] = [];
  public searchQuery: string = ''; // Valor del input de búsqueda
    
  private objetosService = inject(ObjetosService);
  private rolesService = inject(RolesService);
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
    this.rolesService.rolesget().subscribe({
      next: (data) => {
        if (data.ListRoles.length > 0) {
          this.listaRoles = data.ListRoles;
        }
      },
      error: (error) => {console.error('Error al cargar objetos', error)
      },
    });

    this.objetosService.objetosget().subscribe({
     next: (data) => {
       if (data.Lista_Objetos.length > 0) {
         this.listaObjetos = data.Lista_Objetos;
       }
     },
     error: (error) => {console.error('Error al cargar objetos', error)
     },
   });
  }
  getNombreRol(idRol: number): string {
    const rol = this.listaRoles.find(r => r.ID_ROL === idRol);
    return rol ? rol.ROL : 'Desconocido';
  }
  
  getNombreObjeto(idObjeto: number): string {
    const obj = this.listaObjetos.find(o => o.ID_OBJETO === idObjeto);
    return obj ? obj.OBJETO : 'Desconocido';
  }
  
// Método para filtrar permisos
filterPermisos() {
  const query = this.searchQuery.toUpperCase();

  this.filteredPermisos = this.ListPermisos.filter(permiso => {
    const idRolMatch = permiso.ID_ROL.toString().includes(query);
    const idObjetoMatch = permiso.ID_OBJETO.toString().includes(query);
    const insercionMatch = permiso.PERMISO_INSERCION.toUpperCase().includes(query);
    const eliminacionMatch = permiso.PERMISO_ELIMINACION.toUpperCase().includes(query);
    const actualizacionMatch = permiso.PERMISO_ACTUALIZACION.toUpperCase().includes(query);
    const consultarMatch = permiso.PERMISO_CONSULTAR.toUpperCase().includes(query);

    // aquí las dos nuevas comprobaciones
    const nombreRolMatch = this.getNombreRol(permiso.ID_ROL).toUpperCase().includes(query);
    const nombreObjetoMatch = this.getNombreObjeto(permiso.ID_OBJETO).toUpperCase().includes(query);

    return (
      idRolMatch ||
      idObjetoMatch ||
      insercionMatch ||
      eliminacionMatch ||
      actualizacionMatch ||
      consultarMatch ||
      nombreRolMatch ||
      nombreObjetoMatch
    );
  });

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

  editarPermiso(permiso: any) {
    this.route.navigate(['/actualizar-permiso'], {
      queryParams: {
        id: permiso.ID_PERMISO,
        idRol: permiso.ID_ROL,
        permisoInsercion: permiso.PERMISO_INSERCION,
        permisoEliminacion: permiso.PERMISO_ELIMINACION,
        permisoActualizacion: permiso.PERMISO_ACTUALIZACION,
        permisoConsultar: permiso.PERMISO_CONSULTAR,
        creadoPor: permiso.CREADO_POR,
        modificadoPor: permiso.MODIFICADO_POR,
        fechaCreacion: permiso.FECHA_CREACION,
        fechaModificacion: permiso.FECHA_MODIFICACION,
        // Si idObjeto se requiere en la lógica, inclúyelo
        idObjeto: permiso.ID_OBJETO
      }
    });
  }
  

  registro() {
    this.route.navigate(['registrar-permiso']);
  }
}