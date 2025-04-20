import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { Usuarios } from '../../interfaces/Usuario/Usuarios';
import { UsuariosService } from '../../services/usuarios.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import Swal from 'sweetalert2';
import { DocumentosService } from '../../services/documentos.service';
import { documento } from '../../interfaces/Documentos/Documetos';
import { FormatDatePipe } from '../../format-date.pipe';
import { SharedService } from '../../shared.service';
import { ObjetosService } from '../../services/objetos.service';
import { ObjetoPermiso, ObjetoPermisoExtendido } from '../../interfaces/Objetos/Objetos';

@Component({
  selector: 'app-documentos',
  standalone: true,
  imports: [CommonModule, FormsModule, FormatDatePipe],
  templateUrl: './documentos.component.html',
  styleUrl: './documentos.component.css',
})
export default class DocumentosComponent {
  private docService = inject(DocumentosService);
  private route = inject(Router);

  // Paginación
  public filteredUsers: documento[] = [];
  public paginatedUsers: documento[] = [];
  public ListUs: documento[] = [];
  public searchQuery: string = '';
  public currentPage: number = 1;
  public itemsPerPage: number = 5;
  public totalPages: number = 1;

 

  constructor(private sharedService: SharedService) {


  }

  //roles y permisos
  rolActual = '';
  ngOnInit() {
    this.cargarDocumentos();
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
      this.normalize(o.OBJETO).includes('documento')
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

  //documentos
  cargarDocumentos() {
    this.docService.DocumetosGet().subscribe({
      next: (data) => {
        if (data && data.ListDocume && Array.isArray(data.ListDocume)) {
          this.ListUs = data.ListDocume;
          this.filteredUsers = data.ListDocume;
          this.updatePagination();

          // Obtener documentos por correo para cada usuario
          this.ListUs.forEach((documento) => {
            this.docService
              .getDocumentosPorCorreo(documento.ID_USUARIO)
              .subscribe({
                next: (correo) => {
                  documento.CORREO = correo.correo;
                },
                error: (error) => {
                  console.error('Error al obtener correo:', error);
                },
              });
          });
        } else {
          console.warn('ListDocume está vacío o no es un array:', data);
          this.ListUs = [];
          this.filteredUsers = [];
        }
      },
      error: (error) => {
        Swal.fire({
          icon: 'error',
          title: 'Error al cargar documentos',
          text: error.message || 'No se pudieron obtener los documentos.',
          confirmButtonColor: '#d33',
        });
      },
    });
  }
  obtenerDocumentosPorCorreo(idCorreo: number) {
    this.docService.getDocumentosPorCorreo(idCorreo).subscribe({
      next: (correo) => {
        console.log('Documentos por correo:', correo);
        return correo;
      },
      error: (error) => {
        console.error('Error al obtener documentos por correo:', error);
      },
    });
  }
  filterUsers() {
    const query = this.searchQuery.toLowerCase();
    this.filteredUsers = this.ListUs.filter((user) =>
      user.NOMBRE.toLowerCase().includes(query)
    );
    this.currentPage = 1;
    this.updatePagination();
  }

  updatePagination() {
    this.totalPages = Math.ceil(this.filteredUsers.length / this.itemsPerPage);
    this.updatePaginatedUsers();
  }

  updatePaginatedUsers() {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    this.paginatedUsers = this.filteredUsers.slice(
      startIndex,
      startIndex + this.itemsPerPage
    );
  }

  changePage(page: number) {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.updatePaginatedUsers();
    }
  }

  // URL de descarga directa (formato PDF)

  eliminarDocumento(idDocumento: number) {
    Swal.fire({
      title: '¿Estás seguro?',
      text: '¡No podrás revertir esto!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar',
    }).then((result) => {
      if (result.isConfirmed) {
        this.docService.eliminarDcoumento(idDocumento).subscribe({
          next: (res) => {
            Swal.fire({
              icon: 'success',
              title: 'Eliminado',
              text: res.msg || 'El usuario ha sido eliminado exitosamente.',
              confirmButtonColor: '#3085d6',
            });

            this.ListUs = this.ListUs.filter(
              (user) => user.ID_DOCUMENTO !== idDocumento
            );
            this.filteredUsers = this.filteredUsers.filter(
              (user) => user.ID_DOCUMENTO !== idDocumento
            );
            this.updatePagination();
          },
          error: (err) => {
            Swal.fire({
              icon: 'error',
              title: 'Error al eliminar',
              text:
                err.error?.msg || 'Ocurrió un error al eliminar el documento.',
              confirmButtonColor: '#d33',
            });
          },
        });
      }
    });
  }
  descargarArchivo(url: string, nombre: string): void {
    // Crear un enlace temporal
    const link = document.createElement('a');
    link.href = url; // Usar la URL de descarga
    link.download = nombre; // Nombre del archivo descargado
    link.style.display = 'none'; // Ocultar el enlace

    // Agregar el enlace al DOM
    document.body.appendChild(link);

    // Simular clic en el enlace
    link.click();

    // Eliminar el enlace temporal
    document.body.removeChild(link);

    // Manejar errores
    link.onerror = () => {
      console.error('Error al descargar el archivo.');
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'No se pudo descargar el archivo.',
        confirmButtonText: 'Aceptar',
      });
    };
  }
  verArchivo(url: string): void {
    if (!url) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'No se encontró un enlace de descarga para este documento.',
        confirmButtonColor: '#d33',
      });
      return;
    }

    const link = document.createElement('a');
    link.href = url;
    link.target = '_blank';
    link.download = 'documento.pdf';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
}
