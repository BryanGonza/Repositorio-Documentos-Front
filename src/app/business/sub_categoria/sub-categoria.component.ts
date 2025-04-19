import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { SubCategoriaService } from '../../services/sub_categoria.service';
import { CategoriaService } from '../../services/categoria.service';
import { SubCategoria } from '../../interfaces/Sub_Categoria/sub_categoria';
import { Categoria } from '../../interfaces/Categoria/categoria';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-sub-categoria',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './sub-categoria.component.html',
  styleUrls: ['./sub-categoria.component.css'],
  providers: [SubCategoriaService, CategoriaService],
})
export class SubCategoriaComponent implements OnInit {
  formSubCategoria!: FormGroup;
  subCategorias: SubCategoria[] = [];
  paginatedSubCategorias: SubCategoria[] = [];

  categorias: Categoria[] = []; //  Arreglo de categorías

  editando = false;
  subCategoriaEditandoId: number | null = null;
  mostrarFormulario: boolean = false;

  filtroBusqueda: string = '';
  currentPage: number = 1;
  itemsPerPage: number = 5;
  totalPages: number = 1;

  constructor(
    private fb: FormBuilder,
    private subCategoriaService: SubCategoriaService,
    private categoriaService: CategoriaService // servicio de Categoria
  ) {}

  ngOnInit(): void {
    this.obtenerSubCategorias();

    // Cargar categorías desde el backend
    this.categoriaService.getCategorias().subscribe((res) => {
      this.categorias = res.Listado_Categorias;
    });

    this.formSubCategoria = this.fb.group({
      ID_CATEGORIA: ['', Validators.required],
      SUB_CATEGORIA: ['', Validators.required],
      ESTADO: [true, Validators.required],
    });
  }

  toggleFormulario(): void {
    this.mostrarFormulario = !this.mostrarFormulario;
    if (!this.mostrarFormulario) {
      this.cancelarEdicion();
    }
  }

  obtenerSubCategorias(): void {
    this.subCategoriaService.getSubCategorias().subscribe((res) => {
      this.subCategorias = res.Listado_Sub_Categoria;
      this.aplicarPaginacion();
    });
  }

  guardarSubCategoria(): void {
    if (this.formSubCategoria.invalid) return;

    if (this.editando && this.subCategoriaEditandoId) {
      const actualizada: SubCategoria = {
        ...this.formSubCategoria.value,
        ID_SUB_CATEGORIA: this.subCategoriaEditandoId,
      };

      this.subCategoriaService.updateSubCategoria(actualizada).subscribe({
        next: (res) => {
          Swal.fire('Actualizado', res.msg, 'success');
          this.obtenerSubCategorias();
          this.formSubCategoria.reset();
          this.cancelarEdicion();
        },
        error: () => Swal.fire('Error', 'No se pudo actualizar', 'error'),
      });
    } else {
      this.subCategoriaService.createSubCategoria(this.formSubCategoria.value).subscribe({
        next: (res) => {
          Swal.fire('Guardado', res.msg, 'success');
          this.obtenerSubCategorias();
          this.formSubCategoria.reset();
        },
        error: () => Swal.fire('Error', 'No se pudo guardar', 'error'),
      });
    }
  }

  editarSubCategoria(sub: SubCategoria): void {
    this.editando = true;
    this.mostrarFormulario = true;
    this.subCategoriaEditandoId = sub.ID_SUB_CATEGORIA!;
    this.formSubCategoria.patchValue(sub);
  }

  confirmarEliminarSubCategoria(id: number): void {
    Swal.fire({
      title: '¿Estás seguro?',
      text: 'Esta acción no se puede deshacer.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Sí, eliminar',
    }).then((result) => {
      if (result.isConfirmed) {
        this.eliminarSubCategoria(id);
      }
    });
  }

  eliminarSubCategoria(id: number): void {
    this.subCategoriaService.deleteSubCategoria(id).subscribe({
      next: (res) => {
        Swal.fire('Eliminado', res.msg, 'success');
        this.obtenerSubCategorias();
      },
      error: () => Swal.fire('Error', 'No se pudo eliminar', 'error'),
    });
  }

  confirmarCancelarEdicion(): void {
    Swal.fire({
      title: 'Cancelar edición',
      text: '¿Seguro que deseas cancelar la edición?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Sí, cancelar',
      cancelButtonText: 'No',
    }).then((result) => {
      if (result.isConfirmed) {
        this.cancelarEdicion();
      }
    });
  }

  confirmarVolver(): void {
    Swal.fire({
      title: 'Volver',
      text: '¿Deseas volver sin guardar cambios?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Sí, volver',
      cancelButtonText: 'No',
    }).then((result) => {
      if (result.isConfirmed) {
        this.cancelarEdicion();
        this.mostrarFormulario = false;
      }
    });
  }

  cancelarEdicion(): void {
    this.editando = false;
    this.subCategoriaEditandoId = null;
    this.formSubCategoria.reset({ ESTADO: true });
  }

  buscarSubCategoria(): void {
    const termino = this.filtroBusqueda.toLowerCase();
    const filtradas = this.subCategorias.filter((s) =>
      s.SUB_CATEGORIA.toString().includes(termino)
    );
    this.paginatedSubCategorias = filtradas.slice(0, this.itemsPerPage);
    this.totalPages = Math.ceil(filtradas.length / this.itemsPerPage);
    this.currentPage = 1;
  }

  aplicarPaginacion(): void {
    const start = (this.currentPage - 1) * this.itemsPerPage;
    const end = start + this.itemsPerPage;
    this.paginatedSubCategorias = this.subCategorias.slice(start, end);
    this.totalPages = Math.ceil(this.subCategorias.length / this.itemsPerPage);
  }

  goToPreviousPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.aplicarPaginacion();
    }
  }

  goToNextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.aplicarPaginacion();
    }
  }
}