import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { Version } from '../../../interfaces/Documentos/Version/Version';
import { VersionService } from '../../../services/version.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import Swal from 'sweetalert2';
import { jwtDecode } from 'jwt-decode';
import { SharedService } from '../../../shared.service';
import { ObjetoPermisoExtendido } from '../../../interfaces/Objetos/Objetos';
import { ObjetosService } from '../../../services/objetos.service';

@Component({
  selector: 'app-version',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './version.component.html',
  styleUrls: ['./version.component.css']
})
export default class VersionComponent {

  private versionService = inject(VersionService);
  private route = inject(Router);
  public filteredVersiones: Version[] = []; // Lista filtrada para mostrar
  public paginatedVersiones: Version[] = []; // Versiones para la página actual
  public Lista_Version: Version[] = [];
  public searchQuery: string = ''; // Valor del input de búsqueda

  // Paginación
  public currentPage: number = 1;
  public itemsPerPage: number = 5;
  public totalPages: number = 1;

  public displayedColumns: string[] = [
    'Id',
    'Usuario',
    'Nombre',
    'Cambios',
    'Fecha Actualización'
  ];

  constructor(private sharedService: SharedService) {
    this.versionService.versionget().subscribe({
      next: (data) => {
        if (data.Listado_Version?.length > 0) {
          this.Lista_Version = data.Listado_Version;
          this.filteredVersiones = data.Listado_Version;
          this.updatePagination();
        }
      },
      error: (error) => {
        Swal.fire({
          icon: 'error',
          title: 'Error al cargar versiones',
          text: error.message || 'No se pudieron obtener las versiones.',
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
      this.normalize(o.OBJETO).includes('version')
    );
    if (!permiso) {
      console.warn("No se encontró permiso para la pantalla 'version'");
      
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

  // Método para filtrar versiones
  filterVersiones() {
    const query = this.searchQuery.toLowerCase();
    this.filteredVersiones = this.Lista_Version.filter(version =>
      version.NOMBRE?.toString().toLowerCase().includes(query) ||
      version.ID_USUARIO?.toString().includes(query) ||
      version.CAMBIOS?.toString().toLowerCase().includes(query)
    );
    this.currentPage = 1;
    this.updatePagination();
  }

  // Actualizar paginación
  updatePagination() {
    this.totalPages = Math.ceil(this.filteredVersiones.length / this.itemsPerPage);
    this.updatePaginatedVersiones();
  }

  // Actualiza las versiones visibles según la página actual
  updatePaginatedVersiones() {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    this.paginatedVersiones = this.filteredVersiones.slice(startIndex, endIndex);
  }

  // Métodos de navegación para paginación
  goToFirstPage() {
    this.currentPage = 1;
    this.updatePaginatedVersiones();
  }

  goToPreviousPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.updatePaginatedVersiones();
    }
  }

  goToNextPage() {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.updatePaginatedVersiones();
    }
  }

  goToLastPage() {
    this.currentPage = this.totalPages;
    this.updatePaginatedVersiones();
  }

  // Eliminar una versión por ID con SweetAlert2
  eliminarVersion(ID_VERSION: number) {
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
        this.versionService.eliminarversion(ID_VERSION).subscribe({
          next: (res) => {
            Swal.fire({
              icon: 'success',
              title: 'Eliminado',
              text: res.msg || 'La versión ha sido eliminada exitosamente.',
              confirmButtonColor: '#3085d6',
            });

            // Actualiza la lista después de eliminar
            this.Lista_Version = this.Lista_Version.filter(version => version.ID_VERSION !== ID_VERSION);
            this.filteredVersiones = this.filteredVersiones.filter(version => version.ID_VERSION !== ID_VERSION);
            this.updatePagination();
          },
          error: (err) => {
            Swal.fire({
              icon: 'error',
              title: 'Error al eliminar',
              text: err.error?.msg || 'Ocurrió un error al eliminar la versión.',
              confirmButtonColor: '#d33',
            });
          }
        });
      }
    });
  }

  editarVersion(param: Version) {
    this.route.navigate(['actualizar-version'], { 
      queryParams: { 
        id: param.ID_VERSION,
        id_usuario: param.ID_USUARIO,
        nombre: param.NOMBRE,
        cambios: param.CAMBIOS,
        fecha_actu: param.FECHA_ACTU
      } 
    });
  }

  registro() {
    this.route.navigate(['registrar-version']);
  }
}