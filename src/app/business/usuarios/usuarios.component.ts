import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { Usuarios } from '../../interfaces/Usuario/Usuarios';
import { UsuariosService } from '../../services/usuarios.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import Swal from 'sweetalert2';
import { SharedService } from '../../shared.service';


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
          icon: 'error',
          title: 'Error al cargar usuarios',
          text: error.message || 'No se pudieron obtener los usuarios.',
          confirmButtonColor: '#d33',
        });
      },
    });
    
  }
  rolActual = '';
 
  ngOnInit() {
    this.sharedService.rol$.subscribe((rol) => {
      this.rolActual = rol;
    });
  }

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

  updatePagination() {
    this.totalPages = Math.ceil(this.filteredUsers.length / this.itemsPerPage);
    this.updatePaginatedUsers();
  }

  updatePaginatedUsers() {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    this.paginatedUsers = this.filteredUsers.slice(startIndex, startIndex + this.itemsPerPage);
  }

  changePage(page: number) {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.updatePaginatedUsers();
    }
  }

  editarUsuario(usuario: Usuarios) {
    this.route.navigate(['/actualizar'], { queryParams: { email: usuario.CORREO_ELECTRONICO } });
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


}
