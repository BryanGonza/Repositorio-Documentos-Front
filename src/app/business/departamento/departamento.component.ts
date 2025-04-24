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
 
  public filtereddepartamento: departamento[] = [];
  public paginateddepartamento: departamento[] = [];
  public Listado_Departamentos: departamento[] = [];
  public searchQuery: string = '';
 
  // Paginación
  public currentPage: number = 1;
  public itemsPerPage: number = 5;
  public totalPages: number = 1;
 
  public displayedColumns: string[] = ['IdDep', 'IdFacu', 'Nombre', 'Estado'];
 
constructor(private sharedService : SharedService) { }
   //roles y permisos 
     rolActual = '';
     ngOnInit() {
      this.obtenerDepartamento();
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
         // Verifica si el permiso para la pantalla  existe
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
     // Fin de roles y permisos
     
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
    this.filtereddepartamento = this.Listado_Departamentos.filter(departamento =>
      departamento.ID_DEPARTAMENTO.toString().toLowerCase().includes(query) ||
      departamento.ID_FACULTAD.toString().toLowerCase().includes(query) ||
      departamento.NOMBRE.toString().toLowerCase().includes(query)  ||
      (departamento.ESTADO ? 'activo' : 'inactivo').includes(query)
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
              text: res.msg || 'Departamento ha sido eliminado exitosamente.',
              confirmButtonColor: '#3085d6',
            });
 
            this.Listado_Departamentos = this.Listado_Departamentos.filter(departamento => departamento.ID_DEPARTAMENTO !== ID_DEPARTAMENTO);
            this.filtereddepartamento = this.filtereddepartamento.filter(departamento => departamento.ID_DEPARTAMENTO !== ID_DEPARTAMENTO);
            this.updatePagination();
          },
          error: (err) => {
            Swal.fire({
              icon: 'error',
              title: 'Error al eliminar',
              text: err.error?.msg || 'Ocurrió un error al eliminar departamento.',
              confirmButtonColor: '#d33',
            });
          }
        });
      }
    });
  }
 
  editardepartamento(param: departamento): void {
    this.route.navigate(['/actualizar-departamento'], {
      queryParams: {
        iddepa: param.ID_DEPARTAMENTO,
        idfacu: param.ID_FACULTAD,
        nombre: param.NOMBRE,
        estado: param.ESTADO,
      }
    });
  }
 
  registro(): void {
    this.route.navigate(['registrar-departamento']);
  }
}