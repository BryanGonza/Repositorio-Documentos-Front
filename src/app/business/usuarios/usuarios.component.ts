import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { Usuarios } from '../../interfaces/Usuario/Usuarios';
import { UsuariosService } from '../../services/usuarios.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import Swal from 'sweetalert2';
import { SharedService } from '../../shared.service';
import { ObjetoPermisoExtendido } from '../../interfaces/Objetos/Objetos'; // Asegúrate de que esta interface esté definida granularmente
import { ObjetosService } from '../../services/objetos.service';

@Component({
  selector: 'app-usuarios',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './usuarios.component.html',
  styleUrls: ['./usuarios.component.css'],
})
export default class UsuariosComponent {
  private usuarioService = inject(UsuariosService);
  private route = inject(Router);
  public filteredUsers: Usuarios[] = [];
  public paginatedUsers: Usuarios[] = [];
  public ListUs: Usuarios[] = [];
  public searchQuery: string = '';

  // Paginación
  public currentPage: number = 1;
  public itemsPerPage: number = 5;
  public totalPages: number = 1;

  constructor(private sharedService: SharedService) {
    this.usuarioService.usuariosget().subscribe({
      next: (data) => {
        if (data.ListUsuarios.length > 0) {
          this.ListUs = data.ListUsuarios;
          this.filteredUsers = data.ListUsuarios;
          this.updatePagination();
        }
      },
      error: (error) => {
        Swal.fire({
          icon: 'warning',
          title: 'Acceso denegado',
          html: `
    <p>No tienes permisos para realizar esta acción.</p>
    <p>Por favor, <strong>contacta al administrador</strong> para solicitar el acceso necesario.</p>
  `,
          footer:
            '<a href="mailto:repositoriodedocuemntos@gmail.com">Enviar correo al soporte</a>',
          confirmButtonText: 'Entendido',
          confirmButtonColor: '#3085d6',
          showCancelButton: true,
          cancelButtonText: 'Cancelar',
          cancelButtonColor: '#aaa',
          background: '#f9f9f9',
          allowOutsideClick: false,
          focusConfirm: false,
        });
      },
    });
  }
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
    // Busca el objeto de permiso cuya propiedad OBJETO contenga la palabra "usuario"
    const permiso = this.objetos.find((o) =>
      this.normalize(o.OBJETO).includes('usuario')
    );
    if (!permiso) {
      console.warn("No se encontró permiso para la pantalla 'usuarios'");
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

  // Métodos de filtrado y paginación
  filterUsers() {
    const query = this.searchQuery.toLowerCase();
    this.filteredUsers = this.ListUs.filter(
      (user) =>
        user.NUM_IDENTIDAD.toString().includes(query) ||
        user.USUARIO.toLowerCase().includes(query) ||
        user.CORREO_ELECTRONICO.toLowerCase().includes(query) ||
        user.NOMBRE_USUARIO.toLowerCase().includes(query)
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

  editarUsuario(usuario: Usuarios) {
    this.route.navigate(['/actualizar'], {
      queryParams: { email: usuario.CORREO_ELECTRONICO },
    });
  }

  registro() {
    this.route.navigate(['registrar']);
  }

  eliminarUsuario(ID_USUARIO: number) {
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
        Swal.fire({
          title: '¿Estás completamente seguro?',
          text: '¡Se eliminarán también los documentos subidos por este usuario!',
          icon: 'warning',
          showCancelButton: true,
          confirmButtonColor: '#3085d6',
          cancelButtonColor: '#d33',
          confirmButtonText: 'Sí, eliminar todo',
          cancelButtonText: 'Cancelar',
        }).then((result) => {
          if (result.isConfirmed) {
            this.usuarioService.eliminar(ID_USUARIO).subscribe({
              next: (res) => {
                Swal.fire({
                  icon: 'success',
                  title: 'Eliminado',
                  text:
                    res.msg ||
                    'El usuario y sus documentos han sido eliminados exitosamente.',
                  confirmButtonColor: '#3085d6',
                });
                this.ListUs = this.ListUs.filter(
                  (user) => user.ID_USUARIO !== ID_USUARIO
                );
                this.filteredUsers = this.filteredUsers.filter(
                  (user) => user.ID_USUARIO !== ID_USUARIO
                );
                this.updatePagination();
              },
              error: (err) => {
                Swal.fire({
                  icon: 'error',
                  title: 'Error al eliminar',
                  text:
                    err.error?.msg ||
                    'Ocurrió un error al eliminar el usuario y/o sus documentos.',
                  confirmButtonColor: '#d33',
                });
              },
            });
          }
        });
      }
    });
  }
}
