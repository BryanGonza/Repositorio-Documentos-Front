import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { Categoria, CategoriaService } from '../../services/categoria.service';
import { CommonModule } from '@angular/common';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-categoria',
  templateUrl: './categoria.component.html',
  styleUrls: ['./categoria.component.css'],
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, FormsModule],
  providers: [CategoriaService]
})
export class CategoriaComponent implements OnInit {
mostrarForm() {
throw new Error('Method not implemented.');
}
filtrar() {
throw new Error('Method not implemented.');
}
formTipoCaracteristica: any;
searchQuery: any;
guardar() {
throw new Error('Method not implemented.');
}
editar(_t42: any) {
throw new Error('Method not implemented.');
}
confirmarEliminar(arg0: any) {
throw new Error('Method not implemented.');
}
  formCategoria!: FormGroup;
  categorias: Categoria[] = [];
  paginatedCategorias: Categoria[] = [];

  editando = false;
  categoriaEditandoId: number | null = null;
  mostrarFormulario: boolean = false;

  filtroBusqueda: string = '';
  currentPage: number = 1;
  itemsPerPage: number = 5;
  totalPages: number = 1;
paginatedLista: any;

  constructor(private fb: FormBuilder, private categoriaService: CategoriaService) {}

  ngOnInit(): void {
    this.formCategoria = this.fb.group({
      CATEGORIA: ['', Validators.required],
      ESTADO: [true, Validators.required]
    });

    this.obtenerCategorias();
  }

  toggleFormulario() {
    this.mostrarFormulario = !this.mostrarFormulario;
  }

  obtenerCategorias() {
    this.categoriaService.getCategorias().subscribe(resp => {
      console.log('Categorías recibidas:', resp);
      this.categorias = resp.Listado_Categoria; // ✅ Corrección aquí
      this.buscarCategoria();
    });
  }

  buscarCategoria() {
    const termino = this.filtroBusqueda.toLowerCase().trim();
    const filtradas = this.categorias.filter(cat =>
      cat.CATEGORIA.toLowerCase().includes(termino)
    );
    this.totalPages = Math.ceil(filtradas.length / this.itemsPerPage);
    this.paginatedCategorias = filtradas.slice(
      (this.currentPage - 1) * this.itemsPerPage,
      this.currentPage * this.itemsPerPage
    );
  }

  goToFirstPage() {
    this.currentPage = 1;
    this.buscarCategoria();
  }

  goToPreviousPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.buscarCategoria();
    }
  }

  goToNextPage() {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.buscarCategoria();
    }
  }

  goToLastPage() {
    this.currentPage = this.totalPages;
    this.buscarCategoria();
  }

  guardarCategoria() {
    if (this.formCategoria.invalid) return;

    if (this.editando && this.categoriaEditandoId !== null) {
      const categoriaActualizada = {
        ID_CATEGORIA: this.categoriaEditandoId,
        ...this.formCategoria.value
      };

      this.categoriaService.updateCategoria(categoriaActualizada).subscribe(() => {
        this.obtenerCategorias();
        this.cancelarEdicion(false);
        Swal.fire({
          icon: 'success',
          title: 'Actualización exitosa',
          text: 'La categoría fue actualizada correctamente.',
          confirmButtonText: 'OK'
        });
      });
    } else {
      this.categoriaService.createCategoria(this.formCategoria.value).subscribe(() => {
        this.obtenerCategorias();
        this.formCategoria.reset({ ESTADO: true });
        this.mostrarFormulario = false;
        Swal.fire({
          icon: 'success',
          title: 'Categoría creada',
          text: 'La categoría fue creada correctamente.',
          confirmButtonText: 'OK'
        });
      });
    }
  }

  editarCategoria(categoria: Categoria) {
    this.editando = true;
    this.mostrarFormulario = true;
    this.categoriaEditandoId = categoria.ID_CATEGORIA || null;
    this.formCategoria.setValue({
      CATEGORIA: categoria.CATEGORIA,
      ESTADO: categoria.ESTADO
    });
  }

  confirmarEliminarCategoria(id: number) {
    Swal.fire({
      title: '¿Estás seguro?',
      text: '¡No podrás revertir esto!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.categoriaService.deleteCategoria(id).subscribe(() => {
          this.obtenerCategorias();
          Swal.fire({
            icon: 'success',
            title: 'Eliminado',
            text: 'La categoría fue eliminada correctamente.',
            confirmButtonText: 'OK'
          });
        });
      }
    });
  }

  confirmarCancelarEdicion() {
    Swal.fire({
      title: '¿Seguro que deseas cancelar la actualización?',
      text: 'Se perderán los cambios realizados.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, cancelar',
      cancelButtonText: 'Volver'
    }).then((result) => {
      if (result.isConfirmed) {
        this.cancelarEdicion(false);
      }
    });
  }

  confirmarVolver() {
    Swal.fire({
      title: '¿Seguro que deseas cancelar?',
      text: 'Se perderán los cambios no guardados.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, volver',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.cancelarEdicion(true);
        this.mostrarFormulario = false;
      }
    });
  }

  cancelarEdicion(resetFormulario: boolean = true) {
    this.editando = false;
    this.categoriaEditandoId = null;
    if (resetFormulario) {
      this.formCategoria.reset({ ESTADO: true });
    }
  }
}
