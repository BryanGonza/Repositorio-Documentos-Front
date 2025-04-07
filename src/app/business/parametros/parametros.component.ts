import { Component, inject } from '@angular/core';
import { ParametrosService } from '../../services/parametros.service';
import { Router } from '@angular/router';
import { parametros } from '../../interfaces/Parametros/resposeParametros';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-parametros',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './parametros.component.html',
  styleUrl: './parametros.component.css',
})
export default class ParametrosComponent {
  private parametroService = inject(ParametrosService);
  private route = inject(Router);
  public filteredUsers: parametros[] = [];
  public paginatedUsers: parametros[] = [];
  public ListUs: parametros[] = [];
  public searchQuery: string = '';

  // Paginación
  public currentPage: number = 1;
  public itemsPerPage: number = 5;
  public totalPages: number = 1;
  constructor() {
    this.parametroService.parametroGet().subscribe({
      next: (data) => {
        if (data.ListParametros.length > 0) {
          this.ListUs = data.ListParametros;
          this.filteredUsers = data.ListParametros;
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
  filterUsers() {
    const query = this.searchQuery.toLowerCase();
    this.filteredUsers = this.ListUs.filter(
      (user) =>
        user.PARAMETRO.toLowerCase().includes(query) ||
        user.VALOR.toLowerCase().includes(query)
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
  editarParametros(parame: parametros) {
    console.log('Datos enviados a queryParams:', parame);
    this.route.navigate(['/actualizarParametros'], {
      queryParams: {
        id: parame.ID_PARAMETRO,
        parametro: parame.PARAMETRO,
        valor: parame.VALOR,
        numerosIntentos: parame.ADMIN_INTENTOS_INVALIDOS,
      },
    });
  }
  registar() {
    this.route.navigate(['/registrarParametros']);
  }
  eliminarParametro(ID_PARAMETRO: number) {
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
        this.parametroService.eliminarParametro(ID_PARAMETRO).subscribe({
          next: (res) => {
            Swal.fire({
              icon: 'success',
              title: 'Eliminado',
              text: res.msg || 'El parámetro ha sido eliminado exitosamente.',
              confirmButtonColor: '#3085d6',
            });
  
            // Actualiza la lista después de eliminar
            this.ListUs = this.ListUs.filter(parametro => parametro.ID_PARAMETRO !== ID_PARAMETRO);
            this.filteredUsers = this.filteredUsers.filter(parametro => parametro.ID_PARAMETRO !== ID_PARAMETRO);
            this.updatePagination();
          },
          error: (err) => {
            Swal.fire({
              icon: 'error',
              title: 'Error al eliminar',
              text: err.error?.msg || 'Ocurrió un error al eliminar el parámetro.',
              confirmButtonColor: '#d33',
            });
          }
        });
      }
    });
  }
  
  
}
