import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { Facultad } from '../../../interfaces/UNAH/Facultad/Facultad';
import { FacultadService } from '../../../services/facultad.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import Swal from 'sweetalert2';
import { ObjetoPermisoExtendido } from '../../../interfaces/Objetos/Objetos';
import { ObjetosService } from '../../../services/objetos.service';
import { SharedService } from '../../../shared.service';

@Component({
  selector: 'app-facultad',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './facultad.component.html',
  styleUrls: ['./facultad.component.css']
})
export default class FacultadComponent {

  private facultadService = inject(FacultadService);
  private route = inject(Router);
  public filteredFacultades: Facultad[] = []; // Lista filtrada para mostrar
  public paginatedFacultades: Facultad[] = []; // Facultades para la página actual
  public Lista_Facultad: Facultad[] = [];
  public searchQuery: string = ''; // Valor del input de búsqueda

  // Paginación
  public currentPage: number = 1;
  public itemsPerPage: number = 5;
  public totalPages: number = 1;

  public displayedColumns: string[] = [
    'Id',
    'Nombre',
    'Estado'
  ];

  constructor(private sharedService: SharedService) {
    this.facultadService.facultadget().subscribe({
      next: (data) => {
        if (data.Lista_Facultad.length > 0) {
          this.Lista_Facultad = data.Lista_Facultad;
          this.filteredFacultades = data.Lista_Facultad;
          this.updatePagination();
        }
      },
      error: (error) => {
        Swal.fire({
          icon: 'error',
          title: 'Error al cargar facultades',
          text: error.message || 'No se pudieron obtener las facultades.',
          confirmButtonColor: '#d33',
        });
      },
    });
  }
//roles y permisos 
    rolActual = '';
    ngOnInit() {
      this.sharedService.rol$.subscribe((rol) => {
        this.rolActual = rol;
        this.getObjetosConPermisos();
      });
      
    }
    objetos: ObjetoPermisoExtendido[] = [];
    private objetoser = inject(ObjetosService);
    token: string =
      typeof window !== 'undefined' ? localStorage.getItem('token') || '' : '';
  
    getObjetosConPermisos(): void {
      this.objetoser.getObjetosPermisos(this.token).subscribe({
        next: (data) => {
          this.objetos = data;
          console.log('Objetos con permisos:', this.objetos);
        },
        error: (err) => {
          console.error('Error al obtener objetos:', err);
        },
      });
    }
      // MEtodo para normalizar cadenas
      private normalize(str: string): string {
        return str
          .toLowerCase()
          .normalize('NFD')
          .replace(/[\u0300-\u036f]/g, '');
      }
    
      getPermiso(accion: string): boolean {
        // Verifica si el permiso para la pantalla 'parametro' existe
        const permiso = this.objetos.find((o) =>
          this.normalize(o.OBJETO).includes('facultad')
        );
        if (!permiso) {
          console.warn("No se encontró permiso para la pantalla 'facultad'");
          return false;
        }
    
        const mapping: Record<
          'consulta' | 'insercion' | 'actualizacion' | 'eliminacion',
          boolean
        > = {
          consulta: permiso.PERMISO_CONSULTAR,
          insercion: permiso.PERMISO_INSERCION,
          actualizacion: permiso.PERMISO_ACTUALIZACION,
          eliminacion: permiso.PERMISO_ELIMINACION,
        };
    
        const key = this.normalize(accion) as
          | 'consulta'
          | 'insercion'
          | 'actualizacion'
          | 'eliminacion';
        return mapping[key] ?? false;
      }
    // Fin de roles y permisos
    
  // Método para filtrar facultades
  filterFacultades() {
    const query = this.searchQuery.toLowerCase();
    this.filteredFacultades = this.Lista_Facultad.filter(facultad =>
      facultad.NOMBRE.toLowerCase().includes(query) ||
      (facultad.ESTADO ? 'activo' : 'inactivo').includes(query)
    );
    this.currentPage = 1;
    this.updatePagination();
  }

  // Actualizar paginación
  updatePagination() {
    this.totalPages = Math.ceil(this.filteredFacultades.length / this.itemsPerPage);
    this.updatePaginatedFacultades();
  }

  // Actualiza las facultades visibles según la página actual
  updatePaginatedFacultades() {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    this.paginatedFacultades = this.filteredFacultades.slice(startIndex, endIndex);
  }

  // Métodos de navegación para paginación
  goToFirstPage() {
    this.currentPage = 1;
    this.updatePaginatedFacultades();
  }

  goToPreviousPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.updatePaginatedFacultades();
    }
  }

  goToNextPage() {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.updatePaginatedFacultades();
    }
  }

  goToLastPage() {
    this.currentPage = this.totalPages;
    this.updatePaginatedFacultades();
  }

  // Eliminar una facultad por ID con SweetAlert2
  eliminarFacultad(ID_FACULTAD: number) {
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
        this.facultadService.eliminarFacultad(ID_FACULTAD).subscribe({
          next: (res) => {
            Swal.fire({
              icon: 'success',
              title: 'Eliminado',
              text: res.msg || 'La facultad ha sido eliminada exitosamente.',
              confirmButtonColor: '#3085d6',
            });

            // Actualiza la lista después de eliminar
            this.Lista_Facultad = this.Lista_Facultad.filter(facultad => facultad.ID_FACULTAD !== ID_FACULTAD);
            this.filteredFacultades = this.filteredFacultades.filter(facultad => facultad.ID_FACULTAD !== ID_FACULTAD);
            this.updatePagination();
          },
          error: (err) => {
            Swal.fire({
              icon: 'error',
              title: 'Error al eliminar',
              text: err.error?.msg || 'Ocurrió un error al eliminar la facultad.',
              confirmButtonColor: '#d33',
            });
          }
        });
      }
    });
  }

  editarFacultad(param: Facultad) {
    console.log("Datos enviados a queryParams:", param);
    this.route.navigate(['/actualizar-facultad'], { 
      queryParams: { 
        id: param.ID_FACULTAD, 
        nombre: param.NOMBRE, 
        estado: param.ESTADO,
      } 
    });
  }

  registro() {
    this.route.navigate(['registrar-facultad']);
  }
}