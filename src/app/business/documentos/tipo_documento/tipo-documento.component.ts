import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { TipoDocumentoService } from '../../../services/tipo-documento.service';
import { TipoDocumento } from '../../../interfaces/Documentos/tipo_documento/tipo_documento';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import Swal from 'sweetalert2';
import { ObjetoPermisoExtendido } from '../../../interfaces/Objetos/Objetos';
import { ObjetosService } from '../../../services/objetos.service';
import { SharedService } from '../../../shared.service';


@Component({
  selector: 'app-tipo-documento',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './tipo-documento.component.html',
  styleUrls: ['./tipo-documento.component.css']
})
export default class TipoDocumentoComponent {

  private tipoDocumentoService = inject(TipoDocumentoService);
  private route = inject(Router);
  public filteredTipoDocumentos: TipoDocumento[] = []; // Lista filtrada para mostrar
  public paginatedTipoDocumentos: TipoDocumento[] = []; // Tipos de documento para la página actual
  public Listado_Tipo_Documentos: TipoDocumento[] = [];
  public searchQuery: string = ''; // Valor del input de búsqueda

  // Paginación
  public currentPage: number = 1;
  public itemsPerPage: number = 5;
  public totalPages: number = 1;

  public displayedColumns: string[] = [
    'Id',
    'Tipo Documento',
    'Estado'
  ];

  constructor(private sharedService: SharedService) {
    this.tipoDocumentoService.tipo_dget().subscribe({
      next: (data) => {
        if (data.Listado_Tipo_Documentos.length > 0) {
          this.Listado_Tipo_Documentos = data.Listado_Tipo_Documentos;
          this.filteredTipoDocumentos = data.Listado_Tipo_Documentos;
          this.updatePagination();
        }
      },
      error: (error) => {
        Swal.fire({
          icon: 'error',
          title: 'Error al cargar tipos de documento',
          text: error.message || 'No se pudieron obtener los tipos de documento.',
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
      this.normalize(o.OBJETO).includes('tipo de documento')
    );
    if (!permiso) {
      console.warn("No se encontró permiso para la pantalla 'documentos'");
      
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
// Método para filtrar tipos de documento
filterTipoDocumentos() {
  const query = this.searchQuery.toLowerCase();
  this.filteredTipoDocumentos = this.Listado_Tipo_Documentos.filter(tipoDoc => {
    const tipoDocStr = tipoDoc.TIPO_DOCUMENTO ? tipoDoc.TIPO_DOCUMENTO.toLowerCase() : '';
    const estadoStr = tipoDoc.ESTADO ? 'activo' : 'inactivo';
    return tipoDocStr.includes(query) || estadoStr.includes(query);
  });
  this.currentPage = 1;
  this.updatePagination();
}

  // Actualizar paginación
  updatePagination() {
    this.totalPages = Math.ceil(this.filteredTipoDocumentos.length / this.itemsPerPage);
    this.updatePaginatedTipoDocumentos();
  }

  // Actualiza los tipos de documento visibles según la página actual
  updatePaginatedTipoDocumentos() {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    this.paginatedTipoDocumentos = this.filteredTipoDocumentos.slice(startIndex, endIndex);
  }

  // Métodos de navegación para paginación
  goToFirstPage() {
    this.currentPage = 1;
    this.updatePaginatedTipoDocumentos();
  }

  goToPreviousPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.updatePaginatedTipoDocumentos();
    }
  }

  goToNextPage() {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.updatePaginatedTipoDocumentos();
    }
  }

  goToLastPage() {
    this.currentPage = this.totalPages;
    this.updatePaginatedTipoDocumentos();
  }

  // Eliminar un tipo de documento por ID con SweetAlert2
  eliminarTipoDocumento(ID_TIPO_DOCUMENTO: number) {
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
        this.tipoDocumentoService.eliminartipo_d(ID_TIPO_DOCUMENTO).subscribe({
          next: (res) => {
            Swal.fire({
              icon: 'success',
              title: 'Eliminado',
              text: res.msg || 'El tipo de documento ha sido eliminado exitosamente.',
              confirmButtonColor: '#3085d6',
            });

            // Actualiza la lista después de eliminar
            this.Listado_Tipo_Documentos = this.Listado_Tipo_Documentos.filter(tipoDoc => tipoDoc.ID_TIPO_DOCUMENTO !== ID_TIPO_DOCUMENTO);
            this.filteredTipoDocumentos = this.filteredTipoDocumentos.filter(tipoDoc => tipoDoc.ID_TIPO_DOCUMENTO !== ID_TIPO_DOCUMENTO);
            this.updatePagination();
          },
          error: (err) => {
            Swal.fire({
              icon: 'error',
              title: 'Error al eliminar',
              text: err.error?.msg || 'Ocurrió un error al eliminar el tipo de documento.',
              confirmButtonColor: '#d33',
            });
          }
        });
      }
    });
  }

  editarTipoDocumento(param: TipoDocumento) {
    console.log("Datos enviados a queryParams:", param);
    this.route.navigate(['/actualizar-tipo-documento'], { 
      queryParams: { 
        id: param.ID_TIPO_DOCUMENTO, 
        tipoDocumento: param.TIPO_DOCUMENTO, 
        estado: param.ESTADO,
      } 
    });
  }

  registro() {
    this.route.navigate(['registrar-tipo-documento']);
  }
}
