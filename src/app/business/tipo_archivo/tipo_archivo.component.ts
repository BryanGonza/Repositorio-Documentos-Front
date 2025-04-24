import { Component, OnInit, inject } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { tipo_archivo } from '../../interfaces/Tipo_Archivo/Tipo_archivo';
import { Tipo_archivoService } from '../../services/tipo_archivo.service';
import { CommonModule } from '@angular/common';
import Swal from 'sweetalert2';
 
@Component({
  selector: 'app-tipo_archivo',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './tipo_archivo.component.html',
  styleUrls: ['./tipo_archivo.component.css']
})
export default class Tipo_archivoComponent implements OnInit {
 
  private tipo_archivoService = inject(Tipo_archivoService);
  private route = inject(Router);
 
  public filteredTipo_archivo: tipo_archivo[] = [];
  public paginatedTipo_archivo: tipo_archivo[] = [];
  public Lista_Tipo_archivo: tipo_archivo[] = [];
  public searchQuery: string = '';
 
  // Paginación
  public currentPage: number = 1;
  public itemsPerPage: number = 5;
  public totalPages: number = 1;
 
  public displayedColumns: string[] = ['Id', 'Tipo', 'Limite'];
 
  ngOnInit(): void {
    this.obtenerTipo_archivos();
  }
 
  obtenerTipo_archivos(): void {
    this.tipo_archivoService.Tipo_archivoget().subscribe({
      next: (data) => {
        const lista = data?.Listado_Tipo_Archivo ?? [];
 
        if (lista.length > 0) {
          this.Lista_Tipo_archivo = lista;
          this.filteredTipo_archivo = [...lista];
          this.updatePagination();
        } else {
          this.Lista_Tipo_archivo = [];
          this.filteredTipo_archivo = [];
          this.paginatedTipo_archivo = [];
          this.totalPages = 1;
        }
      },
      error: (error) => {
        Swal.fire({
          icon: 'error',
          title: 'Error al cargar tipo de archivo',
          text: error.message || 'No se pudieron obtener tipo de archivo.',
          confirmButtonColor: '#d33',
        });
      },
    });
  }
 
  filterTipo_archivo(): void {
    const query = this.searchQuery.toLowerCase();
    this.filteredTipo_archivo = this.Lista_Tipo_archivo.filter(tipo_archivo =>
      tipo_archivo.ID_TIPO_ARCHIVO.toString().toLowerCase().includes(query) ||
      tipo_archivo.TIPO_ARCHIVO.toLowerCase().includes(query) ||
      tipo_archivo.LIMITE_ALMACENAMIENTO.toString().toLowerCase().includes(query)
    );
    this.currentPage = 1;
    this.updatePagination();
  }
 
  updatePagination(): void {
    this.totalPages = Math.max(1, Math.ceil(this.filteredTipo_archivo.length / this.itemsPerPage));
    this.updatePaginatedTipo_archivo();
  }
 
  updatePaginatedTipo_archivo(): void {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    this.paginatedTipo_archivo = this.filteredTipo_archivo.slice(startIndex, endIndex);
  }
 
  goToFirstPage(): void {
    this.currentPage = 1;
    this.updatePaginatedTipo_archivo();
  }
 
  goToPreviousPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.updatePaginatedTipo_archivo();
    }
  }
 
  goToNextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.updatePaginatedTipo_archivo();
    }
  }
 
  goToLastPage(): void {
    this.currentPage = this.totalPages;
    this.updatePaginatedTipo_archivo();
  }
 
  eliminarTipo_archivo(ID_TIPO_ARCHIVO: number): void {
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
        this.tipo_archivoService.eliminartipo_archivo(ID_TIPO_ARCHIVO).subscribe({
          next: (res) => {
            Swal.fire({
              icon: 'success',
              title: 'Eliminado',
              text: res.msg || 'Tipo de Archivo ha sido eliminado exitosamente.',
              confirmButtonColor: '#3085d6',
            });
 
            this.Lista_Tipo_archivo = this.Lista_Tipo_archivo.filter(tipo_archivo => tipo_archivo.ID_TIPO_ARCHIVO !== ID_TIPO_ARCHIVO);
            this.filteredTipo_archivo = this.filteredTipo_archivo.filter(tipo_archivo => tipo_archivo.ID_TIPO_ARCHIVO !== ID_TIPO_ARCHIVO);
            this.updatePagination();
          },
          error: (err) => {
            Swal.fire({
              icon: 'error',
              title: 'Error al eliminar',
              text: err.error?.msg || 'Ocurrió un error al eliminar tipo de archivo.',
              confirmButtonColor: '#d33',
            });
          }
        });
      }
    });
  }
 
  editarTipo_archivo(param: tipo_archivo): void {
    this.route.navigate(['/actualizar-tipo_archivo'], {
      queryParams: {
        id: param.ID_TIPO_ARCHIVO,
        tipo: param.TIPO_ARCHIVO,
        limite: param.LIMITE_ALMACENAMIENTO,
      }
    });
  }
 
  registro(): void {
    this.route.navigate(['registrar-tipo_archivo']);
  }
}