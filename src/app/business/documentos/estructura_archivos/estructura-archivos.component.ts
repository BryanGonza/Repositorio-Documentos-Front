import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { EstructuraArchivos } from '../../../interfaces/Documentos/Estructura_archivos/Estructura_archivos';
import { EstructuraArchivosService } from '../../../services/estructura-archivos.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import Swal from 'sweetalert2';
import { SharedService } from '../../../shared.service';
import { ObjetoPermisoExtendido } from '../../../interfaces/Objetos/Objetos';
import { ObjetosService } from '../../../services/objetos.service';

@Component({
  selector: 'app-estructura-archivos',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './estructura-archivos.component.html',
  styleUrls: ['./estructura-archivos.component.css']
})
export default class EstructuraArchivosComponent {

  private estructuraArchivosService = inject(EstructuraArchivosService);
  private route = inject(Router);
  public filteredEstructuras: EstructuraArchivos[] = []; // Lista filtrada para mostrar
  public paginatedEstructuras: EstructuraArchivos[] = []; // Estructuras para la página actual
  public Lista_Estructuras: EstructuraArchivos[] = [];
  public searchQuery: string = ''; // Valor del input de búsqueda

  // Paginación
  public currentPage: number = 1;
  public itemsPerPage: number = 5;
  public totalPages: number = 1;

  public displayedColumns: string[] = [
    'ID',
    'Departamento',
    'Espacio',
    'Nombre',
    'Ubicacion'
  ];

  constructor( private sharedService: SharedService) {
    this.estructuraArchivosService.estructuraget().subscribe({
      next: (data) => {
        if (data.Listado_Estrucura_Archivos?.length > 0) {
          this.Lista_Estructuras = data.Listado_Estrucura_Archivos;
          this.filteredEstructuras = data.Listado_Estrucura_Archivos;
          this.updatePagination();
        }
      },
      error: (error) => {
        Swal.fire({
          icon: 'error',
          title: 'Error al cargar estructuras',
          text: error.message || 'No se pudieron obtener las estructuras de archivos.',
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
      // Verifica si el permiso para la pantalla 'rol' existe
      const permiso = this.objetos.find((o) =>
        this.normalize(o.OBJETO).includes('estructura de archivos')
      );
      if (!permiso) {
        console.warn("No se encontró permiso para la pantalla 'estructura de archivos'");
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
  // Método para filtrar estructuras
  filterEstructuras() {
    const query = this.searchQuery.toLowerCase();
    this.filteredEstructuras = this.Lista_Estructuras.filter(estructura =>
      estructura.NOMBRE?.toLowerCase().includes(query) ||
      estructura.UBICACION?.toLowerCase().includes(query) ||
      estructura.ID_DEPARTAMENTO?.toString().includes(query)
    );
    this.currentPage = 1;
    this.updatePagination();
  }

  // Actualizar paginación
  updatePagination() {
    this.totalPages = Math.ceil(this.filteredEstructuras.length / this.itemsPerPage);
    this.updatePaginatedEstructuras();
  }

  // Actualiza las estructuras visibles según la página actual
  updatePaginatedEstructuras() {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    this.paginatedEstructuras = this.filteredEstructuras.slice(startIndex, endIndex);
  }

  // Métodos de navegación para paginación
  goToFirstPage() {
    this.currentPage = 1;
    this.updatePaginatedEstructuras();
  }

  goToPreviousPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.updatePaginatedEstructuras();
    }
  }

  goToNextPage() {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.updatePaginatedEstructuras();
    }
  }

  goToLastPage() {
    this.currentPage = this.totalPages;
    this.updatePaginatedEstructuras();
  }

  // Eliminar una estructura por ID con SweetAlert2
  eliminarEstructura(ID_ESTRUCTURA_ARCHIVOS: number) {
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
        this.estructuraArchivosService.eliminarEstructura(ID_ESTRUCTURA_ARCHIVOS).subscribe({
          next: (res) => {
            Swal.fire({
              icon: 'success',
              title: 'Eliminado',
              text: res.msg || 'La estructura ha sido eliminada exitosamente.',
              confirmButtonColor: '#3085d6',
            });

            // Actualiza la lista después de eliminar
            this.Lista_Estructuras = this.Lista_Estructuras.filter(estructura => estructura.ID_ESTRUCTURA_ARCHIVOS !== ID_ESTRUCTURA_ARCHIVOS);
            this.filteredEstructuras = this.filteredEstructuras.filter(estructura => estructura.ID_ESTRUCTURA_ARCHIVOS !== ID_ESTRUCTURA_ARCHIVOS);
            this.updatePagination();
          },
          error: (err) => {
            Swal.fire({
              icon: 'error',
              title: 'Error al eliminar',
              text: err.error?.msg || 'Ocurrió un error al eliminar la estructura.',
              confirmButtonColor: '#d33',
            });
          }
        });
      }
    });
  }

  editarEstructura(param: EstructuraArchivos) {
    console.log("Datos enviados a queryParams:", param);
    this.route.navigate(['/actualizar-estructura-archivos'], { 
      queryParams: { 
        id: param.ID_ESTRUCTURA_ARCHIVOS, 
        id_departamento: param.ID_DEPARTAMENTO, 
        espacio: param.ESPACIO_ALMACENAMIENTO,
        nombre: param.NOMBRE,
        ubicacion: param.UBICACION
      } 
    });
  }

  registro() {
    this.route.navigate(['registrar-estructura-archivos']);
  }
}