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
import { TipoDocCaracteService } from '../../../services/tipo-doc-caracte.service';
import { DocumentoCaracteristica } from '../../../interfaces/Documentos/TipoDocuemtoCaracte/TipoDcoCara';

@Component({
  selector: 'app-tipo-docuemto-caracteristica',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './tipo-docuemto-caracteristica.component.html',
  styleUrl: './tipo-docuemto-caracteristica.component.css',
})
export class TipoDocuemtoCaracteristicaComponent {
  private TipoDocCaracteService = inject(TipoDocCaracteService);
  private route = inject(Router);

  public filtereddepartamento: DocumentoCaracteristica[] = [];
  public paginateddepartamento: DocumentoCaracteristica[] = [];
  public Listado_DocumentoCaracteristica: DocumentoCaracteristica[] = [];
  public searchQuery: string = '';

  // Paginación
  public currentPage: number = 1;
  public itemsPerPage: number = 5;
  public totalPages: number = 1;

  public displayedColumns: string[] = ['IdDep', 'IdFacu', 'Nombre', 'Estado'];

  constructor(private sharedService: SharedService) {}
  ngOnInit(): void {
    this.obtenerDocCaracteristcia();
  }

  obtenerDocCaracteristcia(): void {
    this.TipoDocCaracteService.TipoDocCaraget().subscribe({
      next: (data) => {
        const lista = data?.Listado_DocumentoCaracteristica ?? [];

        if (lista.length > 0) {
          this.Listado_DocumentoCaracteristica = lista;
          this.filtereddepartamento = [...lista];
          this.updatePagination();
        } else {
          this.Listado_DocumentoCaracteristica = [];
          this.filtereddepartamento = [];
          this.paginateddepartamento = [];
          this.totalPages = 1;
        }
      },
      error: (error) => {
        Swal.fire({
          icon: 'error',
          title: 'Error al cargar los departamentos',
          text: error.message || 'No se pudieron obtener los departamentos.',
          confirmButtonColor: '#d33',
        });
      },
    });
  }
  //eliianar caracteristicas de tipo documento
  // Eliminar un permiso por ID con SweetAlert2
  eliminarDocCaracte(ID_CARACTERISTICA: number, ID_TIPO_DOCUMENTO: number) {
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
        this.TipoDocCaracteService.eliminarDocCaracte(
          ID_CARACTERISTICA,
          ID_TIPO_DOCUMENTO
        ).subscribe({
          next: (res) => {
            Swal.fire({
              icon: 'success',
              title: 'Eliminado',
              text: res.msg || 'El permiso ha sido eliminado exitosamente.',
              confirmButtonColor: '#3085d6',
            });

            // Actualiza la lista después de eliminar
            this.Listado_DocumentoCaracteristica =
              this.Listado_DocumentoCaracteristica.filter(
                (permiso) =>
                  !(
                    permiso.ID_CARACTERISTICA === ID_CARACTERISTICA &&
                    permiso.ID_TIPO_DOCUMENTO === ID_TIPO_DOCUMENTO
                  )
              );

            this.filtereddepartamento = this.filtereddepartamento.filter(
              (permiso) =>
                !(
                  permiso.ID_CARACTERISTICA === ID_CARACTERISTICA &&
                  permiso.ID_TIPO_DOCUMENTO === ID_TIPO_DOCUMENTO
                )
            );

            this.updatePagination();
          },
          error: (err) => {
            Swal.fire({
              icon: 'error',
              title: 'Error al eliminar',
              text:
                err.error?.msg || 'Ocurrió un error al eliminar el permiso.',
              confirmButtonColor: '#d33',
            });
          },
        });
      }
    });
  }
    editardepartamento(param: DocumentoCaracteristica): void {
      this.route.navigate(['/ActualizarTipoDocumentoCaracteristica'], {
        queryParams: {
          id_tipo_documento: param.ID_TIPO_DOCUMENTO,
          id_caracteristica: param.ID_CARACTERISTICA,
          Caracate: param.def.CARACTERISTICA,
          tipoDocu: param.tipo_documento.TIPO_DOCUMENTO,
   
        }
      });
    }
  registro() {
    this.route.navigate(['/RegistrarTipoDocumentoCaracteristica']);
  }


  filterdepartamento(): void {
    const query = this.searchQuery.toLowerCase();
    this.filtereddepartamento = this.Listado_DocumentoCaracteristica.filter(
      (TipoDocCaracte) =>
        TipoDocCaracte.def.CARACTERISTICA.toString()
          .toLowerCase()
          .includes(query) ||
        TipoDocCaracte.tipo_documento.TIPO_DOCUMENTO.toString()
          .toLowerCase()
          .includes(query)
    );

    this.currentPage = 1;
    this.updatePagination();
  }

  updatePagination(): void {
    this.totalPages = Math.max(
      1,
      Math.ceil(this.filtereddepartamento.length / this.itemsPerPage)
    );
    this.updatePaginatedDepartamento();
  }

  updatePaginatedDepartamento(): void {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    this.paginateddepartamento = this.filtereddepartamento.slice(
      startIndex,
      endIndex
    );
  }

  goToFirstPage(): void {
    this.currentPage = 1;
    this.updatePaginatedDepartamento();
  }

  goToPreviousPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.updatePaginatedDepartamento();
    }
  }

  goToNextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.updatePaginatedDepartamento();
    }
  }

  goToLastPage(): void {
    this.currentPage = this.totalPages;
    this.updatePaginatedDepartamento();
  }
}
