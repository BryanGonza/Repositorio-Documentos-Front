import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { ObjetosService } from '../../services/objetos.service'; 
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import Swal from 'sweetalert2';
import { Objetos } from '../../interfaces/Objetos/Objetos';

@Component({
  selector: 'app-objetos',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './objetos.component.html',
  styleUrls: ['./objetos.component.css']
})
export default class ObjetosComponent {

  private objetosService = inject(ObjetosService);
  private route = inject(Router);
  public filteredObjetos: Objetos[] = []; // Lista filtrada para mostrar
  public paginatedObjetos: Objetos[] = []; // Objetos para la página actual
  public Lista_Objetos: Objetos[] = [];
  public searchQuery: string = ''; // Valor del input de búsqueda

  // Paginación
  public currentPage: number = 1;
  public itemsPerPage: number = 5;
  public totalPages: number = 1; // Total de páginas

  public displayedColumns: string[] = [
    'ID_OBJETO',
    'OBJETO',
    'TIPO_OBJETO',
    'DESCRIPCION',
    'FECHA_CREACION',
    'CREADO_POR',
    'FECHA_MODIFICACION',
    'MODIFICADO_POR'
  ];

  constructor() {
    this.objetosService.objetosget().subscribe({
      next: (data) => {
        if (data.Lista_Objetos.length > 0) {
          this.Lista_Objetos = data.Lista_Objetos;
          this.filteredObjetos = data.Lista_Objetos;
          this.updatePagination();
        }
      },
      error: (error) => {
        Swal.fire({
          icon: 'error',
          title: 'Error al cargar objetos',
          text: error.message || 'No se pudieron obtener los objetos.',
          confirmButtonColor: '#d33',
        });
      },
    });
  }

  // Método para filtrar objetos
  filterObjetos() {
    const query = this.searchQuery.toLowerCase();
    this.filteredObjetos = this.Lista_Objetos.filter(objeto =>
      objeto.OBJETO.toLowerCase().includes(query) ||
      objeto.TIPO_OBJETO.toLowerCase().includes(query) ||
      objeto.DESCRIPCION.toLowerCase().includes(query)
    );
    this.currentPage = 1;
    this.updatePagination();
  }

  // Actualizar paginación
  updatePagination() {
    this.totalPages = Math.ceil(this.filteredObjetos.length / this.itemsPerPage);
    this.updatePaginatedObjetos();
  }

  // Actualiza los objetos visibles según la página actual
  updatePaginatedObjetos() {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    this.paginatedObjetos = this.filteredObjetos.slice(startIndex, endIndex);
  }

  // Métodos de navegación para paginación
  goToFirstPage() {
    this.currentPage = 1;
    this.updatePaginatedObjetos();
  }

  goToPreviousPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.updatePaginatedObjetos();
    }
  }

  goToNextPage() {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.updatePaginatedObjetos();
    }
  }

  goToLastPage() {
    this.currentPage = this.totalPages;
    this.updatePaginatedObjetos();
  }

  // Eliminar un objeto por ID con SweetAlert2
  eliminar(ID_OBJETO: number) {
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
        this.objetosService.eliminar(ID_OBJETO).subscribe({
          next: (res) => {
            Swal.fire({
              icon: 'success',
              title: 'Eliminado',
              text: res.msg || 'El objeto ha sido eliminado exitosamente.',
              confirmButtonColor: '#3085d6',
            });

            // Actualiza la lista después de eliminar
            this.Lista_Objetos = this.Lista_Objetos.filter(objeto => objeto.ID_OBJETO !== ID_OBJETO);
            this.filteredObjetos = this.filteredObjetos.filter(objeto => objeto.ID_OBJETO !== ID_OBJETO);
            this.updatePagination();
          },
          error: (err) => {
            Swal.fire({
              icon: 'error',
              title: 'Error al eliminar',
              text: err.error?.msg || 'Ocurrió un error al eliminar el objeto.',
              confirmButtonColor: '#d33',
            });
          }
        });
      }
    });
  }

  // Editar un objeto
  editarObjeto(param: Objetos) {
    console.log("Datos enviados a queryParams:", param);
    this.route.navigate(['/actualizar-objeto'], {
      queryParams: {
        id: param.ID_OBJETO,
        objeto: param.OBJETO,
        tipoObjeto: param.TIPO_OBJETO,
        descripcion: param.DESCRIPCION,
        fechaCreacion: param.FECHA_CREACION,
        creadoPor: param.CREADO_POR,
        fechaModificacion: param.FECHA_MODIFICACION,
        modificadoPor: param.MODIFICADO_POR
      }
    });
  }

  // Navegar a la página de registro de objetos
  registro() {
    this.route.navigate(['registrar-objeto']);
  }
}