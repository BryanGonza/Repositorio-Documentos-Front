import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { Caracteristica } from '../../../interfaces/Documentos/Caracteristica/Caracteristica';
import { CaracteristicaService } from '../../../services/caracteristica.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import Swal from 'sweetalert2';
import { ObjetoPermisoExtendido } from '../../../interfaces/Objetos/Objetos';
import { SharedService } from '../../../shared.service';
import { ObjetosService } from '../../../services/objetos.service';

@Component({
  selector: 'app-caracteristica',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './caracteristica.component.html',
  styleUrls: ['./caracteristica.component.css']
})
export default class CaracteristicaComponent {

  private caracteristicaService = inject(CaracteristicaService);
  private route = inject(Router);
  public filteredCaracteristicas: Caracteristica[] = []; // Lista filtrada para mostrar
  public paginatedCaracteristicas: Caracteristica[] = []; // Caracteristicas para la página actual
  public Lista_Caracteristica: Caracteristica[] = [];
  public searchQuery: string = ''; // Valor del input de búsqueda

  // Paginación
  public currentPage: number = 1;
  public itemsPerPage: number = 5;
  public totalPages: number = 1;

  public displayedColumns: string[] = [
    'Id',
    'Tipo Característica',
    'Característica',
    'Valores Predeterminados'
  ];

  constructor(private sharedService: SharedService) {
    this.caracteristicaService.cget().subscribe({
      next: (data) => {
        if (data.Listado_Caracteristicas.length > 0) {
          this.Lista_Caracteristica = data.Listado_Caracteristicas;
          this.filteredCaracteristicas = data.Listado_Caracteristicas;
          this.updatePagination();
        }
      },
      error: (error) => {
        Swal.fire({
          icon: 'error',
          title: 'Error al cargar características',
          text: error.message || 'No se pudieron obtener las características.',
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
      this.normalize(o.OBJETO).includes('mantenimiento caracteristica') 
    );
    if (!permiso) {
      console.warn("No se encontró permiso para la pantalla 'caracteristica'");
      
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

  // Método para filtrar características
  filterCaracteristicas() {
    const query = this.searchQuery.toLowerCase();
    this.filteredCaracteristicas = this.Lista_Caracteristica.filter(caracteristica =>
      caracteristica.CARACTERISTICA?.toLowerCase().includes(query) ||
      caracteristica.ID_TIPO_CARACTERISTICA.toLowerCase().includes(query)
    );
    this.currentPage = 1;
    this.updatePagination();
  }

  // Actualizar paginación
  updatePagination() {
    this.totalPages = Math.ceil(this.filteredCaracteristicas.length / this.itemsPerPage);
    this.updatePaginatedCaracteristicas();
  }

  // Actualiza las características visibles según la página actual
  updatePaginatedCaracteristicas() {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    this.paginatedCaracteristicas = this.filteredCaracteristicas.slice(startIndex, endIndex);
  }

  // Métodos de navegación para paginación
  goToFirstPage() {
    this.currentPage = 1;
    this.updatePaginatedCaracteristicas();
  }

  goToPreviousPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.updatePaginatedCaracteristicas();
    }
  }

  goToNextPage() {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.updatePaginatedCaracteristicas();
    }
  }

  goToLastPage() {
    this.currentPage = this.totalPages;
    this.updatePaginatedCaracteristicas();
  }

  // Eliminar una característica por ID con SweetAlert2
  eliminarCaracteristica(ID_CARACTERISTICA: number) {
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
        this.caracteristicaService.eliminarc(ID_CARACTERISTICA).subscribe({
          next: (res) => {
            Swal.fire({
              icon: 'success',
              title: 'Eliminado',
              text: res.msg || 'La característica ha sido eliminada exitosamente.',
              confirmButtonColor: '#3085d6',
            });

            // Actualiza la lista después de eliminar
            this.Lista_Caracteristica = this.Lista_Caracteristica.filter(caracteristica => caracteristica.ID_CARACTERISTICA !== ID_CARACTERISTICA);
            this.filteredCaracteristicas = this.filteredCaracteristicas.filter(caracteristica => caracteristica.ID_CARACTERISTICA !== ID_CARACTERISTICA);
            this.updatePagination();
          },
          error: (err) => {
            Swal.fire({
              icon: 'error',
              title: 'Error al eliminar',
              text: err.error?.msg || 'Ocurrió un error al eliminar la característica.',
              confirmButtonColor: '#d33',
            });
          }
        });
      }
    });
  }

  editarCaracteristica(param: Caracteristica) {
    this.route.navigate(['/actualizar-caracteristicas'], { 
      queryParams: { 
        id: param.ID_CARACTERISTICA, 
        idTipo: param.ID_TIPO_CARACTERISTICA,
        caracteristica: param.CARACTERISTICA,
        valores: param.VALORES_PREDETERMINADOS
      } 
    });
  }

  registro() {
    this.route.navigate(['registrar-caracteristicas']);
  }
}
