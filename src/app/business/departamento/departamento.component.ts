import { Component, OnInit, inject } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { departamento } from '../../interfaces/Departamento/Departamento';
import { DepartamentoService } from '../../services/departamento.service';
import { CommonModule } from '@angular/common';
import Swal from 'sweetalert2';
import { ObjetoPermisoExtendido } from '../../interfaces/Objetos/Objetos';
import { ObjetosService } from '../../services/objetos.service';
import { SharedService } from '../../shared.service';

@Component({
  selector: 'app-departamento',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './departamento.component.html',
  styleUrls: ['./departamento.component.css']
})
export default class departamentoComponent implements OnInit {

  private departamentoService = inject(DepartamentoService);
  private route = inject(Router);
  constructor(private sharedService: SharedService) {}

  public filtereddepartamento: departamento[] = [];
  public paginateddepartamento: departamento[] = [];
  public Listado_Departamentos: departamento[] = [];
  public searchQuery: string = '';

  // Paginación
  public currentPage: number = 1;
  public itemsPerPage: number = 5;
  public totalPages: number = 1;

  // Roles y permisos
  rolActual = '';
  objetos: ObjetoPermisoExtendido[] = [];
  private objetoser = inject(ObjetosService);
  token: string = typeof window !== 'undefined' ? localStorage.getItem('token') || '' : '';

  ngOnInit() {
    this.obtenerDepartamento();
    this.sharedService.rol$.subscribe((rol) => {
      this.rolActual = rol;
      this.getObjetosConPermisos();
    });
  }

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

  private normalize(str: string): string {
    return str.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  }

  getPermiso(accion: string): boolean {
    const permiso = this.objetos.find((o) =>
      this.normalize(o.OBJETO).includes('departamento')
    );

    if (!permiso) {
      console.warn("No se encontró permiso para la pantalla 'departamento'");
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

  obtenerDepartamento(): void {
    this.departamentoService.Departamentoget().subscribe({
      next: (data) => {
        const lista = data?.Listado_Departamentos ?? [];

        if (lista.length > 0) {
          this.Listado_Departamentos = lista;
          this.filtereddepartamento = [...lista];
          this.updatePagination();
        } else {
          this.Listado_Departamentos = [];
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

  filterdepartamento(): void {
    const query = this.searchQuery.toLowerCase();
    this.filtereddepartamento = this.Listado_Departamentos.filter(dep =>
      dep.ID_DEPARTAMENTO.toString().toLowerCase().includes(query)
    );

    this.currentPage = 1;
    this.updatePagination();
  }

  updatePagination(): void {
    this.totalPages = Math.max(1, Math.ceil(this.filtereddepartamento.length / this.itemsPerPage));
    this.updatePaginatedDepartamento();
  }

  updatePaginatedDepartamento(): void {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    this.paginateddepartamento = this.filtereddepartamento.slice(startIndex, endIndex);
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

 eliminardepartamento(ID_DEPARTAMENTO: number): void {
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
      this.departamentoService.eliminardepartamento(ID_DEPARTAMENTO).subscribe({
        next: (res) => {
          Swal.fire({
            icon: 'success',
            title: 'Eliminado',
            text: res.msg || 'Departamento eliminado exitosamente.',
            confirmButtonColor: '#3085d6',
          });

          this.Listado_Departamentos = this.Listado_Departamentos.filter(dep => dep.ID_DEPARTAMENTO !== ID_DEPARTAMENTO);
          this.filtereddepartamento = this.filtereddepartamento.filter(dep => dep.ID_DEPARTAMENTO !== ID_DEPARTAMENTO);
          this.updatePagination();
        },
        error: (err) => {
          const mensaje = err.error?.msg || '';

          if (
            mensaje.includes('Cannot delete or update a parent row') ||
            mensaje.includes('a foreign key constraint fails') ||
            mensaje.toLowerCase().includes('clave foránea')
          ) {
            Swal.fire({
              icon: 'error',
              title: 'No se puede eliminar',
              text: 'Este departamento está relacionado con otros registros y no puede ser eliminado.',
              confirmButtonColor: '#d33',
            });
          } else {
            Swal.fire({
              icon: 'error',
              title: 'Error al eliminar',
              text: mensaje || 'Ocurrió un error al eliminar el departamento.',
              confirmButtonColor: '#d33',
            });
          }
        }
      });
    }
  });
}

  editardepartamento(dep: departamento): void {
    this.route.navigate(['/actualizar-departamento'], {
      queryParams: {
        iddepa: dep.ID_DEPARTAMENTO,
        idfacu: dep.ID_FACULTAD, // Esto puede usarse para el select en el formulario de edición
        nombre: dep.NOMBRE,
        estado: dep.ESTADO,
      }
    });
  }

  registro(): void {
    this.route.navigate(['registrar-departamento']);
  }
}
