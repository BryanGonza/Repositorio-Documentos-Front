import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { Usuarios } from '../../interfaces/Usuario/Usuarios';
import { UsuariosService } from '../../services/usuarios.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-usuarios',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './usuarios.component.html',
  styleUrl: './usuarios.component.css'
})
export default class UsuariosComponent {

  private usuarioService = inject(UsuariosService);
  private route = inject(Router);
  public filteredUsers: Usuarios[] = []; // Lista filtrada para mostrar
  public paginatedUsers: Usuarios[] = []; // Usuarios para la página actual
  public ListUs: Usuarios[] = [];
  public searchQuery: string = ''; // Valor del input de búsqueda

  // Paginación
  public currentPage: number = 1;
  public itemsPerPage: number = 5;
  public totalPages: number = 1;

  public displayedColumns: string[] = [
    'Id',
    'NumeroIdentidad',
    'Alias',
    'Nombre',
    'Contraseña',
    'CorreoElectronico',
  ];

  constructor() {
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
          icon: 'error',
          title: 'Error al cargar usuarios',
          text: error.message || 'No se pudieron obtener los usuarios.',
          confirmButtonColor: '#d33',
        });
      },
    });
  }

  // Método para filtrar usuarios
  filterUsers() {
    const query = this.searchQuery.toLowerCase();
    this.filteredUsers = this.ListUs.filter(user =>
      user.USUARIO.toLowerCase().includes(query) ||
      user.CORREO_ELECTRONICO.toLowerCase().includes(query) ||
      user.NOMBRE_USUARIO.toLowerCase().includes(query)
    );
    this.currentPage = 1;
    this.updatePagination();
  }

  // Actualizar paginación
  updatePagination() {
    this.totalPages = Math.ceil(this.filteredUsers.length / this.itemsPerPage);
    this.updatePaginatedUsers();
  }

  // Actualiza los usuarios visibles según la página actual
  updatePaginatedUsers() {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    this.paginatedUsers = this.filteredUsers.slice(startIndex, endIndex);
  }

  // Métodos de navegación para paginación
  goToFirstPage() {
    this.currentPage = 1;
    this.updatePaginatedUsers();
  }

  goToPreviousPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.updatePaginatedUsers();
    }
  }

  goToNextPage() {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.updatePaginatedUsers();
    }
  }

  goToLastPage() {
    this.currentPage = this.totalPages;
    this.updatePaginatedUsers();
  }

  // Eliminar un usuario por ID con SweetAlert2
  eliminarUsuario(ID_USUARIO: number) {
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
        this.usuarioService.eliminar(ID_USUARIO).subscribe({
          next: (res) => {
            Swal.fire({
              icon: 'success',
              title: 'Eliminado',
              text: res.msg || 'El usuario ha sido eliminado exitosamente.',
              confirmButtonColor: '#3085d6',
            });

            // Actualiza la lista después de eliminar
            this.ListUs = this.ListUs.filter(user => user.ID_USUARIO !== ID_USUARIO);
            this.filteredUsers = this.filteredUsers.filter(user => user.ID_USUARIO !== ID_USUARIO);
            this.updatePagination();
          },
          error: (err) => {
            Swal.fire({
              icon: 'error',
              title: 'Error al eliminar',
              text: err.error?.msg || 'Ocurrió un error al eliminar el usuario.',
              confirmButtonColor: '#d33',
            });
          }
        });
      }
    });
  }

  editarUsuario(usuario: Usuarios) {
    this.route.navigate(['/actualizar'], { queryParams: { email: usuario.CORREO_ELECTRONICO } });
  }

  registro() {
    this.route.navigate(['registrar']);
  }
}
