import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { Estado } from '../../interfaces/Estado/Estado';
import { EstadoService } from '../../services/estado.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import Swal from 'sweetalert2';
import { SharedService } from '../../shared.service';
import { ObjetoPermisoExtendido } from '../../interfaces/Objetos/Objetos';
import { ObjetosService } from '../../services/objetos.service';

@Component({
  selector: 'app-estado',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './estado.component.html',
  styleUrls: ['./estado.component.css']
})
export default class EstadoComponent {

  private estadoService = inject(EstadoService);
  private route = inject(Router);
  public filteredEstados: Estado[] = []; // Lista filtrada para mostrar
  public paginatedEstados: Estado[] = []; // Estados para la página actual
  public Lista_Estado: Estado[] = [];
  public searchQuery: string = ''; // Valor del input de búsqueda

  // Paginación
  public currentPage: number = 1;
  public itemsPerPage: number = 5;
  public totalPages: number = 1;

  public displayedColumns: string[] = [
    'Id',
    'Estado'
  ];

  constructor(private sharedService: SharedService) {
    this.estadoService.estadoget().subscribe({
      next: (data) => {
        if (data.Listado_Estado?.length > 0) {
          this.Lista_Estado = data.Listado_Estado;
          this.filteredEstados = data.Listado_Estado;
          this.updatePagination();
        }
      },
      error: (error) => {
        Swal.fire({
          icon: 'error',
          title: 'Error al cargar estados',
          text: error.message || 'No se pudieron obtener los estados.',
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
        this.normalize(o.OBJETO).includes('estado')
      );
      if (!permiso) {
        console.warn("No se encontró permiso para la pantalla 'estado'");
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
  // Método para filtrar estados
  filterEstados() {
    const query = this.searchQuery.toLowerCase();
    this.filteredEstados = this.Lista_Estado.filter(estado =>
      estado.ESTADO.toLowerCase().includes(query)
    );
    this.currentPage = 1;
    this.updatePagination();
  }

  // Actualizar paginación
  updatePagination() {
    this.totalPages = Math.ceil(this.filteredEstados.length / this.itemsPerPage);
    this.updatePaginatedEstados();
  }

  // Actualiza los estados visibles según la página actual
  updatePaginatedEstados() {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    this.paginatedEstados = this.filteredEstados.slice(startIndex, endIndex);
  }

  // Métodos de navegación para paginación
  goToFirstPage() {
    this.currentPage = 1;
    this.updatePaginatedEstados();
  }

  goToPreviousPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.updatePaginatedEstados();
    }
  }

  goToNextPage() {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.updatePaginatedEstados();
    }
  }

  goToLastPage() {
    this.currentPage = this.totalPages;
    this.updatePaginatedEstados();
  }

  // Eliminar un estado por ID con SweetAlert2
  eliminarEstado(ID_ESTADO: number) {
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
        this.estadoService.eliminarEstado(ID_ESTADO).subscribe({
          next: (res) => {
            Swal.fire({
              icon: 'success',
              title: 'Eliminado',
              text: res.msg || 'El estado ha sido eliminado exitosamente.',
              confirmButtonColor: '#3085d6',
            });

            // Actualiza la lista después de eliminar
            this.Lista_Estado = this.Lista_Estado.filter(estado => estado.ID_ESTADO !== ID_ESTADO);
            this.filteredEstados = this.filteredEstados.filter(estado => estado.ID_ESTADO !== ID_ESTADO);
            this.updatePagination();
          },
          error: (err) => {
            Swal.fire({
              icon: 'error',
              title: 'Error al eliminar',
              text: err.error?.msg || 'Ocurrió un error al eliminar el estado.',
              confirmButtonColor: '#d33',
            });
          }
        });
      }
    });
  }

  editarEstado(param: Estado) {
    this.route.navigate(['/actualizar-estado'], { 
      queryParams: { 
        id: param.ID_ESTADO, 
        estado: param.ESTADO
      } 
    });
  }

  registro() {
    this.route.navigate(['registrar-estado']);
  }
}