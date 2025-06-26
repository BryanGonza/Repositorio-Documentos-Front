import { Component, inject } from '@angular/core';
import { DocumentosService } from '../../services/documentos.service';
import { Router } from '@angular/router';
import { documento } from '../../interfaces/Documentos/Documetos';
import Swal from 'sweetalert2';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { SharedService } from '../../shared.service';
import { UsuariosService } from '../../services/usuarios.service';
import { Usuarios } from '../../interfaces/Usuario/Usuarios';
import { FormatDatePipe } from '../../format-date.pipe';
import { ObjetoPermiso } from '../../interfaces/Objetos/Objetos';
import { PermisosService } from '../../services/permisos.service';
import { ObjetosService } from '../../services/objetos.service';
import { Documento } from '../../interfaces/Documentos/detalles';

@Component({
  selector: 'app-dhashboard',
  standalone: true,
  imports: [CommonModule, FormsModule, FormatDatePipe],
  templateUrl: './dhashboard.component.html',
  styleUrl: './dhashboard.component.css',
})
export default class DhashboardComponent {
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
  public usuario: Usuarios | null = null;
  private sharedService = inject(SharedService);
  private objetoser = inject(ObjetosService);

  private usuarioService = inject(UsuariosService);

  //permisos 

objetos: ObjetoPermiso[] = [];
token: string = typeof window !== 'undefined' ? localStorage.getItem('token') || '' : '';
constructor() {}
  ngOnInit() {

    if (typeof window !== 'undefined') {
      const shouldReload = localStorage.getItem('reloadAfterLogin');
      if (shouldReload === 'true') {
        localStorage.setItem('reloadAfterLogin', 'false');
        window.location.reload();
      }
    } else {
   
      const correo = this.sharedService.getCorreo();
      if (correo) {
        this.usuarioService.perfil({ email: correo }).subscribe({
          next: (data) => {
            this.usuario = data;
            if (this.usuario?.ID_USUARIO) {
              this.cargarDocumentos(this.usuario.ID_USUARIO);
            }
          },
          error: (err) => {
            console.error('Error al cargar el perfil:', err);
          },
        });
      }
    }
    this.cargarDatos();
    this.getObjetosConPermisos(); 
  }
  
  getObjetosConPermisos(): void {
    this.objetoser.getObjetosPermiss(this.token).subscribe({
      next: (data) => {
        this.objetos = data;
    
        console.log('Objetos con permisos:', this.objetos);
      },
      error: (err) => {
        console.error('Error al obtener objetos:', err);
      }
    });
    
  }
  getPermiso(accion: string): boolean {
    // Busca en el array el objeto cuyo TIPO_OBJETO (normalizado) coincida con la acción
    const permiso = this.objetos.find(o => 
      (o.TIPO_OBJETO || '').trim().toLowerCase() === accion.toLowerCase()
    );
    return permiso ? permiso.allowed : false;
  }
  private cargarDatos(): void {
    const correo = this.sharedService.getCorreo();
    if (correo) {
      this.usuarioService.perfil({ email: correo }).subscribe({
        next: (data) => {
          this.usuario = data;
          if (this.usuario?.ID_USUARIO) {
            this.cargarDocumentos(this.usuario.ID_USUARIO);
          }
        },
        error: (err) => {
          console.error('Error al cargar el perfil:', err);
        },
      });
    }
  }
  cargarDocumentos(idUsuario: number) {
    this.docService.getDocumentosUser(idUsuario).subscribe({
      next: (data) => {
        if (data && data.ListDocume && Array.isArray(data.ListDocume)) {
          this.ListUs = data.ListDocume;
          this.filteredUsers = data.ListDocume;
          this.updatePagination();
        } else {
          console.warn('ListDocume está vacío o no es un array:', data);
          this.ListUs = [];
          this.filteredUsers = [];
        }
      },
    });
  }
  filterUsers() {
    const query = this.searchQuery.toLowerCase();
    this.filteredUsers = this.ListUs.filter((user) =>
      user.NOMBRE.toLowerCase().includes(query) ||
      user.DESCRIPCION.toLowerCase().includes(query) ||
      user.FECHA_SUBIDA.toLowerCase().includes(query) 
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

  
 descargarArchivo(url: string, nombre:string): void {
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
  mostrarModalDetalles: boolean = false;

  documento!: Documento;
  detelles(idDocumento: number) {
    this.docService.getDocumentoDetalle(idDocumento).subscribe({
      next: (data) => {
        this.documento = data.doc;
        this.mostrarModalDetalles = true; 
      },
      error: (err) => {
        console.error('Error al cargar el documento:', err);
      }
    });
  }
  // Propiedad para controlar la visibilidad del área de carga
  showUploadArea: boolean = false;

  // Método para alternar la visibilidad
  toggleUploadArea() {
    this.showUploadArea = !this.showUploadArea;
  }
  // Variable para almacenar el archivo seleccionado
  archivoSeleccionado: File | null = null;

  // ID de usuario (puedes obtenerlo de tu lógica de autenticación)
  idUsuario: string = '18'; // Cambia esto por el ID real del usuario

  // Método para manejar la selección de archivos
  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.archivoSeleccionado = input.files[0];
    }
  }



  subir() {
    this.route.navigate(['subir_documentos']);
  }
}
